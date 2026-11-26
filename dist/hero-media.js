/* One media controller for the homepage and the editor preview. */
(function(){
 const controllers=new WeakMap();
 const clamp=(value,fallback,min,max)=>Number.isFinite(Number(value))&&value!==''?Math.max(min,Math.min(max,Number(value))):fallback;
 function sectionUrl(value){const safe=VisaCatalog.url(value||'/#trips')||'/#trips';const target=new URL(safe,location.origin);if(target.origin!==location.origin)return safe;const sections={trips:'trips',calendar:'calendar',about:'about',visas:'visas'};const section=sections[target.pathname.replace(/^\/|\/$/g,'').replace(/\.html$/,'')];return section?'/'+target.search+(target.hash||'#'+section):safe}
 function settings(config={}){const c=config.content||{},m=config.media||{};const desktopVideo=m.heroVideo||'/assets/media/torii-loop.mp4';const desktopPoster=m.heroPoster||'/assets/media/hero-group-japan.jpg';return {mode:c.heroMode==='photo'?'photo':'video',poster:desktopPoster,mobilePoster:m.heroMobilePoster||desktopPoster,video:desktopVideo,mobileVideo:m.heroMobileVideo||desktopVideo,x:clamp(c.heroX,50,0,100),y:clamp(c.heroY,50,0,100),mobileX:clamp(c.heroMobileX,50,0,100),mobileY:clamp(c.heroMobileY,50,0,100),shade:clamp(c.heroShade,65,25,90),height:c.heroHeight==='compact'?'compact':'full',button:window.VisaContent?VisaContent.get(config,'heroButton'):(c.heroButton??'Выбрать путешествие'),buttonUrl:sectionUrl(c.heroButtonUrl),caption:window.VisaContent?VisaContent.get(config,'heroCaption'):(c.heroCaption??'Япония · Южная Корея')}}
 function mount(config={},root=document.querySelector('.home-opening'),options={}){
  if(!root)return ()=>{};
  controllers.get(root)?.();
  const s=settings(config),video=root.querySelector('.home-film'),photo=root.querySelector('.home-photo'),mobile=matchMedia('(max-width: 600px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mediaUrl=value=>{const source=String(value);const upgraded=value;return options.preview&&source.startsWith('blob:')?value:VisaCatalog.url(upgraded)};
  let visible=false,failed=false,disposed=false,userPaused=false;
  let mediaStatus=root.querySelector('.hero-media-status');if(!mediaStatus){mediaStatus=document.createElement('p');mediaStatus.className='hero-media-status';mediaStatus.setAttribute('role','status');root.append(mediaStatus)}mediaStatus.textContent='';
  const pause=root.querySelector('.hero-pause');
  if(pause){pause.setAttribute('aria-pressed','false');pause.textContent=window.VisaContent?VisaContent.get(config,'heroPauseLabel'):'Остановить видео'}
  const onPause=()=>{userPaused=!userPaused;if(pause){pause.setAttribute('aria-pressed',String(userPaused));pause.textContent=window.VisaContent?VisaContent.get(config,userPaused?'heroResumeLabel':'heroPauseLabel'):(userPaused?'Продолжить видео':'Остановить видео')}play()};pause?.addEventListener('click',onPause);
  root.dataset.heroHeight=s.height;root.style.setProperty('--hero-shade',String(s.shade/100));
  const caption=root.querySelector('.film-caption');if(caption)caption.textContent=s.caption;
  const cta=root.querySelector('.home-title .button');if(cta){cta.textContent=s.button;cta.href=s.buttonUrl;if(new URL(cta.href,location.origin).origin!==location.origin){cta.target='_blank';cta.rel='noopener'}else{cta.removeAttribute('target');cta.removeAttribute('rel')}}
  video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;video.autoplay=true;video.preload='metadata';
  function play(){if(disposed)return;if(s.mode!=='video'||reduced.matches||userPaused||failed||!visible||document.hidden){video.pause();return}const result=video.play();result?.catch(()=>{if(disposed)return;root.classList.remove('video-ready')})}
  function choose(){failed=false;if(pause)pause.hidden=s.mode!=='video'||reduced.matches;root.classList.remove('video-ready');const small=options.mobile??mobile.matches;const position=`${small?s.mobileX:s.x}% ${small?s.mobileY:s.y}%`;video.style.objectPosition=position;photo.style.objectPosition=position;photo.src=mediaUrl(small?s.mobilePoster:s.poster);video.poster=photo.src;if(s.mode==='video'&&!reduced.matches){const source=mediaUrl(small?s.mobileVideo:s.video);if(video.getAttribute('src')!==source){video.src=source;video.load()}play()}else{video.pause();video.removeAttribute('src');video.load()}}
  function onPlaying(){if(!disposed)root.classList.add('video-ready')}
  function onError(){if(s.mode!=='video'||reduced.matches)return;failed=true;root.classList.remove('video-ready');if(pause)pause.hidden=true;mediaStatus.textContent=window.VisaContent?VisaContent.get(config,'heroVideoError'):'Видео недоступно. Показана обложка.'}
  video.addEventListener('playing',onPlaying);video.addEventListener('error',onError);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;play()});observer.observe(root);
  const onVisibility=()=>play();document.addEventListener('visibilitychange',onVisibility);mobile.addEventListener('change',choose);reduced.addEventListener('change',choose);choose();
  const cleanup=()=>{disposed=true;pause?.removeEventListener('click',onPause);observer.disconnect();video.pause();video.removeEventListener('playing',onPlaying);video.removeEventListener('error',onError);document.removeEventListener('visibilitychange',onVisibility);mobile.removeEventListener('change',choose);reduced.removeEventListener('change',choose)};
  controllers.set(root,cleanup);return cleanup;
 }
 window.VisaHero={settings,mount};
 if(document.querySelector('.home-opening'))mount();
})();
