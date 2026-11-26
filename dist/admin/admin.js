/* Authenticated CMS. Public data and draft uploads keep the existing Supabase RLS. */
const db=window.visaSupabase;
const escapeAttr=value=>VisaCatalog.escape(value);
const defaultContent=VisaContent.defaults,defaultMedia=VisaContent.mediaDefaults;
let activeConfig={},mediaUploads={},order=[],faqDraft=[],loaded=false,saving=false,pendingMedia=0;
const mediaObjectUrls=new Map(),mediaSelectionVersions=new Map();
const adminStatus=message=>document.querySelector('#save-status').textContent=message;
const safePreview=value=>!String(value||'').trim()?'':String(value).startsWith('blob:')?value:VisaCatalog.url(value);
const cmsPlain=value=>{const template=document.createElement('template');template.innerHTML=String(value).replace(/<br\s*\/?\s*>/gi,'\n');return template.content.textContent};
function readCmsValue(input){if(input.hasAttribute('data-rich-original'))return input.value===cmsPlain(input.dataset.richOriginal)?input.dataset.richOriginal:escapeAttr(input.value).replace(/\n/g,'<br>');return input.value}
function cmsField(field,value){
 const id='cms-'+field.key,hint=field.type==='rich'?'Для переноса строки нажмите Enter.':'',input=field.type==='url'?`<input id="${id}" name="content.${field.key}" type="text" inputmode="url" value="${escapeAttr(value)}">`:`<textarea id="${id}" name="content.${field.key}" ${field.type==='rich'?`data-rich-original="${escapeAttr(value)}"`:''} rows="${String(value).length>110?4:2}">${escapeAttr(field.type==='rich'?cmsPlain(value):value)}</textarea>`;
 return `<label class="field content-field" data-field-key="${field.key}"><span>${escapeAttr(field.label)}</span>${input}${hint?`<small>${escapeAttr(hint)}</small>`:''}</label>`;
}
function renderContent(){
 const root=document.querySelector('#content-fields');root.innerHTML=Object.entries(VisaContent.groups).filter(([key])=>key!=='home').map(([group,title])=>{const fields=VisaContent.fields.filter(f=>f.group===group);if(!fields.length)return '';return `<details class="content-group" data-content-group="${group}" ${group==='about'?'open':''}><summary>${escapeAttr(title)}<span>${fields.length} полей</span></summary><div class="form-grid">${fields.map(f=>cmsField(f,VisaContent.get(activeConfig,f.key))).join('')}</div></details>`}).join('');
 filterContent();
}
function filterContent(){const query=document.querySelector('#content-search').value.trim().toLocaleLowerCase('ru');let count=0;document.querySelectorAll('.content-group').forEach(group=>{let visible=0;group.querySelectorAll('.content-field').forEach(field=>{const input=field.querySelector('input,textarea');const show=!query||(field.textContent+' '+input.value).toLocaleLowerCase('ru').includes(query);field.hidden=!show;if(show)visible++});group.hidden=!visible;if(query&&visible)group.open=true;count+=visible});document.querySelector('#search-status').textContent=query?`Найдено полей: ${count}`:''}
function mediaCard(field,config=activeConfig){
 const value=config.media?.[field.key]??field.default,source=safePreview(value),video=field.kind==='video';
 const description=video?'MP4 (H.264) или WebM, до 40 МБ.':'JPG, PNG или WebP, до 5 МБ.';
 return `<article class="media-editor" data-media-card="${field.key}"><h3>${escapeAttr(field.label)}</h3><div class="media-preview">${source?(video?`<video src="${escapeAttr(source)}" controls muted playsinline preload="metadata"></video>`:`<img src="${escapeAttr(source)}" alt="Предпросмотр ${escapeAttr(field.label)}">`):'<p>Используется материал для компьютера</p>'}</div><label class="field"><span>Ссылка на ${video?'видео':'изображение'}</span><input name="media.${field.key}" type="text" inputmode="url" value="${escapeAttr(value)}" placeholder="${field.fallback?'Можно оставить пустым':'/assets/media/… или https://…'}"></label><label class="field file-field"><span>Загрузить ${video?'видео':'изображение'}</span><input type="file" data-media-upload="${field.key}" accept="${video?'video/mp4,video/webm':'image/jpeg,image/png,image/webp'}"></label><p class="media-note">${description} ${field.fallback?'Без отдельного файла используется материал для компьютера.':video?'Рекомендуем ролик 10–20 секунд, без звука.':'Для видео это изображение показывается до начала воспроизведения.'}</p><p class="media-file-status" role="status"></p><button class="secondary" type="button" data-media-reset="${field.key}">${field.fallback?'Использовать материал для компьютера':'Вернуть исходный файл'}</button></article>`;
}
function renderMedia(){document.querySelector('#media-fields').innerHTML=VisaContent.media.filter(f=>f.group!=='home').map(f=>mediaCard(f)).join('')}
function releaseMedia(key){mediaSelectionVersions.set(key,(mediaSelectionVersions.get(key)||0)+1);if(mediaObjectUrls.has(key)){URL.revokeObjectURL(mediaObjectUrls.get(key));mediaObjectUrls.delete(key)}delete mediaUploads[key]}
async function stageMedia(input){
 const file=input.files?.[0];if(!file)return;const field=VisaContent.media.find(f=>f.key===input.dataset.mediaUpload),video=field.kind==='video',card=input.closest('.media-editor'),status=card.querySelector('.media-file-status');
 const allowed=video?['video/mp4','video/webm']:['image/jpeg','image/png','image/webp'],max=video?40000000:5000000;
 if(!allowed.includes(file.type)||file.size>max||file.size===0){status.textContent=`Файл не выбран. Используйте ${video?'MP4 или WebM до 40 МБ':'JPG, PNG или WebP до 5 МБ'}.`;status.classList.add('error');input.value='';return}
 // Decode before staging so a renamed or damaged image cannot replace working media.
 const objectUrl=URL.createObjectURL(file),version=(mediaSelectionVersions.get(field.key)||0)+1;mediaSelectionVersions.set(field.key,version);pendingMedia++;
 try{if(!video){const img=new Image();img.src=objectUrl;await img.decode()}else{await new Promise((resolve,reject)=>{const el=document.createElement('video'),timer=setTimeout(()=>{el.removeAttribute('src');el.load();reject(new Error('Не удалось прочитать видео. Попробуйте MP4 с кодеком H.264.'))},8000);const finish=error=>{clearTimeout(timer);el.removeAttribute('src');el.load();error?reject(error):resolve()};el.preload='metadata';el.onloadedmetadata=()=>finish();el.onerror=()=>finish(new Error('Браузер не распознал видео. Попробуйте MP4 с кодеком H.264.'));el.src=objectUrl})}}catch(error){pendingMedia--;URL.revokeObjectURL(objectUrl);if(mediaSelectionVersions.get(field.key)!==version)return;input.value='';status.textContent=video?(error.message||'Не удалось прочитать видео. Выберите другой файл.'):'Не удалось прочитать изображение. Выберите другой JPG, PNG или WebP.';status.classList.add('error');return}
 pendingMedia--;if(mediaSelectionVersions.get(field.key)!==version){URL.revokeObjectURL(objectUrl);return}releaseMedia(field.key);mediaObjectUrls.set(field.key,objectUrl);mediaUploads[field.key]=file;
 card.querySelector('.media-preview').innerHTML=video?`<video src="${objectUrl}" controls muted playsinline preload="metadata"></video>`:`<img src="${objectUrl}" alt="Выбранное изображение">`;
 status.classList.remove('error');status.textContent=`${file.name} · ${(file.size/1000000).toFixed(1)} МБ. Выбран для публикации, ещё не загружен.`;markCatalogDirty();window.refreshHeroPreview?.();window.refreshDraftPreview?.();
}
function renderFaqs(){document.querySelector('#faq-fields').innerHTML=faqDraft.length?faqDraft.map(([q,a],i)=>`<article class="faq-editor" data-faq="${i}"><h3>Вопрос ${i+1}</h3><label class="field"><span>Вопрос</span><textarea name="faq.${i}.q" rows="2">${escapeAttr(q)}</textarea></label><label class="field"><span>Ответ</span><textarea name="faq.${i}.a" rows="4">${escapeAttr(a)}</textarea></label><button type="button" class="secondary" data-remove-faq="${i}">Удалить вопрос</button></article>`).join(''):'<p class="empty-state">Вопросов пока нет. Добавьте вопрос, если хотите показывать ответы в попапах туров.</p>'}
function collectFaqs(){faqDraft=[...document.querySelectorAll('[data-faq]')].map(el=>[el.querySelector('[name$=".q"]').value,el.querySelector('[name$=".a"]').value])}
function renderEditor(){
 mediaObjectUrls.forEach(URL.revokeObjectURL);mediaObjectUrls.clear();mediaUploads={};
 faqDraft=activeConfig.content?.faqVersion==='2'?(activeConfig.faqs||[]):activeConfig.faqs?.length?activeConfig.faqs:VisaDefaults.faqs;
 order=activeConfig.sectionOrder||[];renderContent();renderMedia();renderFaqs();window.renderHeroEditor?.();
}
function activateAdminTab(btn){
 document.querySelectorAll('.tab').forEach(el=>{const on=el===btn;el.classList.toggle('active',on);el.setAttribute('aria-selected',String(on));el.tabIndex=on?0:-1});
 document.querySelectorAll('.panel').forEach(el=>el.classList.toggle('active',el.dataset.panel===btn.dataset.tab));
 btn.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
 if(btn.dataset.tab==='hero')window.refreshHeroPreview?.();if(btn.dataset.tab==='preview')window.refreshDraftPreview?.();if(btn.dataset.tab==='leads')loadLeads();
}
function focusCmsField(key){const field=document.querySelector(`[name="content.${CSS.escape(key)}"],[name="media.${CSS.escape(key)}"]`);if(!field)return false;document.querySelector('#content-search').value='';filterContent();const panel=field.closest('.panel');activateAdminTab(document.querySelector(`[data-tab="${panel.dataset.panel}"]`));field.closest('details')?.setAttribute('open','');field.scrollIntoView({block:'center',behavior:'instant'});field.focus({preventScroll:true});return true}
function draftConfig(){
 if(typeof collectCatalog==='function')collectCatalog();collectFaqs();const fd=new FormData(document.querySelector('#editor-form')),content={...activeConfig.content},media={...defaultMedia,...activeConfig.media};
 for(const [key,value]of fd){if(key.startsWith('content.'))content[key.slice(8)]=readCmsValue(document.querySelector(`[name="${CSS.escape(key)}"]`));if(key.startsWith('media.'))media[key.slice(6)]=String(value)}
 mediaObjectUrls.forEach((value,key)=>media[key]=value);content.catalogVersion='2';content.calendarData=JSON.stringify(calendarDraft);content.faqVersion='2';
 return {content,media,tours:catalogAPI.clone(catalogDraft),faqs:catalogAPI.clone(faqDraft)};
}
function validationError(message,field){if(field){const panel=field.closest('.panel');activateAdminTab(document.querySelector(`[data-tab="${panel.dataset.panel}"]`));field.closest('details')?.setAttribute('open','');field.focus();field.setAttribute('aria-invalid','true')}throw new Error(message)}
function validateDraft(draft){
 const form=document.querySelector('#editor-form');form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
 for(const field of VisaContent.fields.filter(f=>f.type==='url')){const value=draft.content[field.key];if(value&&!catalogAPI.url(value))validationError('Проверьте ссылку: '+field.label,form.querySelector(`[name="content.${field.key}"]`))}
 for(const field of VisaContent.media){const value=draft.media[field.key];if(field.required&&!value)validationError('Добавьте обложку для компьютера. Она нужна до загрузки видео.',form.querySelector(`[name="media.${field.key}"]`));if(value&&!String(value).startsWith('blob:')&&!catalogAPI.url(value))validationError('Проверьте ссылку: '+field.label,form.querySelector(`[name="media.${field.key}"]`))}
 if(draft.content.heroMode==='video'&&!draft.media.heroVideo)validationError('Выберите видео для компьютера или переключите фон на фотографию.',form.querySelector('[name="media.heroVideo"]'));
 const invalid=catalogDraft.findIndex(t=>!String(t.title||'').trim());if(invalid>=0)validationError('Укажите название путешествия.',document.querySelector(`.catalog-tour[data-index="${invalid}"] [data-key="title"]`));
 if(calendarDraft.some(d=>!catalogDraft.some(t=>t.id===d.tourId)||(d.published&&!d.start&&!String(d.label||'').trim())||(d.start&&d.end&&d.end<d.start)))validationError('Проверьте календарь: нужен маршрут и дата; окончание должно быть не раньше начала.',document.querySelector('[data-panel="calendar"] input'));
 if(catalogDraft.some(t=>[t.image,...t.gallery.map(p=>typeof p==='string'?p:p.url),...t.program.map(d=>d.image)].some(v=>v&&!String(v).startsWith('blob:')&&!catalogAPI.url(v))))validationError('Проверьте ссылки на фотографии путешествий.',document.querySelector('[data-panel="tours"] [data-key="image"]'));
 const invalidFaq=faqDraft.findIndex(([q,a])=>!q.trim()||!a.trim());if(invalidFaq>=0)validationError('Заполните вопрос и ответ или удалите пустой вопрос.',document.querySelector(`[data-faq="${invalidFaq}"] textarea`));
}
async function uploadFile(file,prefix){
 if(!db)throw new Error('Нет соединения с хранилищем');const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-'),path=`${prefix}/${crypto.randomUUID()}-${safe}`;
 const {error}=await db.storage.from('site-media').upload(path,file,{cacheControl:'31536000',upsert:false});if(error)throw new Error(`Не удалось загрузить «${file.name}»: ${error.message}`);
 return db.storage.from('site-media').getPublicUrl(path).data.publicUrl;
}
const previewFrameState=new WeakMap();
function disposePreviewFrame(frame){previewFrameState.get(frame)?.observer.disconnect();previewFrameState.delete(frame)}
function fitPreviewFrame(frame,mobile,height){
 const wrap=frame.parentElement,style=getComputedStyle(wrap),left=parseFloat(style.paddingLeft)||0,top=parseFloat(style.paddingTop)||0,right=parseFloat(style.paddingRight)||0,bottom=parseFloat(style.paddingBottom)||0;
 const available=wrap.clientWidth-left-right;
 let state=previewFrameState.get(frame);if(!state){state={width:0,mobile,height};state.observer=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==state.width){state.width=width;fitPreviewFrame(frame,state.mobile,state.height)}});state.observer.observe(wrap);previewFrameState.set(frame,state)}state.mobile=mobile;state.height=height;
 if(available<=0)return 1;
 const width=mobile?390:Math.max(1200,available),scale=Math.min(1,available/width);
 Object.assign(wrap.style,{position:'relative',overflow:'hidden',height:Math.ceil(height*scale+top+bottom)+'px'});
 Object.assign(frame.style,{position:'absolute',top:top+'px',left:left+'px',width:width+'px',maxWidth:'none',height:height+'px',margin:'0',transformOrigin:'top left',transform:`scale(${scale})`});return scale;
}
async function saveEditor(event){
 event.preventDefault();if(saving||!loaded)return;if(pendingMedia){adminStatus('Проверяем выбранный файл. Дождитесь окончания проверки и повторите сохранение.');return}let draft;
 try{draft=draftConfig();validateDraft(draft)}catch(error){adminStatus(error.message);return}
 saving=true;const submit=document.querySelector('#save-site');submit.disabled=true;document.querySelectorAll('.panel').forEach(el=>el.inert=true);document.querySelector('#reset-site').disabled=true;document.querySelector('#logout').disabled=true;adminStatus('Проверяем сессию и загружаем выбранные файлы…');
 try{
  const {data:{user},error:authError}=await db.auth.getUser();if(authError||!user)throw new Error('Сессия истекла. Откройте админку в другой вкладке и войдите снова. Черновик сохранён здесь.');
  const map=new Map();
  for(const [preview,{file,tourId}]of catalogFiles){const t=draft.tours.find(t=>t.image===preview||t.gallery.includes(preview)||t.program.some(d=>d.image===preview));if(t)map.set(preview,await uploadFile(file,'tours/'+t.id))}
  draft.tours=draft.tours.map(t=>({...t,image:map.get(t.image)||t.image,gallery:t.gallery.map(p=>map.get(p)||p),program:t.program.map(d=>({...d,image:map.get(d.image)||d.image}))}));
  for(const [key,file]of Object.entries(mediaUploads))draft.media[key]=await uploadFile(file,'media/'+key);
  const payload={id:'main',...draft,section_order:order,updated_at:new Date().toISOString(),updated_by:user.id};
  adminStatus('Файлы загружены. Сохраняем настройки…');
  const {data:saved,error}=await db.from('site_config').upsert(payload).select('updated_at').single();if(error)throw error;if(!saved?.updated_at)throw new Error('Сервер не подтвердил сохранение. Повторите публикацию.');
  activeConfig={...draft,sectionOrder:order,updatedAt:saved.updated_at};
  catalogFiles.forEach((_,preview)=>URL.revokeObjectURL(preview));catalogFiles.clear();
  renderEditor();catalogDirty=false;adminStatus('Сохранено и опубликовано. Открытые страницы сайта обновляются автоматически.');window.VisaLive?.publish(saved.updated_at);window.refreshDraftPreview?.();
 }catch(error){adminStatus('Не удалось опубликовать: '+error.message+' Изменения остались в редакторе.')}finally{saving=false;submit.disabled=false;document.querySelectorAll('.panel').forEach(el=>el.inert=false);document.querySelector('#reset-site').disabled=false;document.querySelector('#logout').disabled=false}
}
async function loadConfig(){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const {data,error}=await db.from('site_config').select('*').eq('id','main').maybeSingle().abortSignal(controller.signal);if(error)throw error;activeConfig={content:data?.content||{},media:data?.media||{},tours:data?.tours||[],faqs:data?.faqs||[],sectionOrder:data?.section_order||[],updatedAt:data?.updated_at}}finally{clearTimeout(timer)}}
async function showDashboard(){
 document.querySelector('#login-panel').hidden=true;document.querySelector('#dashboard').hidden=false;document.querySelector('#load-state').hidden=false;document.querySelector('#retry-load').hidden=true;
 try{await loadConfig();renderEditor();loaded=true;document.querySelector('#load-state').hidden=true;document.querySelector('.dashboard nav').hidden=false;document.querySelector('#editor-form').hidden=false;adminStatus('Нет несохранённых изменений.');document.querySelector('#dashboard').removeAttribute('aria-busy')}
 catch(error){loaded=false;document.querySelector('#load-status').textContent='Не удалось загрузить опубликованные настройки. '+error.message;document.querySelector('#retry-load').hidden=false;document.querySelector('#editor-form').hidden=true}
}
async function loadLeads(){
 const list=document.querySelector('#leads-list');list.innerHTML='<p class="empty-state">Загружаем заявки…</p>';
 try{const {data,error}=await db.from('leads').select('*').order('created_at',{ascending:false}).limit(200);if(error)throw error;document.querySelector('#lead-count').textContent=data.length;list.innerHTML=data.length?data.map(lead=>{const date=new Date(lead.created_at),phone=String(lead.phone||'').replace(/[^+\d]/g,'');return `<article class="lead-card"><time>${Number.isNaN(date.getTime())?'Дата не указана':escapeAttr(new Intl.DateTimeFormat('ru-RU',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Almaty'}).format(date))}</time><h3>${escapeAttr(lead.name)}</h3><a href="tel:${phone}">${escapeAttr(lead.phone)}</a><p>${escapeAttr(lead.tour)} · ${escapeAttr(lead.departure_date)}</p><p>${escapeAttr(lead.comment||'Комментарий не указан')}</p></article>`}).join(''):'<p class="empty-state">Заявок пока нет. Они появятся после отправки формы на сайте.</p>'}catch(error){list.innerHTML='<p class="error">Не удалось загрузить заявки. Нажмите «Обновить заявки», чтобы попробовать снова.</p>'}
}
document.addEventListener('DOMContentLoaded',async()=>{
 const form=document.querySelector('#editor-form');form.addEventListener('submit',saveEditor);
 form.addEventListener('error',event=>{const card=event.target.closest?.('.media-editor');if(!card)return;const status=card.querySelector('.media-file-status');status.classList.add('error');status.textContent='Не удалось открыть файл по этой ссылке. Проверьте адрес или загрузите файл с устройства.'},true);
 form.addEventListener('change',event=>{const input=event.target;if(input.matches('[data-media-upload]'))stageMedia(input);if(input.matches('[name^="media."]')){const key=input.name.slice(6);const card=input.closest('.media-editor'),value=safePreview(input.value);if(card){card.querySelector('.media-file-status').textContent='Ссылка изменена. Проверьте предпросмотр и опубликуйте.';const field=VisaContent.media.find(f=>f.key===key);card.querySelector('.media-preview').innerHTML=value?(field.kind==='video'?`<video src="${escapeAttr(value)}" controls muted playsinline preload="metadata"></video>`:`<img src="${escapeAttr(value)}" alt="Предпросмотр изображения">`):'<p>Используется материал для компьютера</p>'}window.refreshHeroPreview?.()}});
 form.addEventListener('input',event=>{if(event.target.matches('[name^="media."]'))releaseMedia(event.target.name.slice(6));window.scheduleDraftPreview?.();if(event.target.closest('[data-panel="hero"]'))window.refreshHeroPreview?.()});
 form.addEventListener('click',event=>{const reset=event.target.closest('[data-media-reset]');if(reset){const key=reset.dataset.mediaReset,field=VisaContent.media.find(f=>f.key===key);releaseMedia(key);const card=reset.closest('.media-editor');card.querySelector('[name^="media."]').value=field.default;card.querySelector('[type="file"]').value='';card.querySelector('[name^="media."]').dispatchEvent(new Event('change',{bubbles:true}));markCatalogDirty()}
 const remove=event.target.closest('[data-remove-faq]');if(remove){collectFaqs();faqDraft.splice(Number(remove.dataset.removeFaq),1);renderFaqs();markCatalogDirty()}});
 document.querySelector('#add-faq').onclick=()=>{collectFaqs();faqDraft.push(['','']);renderFaqs();markCatalogDirty();document.querySelector('#faq-fields article:last-child textarea').focus()};
 document.querySelector('#content-search').addEventListener('input',filterContent);
 document.querySelector('#retry-load').onclick=showDashboard;document.querySelector('#refresh-leads').onclick=loadLeads;
 document.querySelectorAll('.tab').forEach(btn=>{btn.id='tab-'+btn.dataset.tab;btn.setAttribute('aria-controls','panel-'+btn.dataset.tab);btn.tabIndex=btn.classList.contains('active')?0:-1;const panel=document.querySelector(`[data-panel="${btn.dataset.tab}"]`);panel.id='panel-'+btn.dataset.tab;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',btn.id);btn.onclick=()=>activateAdminTab(btn);btn.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const list=[...document.querySelectorAll('.tab')],index=list.indexOf(btn),next=event.key==='Home'?0:event.key==='End'?list.length-1:(index+(event.key==='ArrowRight'?1:-1)+list.length)%list.length;list[next].focus();activateAdminTab(list[next])}});
 document.querySelector('#login-form').onsubmit=async event=>{event.preventDefault();const button=event.target.querySelector('button'),error=document.querySelector('#login-error');button.disabled=true;error.textContent='Входим…';try{if(!db)throw new Error('Сервис недоступен. Обновите страницу.');const result=await db.auth.signInWithPassword({email:document.querySelector('#email').value.trim(),password:document.querySelector('#password').value});if(result.error)throw result.error;document.querySelector('#password').value='';error.textContent='';await showDashboard()}catch(err){error.textContent='Не удалось войти. Проверьте email и пароль или соединение.'}finally{button.disabled=false}};
 document.querySelector('#logout').onclick=async()=>{if(catalogDirty&&!confirm('Есть несохранённые изменения. Выйти и потерять черновик?'))return;const {error}=await db.auth.signOut();if(error){adminStatus('Не удалось выйти. Повторите попытку.');return}catalogDirty=false;location.reload()};
 const dialog=document.querySelector('#reset-dialog');document.querySelector('#reset-site').onclick=()=>dialog.showModal();document.querySelector('#cancel-reset').onclick=()=>dialog.close();document.querySelector('#confirm-reset').onclick=async()=>{const button=document.querySelector('#confirm-reset');button.disabled=true;try{const {data:{user},error:authError}=await db.auth.getUser();if(authError||!user)throw new Error('Войдите снова.');const {data,error}=await db.from('site_config').upsert({id:'main',content:{},media:{},tours:[],faqs:[],section_order:[],updated_by:user.id,updated_at:new Date().toISOString()}).select('updated_at').single();if(error||!data?.updated_at)throw error||new Error('Нет подтверждения сервера.');activeConfig={};renderEditor();catalogDirty=false;dialog.close();adminStatus('Исходная версия опубликована.');window.VisaLive?.publish(data.updated_at)}catch(error){adminStatus('Не удалось сбросить сайт: '+error.message);dialog.close()}finally{button.disabled=false}};
 try{if(!db)return;const {data,error}=await db.auth.getSession();if(error)throw error;if(data.session)await showDashboard()}catch(error){document.querySelector('#login-error').textContent='Не удалось проверить вход. Войдите снова.'}
});
