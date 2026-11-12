/* Führt zwei Datenstände (Browser + Cloud) zusammen, ohne etwas zu verlieren.
   Archiv: pro Bezeichnung gewinnt der neuere Eintrag (id = Zeitstempel).
   Kunden: pro Firma gewinnt der neuere Eintrag (t = Zeitstempel).
   Artikel: pro Bezeichnung der neuere. Zahlungen: jede einzeln (t = Zeitstempel).
   Gelöschtes: "deleted" merkt sich Löschzeitpunkte, damit ein anderes Gerät
   den Eintrag nicht zurückbringt. Nummern: immer der höhere Stand. */
function mergeState(a,b){
  const del=Object.assign({},a.deleted);
  Object.keys(b.deleted||{}).forEach(function(k){del[k]=Math.max(del[k]||0,b.deleted[k]);});
  function pick(la,lb,prefix,key,time){
    const m=new Map();
    la.concat(lb).forEach(function(x){const o=m.get(key(x)); if(!o||time(x)>time(o)) m.set(key(x),x);});
    return Array.from(m.values()).filter(function(x){return !(del[prefix+key(x)]>=time(x));});
  }
  const newer=(+a.settingsAt||0)>=(+b.settingsAt||0)?a:b;
  return {app:"maloev",schemaVersion:1,
    settings:newer.settings, settingsAt:+newer.settingsAt||0,
    customers:pick(a.customers,b.customers,"cust:",function(c){return c.k_firma;},function(c){return +c.t||0;}),
    archive:pick(a.archive,b.archive,"arc:",function(e){return e.label;},function(e){return +e.id||0;})
      .sort(function(x,y){return y.id-x.id;}),
    articles:pick(a.articles||[],b.articles||[],"art:",function(x){return x.bez;},function(x){return +x.t||0;}),
    payments:pick(a.payments||[],b.payments||[],"pay:",function(x){return String(x.t);},function(x){return +x.t||0;}),
    counters:mergeCounters(a.counters,b.counters), deleted:del};
}
function mergeCounters(a,b){
  const n=function(v){return parseInt(v,10)||0;};
  const c={offerte:Math.max(n(a.offerte),n(b.offerte))};
  [["rjahr","rn"],["qjahr","qn"]].forEach(function(p){
    const y=p[0],k=p[1];
    const w=n(a[y])!==n(b[y])?(n(a[y])>n(b[y])?a:b):(n(a[k])>=n(b[k])?a:b);
    c[y]=n(w[y]); c[k]=n(w[k]);
  });
  return c;
}
if(typeof module!=="undefined") module.exports={mergeState:mergeState};
