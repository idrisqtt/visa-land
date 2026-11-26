(function(){
  const defaults=window.VisaDefaults;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function url(value){if(!String(value??'').trim())return '';try{const u=new URL(String(value||''),location.origin);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}}
  function tours(config={}){
    const saved=config.tours||[];
    const list=config.content?.catalogVersion==='2'?saved:defaults.tours.map(t=>({...t,...saved.find(s=>s.id===t.id)})).concat(saved.filter(s=>!defaults.tours.some(t=>t.id===s.id)));
    return clone(list).map(t=>({...t,category:t.category||'group',published:t.published!==false,program:Array.isArray(t.program)?t.program:[],gallery:Array.isArray(t.gallery)?t.gallery:[],included:Array.isArray(t.included)?t.included:[],excluded:Array.isArray(t.excluded)?t.excluded:[]}));
  }
  function calendar(config={},catalog=tours(config)){
    if(config.content?.calendarData){try{const list=JSON.parse(config.content.calendarData);if(Array.isArray(list))return list}catch{}}
    const seen=new Set();return defaults.departures.flatMap(m=>m.items).map((d,i)=>{const tourId=d.tourId||d.id,identity=d.departureId||`${tourId}-${d.start||i}`;if(seen.has(identity))return null;seen.add(identity);const t=catalog.find(t=>t.id===tourId);return {id:identity,tourId,start:d.start||'',end:d.end||'',label:d.date||'',status:d.status||t?.status||'',places:d.places||t?.places||'',published:true}}).filter(Boolean);
  }
  window.VisaCatalog={tours,calendar,escape,url,clone};
})();
