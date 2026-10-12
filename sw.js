const P='gasan-close-',C=P+'v11',F=['./','index.html'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)).catch(()=>{}))});
// 같은 주소(github.io)의 다른 앱 캐시는 건드리지 않고, 이 앱의 옛 버전만 지움
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.indexOf(P)===0&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// 캐시 먼저 보여주고(즉시 열림) 뒤에서 새 버전 갱신
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>{
const n=fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res}).catch(()=>r);
return r||n})))});
