'use strict';
const fs=require('node:fs'),{spawnSync}=require('node:child_process');
process.chdir(__dirname);
if(!process.argv.includes('--publish'))throw Error('阅读公开材料并确认发布后，使用 --publish。');
const c=JSON.parse(fs.readFileSync('docs/config.json')),repository='George-Qiaomu/mote-releases';
if(!c.feedbackEmail || !c.releases.endsWith(repository+'/releases'))throw Error('发布配置无效。');
function run(cmd,args,allow=false){
 const result=spawnSync(cmd,args,{encoding:'utf8'});
 if(result.status!==0&&!allow)throw Error(result.stderr||cmd+' failed');
 return result;
}
const account=run('gh',['api','user','--jq','.login']).stdout.trim();
if(account.toLowerCase()!=='george-qiaomu')throw Error('当前登录账号不是 George-Qiaomu。');
const asset='assets/Mote-'+c.version+'-mac-arm64.zip';
for(const file of [asset,asset+'.sha256','release-notes.md'])if(!fs.existsSync(file))throw Error('缺少 '+file);
if(!fs.existsSync('.git')){
 run('git',['init','-b','main']);
 run('git',['config','user.name',account]);
 run('git',['config','user.email',account+'@users.noreply.github.com']);
}
run('git',['add','docs','README.md','release-notes.md','.gitignore','publish.cjs']);
if(run('git',['diff','--cached','--quiet'],true).status!==0)run('git',['commit','-m','Publish Mote '+c.version]);
const exists=run('gh',['repo','view',repository,'--json','name'],true).status===0;
if(!exists)run('gh',['repo','create',repository,'--public','--description','Mote Mac beta downloads and release notes']);
if(run('git',['remote','get-url','origin'],true).status!==0)run('git',['remote','add','origin','https://github.com/'+repository+'.git']);
if(run('git',['remote','get-url','origin']).stdout.trim()!=='https://github.com/'+repository+'.git')throw Error('仓库远程地址不一致。');
run('gh',['auth','setup-git']);
run('git',['push','-u','origin','main']);
const tag='v'+c.version;
if(run('gh',['release','view',tag,'--repo',repository],true).status===0)throw Error('该版本已存在，请提高版本号后再发布。');
run('gh',['release','create',tag,asset,asset+'.sha256','--repo',repository,'--title','Mote '+c.version,'--notes-file','release-notes.md','--latest']);
const pages='/repos/'+repository+'/pages';
if(run('gh',['api',pages],true).status!==0)
 run('gh',['api',pages,'--method','POST','-f','source[branch]=main','-f','source[path]=/docs']);
console.log('Published https://george-qiaomu.github.io/mote-releases/');
