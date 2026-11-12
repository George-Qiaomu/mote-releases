'use strict';
let releaseConfig;
function feedbackText(){
 return 'Mote '+releaseConfig.version+' · '+(document.querySelector('#system').value.trim()||'Mac 系统版本未填写')+'\n\n'+document.querySelector('#message').value.trim();
}
Promise.resolve(window.MoteDownload).then(config=>{if(!config)throw Error('下载信息暂不可用，请稍后重试。');
 releaseConfig=config;
 const download=document.querySelector('#download');
 download.href=config.download;
 document.querySelector('#version').textContent='v'+config.version+' · Apple 芯片 Mac · '+config.megabytes+' MB';
 document.querySelector('#releases').href=config.releases;
 document.querySelector('#feedback button[type=submit]').disabled=!config.feedbackEmail;
 document.querySelector('#feedback-status').textContent=config.feedbackEmail?'':'反馈邮箱尚未配置，暂可复制反馈内容。';
}).catch(e=>document.querySelector('#version').textContent=e.message);
document.querySelector('#feedback').onsubmit=async e=>{
 e.preventDefault();
 if(!releaseConfig?.feedbackEmail)return;
 const submit=document.querySelector('#submit-feedback'),status=document.querySelector('#feedback-status');
 if(submit.disabled)return;
 submit.disabled=true;status.textContent='正在发送…';
 const message=document.querySelector('#message'),system=document.querySelector('#system');
 message.readOnly=true;system.readOnly=true;
 try{
  const response=await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(releaseConfig.feedbackEmail),{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:AbortSignal.timeout(20000),
   body:JSON.stringify({_subject:'Mote '+releaseConfig.version+' 内测反馈',_template:'table',message:feedbackText()})
  });
  if(!response.ok)throw Error('反馈服务暂时不可用。');
  const result=await response.json();
  if(/needs Activation/i.test(result.message||''))throw Error('开发者正在激活接收服务，请稍后重试。');
  if(result.success!==true&&result.success!=='true')throw Error('反馈未提交成功。');
  status.textContent='已提交，谢谢你的反馈。';message.value='';
 }catch(error){status.textContent='发送未确认，内容已保留，可稍后重试。'+(error.name==='TimeoutError'?'':error.message);}
 finally{submit.disabled=false;message.readOnly=false;system.readOnly=false;}
};
document.querySelector('#copy').onclick=async()=>{
 if(!releaseConfig)return;
 try{await navigator.clipboard.writeText(feedbackText());document.querySelector('#feedback-status').textContent='已复制，可粘贴到邮件或聊天里。';}
 catch{document.querySelector('#feedback-status').textContent='复制失败，请选中输入框内的内容手动复制。';}
};
