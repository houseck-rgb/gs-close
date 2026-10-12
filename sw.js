const P='gasan-close-',C=P+'v12',F=['./','index.html'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).catch(()=>{}))});
// 같은 주소의 다른 앱 캐시는 건드리지 않고, 이 앱의 옛 버전만 지움
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.indexOf(P)===0&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
// 화면(HTML): 항상 새 버전 먼저 → 인터넷이 3초 넘게 느리거나 끊기면 저장본으로 바로 열기
if(q.mode==='navigate'||/\.html?$|\/$/.test(new URL(q.url).pathname)){
e.respondWith(caches.open(C).then(c=>{const net=fetch(q,{cache:'no-store'}).then(r=>{if(r&&r.ok)c.put(q,r.clone());return r});
return new Promise(ok=>{let done=0;const t=setTimeout(()=>c.match(q,{ignoreSearch:true}).then(r=>{if(r&&!done){done=1;ok(r)}}),3000);
net.then(r=>{if(!done){done=1;clearTimeout(t);ok(r)}}).catch(()=>c.match(q,{ignoreSearch:true}).then(r=>{if(!done){done=1;clearTimeout(t);ok(r||Response.error())}}))})}));return}
// 그 밖의 파일: 저장본 먼저, 뒤에서 갱신
e.respondWith(caches.open(C).then(c=>c.match(q,{ignoreSearch:true}).then(r=>{const n=fetch(q).then(res=>{if(res.ok)c.put(q,res.clone());return res}).catch(()=>r);return r||n})))});
