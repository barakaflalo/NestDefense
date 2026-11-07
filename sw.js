/* AppNest · Cloudflare Pages fix: מנקה תגובות "redirected" שכרום מסרב לקבל מה-SW */
(function(){var NB={101:1,204:1,205:1,304:1};function clean(r){if(!r||!r.redirected||NB[r.status])return r;return r.blob().then(function(b){return new Response(b,{status:r.status,statusText:r.statusText,headers:r.headers});});}
var _f=self.fetch.bind(self);self.fetch=function(i,n){if(i&&typeof i==='object'&&i.mode==='navigate')i=i.url;return _f(i,n).then(clean);};
var cm=Cache.prototype.match;Cache.prototype.match=function(){return cm.apply(this,arguments).then(clean);};var sm=CacheStorage.prototype.match;CacheStorage.prototype.match=function(){return sm.apply(this,arguments).then(clean);};})();
const VERSION='nestdefense-v1'; const CORE=['./','app.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);if(u.origin!==location.origin)return;
 if(q.mode==='navigate'){e.respondWith(fetch(q).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('./',c)).catch(()=>{});return r;}).catch(()=>caches.open(VERSION).then(x=>x.match('./'))));return;}
 e.respondWith(caches.open(VERSION).then(c=>c.match(q,{ignoreSearch:true}).then(hit=>hit||fetch(q).then(r=>{if(r&&r.ok)c.put(q,r.clone()).catch(()=>{});return r;}))));});
