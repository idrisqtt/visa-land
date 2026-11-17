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
    const nav=document.createElement('nav');nav.className='route-contents';nav.setAttribute('aria-label','Разделы маршрута');
    sections.forEach(({el,label},index)=>{el.id='route-section-'+index;const a=document.createElement('a');a.href='#'+el.id;a.textContent=label;nav.append(a)});
    document.querySelector('.trip-opening').after(nav);
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -60% 0px'});
    sections.forEach(({el})=>observer.observe(el));
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  }
  const contentObserver=new MutationObserver(buildContents);contentObserver.observe(document.querySelector('main'),{childList:true,subtree:true});buildContents();
  window.addEventListener('pagehide',()=>{updates.disconnect();contentObserver.disconnect()},{once:true});
})();
