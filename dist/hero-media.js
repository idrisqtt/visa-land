/* One media controller for the homepage and the editor preview. */
(function(){
 const clamp=(value,fallback,min,max)=>Number.isFinite(Number(value))&&value!==''?Math.max(min,Math.min(max,Number(value))):fallback;
 function sectionUrl(value){const safe=VisaCatalog.url(value||'/#trips')||'/#trips';const target=new URL(safe,location.origin);if(target.origin!==location.origin)return safe;const sections={trips:'trips',calendar:'calendar',visas:'visas',about:'about'};const section=sections[target.pathname.replace(/^\/|\/$/g,'').replace(/\.html$/,'')];return section?'/'+target.search+(target.hash||'#'+section):safe}
 function settings(config={}){const c=config.content||{},m=config.media||{};const legacyVideo=value=>!value||/\/torii-loop\.mp4(?:\?.*)?$/.test(value);const legacyPoster=value=>!value||/\/hero-group-japan(?:-ai)?\.jpg(?:\?.*)?$/.test(value);const desktopVideo=legacyVideo(m.heroVideo)?'/assets/media/hero-desktop.mp4':m.heroVideo;const desktopPoster=legacyPoster(m.heroPoster)?'/assets/media/hero-desktop.jpg':m.heroPoster;return {mode:c.heroMode==='photo'?'photo':'video',poster:desktopPoster,mobilePoster:m.heroMobilePoster||(legacyPoster(m.heroPoster)?'/assets/media/hero-mobile.jpg':desktopPoster),video:desktopVideo,mobileVideo:m.heroMobileVideo||(legacyVideo(m.heroVideo)?'/assets/media/hero-mobile.mp4':desktopVideo),x:clamp(c.heroX,50,0,100),y:clamp(c.heroY,50,0,100),mobileX:clamp(c.heroMobileX,50,0,100),mobileY:clamp(c.heroMobileY,50,0,100),shade:clamp(c.heroShade,65,25,90),height:c.heroHeight==='compact'?'compact':'full',button:c.heroButton||'Выбрать путешествие ↗',buttonUrl:sectionUrl(c.heroButtonUrl),caption:c.heroCaption??'Япония · Южная Корея · Ваши новые истории'}}
 function mount(config={},root=document.querySelector('.home-opening'),options={}){
  if(!root)return ()=>{};
  const s=settings(config),video=root.querySelector('.home-film'),photo=root.querySelector('.home-photo'),mobile=matchMedia('(max-width: 600px)');
  const mediaUrl=value=>{const source=String(value);const upgraded=/\/hero-group-japan\.jpg(?:\?.*)?$/.test(source)?'/assets/media/hero-group-japan-ai.jpg':value;return options.preview&&source.startsWith('blob:')?value:VisaCatalog.url(upgraded)};
  let visible=false,failed=false,disposed=false;
  root.dataset.heroHeight=s.height;root.style.setProperty('--hero-shade',String(s.shade/100));
  const caption=root.querySelector('.film-caption');if(caption)caption.textContent=s.caption;
  const cta=root.querySelector('.home-title .button');if(cta){cta.textContent=s.button;cta.href=s.buttonUrl;if(new URL(cta.href,location.origin).origin!==location.origin){cta.target='_blank';cta.rel='noopener'}else{cta.removeAttribute('target');cta.removeAttribute('rel')}}
  video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;video.autoplay=true;video.preload='metadata';
  function play(){if(disposed)return;if(s.mode!=='video'||failed||!visible||document.hidden){video.pause();return}const result=video.play();result?.catch(()=>{if(disposed)return;root.classList.remove('video-ready')})}
  function choose(){failed=false;root.classList.remove('video-ready');const small=options.mobile??mobile.matches;const position=`${small?s.mobileX:s.x}% ${small?s.mobileY:s.y}%`;video.style.objectPosition=position;photo.style.objectPosition=position;photo.src=mediaUrl(small?s.mobilePoster:s.poster);video.poster=photo.src;if(s.mode==='video'){const source=mediaUrl(small?s.mobileVideo:s.video);if(video.getAttribute('src')!==source){video.src=source;video.load()}play()}else{video.pause();video.removeAttribute('src');video.load()}}
  function onPlaying(){if(!disposed)root.classList.add('video-ready')}
  function onError(){failed=true;root.classList.remove('video-ready')}
  video.addEventListener('playing',onPlaying);video.addEventListener('error',onError);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;play()});observer.observe(root);
  const onVisibility=()=>play();document.addEventListener('visibilitychange',onVisibility);mobile.addEventListener('change',choose);choose();
  return ()=>{disposed=true;observer.disconnect();video.pause();video.removeEventListener('playing',onPlaying);video.removeEventListener('error',onError);document.removeEventListener('visibilitychange',onVisibility);mobile.removeEventListener('change',choose)};
 }
 window.VisaHero={settings,mount};
})();
