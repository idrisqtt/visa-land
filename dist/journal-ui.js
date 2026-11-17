(() => {
  const arrowPaths={ '↗':'M5 19 19 5M5 5h14v14', '↘':'M5 5l14 14M5 19h14V5', '←':'M19 12H5m7-7-7 7 7 7' };
  function replaceArrows(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode()){const node=walker.currentNode;if(/[↗↘←]/.test(node.textContent)&&!node.parentElement.closest('script,style,textarea'))nodes.push(node)}
    nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/([↗↘←])/).forEach(part=>{if(!arrowPaths[part]){fragment.append(document.createTextNode(part));return}const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','ui-arrow');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',arrowPaths[part]);svg.append(path);fragment.append(svg)});node.replaceWith(fragment)});
  }
  replaceArrows(document.body);
  const updates=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1&&!node.matches('svg,path'))replaceArrows(node)})));
  updates.observe(document.body,{childList:true,subtree:true});
  // Content is generated asynchronously by pages.js; build navigation only once.
  function buildContents(){
    if(document.body.dataset.page!=='trip'||document.querySelector('.route-contents'))return;
    const sections=[['.itinerary','Программа'],['.trip-gallery','Фото'],['.trip-inclusions','Стоимость'],['.trip-support','Вопросы']].map(([selector,label])=>({el:document.querySelector(selector),label})).filter(item=>item.el);
    if(!sections.length)return;
    const cover=document.querySelector('.trip-cover img');if(cover){cover.src='/assets/media/route-coast-ai.jpg';cover.alt='Атмосферная иллюстрация японского побережья';const caption=document.createElement('span');caption.className='trip-art-caption';caption.textContent='Атмосферная иллюстрация · создано с ИИ';document.querySelector('.trip-opening').append(caption)}
    buildRouteMap();
    const nav=document.createElement('nav');nav.className='route-contents';nav.setAttribute('aria-label','Разделы маршрута');
    sections.forEach(({el,label},index)=>{el.id='route-section-'+index;const a=document.createElement('a');a.href='#'+el.id;a.textContent=label;nav.append(a)});
    document.querySelector('.trip-opening').after(nav);
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -60% 0px'});
    sections.forEach(({el})=>observer.observe(el));
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  }
  function buildRouteMap(){
    const itinerary=document.querySelector('.itinerary');if(!itinerary||itinerary.querySelector('.route-map'))return;
    const cities=[['Сеул',126.98,37.57,/сеул/i],['Пусан',129.08,35.18,/пусан/i],['Осака',135.5,34.69,/осак/i],['Киото',135.77,35.01,/киото/i],['Нара',135.8,34.68,/нар[ауы]/i],['Токио',139.69,35.68,/токио/i],['Камакура',139.55,35.32,/камакур/i],['Канадзава',136.65,36.56,/канадзав/i],['Такаяма',137.25,36.14,/такаям/i],['Коясан',135.59,34.21,/коясан/i],['Наосима',133.99,34.46,/наосим/i]];
    const days=[...itinerary.querySelectorAll('.itinerary-day')];const routeText=document.querySelector('.trip-opening p')?.textContent||'';
    const stops=routeText.split(/[—–→]/).map(part=>cities.find(c=>c[3].test(part))).filter(Boolean);if(stops.length<2)return;
    const points=stops.map(c=>[60+(c[1]-126)*28,70+(39-c[2])*65]);
    const panel=document.createElement('aside');panel.className='route-map';panel.innerHTML='<h3>Ваш маршрут</h3><p class="route-map-current" aria-live="polite">'+VisaCatalog.escape(stops[0][0])+'</p>';
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 520 460');svg.setAttribute('role','img');svg.setAttribute('aria-label','Географическая схема маршрута: '+stops.map(c=>c[0]).join(', '));
    const add=(tag,attrs,text)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));if(text)el.textContent=text;svg.append(el);return el};
    const path=points.map((p,i)=>(i?'L':'M')+p.join(',')).join(' ');add('path',{d:path,class:'map-track'});const progress=add('path',{d:path,class:'map-progress',pathLength:'1','stroke-dasharray':'1','stroke-dashoffset':'1'});
    const dots=points.map(([x,y],i)=>{const dot=add('circle',{cx:x,cy:y,r:6,class:'map-stop'});add('text',{x:x+10,y:y+(i%2?-12:20),class:'map-label'},stops[i][0]);return dot});
    panel.append(svg);const caption=document.createElement('p');caption.className='route-map-caption';caption.textContent='Схема маршрута · точки по городам программы';panel.append(caption);
    const layout=document.createElement('div');layout.className='itinerary-map-layout';const list=document.createElement('div');list.className='itinerary-days';days[0].before(layout);layout.append(panel,list);days.forEach(day=>list.append(day));
    const lengths=points.map((p,i)=>i?Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]):0);const total=lengths.reduce((a,b)=>a+b,0);
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const title=entry.target.querySelector('h3')?.textContent||'';const found=cities.filter(c=>c[3].test(title)).pop();if(!found)return;const index=stops.indexOf(found);if(index<0)return;progress.style.strokeDashoffset=String(1-lengths.slice(0,index+1).reduce((a,b)=>a+b,0)/total);dots.forEach((dot,i)=>dot.classList.toggle('is-current',i===index));panel.querySelector('.route-map-current').textContent=found[0];days.forEach(day=>day.classList.toggle('is-current-day',day===entry.target))}),{rootMargin:'-20% 0px -50% 0px'});days.forEach(day=>observer.observe(day));window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  }
  const contentObserver=new MutationObserver(buildContents);contentObserver.observe(document.querySelector('main'),{childList:true,subtree:true});buildContents();
  window.addEventListener('pagehide',()=>{updates.disconnect();contentObserver.disconnect()},{once:true});
})();
