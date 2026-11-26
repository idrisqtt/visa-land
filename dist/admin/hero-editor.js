/* The preview loads the actual homepage and its media controller, not a replica. */
(() => {
 const root=document.querySelector('#hero-editor');let frame,previewSmall=false,previewTimer;
 const choices=(key,label,options,current)=>`<label class="field"><span>${label}</span><select name="content.${key}">${options.map(([v,l])=>`<option value="${v}" ${v===current?'selected':''}>${l}</option>`).join('')}</select></label>`;
 const range=(key,label,value,min=0,max=100)=>`<label class="field range-field"><span>${label} <output>${value}%</output></span><input type="range" name="content.${key}" value="${value}" min="${min}" max="${max}" step="1"></label>`;
 window.renderHeroEditor=()=>{
  if(frame)disposePreviewFrame(frame);
  const s=VisaHero.settings(activeConfig);
  root.innerHTML=`<a class="preview-jump" href="#hero-preview-stage">Показать предпросмотр обложки</a><div class="form-grid hero-copy-fields">${VisaContent.fields.filter(f=>f.group==='home'&&!['heroPauseLabel','heroResumeLabel','heroVideoError'].includes(f.key)).map(f=>cmsField(f,VisaContent.get(activeConfig,f.key))).join('')}</div><div class="editor-subhead"><h3>Фон и кадрирование</h3><p>Для видео всегда добавляйте обложку. На телефоне можно использовать отдельный вертикальный материал.</p></div><div id="hero-settings" class="form-grid">${choices('heroMode','Что показывать на фоне',[['video','Видео с обложкой'],['photo','Только фотографию']],s.mode)}${choices('heroHeight','Высота обложки',[['full','Большая'],['compact','Компактная']],s.height)}${range('heroShade','Затемнение фона',s.shade,25,90)}${range('heroX','Компьютер · кадр по горизонтали',s.x)}${range('heroY','Компьютер · кадр по вертикали',s.y)}${range('heroMobileX','Телефон · кадр по горизонтали',s.mobileX)}${range('heroMobileY','Телефон · кадр по вертикали',s.mobileY)}</div><div class="editor-subhead"><h3>Материалы для компьютера</h3><p>Фото — самостоятельный фон или обложка для видео. При отключённом автовоспроизведении посетитель увидит обложку.</p></div><div class="media-grid hero-media-grid">${VisaContent.media.filter(f=>f.group==='home'&&!f.fallback).map(f=>mediaCard(f)).join('')}</div><div class="editor-subhead"><h3>Материалы для телефона</h3><p>Необязательно. Пустые поля используют материалы для компьютера. Вертикальные фото и видео помогают сохранить важное в кадре.</p></div><div class="media-grid hero-media-grid">${VisaContent.media.filter(f=>f.group==='home'&&f.fallback).map(f=>mediaCard(f)).join('')}</div><details class="content-group"><summary>Тексты управления видео</summary><div class="form-grid">${VisaContent.fields.filter(f=>['heroPauseLabel','heroResumeLabel','heroVideoError'].includes(f.key)).map(f=>cmsField(f,VisaContent.get(activeConfig,f.key))).join('')}</div></details><div class="preview-toolbar" id="hero-preview-stage"><h3>Предпросмотр обложки</h3><button type="button" data-hero-view="desktop" aria-pressed="${!previewSmall}">Компьютер</button><button type="button" data-hero-view="mobile" aria-pressed="${previewSmall}">Телефон</button></div><p id="hero-preview-status" role="status">Загружаем предпросмотр…</p><div class="hero-preview-wrap"><iframe id="hero-preview" title="Обложка: черновик" scrolling="no"></iframe></div>`;
  frame=root.querySelector('iframe');frame.onload=()=>{applyHeroPreview();};frame.src='/?editor-preview=1';
  root.querySelectorAll('[data-hero-view]').forEach(button=>button.onclick=()=>{previewSmall=button.dataset.heroView==='mobile';root.querySelectorAll('[data-hero-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));applyHeroPreview()});
 };
 function heroDraft(){const cfg={content:{...activeConfig.content},media:{...defaultMedia,...activeConfig.media}};root.querySelectorAll('[name^="content."]').forEach(el=>cfg.content[el.name.slice(8)]=readCmsValue(el));root.querySelectorAll('[name^="media."]').forEach(el=>cfg.media[el.name.slice(6)]=el.value);mediaObjectUrls.forEach((value,key)=>cfg.media[key]=value);return cfg}
 function applyHeroPreview(){
  if(!frame?.contentWindow?.VisaHero||!frame.contentWindow.VisaContent)return;
  const cfg=heroDraft(),doc=frame.contentDocument,cover=doc.querySelector('.home-opening');
  if(!cover)return;frame.classList.toggle('preview-mobile',previewSmall);
  doc.querySelectorAll('body>header,body>footer,body>.skip-link,main>*:not(.home-opening)').forEach(el=>el.hidden=true);
  let style=doc.getElementById('hero-preview-layout');if(!style){style=doc.createElement('style');style.id='hero-preview-layout';doc.head.append(style)}
  style.textContent='html,body{overflow:hidden!important}.home-opening{margin:0!important;border-radius:0!important;min-height:100vh!important;height:auto!important}.film-caption{max-width:40%;text-align:right}';
  const height=previewSmall?(cfg.content.heroHeight==='compact'?540:660):(cfg.content.heroHeight==='compact'?480:560);fitPreviewFrame(frame,previewSmall,height);
  const heroDoc=frame.contentWindow;heroDoc.VisaContent.apply(cfg);heroDoc.VisaHero.mount(cfg,cover,{mobile:previewSmall,preview:true});
  root.querySelectorAll('.range-field').forEach(label=>label.querySelector('output').textContent=label.querySelector('input').value+'%');
  requestAnimationFrame(()=>{if(frame?.contentDocument===doc)fitPreviewFrame(frame,previewSmall,Math.max(height,Math.ceil(cover.getBoundingClientRect().height)))});
  const s=heroDoc.VisaHero.settings(cfg),selected=previewSmall?s.mobilePoster:s.poster,video=previewSmall?s.mobileVideo:s.video;
  root.querySelector('#hero-preview-status').textContent=(s.mode==='photo'?'Режим фото.':'Режим видео. Обложка показывается до воспроизведения.')+' '+(previewSmall?'Телефон.':'Компьютер.');
 }
 window.refreshHeroPreview=()=>{clearTimeout(previewTimer);previewTimer=setTimeout(applyHeroPreview,180)};
})();
