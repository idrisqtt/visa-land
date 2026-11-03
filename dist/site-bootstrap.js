(async()=>{
  try{
    const {data,error}=await window.visaSupabase.from('site_config').select('*').eq('id','main').single();
    if(error)throw error;
    window.visaLandRemoteConfig={content:data.content||{},media:data.media||{},tours:data.tours||[],faqs:data.faqs||[],sectionOrder:data.section_order||[]};
  }catch(error){
    console.warn('Using bundled site content:',error.message);
    window.visaLandRemoteConfig=null;
  }finally{
    const script=document.createElement('script');script.src='/app.js';document.body.appendChild(script);
  }
})();
