const C='gasan-close-v9',F=['./','index.html'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// 캐시 먼저 보여주고(즉시 열림) 뒤에서 새 버전 갱신
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{const n=fetch(e.request).then(res=>{if(res.ok)caches.open(C).then(c=>c.put(e.request,res.clone()));return res}).catch(()=>r);return r||n}))});
