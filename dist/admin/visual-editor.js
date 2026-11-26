/* Same-origin, draft-only preview. Editing uses durable field keys rather than DOM positions. */
(() => {
 const frame=document.querySelector('#page-preview'),section=document.querySelector('#preview-section');let ready=false,timer,mobile=false;
 function config(){return draftConfig()}
 function update(){
  if(!ready||!frame.contentWindow?.VisaLanding)return;
  frame.contentWindow.VisaLanding.preview(config());frame.classList.toggle('preview-mobile',mobile);fitPreviewFrame(frame,mobile,780);
  const target=frame.contentDocument.querySelector(section.value);if(target)target.scrollIntoView({behavior:'instant',block:'start'});
  document.querySelector('#preview-status').textContent='Черновик. Изменения ещё не опубликованы; форма заявки в предпросмотре не отправляется.';
 }
 window.refreshDraftPreview=()=>{if(!frame.src){ready=false;frame.src='/?editor-preview=1';return}update()};
 window.scheduleDraftPreview=()=>{if(!ready)return;clearTimeout(timer);timer=setTimeout(update,250)};
 frame.onload=()=>{
  ready=true;update();
  frame.contentDocument.addEventListener('click',event=>{
   // Keep the website interactive, with an explicit edit shortcut on double-click.
   if(!event.altKey)return;
   const node=event.target.closest('[data-content],[data-content-html],[data-media],[data-content-placeholder]');if(!node)return;
   event.preventDefault();event.stopPropagation();const key=node.dataset.media||node.dataset.content||node.dataset.contentHtml||node.dataset.contentPlaceholder;
   if(!focusCmsField(key))document.querySelector('#preview-status').textContent='Поля этого элемента находятся в разделе «Туры».';
  },true);
  const helper=frame.contentDocument.createElement('style');helper.textContent='[data-content],[data-content-html],[data-media]{cursor:default} [data-content]:hover,[data-content-html]:hover,[data-media]:hover{outline:1px dashed #b84330;outline-offset:3px}';frame.contentDocument.head.append(helper);
 };
 document.querySelector('#refresh-preview').onclick=()=>window.refreshDraftPreview();section.onchange=()=>{if(!frame.src)window.refreshDraftPreview();else update()};
 document.querySelectorAll('[data-preview-size]').forEach(button=>button.onclick=()=>{mobile=button.dataset.previewSize==='mobile';document.querySelectorAll('[data-preview-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update()});
 document.querySelector('[data-panel="preview"] .panel-head p').textContent='Черновик до публикации. Переключайте компьютер и телефон, проверяйте кнопки и попапы. Чтобы перейти к полю текста или фото, зажмите Alt и нажмите на элемент. На телефоне используйте разделы редактора.';
})();
