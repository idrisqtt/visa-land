(async function(){
  window.addEventListener('pagereveal',event=>{event.viewTransition?.ready.catch(()=>{})});
  const {escape:e,url,tours:readTours,calendar:readCalendar}=VisaCatalog;
  const page=document.body.dataset.page||'home';
  const status=document.querySelector('#page-status');
  let config={content:{},media:{},tours:[],faqs:[]};
  try{if(window.visaSupabase){const request=window.visaSupabase.from('site_config').select('*').eq('id','main').maybeSingle();const result=await Promise.race([request,new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),6000))]);if(result.error)throw result.error;const d=result.data||{};config={content:d.content||{},media:d.media||{},tours:d.tours||[],faqs:d.faqs||[]}}}catch{if(status)status.textContent='Показаны сохранённые маршруты. Актуальные даты уточните в WhatsApp.'}
  const catalog=readTours(config).filter(t=>t.published);
  const departures=readCalendar(config,catalog).filter(d=>d.published!==false&&catalog.some(t=>t.id===d.tourId));
  const link=t=>'/trip.html?id='+encodeURIComponent(t.id);
  const whatsApp=(tour,departure)=>{const message=['Здравствуйте! Хочу узнать подробнее о путешествии',tour?.title?`«${tour.title}»`:'',departure?`на даты ${formatDeparture(departure)}`:''].filter(Boolean).join(' ');return 'https://wa.me/message/QHA2WWUW5XGED1?text='+encodeURIComponent(message)};
  const formatDate=value=>value?new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')):'';
  const formatDeparture=d=>{if(!d.start)return d.label;const start=new Date(d.start+'T12:00:00Z'),end=d.end?new Date(d.end+'T12:00:00Z'):null;if(end&&start.getUTCFullYear()===end.getUTCFullYear()&&start.getUTCMonth()===end.getUTCMonth())return `${start.getUTCDate()}–${formatDate(d.end).replace(/ г\.$/,'')}`;return `${formatDate(d.start).replace(/ г\.$/,'')}${end?' — '+formatDate(d.end).replace(/ г\.$/,''):''}`};
  function image(src,alt,extra=''){const safe=url(src);return safe?`<img src="${e(safe)}" alt="${e(alt)}" ${extra}>`:''}
  function card(t){const heading=page==='trips'?'h2':'h3';return `<a class="journey-card" href="${link(t)}"><div class="journey-photo">${image(t.image,t.title,'loading="lazy"')}<span>${e(t.status)}</span></div><div class="journey-info"><p>${e(t.days)} · ${e(t.dates)}</p><${heading}>${e(t.title)}</${heading}><p>${e(t.route)}</p><div><strong>${e(t.price)}</strong><span>Смотреть маршрут <span aria-hidden="true">↗</span></span></div></div></a>`}
  const content=config.content||{};
  function calendarList(list){
    if(!list.length)return '<p class="empty-state">Новые даты скоро появятся. Уточните поездку в WhatsApp.</p>';
    const groups=new Map();
    list.slice().sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999')).forEach(d=>{const key=d.start?d.start.slice(0,7):'undated';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(d)});
    return `<div class="departure-timeline">${[...groups].map(([key,items])=>{const month=key==='undated'?'Даты уточняются':new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(key+'-01T12:00:00Z')).replace(/ г\.$/,'');return `<section class="timeline-month"><h3>${e(month)}</h3><div>${items.map(d=>{const t=catalog.find(t=>t.id===d.tourId);const soon=/скоро|анонс/i.test(d.status||'');const remaining=Number.isInteger(d.remainingPlaces)&&d.remainingPlaces>=0?d.remainingPlaces:null;const capacity=Number.isInteger(d.capacity)&&d.capacity>0?d.capacity:null;const availability=soon?'Скоро анонс':remaining!==null?`Осталось ${remaining}${capacity&&capacity>=remaining?' из '+capacity:''}`:/мало|несколько/i.test(d.status||'')?'Остаток мест уточняется':d.status||'Уточнить места';return `<a class="timeline-trip" href="${link(t)}&departure=${encodeURIComponent(d.id)}#departure-request"><div class="timeline-date"><time datetime="${e(d.start||'')}">${e(formatDeparture(d))}</time><span>${e(t.days)}</span></div><div class="timeline-description"><h4>${e(t.title)}</h4><p>${e(t.route)}</p></div><span class="timeline-status">${e(availability)}</span></a>`}).join('')}</div></section>`}).join('')}</div>`;
  }
  // Rich headings allow only the formatting supported by the existing editor.
  function rich(value){const template=document.createElement('template');template.innerHTML=String(value);const clean=node=>{if(node.nodeType===3)return document.createTextNode(node.textContent);const fragment=document.createDocumentFragment();if(node.nodeType!==1)return fragment;const out=['BR','EM','SPAN','STRONG'].includes(node.tagName)?document.createElement(node.tagName.toLowerCase()):fragment;node.childNodes.forEach(child=>out.appendChild(clean(child)));return out};const out=document.createElement('div');template.content.childNodes.forEach(n=>out.appendChild(clean(n)));return out.innerHTML}
  document.querySelectorAll('[data-content]').forEach(el=>{const v=content[el.dataset.content];if(typeof v==='string')el.textContent=v});
  document.querySelectorAll('[data-content-html]').forEach(el=>{const v=content[el.dataset.contentHtml];if(typeof v==='string'&&v.trim())el.innerHTML=rich(v)});
  if(page==='home'||page==='trips'){
    const formats=[['all','Все маршруты','/assets/media/hero-group-japan-ai.jpg'],['group','Групповые','/assets/media/gallery-seoul-group.jpg'],['expedition','Экспедиции','/assets/media/tour-other-japan.jpg'],['private','Индивидуальные','/assets/media/tour-private-asia.jpg']];
    const filters=document.querySelector('.catalog-filters');filters.classList.add('visual-formats');
    filters.innerHTML=formats.map(([key,title,photo],index)=>{const count=catalog.filter(t=>key==='all'||t.category===key).length;return `<button type="button" data-filter="${key}" class="format-panel ${index===0?'active':''}" aria-pressed="${index===0}" aria-label="${e(title)}, маршрутов: ${count}"><img src="${photo}" alt="" loading="lazy"><span class="format-panel-shade"></span><span class="format-panel-copy"><span class="format-panel-title">${e(title)}</span><span class="format-panel-count">Маршрутов: ${count}</span></span></button>`}).join('');
    const grid=document.querySelector('#catalog');let category='all';
    const render=()=>{const list=catalog.filter(t=>category==='all'||t.category===category);grid.innerHTML=list.length?list.map(card).join(''):'<p class="empty-state">В этом формате пока нет опубликованных поездок.</p>';const forms={one:'маршрут',few:'маршрута',many:'маршрутов',other:'маршрута'};document.querySelector('#result-count').textContent=`${list.length} ${forms[new Intl.PluralRules('ru').select(list.length)]}`;};
    document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.setAttribute('aria-pressed',x===b);x.classList.toggle('active',x===b)});if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(render);else render()});render();
  }
  const calendarEl=document.querySelector('#departures');if(calendarEl)calendarEl.innerHTML=calendarList(departures);
  if(page==='home'){
    const intro=document.querySelector('.home-intro'),catalogSection=document.querySelector('.catalog-section');
    catalogSection.after(intro);
    intro.insertAdjacentHTML('afterbegin','<figure class="home-people"><img src="/assets/media/founder-group.jpg" alt="Гаухар и участники путешествия Visa Land" loading="lazy" decoding="async"><figcaption>Гаухар и команда Visa Land</figcaption></figure>');
    const peopleCopy=document.createElement('div');peopleCopy.className='home-people-copy';
    [...intro.children].filter(el=>!el.classList.contains('home-people')).forEach(el=>peopleCopy.appendChild(el));intro.appendChild(peopleCopy);
    peopleCopy.insertAdjacentHTML('beforeend','<p data-content="aboutCopy"></p><a class="text-link" href="/about.html">Познакомиться с командой ↗</a>');
    peopleCopy.querySelector('[data-content="aboutCopy"]').textContent=content.aboutCopy||'Меня зовут Гаухар. Я организую путешествия и лично сопровождаю часть групп. Вместе со мной работают групп-лидеры и местные специалисты.';
    intro.insertAdjacentHTML('afterend','<section class="travel-frames" aria-label="Моменты путешествий Visa Land"><div class="travel-frames-heading"><h2>Место для впечатлений.</h2><p>Локальные места, новые знакомства и время почувствовать страну.</p></div><div class="travel-frames-grid"><figure><img src="/assets/media/gallery-kimono.jpg" alt="Участницы поездки в кимоно" loading="lazy" decoding="async"><figcaption>Япония</figcaption></figure><figure><img src="/assets/media/gallery-seoul-group.jpg" alt="Участники путешествия в Сеуле" loading="lazy" decoding="async"><figcaption>Сеул</figcaption></figure><figure><img src="/assets/media/gallery-dinner.jpg" alt="Участники Visa Land за совместным ужином" loading="lazy" decoding="async"><figcaption>Вечер вместе</figcaption></figure></div></section>');
    const peoplePhoto=intro.querySelector('img');if(config.media?.aboutImage)peoplePhoto.src=url(config.media.aboutImage);
    intro.classList.add('care-story');
    peopleCopy.innerHTML='<div class="care-step"><h2>Вы собираете чемодан.<br><span>Остальное мы берём на себя.</span></h2></div><div class="care-step care-roles"><div><h3>Вы</h3><p>Выбираете путешествие, делитесь пожеланиями и готовитесь к новым впечатлениям.</p></div><div><h3>Мы</h3><p>Продумываем маршрут и помогаем подготовиться к поездке. Все условия и состав пакета обсуждаем до бронирования.</p></div></div><div class="care-step care-personal"><p></p><a class="text-link" href="/about.html">Познакомиться с командой</a></div>';
    peopleCopy.querySelector('.care-personal p').textContent=content.aboutCopy||'Меня зовут Гаухар. Я организую путешествия и лично сопровождаю часть групп. Для меня важно создать комфортный, живой и запоминающийся маршрут.';
    const visaPhoto=document.querySelector('.visa-help-photo img');if(config.media?.visaImage)visaPhoto.src=/\/visa-support\.jpg(?:\?.*)?$/.test(config.media.visaImage)?'/assets/media/visa-support-ai.jpg':url(config.media.visaImage);
    const form=document.querySelector('#lead-form'),tourSelect=document.querySelector('#tour-select'),dateSelect=document.querySelector('#date-select'),formStatus=document.querySelector('#form-status');
    tourSelect.innerHTML=catalog.length?catalog.map(t=>`<option value="${e(t.title)}" data-tour-id="${e(t.id)}">${e(t.title)}</option>`).join(''):'<option value="Подбор путешествия">Помогите подобрать путешествие</option>';
    const updateLeadDates=()=>{const selected=tourSelect.selectedOptions[0]?.dataset.tourId,dates=departures.filter(d=>d.tourId===selected);dateSelect.innerHTML=dates.length?dates.map(d=>`<option value="${e(formatDeparture(d))}">${e(formatDeparture(d))}</option>`).join(''):'<option value="Даты уточняются">Даты уточняются</option>'};
    tourSelect.addEventListener('change',updateLeadDates);updateLeadDates();
    form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('button[type="submit"]'),data=Object.fromEntries(new FormData(form));button.disabled=true;formStatus.className='form-status wide';formStatus.textContent='Отправляем заявку…';try{if(!window.visaSupabase)throw new Error('service unavailable');const {error}=await window.visaSupabase.from('leads').insert({name:data.name.trim(),phone:data.phone.trim(),tour:data.tour,departure_date:data.date,comment:data.comment?.trim()||null});if(error)throw error;form.reset();updateLeadDates();formStatus.classList.add('is-success');formStatus.textContent='Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.'}catch(error){console.error('Lead submission failed',error);formStatus.classList.add('is-error');formStatus.innerHTML=`Не удалось отправить заявку. <a href="${whatsApp()}" target="_blank" rel="noopener">Напишите нам в WhatsApp ↗</a>`}finally{button.disabled=false}});
  }
  if(page==='trip'){
    const t=catalog.find(t=>t.id===new URLSearchParams(location.search).get('id'));const main=document.querySelector('#trip-content');
    if(!t){document.title='Поездка не найдена — Visa Land';main.innerHTML='<section class="page-heading"><h1>Маршрут не найден</h1><p>Возможно, поездка перенесена или ещё готовится.</p><a class="button button-accent" href="/trips.html">Все путешествия</a></section>'}
    else{document.title=t.title+' — Visa Land';const dates=departures.filter(d=>d.tourId===t.id),faqs=(config.faqs.length?config.faqs:VisaDefaults.faqs).slice(0,6);const itinerary=t.program.length?t.program.map((day,i)=>{const d=typeof day==='string'?{title:day,description:'',image:''}:day,hasDetails=Boolean(d.description||d.image);return hasDetails?`<details class="itinerary-day" ${i===0?'open':''}><summary><span>День ${i+1}</span><h3>${e(d.title)}</h3><span class="expand-mark" aria-hidden="true">+</span></summary>${d.description?`<p>${e(d.description)}</p>`:''}${d.image?image(d.image,d.title,'loading="lazy"'):''}</details>`:`<div class="itinerary-day itinerary-day-static"><span>День ${i+1}</span><h3>${e(d.title)}</h3></div>`}).join(''):'<p class="empty-state">Подробная программа готовится. Напишите нам — расскажем о логике маршрута и сроках публикации.</p>';main.innerHTML=`<section class="trip-opening"><div><a class="back-link" href="/trips.html">← Все путешествия</a><h1>${e(t.title)}</h1><p>${e(t.route)}</p><div class="trip-facts"><span>${e(t.days)}</span><span>${e(t.price)}</span><span>${e(t.status)}</span></div><a class="button button-accent" href="${whatsApp(t)}" target="_blank" rel="noopener">Обсудить этот маршрут ↗</a></div><div class="trip-cover">${image(t.image,t.title,'fetchpriority="high"')}</div></section><section class="trip-story"><h2>Ваше путешествие</h2><p>${e(t.desc)}</p></section><section class="itinerary section"><div class="section-head"><h2>День за днём</h2><p>Программа маршрута</p></div>${itinerary}<div class="trip-inline-cta"><p>Хотите уточнить темп, свободное время или конкретный день?</p><a class="text-link" href="${whatsApp(t)}" target="_blank" rel="noopener">Задать вопрос по маршруту ↗</a></div></section>${t.gallery.length?`<section class="trip-gallery section"><h2>В кадре</h2><div>${t.gallery.map((photo,i)=>image(typeof photo==='string'?photo:photo.url,photo.alt||t.title+' — фото '+(i+1),'loading="lazy"')).join('')}</div></section>`:''}<section class="trip-inclusions section"><div><h2>Включено</h2>${t.included.length?'<ul>'+t.included.map(v=>'<li>'+e(v)+'</li>').join('')+'</ul>':'<p>Точный состав пакета фиксируется в предложении до оплаты. Напишите нам, чтобы получить актуальные условия.</p>'}</div><div><h2>Оплачивается отдельно</h2>${t.excluded.length?'<ul>'+t.excluded.map(v=>'<li>'+e(v)+'</li>').join('')+'</ul>':'<p>Дополнительные расходы зависят от выбранного формата. Мы заранее перечислим их перед бронированием.</p>'}</div></section><section class="trip-support section"><div><h2>До поездки<br><span>всё будет понятно.</span></h2><p>Гаухар, групп-лидеры и местные специалисты помогают подготовиться к путешествию. Условия и окончательная сумма фиксируются до оплаты.</p><a class="button button-accent" href="${whatsApp(t)}" target="_blank" rel="noopener">Обсудить детали ↗</a></div><div class="trip-support-faq">${faqs.map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div></section><section class="section"><h2>Выберите дату</h2><div class="calendar-entries">${calendarList(dates)}</div></section>`}
  }
  if(page==='trip'){
    const params=new URLSearchParams(location.search);
    const selected=departures.find(d=>d.id===params.get('departure')&&d.tourId===params.get('id'));
    if(selected){const t=catalog.find(t=>t.id===selected.tourId);document.querySelector('.trip-opening')?.insertAdjacentHTML('afterend',`<section class="selected-departure" id="departure-request"><div><h2>Выбранный заезд</h2><p>${e(t.title)} · ${e(formatDeparture(selected))}</p><p>${e(selected.status)}${selected.places?' · '+e(selected.places):''}</p></div><a class="button button-accent" href="${whatsApp(t,selected)}" target="_blank" rel="noopener">Уточнить места в WhatsApp ↗</a></section>`);document.querySelector('#departure-request')?.scrollIntoView()}
  }
  if(page==='about'){
    const photo=document.querySelector('#about-image');if(config.media?.aboutImage)photo.src=url(config.media.aboutImage);
    const faq=document.querySelector('#public-faq');faq.innerHTML=(config.faqs.length?config.faqs:VisaDefaults.faqs).map(([q,a])=>`<details class="faq-row"><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('');
  }
  window.VisaHero?.mount(config);
  const supportCopy=document.querySelector('.trip-support>div:first-child');
  if(supportCopy)supportCopy.insertAdjacentHTML('afterbegin',image(config.media?.aboutImage||'/assets/media/founder-group.jpg','Гаухар и участники путешествия Visa Land','class="support-team-photo" loading="lazy" decoding="async"'));
  const leadSection=document.querySelector('.lead-section');
  if(leadSection){leadSection.insertAdjacentHTML('afterbegin',image('/assets/media/gallery-dinner.jpg','', 'class="lead-background" loading="lazy" decoding="async"'));leadSection.querySelector('textarea')?.setAttribute('rows','2')}
  document.querySelectorAll('#public-faq,.trip-support-faq').forEach((group,groupIndex)=>{
    group.querySelectorAll('details').forEach((item,index)=>{
      item.name='faq-group-'+groupIndex;
      const summary=item.querySelector('summary'),answer=item.querySelector('p');
      if(!summary||!answer)return;
      const marker=document.createElement('span');marker.className='faq-mark';marker.setAttribute('aria-hidden','true');summary.append(marker);
      let animation;
      summary.addEventListener('click',event=>{
        event.preventDefault();animation?.cancel();
        if(item.open){item.open=false;return}
        group.querySelectorAll('details[open]').forEach(other=>{other.open=false});item.open=true;
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=answer.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
      });
    });
  });
  document.querySelectorAll('.departure-timeline').forEach((rail,index)=>{
    rail.id='departure-rail-'+index;rail.setAttribute('tabindex','0');rail.setAttribute('role','region');rail.setAttribute('aria-label','Поездки по датам. Горизонтальная прокрутка');
    rail.querySelectorAll('.timeline-trip').forEach(card=>{const id=new URL(card.href).searchParams.get('id'),tour=catalog.find(t=>t.id===id);if(tour)card.insertAdjacentHTML('afterbegin',image(tour.image,'','loading="lazy" class="departure-photo"'))});
    const controls=document.createElement('div');controls.className='departure-controls';controls.innerHTML=`<span>Листайте, чтобы выбрать заезд</span><button type="button" aria-label="Предыдущие поездки" aria-controls="${rail.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button type="button" aria-label="Следующие поездки" aria-controls="${rail.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>`;rail.before(controls);
    const buttons=controls.querySelectorAll('button'),sync=()=>{buttons[0].disabled=rail.scrollLeft<2;buttons[1].disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2};
    buttons.forEach((button,i)=>button.onclick=()=>rail.scrollBy({left:(i?1:-1)*(rail.querySelector('.timeline-trip').offsetWidth+20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));rail.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);requestAnimationFrame(sync);
  });
  // Motion skill principles adapted to the static site: once-only entrances,
  // compositor-only movement, cleanup and a live reduced-motion preference.
  const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  const heroCover=document.querySelector('.home-opening');
  let coverFrame=0;
  const coverCatalog=document.querySelector('.catalog-section');
  const updateCover=()=>{coverFrame=0;if(!heroCover||motionPreference.matches)return;const height=heroCover.offsetHeight,progress=Math.min(1,Math.max(0,scrollY/height));heroCover.style.transform=`translateY(${-progress*height}px)`;heroCover.style.visibility=progress>=1?'hidden':'visible';if(coverCatalog){coverCatalog.style.transform=progress<1?`translateY(${progress*height-height}px)`:'none';coverCatalog.inert=progress===0}};
  const onCoverScroll=()=>{if(!coverFrame)coverFrame=requestAnimationFrame(updateCover)};
  const setCoverMode=()=>{if(!heroCover)return;document.body.classList.toggle('hero-cover-transition',!motionPreference.matches);if(motionPreference.matches){heroCover.style.removeProperty('transform');heroCover.style.removeProperty('visibility');if(coverCatalog){coverCatalog.inert=false;coverCatalog.style.removeProperty('transform')}}else updateCover()};
  setCoverMode();window.addEventListener('scroll',onCoverScroll,{passive:true});window.addEventListener('resize',onCoverScroll);motionPreference.addEventListener('change',setCoverMode);
  // A deliberate first gesture completes the cover transition in one movement.
  let coverJumping=false,coverGestureTimer,touchStartY=null;
  const finishCover=()=>{if(!heroCover||motionPreference.matches||coverJumping||scrollY>=heroCover.offsetHeight-2)return false;coverJumping=true;window.scrollTo({top:heroCover.offsetHeight,behavior:'smooth'});clearTimeout(coverGestureTimer);coverGestureTimer=setTimeout(()=>{coverJumping=false},1000);return true};
  const coverWheel=event=>{if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.deltaY<=0)return;if(coverJumping){event.preventDefault();return}if(finishCover())event.preventDefault()};
  const coverTouchStart=event=>{touchStartY=event.touches.length===1?event.touches[0].clientY:null};
  const coverTouchMove=event=>{if(touchStartY===null||!event.touches.length)return;if(touchStartY-event.touches[0].clientY>24&&(coverJumping||finishCover()))event.preventDefault()};
  const coverKey=event=>{if(event.target.closest('input,textarea,select,button,[contenteditable="true"]')||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;if(['ArrowDown','PageDown',' '].includes(event.key)&&(coverJumping||finishCover()))event.preventDefault()};
  if(heroCover){window.addEventListener('wheel',coverWheel,{passive:false});window.addEventListener('touchstart',coverTouchStart,{passive:true});window.addEventListener('touchmove',coverTouchMove,{passive:false});window.addEventListener('keydown',coverKey)}
  window.addEventListener('pagehide',()=>{clearTimeout(coverGestureTimer);window.removeEventListener('wheel',coverWheel);window.removeEventListener('touchstart',coverTouchStart);window.removeEventListener('touchmove',coverTouchMove);window.removeEventListener('keydown',coverKey)},{once:true});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(coverFrame);window.removeEventListener('scroll',onCoverScroll);window.removeEventListener('resize',onCoverScroll);motionPreference.removeEventListener('change',setCoverMode)},{once:true});
  const running=new Set();
  const move=(el,frames,options)=>{if(motionPreference.matches||!el.animate)return;const animation=el.animate(frames,options);running.add(animation);animation.finished.catch(()=>{}).finally(()=>running.delete(animation));return animation};
  const entranceOptions={duration:650,easing:'cubic-bezier(.16,1,.3,1)'};
  const opening=document.querySelector('.home-title');
  if(opening)move(opening,[{transform:'translateY(20px)',opacity:.65},{transform:'translateY(0)',opacity:1}],entranceOptions);
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);move(entry.target,[{transform:'translateY(18px)',opacity:.7},{transform:'translateY(0)',opacity:1}],entranceOptions)}),{threshold:.12,rootMargin:'0px 0px -24px'});
  document.querySelectorAll('.home-people:not(.care-story .home-people),.visa-help-photo,.trip-gallery img,.travel-frames figure').forEach(el=>observer.observe(el));
  const catalogGrid=document.querySelector('#catalog');
  const catalogMotion=new MutationObserver(()=>{catalogGrid.querySelectorAll('.journey-card').forEach((card,index)=>move(card,[{opacity:.7,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{...entranceOptions,duration:420,delay:Math.min(index*45,135)}))});
  if(catalogGrid)catalogMotion.observe(catalogGrid,{childList:true});
  document.querySelectorAll('.button').forEach(button=>{let pressed=false,pressAnimation;button.addEventListener('pointerdown',event=>{if(button.disabled||event.button!==0)return;pressed=true;pressAnimation?.cancel();pressAnimation=move(button,[{scale:1},{scale:.97}],{duration:120,fill:'forwards'})});const release=()=>{if(!pressed)return;pressed=false;pressAnimation?.cancel();move(button,[{scale:.97},{scale:1}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'})};button.addEventListener('pointerup',release);button.addEventListener('pointerleave',release);button.addEventListener('pointercancel',release);button.addEventListener('blur',release)});
  motionPreference.addEventListener('change',()=>{if(motionPreference.matches)running.forEach(animation=>animation.cancel())});
  window.addEventListener('pagehide',()=>{observer.disconnect();catalogMotion.disconnect();running.forEach(animation=>animation.cancel())},{once:true});
  document.querySelectorAll('.site-nav a').forEach(a=>{if(new URL(a.getAttribute('href'),location.origin).pathname.replace(/\.html$/,'')===location.pathname.replace(/\.html$/,''))a.setAttribute('aria-current','page')});
  const toggle=document.querySelector('#nav-toggle'),nav=document.querySelector('.site-nav');toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);if(open)move(nav,[{opacity:.5,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'})};document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}});
})();
