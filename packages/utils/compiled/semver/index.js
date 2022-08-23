(function(){var e={927:function(e){const t=typeof performance==="object"&&performance&&typeof performance.now==="function"?performance:Date;const s=typeof AbortController!=="undefined";const i=s?AbortController:Object.assign(class AbortController{constructor(){this.signal=new i.AbortSignal}abort(){this.signal.aborted=true}},{AbortSignal:class AbortSignal{constructor(){this.aborted=false}}});const r=new Set;const deprecatedOption=(e,t)=>{const s=`LRU_CACHE_OPTION_${e}`;if(shouldWarn(s)){warn(s,`${e} option`,`options.${t}`,LRUCache)}};const deprecatedMethod=(e,t)=>{const s=`LRU_CACHE_METHOD_${e}`;if(shouldWarn(s)){const{prototype:i}=LRUCache;const{get:r}=Object.getOwnPropertyDescriptor(i,e);warn(s,`${e} method`,`cache.${t}()`,r)}};const deprecatedProperty=(e,t)=>{const s=`LRU_CACHE_PROPERTY_${e}`;if(shouldWarn(s)){const{prototype:i}=LRUCache;const{get:r}=Object.getOwnPropertyDescriptor(i,e);warn(s,`${e} property`,`cache.${t}`,r)}};const emitWarning=(...e)=>{typeof process==="object"&&process&&typeof process.emitWarning==="function"?process.emitWarning(...e):console.error(...e)};const shouldWarn=e=>!r.has(e);const warn=(e,t,s,i)=>{r.add(e);const n=`The ${t} is deprecated. Please use ${s} instead.`;emitWarning(n,"DeprecationWarning",e,i)};const isPosInt=e=>e&&e===Math.floor(e)&&e>0&&isFinite(e);const getUintArray=e=>!isPosInt(e)?null:e<=Math.pow(2,8)?Uint8Array:e<=Math.pow(2,16)?Uint16Array:e<=Math.pow(2,32)?Uint32Array:e<=Number.MAX_SAFE_INTEGER?ZeroArray:null;class ZeroArray extends Array{constructor(e){super(e);this.fill(0)}}class Stack{constructor(e){if(e===0){return[]}const t=getUintArray(e);this.heap=new t(e);this.length=0}push(e){this.heap[this.length++]=e}pop(){return this.heap[--this.length]}}class LRUCache{constructor(e={}){const{max:t=0,ttl:s,ttlResolution:i=1,ttlAutopurge:n,updateAgeOnGet:o,updateAgeOnHas:l,allowStale:a,dispose:h,disposeAfter:c,noDisposeOnSet:f,noUpdateTTL:p,maxSize:u=0,sizeCalculation:E,fetchMethod:d}=e;const{length:m,maxAge:$,stale:g}=e instanceof LRUCache?{}:e;if(t!==0&&!isPosInt(t)){throw new TypeError("max option must be a nonnegative integer")}const I=t?getUintArray(t):Array;if(!I){throw new Error("invalid max value: "+t)}this.max=t;this.maxSize=u;this.sizeCalculation=E||m;if(this.sizeCalculation){if(!this.maxSize){throw new TypeError("cannot set sizeCalculation without setting maxSize")}if(typeof this.sizeCalculation!=="function"){throw new TypeError("sizeCalculation set to non-function")}}this.fetchMethod=d||null;if(this.fetchMethod&&typeof this.fetchMethod!=="function"){throw new TypeError("fetchMethod must be a function if specified")}this.keyMap=new Map;this.keyList=new Array(t).fill(null);this.valList=new Array(t).fill(null);this.next=new I(t);this.prev=new I(t);this.head=0;this.tail=0;this.free=new Stack(t);this.initialFill=1;this.size=0;if(typeof h==="function"){this.dispose=h}if(typeof c==="function"){this.disposeAfter=c;this.disposed=[]}else{this.disposeAfter=null;this.disposed=null}this.noDisposeOnSet=!!f;this.noUpdateTTL=!!p;if(this.maxSize!==0){if(!isPosInt(this.maxSize)){throw new TypeError("maxSize must be a positive integer if specified")}this.initializeSizeTracking()}this.allowStale=!!a||!!g;this.updateAgeOnGet=!!o;this.updateAgeOnHas=!!l;this.ttlResolution=isPosInt(i)||i===0?i:1;this.ttlAutopurge=!!n;this.ttl=s||$||0;if(this.ttl){if(!isPosInt(this.ttl)){throw new TypeError("ttl must be a positive integer if specified")}this.initializeTTLTracking()}if(this.max===0&&this.ttl===0&&this.maxSize===0){throw new TypeError("At least one of max, maxSize, or ttl is required")}if(!this.ttlAutopurge&&!this.max&&!this.maxSize){const e="LRU_CACHE_UNBOUNDED";if(shouldWarn(e)){r.add(e);const t="TTL caching without ttlAutopurge, max, or maxSize can "+"result in unbounded memory consumption.";emitWarning(t,"UnboundedCacheWarning",e,LRUCache)}}if(g){deprecatedOption("stale","allowStale")}if($){deprecatedOption("maxAge","ttl")}if(m){deprecatedOption("length","sizeCalculation")}}getRemainingTTL(e){return this.has(e,{updateAgeOnHas:false})?Infinity:0}initializeTTLTracking(){this.ttls=new ZeroArray(this.max);this.starts=new ZeroArray(this.max);this.setItemTTL=(e,s)=>{this.starts[e]=s!==0?t.now():0;this.ttls[e]=s;if(s!==0&&this.ttlAutopurge){const t=setTimeout((()=>{if(this.isStale(e)){this.delete(this.keyList[e])}}),s+1);if(t.unref){t.unref()}}};this.updateItemAge=e=>{this.starts[e]=this.ttls[e]!==0?t.now():0};let e=0;const getNow=()=>{const s=t.now();if(this.ttlResolution>0){e=s;const t=setTimeout((()=>e=0),this.ttlResolution);if(t.unref){t.unref()}}return s};this.getRemainingTTL=t=>{const s=this.keyMap.get(t);if(s===undefined){return 0}return this.ttls[s]===0||this.starts[s]===0?Infinity:this.starts[s]+this.ttls[s]-(e||getNow())};this.isStale=t=>this.ttls[t]!==0&&this.starts[t]!==0&&(e||getNow())-this.starts[t]>this.ttls[t]}updateItemAge(e){}setItemTTL(e,t){}isStale(e){return false}initializeSizeTracking(){this.calculatedSize=0;this.sizes=new ZeroArray(this.max);this.removeItemSize=e=>this.calculatedSize-=this.sizes[e];this.requireSize=(e,t,s,i)=>{if(!isPosInt(s)){if(i){if(typeof i!=="function"){throw new TypeError("sizeCalculation must be a function")}s=i(t,e);if(!isPosInt(s)){throw new TypeError("sizeCalculation return invalid (expect positive integer)")}}else{throw new TypeError("invalid size value (must be positive integer)")}}return s};this.addItemSize=(e,t,s,i)=>{this.sizes[e]=i;const r=this.maxSize-this.sizes[e];while(this.calculatedSize>r){this.evict(true)}this.calculatedSize+=this.sizes[e]};this.delete=e=>{if(this.size!==0){const t=this.keyMap.get(e);if(t!==undefined){this.calculatedSize-=this.sizes[t]}}return LRUCache.prototype.delete.call(this,e)}}removeItemSize(e){}addItemSize(e,t,s,i){}requireSize(e,t,s,i){if(s||i){throw new TypeError("cannot set size without setting maxSize on cache")}}*indexes({allowStale:e=this.allowStale}={}){if(this.size){for(let t=this.tail;true;){if(!this.isValidIndex(t)){break}if(e||!this.isStale(t)){yield t}if(t===this.head){break}else{t=this.prev[t]}}}}*rindexes({allowStale:e=this.allowStale}={}){if(this.size){for(let t=this.head;true;){if(!this.isValidIndex(t)){break}if(e||!this.isStale(t)){yield t}if(t===this.tail){break}else{t=this.next[t]}}}}isValidIndex(e){return this.keyMap.get(this.keyList[e])===e}*entries(){for(const e of this.indexes()){yield[this.keyList[e],this.valList[e]]}}*rentries(){for(const e of this.rindexes()){yield[this.keyList[e],this.valList[e]]}}*keys(){for(const e of this.indexes()){yield this.keyList[e]}}*rkeys(){for(const e of this.rindexes()){yield this.keyList[e]}}*values(){for(const e of this.indexes()){yield this.valList[e]}}*rvalues(){for(const e of this.rindexes()){yield this.valList[e]}}[Symbol.iterator](){return this.entries()}find(e,t={}){for(const s of this.indexes()){if(e(this.valList[s],this.keyList[s],this)){return this.get(this.keyList[s],t)}}}forEach(e,t=this){for(const s of this.indexes()){e.call(t,this.valList[s],this.keyList[s],this)}}rforEach(e,t=this){for(const s of this.rindexes()){e.call(t,this.valList[s],this.keyList[s],this)}}get prune(){deprecatedMethod("prune","purgeStale");return this.purgeStale}purgeStale(){let e=false;for(const t of this.rindexes({allowStale:true})){if(this.isStale(t)){this.delete(this.keyList[t]);e=true}}return e}dump(){const e=[];for(const t of this.indexes()){const s=this.keyList[t];const i=this.valList[t];const r={value:i};if(this.ttls){r.ttl=this.ttls[t]}if(this.sizes){r.size=this.sizes[t]}e.unshift([s,r])}return e}load(e){this.clear();for(const[t,s]of e){this.set(t,s.value,s)}}dispose(e,t,s){}set(e,t,{ttl:s=this.ttl,noDisposeOnSet:i=this.noDisposeOnSet,size:r=0,sizeCalculation:n=this.sizeCalculation,noUpdateTTL:o=this.noUpdateTTL}={}){r=this.requireSize(e,t,r,n);let l=this.size===0?undefined:this.keyMap.get(e);if(l===undefined){l=this.newIndex();this.keyList[l]=e;this.valList[l]=t;this.keyMap.set(e,l);this.next[this.tail]=l;this.prev[l]=this.tail;this.tail=l;this.size++;this.addItemSize(l,t,e,r);o=false}else{const s=this.valList[l];if(t!==s){if(this.isBackgroundFetch(s)){s.__abortController.abort()}else{if(!i){this.dispose(s,e,"set");if(this.disposeAfter){this.disposed.push([s,e,"set"])}}}this.removeItemSize(l);this.valList[l]=t;this.addItemSize(l,t,e,r)}this.moveToTail(l)}if(s!==0&&this.ttl===0&&!this.ttls){this.initializeTTLTracking()}if(!o){this.setItemTTL(l,s)}if(this.disposeAfter){while(this.disposed.length){this.disposeAfter(...this.disposed.shift())}}return this}newIndex(){if(this.size===0){return this.tail}if(this.size===this.max&&this.max!==0){return this.evict(false)}if(this.free.length!==0){return this.free.pop()}return this.initialFill++}pop(){if(this.size){const e=this.valList[this.head];this.evict(true);return e}}evict(e){const t=this.head;const s=this.keyList[t];const i=this.valList[t];if(this.isBackgroundFetch(i)){i.__abortController.abort()}else{this.dispose(i,s,"evict");if(this.disposeAfter){this.disposed.push([i,s,"evict"])}}this.removeItemSize(t);if(e){this.keyList[t]=null;this.valList[t]=null;this.free.push(t)}this.head=this.next[t];this.keyMap.delete(s);this.size--;return t}has(e,{updateAgeOnHas:t=this.updateAgeOnHas}={}){const s=this.keyMap.get(e);if(s!==undefined){if(!this.isStale(s)){if(t){this.updateItemAge(s)}return true}}return false}peek(e,{allowStale:t=this.allowStale}={}){const s=this.keyMap.get(e);if(s!==undefined&&(t||!this.isStale(s))){return this.valList[s]}}backgroundFetch(e,t,s){const r=t===undefined?undefined:this.valList[t];if(this.isBackgroundFetch(r)){return r}const n=new i;const o={signal:n.signal,options:s};const l=Promise.resolve(this.fetchMethod(e,r,o)).then((t=>{if(!n.signal.aborted){this.set(e,t,o.options)}return t}));l.__abortController=n;l.__staleWhileFetching=r;if(t===undefined){this.set(e,l,o.options);t=this.keyMap.get(e)}else{this.valList[t]=l}return l}isBackgroundFetch(e){return e&&typeof e==="object"&&typeof e.then==="function"&&Object.prototype.hasOwnProperty.call(e,"__staleWhileFetching")}async fetch(e,{allowStale:t=this.allowStale,updateAgeOnGet:s=this.updateAgeOnGet,ttl:i=this.ttl,noDisposeOnSet:r=this.noDisposeOnSet,size:n=0,sizeCalculation:o=this.sizeCalculation,noUpdateTTL:l=this.noUpdateTTL}={}){if(!this.fetchMethod){return this.get(e,{allowStale:t,updateAgeOnGet:s})}const a={allowStale:t,updateAgeOnGet:s,ttl:i,noDisposeOnSet:r,size:n,sizeCalculation:o,noUpdateTTL:l};let h=this.keyMap.get(e);if(h===undefined){return this.backgroundFetch(e,h,a)}else{const i=this.valList[h];if(this.isBackgroundFetch(i)){return t&&i.__staleWhileFetching!==undefined?i.__staleWhileFetching:i}if(!this.isStale(h)){this.moveToTail(h);if(s){this.updateItemAge(h)}return i}const r=this.backgroundFetch(e,h,a);return t&&r.__staleWhileFetching!==undefined?r.__staleWhileFetching:r}}get(e,{allowStale:t=this.allowStale,updateAgeOnGet:s=this.updateAgeOnGet}={}){const i=this.keyMap.get(e);if(i!==undefined){const r=this.valList[i];const n=this.isBackgroundFetch(r);if(this.isStale(i)){if(!n){this.delete(e);return t?r:undefined}else{return t?r.__staleWhileFetching:undefined}}else{if(n){return undefined}this.moveToTail(i);if(s){this.updateItemAge(i)}return r}}}connect(e,t){this.prev[t]=e;this.next[e]=t}moveToTail(e){if(e!==this.tail){if(e===this.head){this.head=this.next[e]}else{this.connect(this.prev[e],this.next[e])}this.connect(this.tail,e);this.tail=e}}get del(){deprecatedMethod("del","delete");return this.delete}delete(e){let t=false;if(this.size!==0){const s=this.keyMap.get(e);if(s!==undefined){t=true;if(this.size===1){this.clear()}else{this.removeItemSize(s);const t=this.valList[s];if(this.isBackgroundFetch(t)){t.__abortController.abort()}else{this.dispose(t,e,"delete");if(this.disposeAfter){this.disposed.push([t,e,"delete"])}}this.keyMap.delete(e);this.keyList[s]=null;this.valList[s]=null;if(s===this.tail){this.tail=this.prev[s]}else if(s===this.head){this.head=this.next[s]}else{this.next[this.prev[s]]=this.next[s];this.prev[this.next[s]]=this.prev[s]}this.size--;this.free.push(s)}}}if(this.disposed){while(this.disposed.length){this.disposeAfter(...this.disposed.shift())}}return t}clear(){for(const e of this.rindexes({allowStale:true})){const t=this.valList[e];if(this.isBackgroundFetch(t)){t.__abortController.abort()}else{const s=this.keyList[e];this.dispose(t,s,"delete");if(this.disposeAfter){this.disposed.push([t,s,"delete"])}}}this.keyMap.clear();this.valList.fill(null);this.keyList.fill(null);if(this.ttls){this.ttls.fill(0);this.starts.fill(0)}if(this.sizes){this.sizes.fill(0)}this.head=0;this.tail=0;this.initialFill=1;this.free.length=0;this.calculatedSize=0;this.size=0;if(this.disposed){while(this.disposed.length){this.disposeAfter(...this.disposed.shift())}}}get reset(){deprecatedMethod("reset","clear");return this.clear}get length(){deprecatedProperty("length","size");return this.size}}e.exports=LRUCache},539:function(e,t,s){const i=Symbol("SemVer ANY");class Comparator{static get ANY(){return i}constructor(e,t){t=r(t);if(e instanceof Comparator){if(e.loose===!!t.loose){return e}else{e=e.value}}a("comparator",e,t);this.options=t;this.loose=!!t.loose;this.parse(e);if(this.semver===i){this.value=""}else{this.value=this.operator+this.semver.version}a("comp",this)}parse(e){const t=this.options.loose?n[o.COMPARATORLOOSE]:n[o.COMPARATOR];const s=e.match(t);if(!s){throw new TypeError(`Invalid comparator: ${e}`)}this.operator=s[1]!==undefined?s[1]:"";if(this.operator==="="){this.operator=""}if(!s[2]){this.semver=i}else{this.semver=new h(s[2],this.options.loose)}}toString(){return this.value}test(e){a("Comparator.test",e,this.options.loose);if(this.semver===i||e===i){return true}if(typeof e==="string"){try{e=new h(e,this.options)}catch(e){return false}}return l(e,this.operator,this.semver,this.options)}intersects(e,t){if(!(e instanceof Comparator)){throw new TypeError("a Comparator is required")}if(!t||typeof t!=="object"){t={loose:!!t,includePrerelease:false}}if(this.operator===""){if(this.value===""){return true}return new c(e.value,t).test(this.value)}else if(e.operator===""){if(e.value===""){return true}return new c(this.value,t).test(e.semver)}const s=(this.operator===">="||this.operator===">")&&(e.operator===">="||e.operator===">");const i=(this.operator==="<="||this.operator==="<")&&(e.operator==="<="||e.operator==="<");const r=this.semver.version===e.semver.version;const n=(this.operator===">="||this.operator==="<=")&&(e.operator===">="||e.operator==="<=");const o=l(this.semver,"<",e.semver,t)&&(this.operator===">="||this.operator===">")&&(e.operator==="<="||e.operator==="<");const a=l(this.semver,">",e.semver,t)&&(this.operator==="<="||this.operator==="<")&&(e.operator===">="||e.operator===">");return s||i||r&&n||o||a}}e.exports=Comparator;const r=s(273);const{re:n,t:o}=s(549);const l=s(575);const a=s(297);const h=s(737);const c=s(296)},296:function(e,t,s){class Range{constructor(e,t){t=n(t);if(e instanceof Range){if(e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease){return e}else{return new Range(e.raw,t)}}if(e instanceof o){this.raw=e.value;this.set=[[e]];this.format();return this}this.options=t;this.loose=!!t.loose;this.includePrerelease=!!t.includePrerelease;this.raw=e;this.set=e.split("||").map((e=>this.parseRange(e.trim()))).filter((e=>e.length));if(!this.set.length){throw new TypeError(`Invalid SemVer Range: ${e}`)}if(this.set.length>1){const e=this.set[0];this.set=this.set.filter((e=>!isNullSet(e[0])));if(this.set.length===0){this.set=[e]}else if(this.set.length>1){for(const e of this.set){if(e.length===1&&isAny(e[0])){this.set=[e];break}}}}this.format()}format(){this.range=this.set.map((e=>e.join(" ").trim())).join("||").trim();return this.range}toString(){return this.range}parseRange(e){e=e.trim();const t=Object.keys(this.options).join(",");const s=`parseRange:${t}:${e}`;const i=r.get(s);if(i){return i}const n=this.options.loose;const a=n?h[c.HYPHENRANGELOOSE]:h[c.HYPHENRANGE];e=e.replace(a,hyphenReplace(this.options.includePrerelease));l("hyphen replace",e);e=e.replace(h[c.COMPARATORTRIM],f);l("comparator trim",e);e=e.replace(h[c.TILDETRIM],p);e=e.replace(h[c.CARETTRIM],u);e=e.split(/\s+/).join(" ");let E=e.split(" ").map((e=>parseComparator(e,this.options))).join(" ").split(/\s+/).map((e=>replaceGTE0(e,this.options)));if(n){E=E.filter((e=>{l("loose invalid filter",e,this.options);return!!e.match(h[c.COMPARATORLOOSE])}))}l("range list",E);const d=new Map;const m=E.map((e=>new o(e,this.options)));for(const e of m){if(isNullSet(e)){return[e]}d.set(e.value,e)}if(d.size>1&&d.has("")){d.delete("")}const $=[...d.values()];r.set(s,$);return $}intersects(e,t){if(!(e instanceof Range)){throw new TypeError("a Range is required")}return this.set.some((s=>isSatisfiable(s,t)&&e.set.some((e=>isSatisfiable(e,t)&&s.every((s=>e.every((e=>s.intersects(e,t)))))))))}test(e){if(!e){return false}if(typeof e==="string"){try{e=new a(e,this.options)}catch(e){return false}}for(let t=0;t<this.set.length;t++){if(testSet(this.set[t],e,this.options)){return true}}return false}}e.exports=Range;const i=s(927);const r=new i({max:1e3});const n=s(273);const o=s(539);const l=s(297);const a=s(737);const{re:h,t:c,comparatorTrimReplace:f,tildeTrimReplace:p,caretTrimReplace:u}=s(549);const isNullSet=e=>e.value==="<0.0.0-0";const isAny=e=>e.value==="";const isSatisfiable=(e,t)=>{let s=true;const i=e.slice();let r=i.pop();while(s&&i.length){s=i.every((e=>r.intersects(e,t)));r=i.pop()}return s};const parseComparator=(e,t)=>{l("comp",e,t);e=replaceCarets(e,t);l("caret",e);e=replaceTildes(e,t);l("tildes",e);e=replaceXRanges(e,t);l("xrange",e);e=replaceStars(e,t);l("stars",e);return e};const isX=e=>!e||e.toLowerCase()==="x"||e==="*";const replaceTildes=(e,t)=>e.trim().split(/\s+/).map((e=>replaceTilde(e,t))).join(" ");const replaceTilde=(e,t)=>{const s=t.loose?h[c.TILDELOOSE]:h[c.TILDE];return e.replace(s,((t,s,i,r,n)=>{l("tilde",e,t,s,i,r,n);let o;if(isX(s)){o=""}else if(isX(i)){o=`>=${s}.0.0 <${+s+1}.0.0-0`}else if(isX(r)){o=`>=${s}.${i}.0 <${s}.${+i+1}.0-0`}else if(n){l("replaceTilde pr",n);o=`>=${s}.${i}.${r}-${n} <${s}.${+i+1}.0-0`}else{o=`>=${s}.${i}.${r} <${s}.${+i+1}.0-0`}l("tilde return",o);return o}))};const replaceCarets=(e,t)=>e.trim().split(/\s+/).map((e=>replaceCaret(e,t))).join(" ");const replaceCaret=(e,t)=>{l("caret",e,t);const s=t.loose?h[c.CARETLOOSE]:h[c.CARET];const i=t.includePrerelease?"-0":"";return e.replace(s,((t,s,r,n,o)=>{l("caret",e,t,s,r,n,o);let a;if(isX(s)){a=""}else if(isX(r)){a=`>=${s}.0.0${i} <${+s+1}.0.0-0`}else if(isX(n)){if(s==="0"){a=`>=${s}.${r}.0${i} <${s}.${+r+1}.0-0`}else{a=`>=${s}.${r}.0${i} <${+s+1}.0.0-0`}}else if(o){l("replaceCaret pr",o);if(s==="0"){if(r==="0"){a=`>=${s}.${r}.${n}-${o} <${s}.${r}.${+n+1}-0`}else{a=`>=${s}.${r}.${n}-${o} <${s}.${+r+1}.0-0`}}else{a=`>=${s}.${r}.${n}-${o} <${+s+1}.0.0-0`}}else{l("no pr");if(s==="0"){if(r==="0"){a=`>=${s}.${r}.${n}${i} <${s}.${r}.${+n+1}-0`}else{a=`>=${s}.${r}.${n}${i} <${s}.${+r+1}.0-0`}}else{a=`>=${s}.${r}.${n} <${+s+1}.0.0-0`}}l("caret return",a);return a}))};const replaceXRanges=(e,t)=>{l("replaceXRanges",e,t);return e.split(/\s+/).map((e=>replaceXRange(e,t))).join(" ")};const replaceXRange=(e,t)=>{e=e.trim();const s=t.loose?h[c.XRANGELOOSE]:h[c.XRANGE];return e.replace(s,((s,i,r,n,o,a)=>{l("xRange",e,s,i,r,n,o,a);const h=isX(r);const c=h||isX(n);const f=c||isX(o);const p=f;if(i==="="&&p){i=""}a=t.includePrerelease?"-0":"";if(h){if(i===">"||i==="<"){s="<0.0.0-0"}else{s="*"}}else if(i&&p){if(c){n=0}o=0;if(i===">"){i=">=";if(c){r=+r+1;n=0;o=0}else{n=+n+1;o=0}}else if(i==="<="){i="<";if(c){r=+r+1}else{n=+n+1}}if(i==="<"){a="-0"}s=`${i+r}.${n}.${o}${a}`}else if(c){s=`>=${r}.0.0${a} <${+r+1}.0.0-0`}else if(f){s=`>=${r}.${n}.0${a} <${r}.${+n+1}.0-0`}l("xRange return",s);return s}))};const replaceStars=(e,t)=>{l("replaceStars",e,t);return e.trim().replace(h[c.STAR],"")};const replaceGTE0=(e,t)=>{l("replaceGTE0",e,t);return e.trim().replace(h[t.includePrerelease?c.GTE0PRE:c.GTE0],"")};const hyphenReplace=e=>(t,s,i,r,n,o,l,a,h,c,f,p,u)=>{if(isX(i)){s=""}else if(isX(r)){s=`>=${i}.0.0${e?"-0":""}`}else if(isX(n)){s=`>=${i}.${r}.0${e?"-0":""}`}else if(o){s=`>=${s}`}else{s=`>=${s}${e?"-0":""}`}if(isX(h)){a=""}else if(isX(c)){a=`<${+h+1}.0.0-0`}else if(isX(f)){a=`<${h}.${+c+1}.0-0`}else if(p){a=`<=${h}.${c}.${f}-${p}`}else if(e){a=`<${h}.${c}.${+f+1}-0`}else{a=`<=${a}`}return`${s} ${a}`.trim()};const testSet=(e,t,s)=>{for(let s=0;s<e.length;s++){if(!e[s].test(t)){return false}}if(t.prerelease.length&&!s.includePrerelease){for(let s=0;s<e.length;s++){l(e[s].semver);if(e[s].semver===o.ANY){continue}if(e[s].semver.prerelease.length>0){const i=e[s].semver;if(i.major===t.major&&i.minor===t.minor&&i.patch===t.patch){return true}}}return false}return true}},737:function(e,t,s){const i=s(297);const{MAX_LENGTH:r,MAX_SAFE_INTEGER:n}=s(760);const{re:o,t:l}=s(549);const a=s(273);const{compareIdentifiers:h}=s(876);class SemVer{constructor(e,t){t=a(t);if(e instanceof SemVer){if(e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease){return e}else{e=e.version}}else if(typeof e!=="string"){throw new TypeError(`Invalid Version: ${e}`)}if(e.length>r){throw new TypeError(`version is longer than ${r} characters`)}i("SemVer",e,t);this.options=t;this.loose=!!t.loose;this.includePrerelease=!!t.includePrerelease;const s=e.trim().match(t.loose?o[l.LOOSE]:o[l.FULL]);if(!s){throw new TypeError(`Invalid Version: ${e}`)}this.raw=e;this.major=+s[1];this.minor=+s[2];this.patch=+s[3];if(this.major>n||this.major<0){throw new TypeError("Invalid major version")}if(this.minor>n||this.minor<0){throw new TypeError("Invalid minor version")}if(this.patch>n||this.patch<0){throw new TypeError("Invalid patch version")}if(!s[4]){this.prerelease=[]}else{this.prerelease=s[4].split(".").map((e=>{if(/^[0-9]+$/.test(e)){const t=+e;if(t>=0&&t<n){return t}}return e}))}this.build=s[5]?s[5].split("."):[];this.format()}format(){this.version=`${this.major}.${this.minor}.${this.patch}`;if(this.prerelease.length){this.version+=`-${this.prerelease.join(".")}`}return this.version}toString(){return this.version}compare(e){i("SemVer.compare",this.version,this.options,e);if(!(e instanceof SemVer)){if(typeof e==="string"&&e===this.version){return 0}e=new SemVer(e,this.options)}if(e.version===this.version){return 0}return this.compareMain(e)||this.comparePre(e)}compareMain(e){if(!(e instanceof SemVer)){e=new SemVer(e,this.options)}return h(this.major,e.major)||h(this.minor,e.minor)||h(this.patch,e.patch)}comparePre(e){if(!(e instanceof SemVer)){e=new SemVer(e,this.options)}if(this.prerelease.length&&!e.prerelease.length){return-1}else if(!this.prerelease.length&&e.prerelease.length){return 1}else if(!this.prerelease.length&&!e.prerelease.length){return 0}let t=0;do{const s=this.prerelease[t];const r=e.prerelease[t];i("prerelease compare",t,s,r);if(s===undefined&&r===undefined){return 0}else if(r===undefined){return 1}else if(s===undefined){return-1}else if(s===r){continue}else{return h(s,r)}}while(++t)}compareBuild(e){if(!(e instanceof SemVer)){e=new SemVer(e,this.options)}let t=0;do{const s=this.build[t];const r=e.build[t];i("prerelease compare",t,s,r);if(s===undefined&&r===undefined){return 0}else if(r===undefined){return 1}else if(s===undefined){return-1}else if(s===r){continue}else{return h(s,r)}}while(++t)}inc(e,t){switch(e){case"premajor":this.prerelease.length=0;this.patch=0;this.minor=0;this.major++;this.inc("pre",t);break;case"preminor":this.prerelease.length=0;this.patch=0;this.minor++;this.inc("pre",t);break;case"prepatch":this.prerelease.length=0;this.inc("patch",t);this.inc("pre",t);break;case"prerelease":if(this.prerelease.length===0){this.inc("patch",t)}this.inc("pre",t);break;case"major":if(this.minor!==0||this.patch!==0||this.prerelease.length===0){this.major++}this.minor=0;this.patch=0;this.prerelease=[];break;case"minor":if(this.patch!==0||this.prerelease.length===0){this.minor++}this.patch=0;this.prerelease=[];break;case"patch":if(this.prerelease.length===0){this.patch++}this.prerelease=[];break;case"pre":if(this.prerelease.length===0){this.prerelease=[0]}else{let e=this.prerelease.length;while(--e>=0){if(typeof this.prerelease[e]==="number"){this.prerelease[e]++;e=-2}}if(e===-1){this.prerelease.push(0)}}if(t){if(this.prerelease[0]===t){if(isNaN(this.prerelease[1])){this.prerelease=[t,0]}}else{this.prerelease=[t,0]}}break;default:throw new Error(`invalid increment argument: ${e}`)}this.format();this.raw=this.version;return this}}e.exports=SemVer},5:function(e,t,s){const i=s(64);const clean=(e,t)=>{const s=i(e.trim().replace(/^[=v]+/,""),t);return s?s.version:null};e.exports=clean},575:function(e,t,s){const i=s(622);const r=s(955);const n=s(651);const o=s(43);const l=s(199);const a=s(407);const cmp=(e,t,s,h)=>{switch(t){case"===":if(typeof e==="object"){e=e.version}if(typeof s==="object"){s=s.version}return e===s;case"!==":if(typeof e==="object"){e=e.version}if(typeof s==="object"){s=s.version}return e!==s;case"":case"=":case"==":return i(e,s,h);case"!=":return r(e,s,h);case">":return n(e,s,h);case">=":return o(e,s,h);case"<":return l(e,s,h);case"<=":return a(e,s,h);default:throw new TypeError(`Invalid operator: ${t}`)}};e.exports=cmp},735:function(e,t,s){const i=s(737);const r=s(64);const{re:n,t:o}=s(549);const coerce=(e,t)=>{if(e instanceof i){return e}if(typeof e==="number"){e=String(e)}if(typeof e!=="string"){return null}t=t||{};let s=null;if(!t.rtl){s=e.match(n[o.COERCE])}else{let t;while((t=n[o.COERCERTL].exec(e))&&(!s||s.index+s[0].length!==e.length)){if(!s||t.index+t[0].length!==s.index+s[0].length){s=t}n[o.COERCERTL].lastIndex=t.index+t[1].length+t[2].length}n[o.COERCERTL].lastIndex=-1}if(s===null){return null}return r(`${s[2]}.${s[3]||"0"}.${s[4]||"0"}`,t)};e.exports=coerce},701:function(e,t,s){const i=s(737);const compareBuild=(e,t,s)=>{const r=new i(e,s);const n=new i(t,s);return r.compare(n)||r.compareBuild(n)};e.exports=compareBuild},664:function(e,t,s){const i=s(449);const compareLoose=(e,t)=>i(e,t,true);e.exports=compareLoose},449:function(e,t,s){const i=s(737);const compare=(e,t,s)=>new i(e,s).compare(new i(t,s));e.exports=compare},890:function(e,t,s){const i=s(64);const r=s(622);const diff=(e,t)=>{if(r(e,t)){return null}else{const s=i(e);const r=i(t);const n=s.prerelease.length||r.prerelease.length;const o=n?"pre":"";const l=n?"prerelease":"";for(const e in s){if(e==="major"||e==="minor"||e==="patch"){if(s[e]!==r[e]){return o+e}}}return l}};e.exports=diff},622:function(e,t,s){const i=s(449);const eq=(e,t,s)=>i(e,t,s)===0;e.exports=eq},651:function(e,t,s){const i=s(449);const gt=(e,t,s)=>i(e,t,s)>0;e.exports=gt},43:function(e,t,s){const i=s(449);const gte=(e,t,s)=>i(e,t,s)>=0;e.exports=gte},689:function(e,t,s){const i=s(737);const inc=(e,t,s,r)=>{if(typeof s==="string"){r=s;s=undefined}try{return new i(e,s).inc(t,r).version}catch(e){return null}};e.exports=inc},199:function(e,t,s){const i=s(449);const lt=(e,t,s)=>i(e,t,s)<0;e.exports=lt},407:function(e,t,s){const i=s(449);const lte=(e,t,s)=>i(e,t,s)<=0;e.exports=lte},555:function(e,t,s){const i=s(737);const major=(e,t)=>new i(e,t).major;e.exports=major},17:function(e,t,s){const i=s(737);const minor=(e,t)=>new i(e,t).minor;e.exports=minor},955:function(e,t,s){const i=s(449);const neq=(e,t,s)=>i(e,t,s)!==0;e.exports=neq},64:function(e,t,s){const{MAX_LENGTH:i}=s(760);const{re:r,t:n}=s(549);const o=s(737);const l=s(273);const parse=(e,t)=>{t=l(t);if(e instanceof o){return e}if(typeof e!=="string"){return null}if(e.length>i){return null}const s=t.loose?r[n.LOOSE]:r[n.FULL];if(!s.test(e)){return null}try{return new o(e,t)}catch(e){return null}};e.exports=parse},463:function(e,t,s){const i=s(737);const patch=(e,t)=>new i(e,t).patch;e.exports=patch},742:function(e,t,s){const i=s(64);const prerelease=(e,t)=>{const s=i(e,t);return s&&s.prerelease.length?s.prerelease:null};e.exports=prerelease},666:function(e,t,s){const i=s(449);const rcompare=(e,t,s)=>i(t,e,s);e.exports=rcompare},522:function(e,t,s){const i=s(701);const rsort=(e,t)=>e.sort(((e,s)=>i(s,e,t)));e.exports=rsort},45:function(e,t,s){const i=s(296);const satisfies=(e,t,s)=>{try{t=new i(t,s)}catch(e){return false}return t.test(e)};e.exports=satisfies},133:function(e,t,s){const i=s(701);const sort=(e,t)=>e.sort(((e,s)=>i(e,s,t)));e.exports=sort},416:function(e,t,s){const i=s(64);const valid=(e,t)=>{const s=i(e,t);return s?s.version:null};e.exports=valid},299:function(e,t,s){const i=s(549);e.exports={re:i.re,src:i.src,tokens:i.t,SEMVER_SPEC_VERSION:s(760).SEMVER_SPEC_VERSION,SemVer:s(737),compareIdentifiers:s(876).compareIdentifiers,rcompareIdentifiers:s(876).rcompareIdentifiers,parse:s(64),valid:s(416),clean:s(5),inc:s(689),diff:s(890),major:s(555),minor:s(17),patch:s(463),prerelease:s(742),compare:s(449),rcompare:s(666),compareLoose:s(664),compareBuild:s(701),sort:s(133),rsort:s(522),gt:s(651),lt:s(199),eq:s(622),neq:s(955),gte:s(43),lte:s(407),cmp:s(575),coerce:s(735),Comparator:s(539),Range:s(296),satisfies:s(45),toComparators:s(944),maxSatisfying:s(165),minSatisfying:s(66),minVersion:s(339),validRange:s(552),outside:s(812),gtr:s(920),ltr:s(489),intersects:s(982),simplifyRange:s(980),subset:s(601)}},760:function(e){const t="2.0.0";const s=256;const i=Number.MAX_SAFE_INTEGER||9007199254740991;const r=16;e.exports={SEMVER_SPEC_VERSION:t,MAX_LENGTH:s,MAX_SAFE_INTEGER:i,MAX_SAFE_COMPONENT_LENGTH:r}},297:function(e){const t=typeof process==="object"&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};e.exports=t},876:function(e){const t=/^[0-9]+$/;const compareIdentifiers=(e,s)=>{const i=t.test(e);const r=t.test(s);if(i&&r){e=+e;s=+s}return e===s?0:i&&!r?-1:r&&!i?1:e<s?-1:1};const rcompareIdentifiers=(e,t)=>compareIdentifiers(t,e);e.exports={compareIdentifiers:compareIdentifiers,rcompareIdentifiers:rcompareIdentifiers}},273:function(e){const t=["includePrerelease","loose","rtl"];const parseOptions=e=>!e?{}:typeof e!=="object"?{loose:true}:t.filter((t=>e[t])).reduce(((e,t)=>{e[t]=true;return e}),{});e.exports=parseOptions},549:function(e,t,s){const{MAX_SAFE_COMPONENT_LENGTH:i}=s(760);const r=s(297);t=e.exports={};const n=t.re=[];const o=t.src=[];const l=t.t={};let a=0;const createToken=(e,t,s)=>{const i=a++;r(e,i,t);l[e]=i;o[i]=t;n[i]=new RegExp(t,s?"g":undefined)};createToken("NUMERICIDENTIFIER","0|[1-9]\\d*");createToken("NUMERICIDENTIFIERLOOSE","[0-9]+");createToken("NONNUMERICIDENTIFIER","\\d*[a-zA-Z-][a-zA-Z0-9-]*");createToken("MAINVERSION",`(${o[l.NUMERICIDENTIFIER]})\\.`+`(${o[l.NUMERICIDENTIFIER]})\\.`+`(${o[l.NUMERICIDENTIFIER]})`);createToken("MAINVERSIONLOOSE",`(${o[l.NUMERICIDENTIFIERLOOSE]})\\.`+`(${o[l.NUMERICIDENTIFIERLOOSE]})\\.`+`(${o[l.NUMERICIDENTIFIERLOOSE]})`);createToken("PRERELEASEIDENTIFIER",`(?:${o[l.NUMERICIDENTIFIER]}|${o[l.NONNUMERICIDENTIFIER]})`);createToken("PRERELEASEIDENTIFIERLOOSE",`(?:${o[l.NUMERICIDENTIFIERLOOSE]}|${o[l.NONNUMERICIDENTIFIER]})`);createToken("PRERELEASE",`(?:-(${o[l.PRERELEASEIDENTIFIER]}(?:\\.${o[l.PRERELEASEIDENTIFIER]})*))`);createToken("PRERELEASELOOSE",`(?:-?(${o[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[l.PRERELEASEIDENTIFIERLOOSE]})*))`);createToken("BUILDIDENTIFIER","[0-9A-Za-z-]+");createToken("BUILD",`(?:\\+(${o[l.BUILDIDENTIFIER]}(?:\\.${o[l.BUILDIDENTIFIER]})*))`);createToken("FULLPLAIN",`v?${o[l.MAINVERSION]}${o[l.PRERELEASE]}?${o[l.BUILD]}?`);createToken("FULL",`^${o[l.FULLPLAIN]}$`);createToken("LOOSEPLAIN",`[v=\\s]*${o[l.MAINVERSIONLOOSE]}${o[l.PRERELEASELOOSE]}?${o[l.BUILD]}?`);createToken("LOOSE",`^${o[l.LOOSEPLAIN]}$`);createToken("GTLT","((?:<|>)?=?)");createToken("XRANGEIDENTIFIERLOOSE",`${o[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);createToken("XRANGEIDENTIFIER",`${o[l.NUMERICIDENTIFIER]}|x|X|\\*`);createToken("XRANGEPLAIN",`[v=\\s]*(${o[l.XRANGEIDENTIFIER]})`+`(?:\\.(${o[l.XRANGEIDENTIFIER]})`+`(?:\\.(${o[l.XRANGEIDENTIFIER]})`+`(?:${o[l.PRERELEASE]})?${o[l.BUILD]}?`+`)?)?`);createToken("XRANGEPLAINLOOSE",`[v=\\s]*(${o[l.XRANGEIDENTIFIERLOOSE]})`+`(?:\\.(${o[l.XRANGEIDENTIFIERLOOSE]})`+`(?:\\.(${o[l.XRANGEIDENTIFIERLOOSE]})`+`(?:${o[l.PRERELEASELOOSE]})?${o[l.BUILD]}?`+`)?)?`);createToken("XRANGE",`^${o[l.GTLT]}\\s*${o[l.XRANGEPLAIN]}$`);createToken("XRANGELOOSE",`^${o[l.GTLT]}\\s*${o[l.XRANGEPLAINLOOSE]}$`);createToken("COERCE",`${"(^|[^\\d])"+"(\\d{1,"}${i}})`+`(?:\\.(\\d{1,${i}}))?`+`(?:\\.(\\d{1,${i}}))?`+`(?:$|[^\\d])`);createToken("COERCERTL",o[l.COERCE],true);createToken("LONETILDE","(?:~>?)");createToken("TILDETRIM",`(\\s*)${o[l.LONETILDE]}\\s+`,true);t.tildeTrimReplace="$1~";createToken("TILDE",`^${o[l.LONETILDE]}${o[l.XRANGEPLAIN]}$`);createToken("TILDELOOSE",`^${o[l.LONETILDE]}${o[l.XRANGEPLAINLOOSE]}$`);createToken("LONECARET","(?:\\^)");createToken("CARETTRIM",`(\\s*)${o[l.LONECARET]}\\s+`,true);t.caretTrimReplace="$1^";createToken("CARET",`^${o[l.LONECARET]}${o[l.XRANGEPLAIN]}$`);createToken("CARETLOOSE",`^${o[l.LONECARET]}${o[l.XRANGEPLAINLOOSE]}$`);createToken("COMPARATORLOOSE",`^${o[l.GTLT]}\\s*(${o[l.LOOSEPLAIN]})$|^$`);createToken("COMPARATOR",`^${o[l.GTLT]}\\s*(${o[l.FULLPLAIN]})$|^$`);createToken("COMPARATORTRIM",`(\\s*)${o[l.GTLT]}\\s*(${o[l.LOOSEPLAIN]}|${o[l.XRANGEPLAIN]})`,true);t.comparatorTrimReplace="$1$2$3";createToken("HYPHENRANGE",`^\\s*(${o[l.XRANGEPLAIN]})`+`\\s+-\\s+`+`(${o[l.XRANGEPLAIN]})`+`\\s*$`);createToken("HYPHENRANGELOOSE",`^\\s*(${o[l.XRANGEPLAINLOOSE]})`+`\\s+-\\s+`+`(${o[l.XRANGEPLAINLOOSE]})`+`\\s*$`);createToken("STAR","(<|>)?=?\\s*\\*");createToken("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$");createToken("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")},920:function(e,t,s){const i=s(812);const gtr=(e,t,s)=>i(e,t,">",s);e.exports=gtr},982:function(e,t,s){const i=s(296);const intersects=(e,t,s)=>{e=new i(e,s);t=new i(t,s);return e.intersects(t)};e.exports=intersects},489:function(e,t,s){const i=s(812);const ltr=(e,t,s)=>i(e,t,"<",s);e.exports=ltr},165:function(e,t,s){const i=s(737);const r=s(296);const maxSatisfying=(e,t,s)=>{let n=null;let o=null;let l=null;try{l=new r(t,s)}catch(e){return null}e.forEach((e=>{if(l.test(e)){if(!n||o.compare(e)===-1){n=e;o=new i(n,s)}}}));return n};e.exports=maxSatisfying},66:function(e,t,s){const i=s(737);const r=s(296);const minSatisfying=(e,t,s)=>{let n=null;let o=null;let l=null;try{l=new r(t,s)}catch(e){return null}e.forEach((e=>{if(l.test(e)){if(!n||o.compare(e)===1){n=e;o=new i(n,s)}}}));return n};e.exports=minSatisfying},339:function(e,t,s){const i=s(737);const r=s(296);const n=s(651);const minVersion=(e,t)=>{e=new r(e,t);let s=new i("0.0.0");if(e.test(s)){return s}s=new i("0.0.0-0");if(e.test(s)){return s}s=null;for(let t=0;t<e.set.length;++t){const r=e.set[t];let o=null;r.forEach((e=>{const t=new i(e.semver.version);switch(e.operator){case">":if(t.prerelease.length===0){t.patch++}else{t.prerelease.push(0)}t.raw=t.format();case"":case">=":if(!o||n(t,o)){o=t}break;case"<":case"<=":break;default:throw new Error(`Unexpected operation: ${e.operator}`)}}));if(o&&(!s||n(s,o))){s=o}}if(s&&e.test(s)){return s}return null};e.exports=minVersion},812:function(e,t,s){const i=s(737);const r=s(539);const{ANY:n}=r;const o=s(296);const l=s(45);const a=s(651);const h=s(199);const c=s(407);const f=s(43);const outside=(e,t,s,p)=>{e=new i(e,p);t=new o(t,p);let u,E,d,m,$;switch(s){case">":u=a;E=c;d=h;m=">";$=">=";break;case"<":u=h;E=f;d=a;m="<";$="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(l(e,t,p)){return false}for(let s=0;s<t.set.length;++s){const i=t.set[s];let o=null;let l=null;i.forEach((e=>{if(e.semver===n){e=new r(">=0.0.0")}o=o||e;l=l||e;if(u(e.semver,o.semver,p)){o=e}else if(d(e.semver,l.semver,p)){l=e}}));if(o.operator===m||o.operator===$){return false}if((!l.operator||l.operator===m)&&E(e,l.semver)){return false}else if(l.operator===$&&d(e,l.semver)){return false}}return true};e.exports=outside},980:function(e,t,s){const i=s(45);const r=s(449);e.exports=(e,t,s)=>{const n=[];let o=null;let l=null;const a=e.sort(((e,t)=>r(e,t,s)));for(const e of a){const r=i(e,t,s);if(r){l=e;if(!o){o=e}}else{if(l){n.push([o,l])}l=null;o=null}}if(o){n.push([o,null])}const h=[];for(const[e,t]of n){if(e===t){h.push(e)}else if(!t&&e===a[0]){h.push("*")}else if(!t){h.push(`>=${e}`)}else if(e===a[0]){h.push(`<=${t}`)}else{h.push(`${e} - ${t}`)}}const c=h.join(" || ");const f=typeof t.raw==="string"?t.raw:String(t);return c.length<f.length?c:t}},601:function(e,t,s){const i=s(296);const r=s(539);const{ANY:n}=r;const o=s(45);const l=s(449);const subset=(e,t,s={})=>{if(e===t){return true}e=new i(e,s);t=new i(t,s);let r=false;e:for(const i of e.set){for(const e of t.set){const t=simpleSubset(i,e,s);r=r||t!==null;if(t){continue e}}if(r){return false}}return true};const simpleSubset=(e,t,s)=>{if(e===t){return true}if(e.length===1&&e[0].semver===n){if(t.length===1&&t[0].semver===n){return true}else if(s.includePrerelease){e=[new r(">=0.0.0-0")]}else{e=[new r(">=0.0.0")]}}if(t.length===1&&t[0].semver===n){if(s.includePrerelease){return true}else{t=[new r(">=0.0.0")]}}const i=new Set;let a,h;for(const t of e){if(t.operator===">"||t.operator===">="){a=higherGT(a,t,s)}else if(t.operator==="<"||t.operator==="<="){h=lowerLT(h,t,s)}else{i.add(t.semver)}}if(i.size>1){return null}let c;if(a&&h){c=l(a.semver,h.semver,s);if(c>0){return null}else if(c===0&&(a.operator!==">="||h.operator!=="<=")){return null}}for(const e of i){if(a&&!o(e,String(a),s)){return null}if(h&&!o(e,String(h),s)){return null}for(const i of t){if(!o(e,String(i),s)){return false}}return true}let f,p;let u,E;let d=h&&!s.includePrerelease&&h.semver.prerelease.length?h.semver:false;let m=a&&!s.includePrerelease&&a.semver.prerelease.length?a.semver:false;if(d&&d.prerelease.length===1&&h.operator==="<"&&d.prerelease[0]===0){d=false}for(const e of t){E=E||e.operator===">"||e.operator===">=";u=u||e.operator==="<"||e.operator==="<=";if(a){if(m){if(e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===m.major&&e.semver.minor===m.minor&&e.semver.patch===m.patch){m=false}}if(e.operator===">"||e.operator===">="){f=higherGT(a,e,s);if(f===e&&f!==a){return false}}else if(a.operator===">="&&!o(a.semver,String(e),s)){return false}}if(h){if(d){if(e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===d.major&&e.semver.minor===d.minor&&e.semver.patch===d.patch){d=false}}if(e.operator==="<"||e.operator==="<="){p=lowerLT(h,e,s);if(p===e&&p!==h){return false}}else if(h.operator==="<="&&!o(h.semver,String(e),s)){return false}}if(!e.operator&&(h||a)&&c!==0){return false}}if(a&&u&&!h&&c!==0){return false}if(h&&E&&!a&&c!==0){return false}if(m||d){return false}return true};const higherGT=(e,t,s)=>{if(!e){return t}const i=l(e.semver,t.semver,s);return i>0?e:i<0?t:t.operator===">"&&e.operator===">="?t:e};const lowerLT=(e,t,s)=>{if(!e){return t}const i=l(e.semver,t.semver,s);return i<0?e:i>0?t:t.operator==="<"&&e.operator==="<="?t:e};e.exports=subset},944:function(e,t,s){const i=s(296);const toComparators=(e,t)=>new i(e,t).set.map((e=>e.map((e=>e.value)).join(" ").trim().split(" ")));e.exports=toComparators},552:function(e,t,s){const i=s(296);const validRange=(e,t)=>{try{return new i(e,t).range||"*"}catch(e){return null}};e.exports=validRange}};var t={};function __nccwpck_require__(s){var i=t[s];if(i!==undefined){return i.exports}var r=t[s]={exports:{}};var n=true;try{e[s](r,r.exports,__nccwpck_require__);n=false}finally{if(n)delete t[s]}return r.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var s=__nccwpck_require__(299);module.exports=s})();