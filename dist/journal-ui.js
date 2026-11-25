(() => {
  const arrowPaths={ '↗':'M5 19 19 5M5 5h14v14', '↘':'M5 5l14 14M5 19h14V5', '←':'M19 12H5m7-7-7 7 7 7' };
  function replaceArrows(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode()){const node=walker.currentNode;if(/[↗↘←]/.test(node.textContent)&&!node.parentElement.closest('script,style,textarea'))nodes.push(node)}
    nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/([↗↘←])/).forEach(part=>{if(!arrowPaths[part]){fragment.append(document.createTextNode(part));return}const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','ui-arrow');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',arrowPaths[part]);svg.append(path);fragment.append(svg)});node.replaceWith(fragment)});
  }
  replaceArrows(document.body);
  const mobileArrows=matchMedia('(max-width:900px)');
  function removeMobileArrowGlyphs(root){
    if(!mobileArrows.matches)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode()){const node=walker.currentNode;if(/[↗↘↙↖←→↑↓➜➝➞➟➠➡⬅⬆⬇⤴⤵🔗]/u.test(node.textContent)&&!node.parentElement?.closest('script,style,textarea,input'))nodes.push(node)}
    nodes.forEach(node=>{node.textContent=node.textContent.replace(/[↗↘↙↖←→↑↓➜➝➞➟➠➡⬅⬆⬇⤴⤵🔗][\uFE0E\uFE0F]?/gu,'')});
  }
  removeMobileArrowGlyphs(document.body);
  const arrowCleanup=new MutationObserver(records=>{records.forEach(record=>{if(record.type==='characterData')removeMobileArrowGlyphs(record.target.parentElement);else record.addedNodes.forEach(node=>{if(node.nodeType===1)removeMobileArrowGlyphs(node);else if(node.nodeType===3)removeMobileArrowGlyphs(node.parentElement)})})});
  arrowCleanup.observe(document.body,{childList:true,subtree:true,characterData:true});
  mobileArrows.addEventListener('change',()=>removeMobileArrowGlyphs(document.body));
  window.addEventListener('pagehide',()=>arrowCleanup.disconnect(),{once:true});
  if(document.querySelector('.visa-services')){
    const services=document.querySelector('.visa-services');
    services.querySelectorAll(':scope>section').forEach(section=>{
      const heading=section.querySelector('h2'),details=document.createElement('details'),summary=document.createElement('summary'),content=document.createElement('div');
      details.id=section.id;section.removeAttribute('id');details.className='visa-accordion';details.name='visa-directions';summary.append(heading);const mark=document.createElement('span');mark.className='faq-mark';mark.setAttribute('aria-hidden','true');summary.append(mark);content.className='visa-accordion-content';section.replaceWith(details);details.append(summary,content);content.append(section);
      details.addEventListener('toggle',()=>{if(details.open&&!matchMedia('(prefers-reduced-motion: reduce)').matches)content.animate([{opacity:.4,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'cubic-bezier(.16,1,.3,1)'})});
    });
    document.querySelectorAll('.visa-direction-nav a').forEach(a=>a.addEventListener('click',()=>{const section=document.getElementById(a.hash.slice(1));if(section)section.closest('details').open=true}));
    const openDirection=()=>{const initial=document.getElementById(location.hash.slice(1));if(initial?.matches('.visa-accordion'))initial.open=true};
    openDirection();window.addEventListener('hashchange',openDirection);
  }
  const updates=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1&&!node.matches('svg,path'))replaceArrows(node)})));
  updates.observe(document.body,{childList:true,subtree:true});
  // Content is generated asynchronously by pages.js; build navigation only once.
  function buildContents(){
    if(document.body.dataset.page!=='trip'||document.querySelector('.route-contents'))return;
    const sections=[['.itinerary','Программа'],['.trip-gallery','Фото'],['.trip-inclusions','Стоимость'],['.trip-support','Вопросы']].map(([selector,label])=>({el:document.querySelector(selector),label})).filter(item=>item.el);
    if(!sections.length)return;
    prepareDays();
    const nav=document.createElement('nav');nav.className='route-contents';nav.setAttribute('aria-label','Разделы маршрута');
    sections.forEach(({el,label},index)=>{el.id='route-section-'+index;const a=document.createElement('a');a.href='#'+el.id;a.textContent=label;nav.append(a)});
    document.querySelector('.trip-opening').after(nav);
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -60% 0px'});
    sections.forEach(({el})=>observer.observe(el));
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  }
  function prepareDays(){
    document.querySelectorAll(".itinerary-day-static").forEach(day=>{const details=document.createElement("details");details.className="itinerary-day";const summary=document.createElement("summary");while(day.firstChild)summary.append(day.firstChild);const mark=document.createElement("span");mark.className="expand-mark";mark.setAttribute("aria-hidden","true");mark.textContent="+";summary.append(mark);details.append(summary);const note=document.createElement("p");note.className="day-photo-empty";note.textContent="Фотография этого дня пока не добавлена.";details.append(note);day.replaceWith(details)});
    document.querySelectorAll(".itinerary-day").forEach(day=>{day.open=false;day.name="journey-program";day.addEventListener("toggle",()=>{if(day.open&&!matchMedia("(prefers-reduced-motion: reduce)").matches)day.querySelector("img")?.animate([{opacity:.4,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:400,easing:"cubic-bezier(.16,1,.3,1)"})})});
  }
  const contentObserver=new MutationObserver(buildContents);contentObserver.observe(document.querySelector('main'),{childList:true,subtree:true});buildContents();
  window.addEventListener('pagehide',()=>{updates.disconnect();contentObserver.disconnect()},{once:true});
})();
