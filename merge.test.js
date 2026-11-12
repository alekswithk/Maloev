// node merge.test.js
const assert=require("assert"), {mergeState}=require("./merge.js");
const base={app:"maloev",schemaVersion:1,settings:{},settingsAt:0,customers:[],archive:[],deleted:{},
  counters:{offerte:26372,rjahr:2026,rn:0,qjahr:2026,qn:0}};
const s=o=>Object.assign({},base,o);
// Archiv beider Geräte wird vereint, neuere Fassung gewinnt, neueste zuerst
let m=mergeState(s({archive:[{id:5,label:"A",v:"neu"},{id:1,label:"B"}]}),s({archive:[{id:3,label:"A",v:"alt"},{id:4,label:"C"}]}));
assert.deepStrictEqual(m.archive.map(e=>e.label+e.id),["A5","C4","B1"]);
// Gelöschtes kommt nicht zurück, später neu Archiviertes schon
m=mergeState(s({deleted:{"arc:A":10,"cust:X":10}}),s({archive:[{id:5,label:"A"},{id:11,label:"A2"}],customers:[{k_firma:"X"},{k_firma:"Y",t:1}]}));
assert.deepStrictEqual(m.archive.map(e=>e.label),["A2"]);
assert.deepStrictEqual(m.customers.map(c=>c.k_firma),["Y"]);
m=mergeState(s({deleted:{"arc:A":10}}),s({archive:[{id:12,label:"A"}]}));
assert.strictEqual(m.archive.length,1);
// Nummern: höherer Stand, neues Jahr schlägt alten Zähler
m=mergeState(s({counters:{offerte:26380,rjahr:2026,rn:4,qjahr:2026,qn:2}}),s({counters:{offerte:26375,rjahr:2027,rn:1,qjahr:2026,qn:3}}));
assert.deepStrictEqual(m.counters,{offerte:26380,rjahr:2027,rn:1,qjahr:2026,qn:3});
// Einstellungen: neuere gewinnen
m=mergeState(s({settings:{firma:"alt"},settingsAt:1}),s({settings:{firma:"neu"},settingsAt:2}));
assert.strictEqual(m.settings.firma,"neu");
console.log("merge ok");
