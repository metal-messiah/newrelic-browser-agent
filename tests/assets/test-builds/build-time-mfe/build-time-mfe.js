!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.container=t():e.container=t()}(self,(()=>(()=>{var e,t,r={616:(e,t,r)=>{"use strict";r.d(t,{H:()=>i});var n=document.createElement("div");n.innerHTML="\x3c!--[if lte IE 6]><div></div><![endif]--\x3e\x3c!--[if lte IE 7]><div></div><![endif]--\x3e\x3c!--[if lte IE 8]><div></div><![endif]--\x3e\x3c!--[if lte IE 9]><div></div><![endif]--\x3e";var i,o=n.getElementsByTagName("div").length;i=4===o?6:3===o?7:2===o?8:1===o?9:0},39:(e,t,r)=>{"use strict";r.d(t,{I:()=>n});class n{constructor(e,t){return e&&"object"==typeof e?t&&"object"==typeof t?(Object.assign(this,t),void Object.entries(e).forEach((([e,r])=>{Object.keys(t).includes(e)&&(this[e]=r)}))):console.error("setting a Configurable requires a model to set its initial properties"):console.error("setting a Configurable requires an object as input")}}},8162:(e,t,r)=>{"use strict";r.d(t,{C:()=>s,L:()=>c});var n=r(2643),i=r(39);const o={beacon:n.ce.beacon,errorBeacon:n.ce.errorBeacon,licenseKey:void 0,applicationID:void 0,sa:void 0,queueTime:void 0,applicationTime:void 0,ttGuid:void 0,user:void 0,account:void 0,product:void 0,extra:void 0,jsAttributes:{},userAttributes:void 0,atts:void 0,transactionName:void 0,tNamePlain:void 0},a={};function s(e){if(!e)throw new Error("All config objects require an agent identifier!");if(!a[e])throw new Error(`Info for ${e} was never set`);return a[e]}function c(e,t){if(!e)throw new Error("All config objects require an agent identifier!");a[e]=new i.I(t,o),(0,n.Qy)(e,a[e],"info")}},6608:(e,t,r)=>{"use strict";r.d(t,{Dg:()=>c,Mt:()=>d,P_:()=>s});var n=r(2643),i=r(39);const o={privacy:{cookies_enabled:void 0},ajax:{deny_list:void 0},distributed_tracing:{enabled:void 0,exclude_newrelic_header:void 0,cors_use_newrelic_header:void 0,cors_use_tracecontext_headers:void 0,allowed_origins:void 0},page_view_timing:{enabled:void 0},ssl:void 0,obfuscate:void 0},a={};function s(e){if(!e)throw new Error("All config objects require an agent identifier!");if(!a[e])throw new Error(`Configuration for ${e} was never set`);return a[e]}function c(e,t){if(!e)throw new Error("All config objects require an agent identifier!");a[e]=new i.I(t,o),(0,n.Qy)(e,a[e],"config")}function d(e,t){if(!e)throw new Error("All config objects require an agent identifier!");var r=s(e);if(r){for(var n=t.split("."),i=0;i<n.length-1;i++)if("object"!=typeof(r=r[n[i]]))return;r=r[n[n.length-1]]}return r}},5763:(e,t,r)=>{"use strict";r.d(t,{D:()=>s,G:()=>c});var n=r(2643),i=r(39);const o={accountID:void 0,trustKey:void 0,agentID:void 0,licenseKey:void 0,applicationID:void 0,xpid:void 0},a={};function s(e){if(!e)throw new Error("All config objects require an agent identifier!");if(!a[e])throw new Error(`LoaderConfig for ${e} was never set`);return a[e]}function c(e,t){if(!e)throw new Error("All config objects require an agent identifier!");a[e]=new i.I(t,o),(0,n.Qy)(e,a[e],"loader_config")}},6682:(e,t,r)=>{"use strict";r.d(t,{O:()=>v,s:()=>w});var n={};r.r(n),r.d(n,{agent:()=>a,match:()=>u,version:()=>s});var i=r(616),o=r(4759),a=null,s=null;if(navigator.userAgent){var c=navigator.userAgent,d=c.match(/Version\/(\S+)\s+Safari/);d&&-1===c.indexOf("Chrome")&&-1===c.indexOf("Chromium")&&(a="Safari",s=d[1])}function u(e,t){if(!a)return!1;if(e!==a)return!1;if(!t)return!0;if(!s)return!1;for(var r=s.split("."),n=t.split("."),i=0;i<n.length;i++)if(n[i]!==r[i])return!1;return!0}var l=r(39),h=r(2643),f=window.XMLHttpRequest,g=f&&f.prototype;const m={origin:""+window.location,maxBytes:6===i.H?2e3:3e4,offset:(0,o.yf)(),features:{},customTransaction:void 0,onerror:void 0,releaseIds:void 0,xhrWrappable:f&&g&&g.addEventListener&&!/CriOS/.test(navigator.userAgent),disabled:void 0,ptid:void 0,userAgent:n},p={};function v(e){if(!e)throw new Error("All config objects require an agent identifier!");if(!p[e])throw new Error(`Runtime for ${e} was never set`);return p[e]}function w(e,t){if(!e)throw new Error("All config objects require an agent identifier!");p[e]=new l.I(t,m),(0,h.Qy)(e,p[e],"runtime")}},9946:(e,t,r)=>{"use strict";r.d(t,{w:()=>i});const n={agentIdentifier:""};class i{constructor(e){if("object"!=typeof e)return console.error("shared context requires an object as input");this.sharedContext={},Object.assign(this.sharedContext,n),Object.entries(e).forEach((([e,t])=>{Object.keys(n).includes(e)&&(this.sharedContext[e]=t)}))}}},4917:(e,t,r)=>{"use strict";function n(){return o(16)}function i(){return o(32)}function o(e){var t=null,r=0,n=window.crypto||window.msCrypto;n&&n.getRandomValues&&Uint8Array&&(t=n.getRandomValues(new Uint8Array(31)));for(var i=[],o=0;o<e;o++)i.push((t?15&t[r++]:16*Math.random()|0).toString(16));return i.join("")}r.d(t,{Ht:()=>i,M:()=>n,ky:()=>o})},4759:(e,t,r)=>{"use strict";r.d(t,{nb:()=>c,os:()=>d,yf:()=>s,zO:()=>a});var n=r(9545),i=(new Date).getTime(),o=i;function a(){return n.G&&performance.now?Math.round(performance.now()):(i=Math.max((new Date).getTime(),i))-o}function s(){return i}function c(e){o=e}function d(){return o}},9545:(e,t,r)=>{"use strict";r.d(t,{G:()=>n});const n=void 0!==window.performance&&window.performance.timing&&void 0!==window.performance.timing.navigationStart},3274:(e,t,r)=>{"use strict";r.d(t,{D:()=>i});var n=Object.prototype.hasOwnProperty;function i(e,t){var r=[],i="",o=0;for(i in e)n.call(e,i)&&(r[o]=t(i,e[i]),o+=1);return r}},2643:(e,t,r)=>{"use strict";r.d(t,{Qy:()=>s,ce:()=>i,fP:()=>o,mF:()=>a});var n=r(4759);const i={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net"};function o(){return window.NREUM||(window.NREUM={}),void 0===window.newrelic&&(window.newrelic=window.NREUM),window.NREUM}function a(){let e=o();if(!e.o){var t=window,r=t.XMLHttpRequest;e.o={ST:setTimeout,SI:t.setImmediate,CT:clearTimeout,XHR:r,REQ:t.Request,EV:t.Event,PR:t.Promise,MO:t.MutationObserver,FETCH:t.fetch}}return e}function s(e,t,r){let i=o();const a=i.initializedAgents||{},s=a[e]||{};return Object.keys(s).length||(s.initializedAt={ms:(0,n.zO)(),date:new Date}),i.initializedAgents={...a,[e]:{...s,[r]:t}},i}},8524:(e,t,r)=>{var n={"./ajax/aggregate":[4098,774,98],"./js-errors/aggregate":[6438,774,438],"./page-action/aggregate":[9064,774,64],"./page-view-event/aggregate":[6797,774,797],"./page-view-timing/aggregate":[7104,774,104],"./session-trace/aggregate":[3757,774,757]};function i(e){if(!r.o(n,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=n[e],i=t[0];return Promise.all(t.slice(1).map(r.e)).then((()=>r(i)))}i.keys=()=>Object.keys(n),i.id=8524,e.exports=i},7371:(e,t,r)=>{var n={"./ajax/instrument":[7962,610,962],"./js-errors/instrument":[5847,610,847],"./page-action/instrument":[6545,545],"./page-view-event/instrument":[8612,612],"./page-view-timing/instrument":[8709,709],"./session-trace/instrument":[976,976]};function i(e){if(!r.o(n,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=n[e],i=t[0];return Promise.all(t.slice(1).map(r.e)).then((()=>r(i)))}i.keys=()=>Object.keys(n),i.id=7371,e.exports=i}},n={};function i(e){var t=n[e];if(void 0!==t)return t.exports;var o=n[e]={exports:{}};return r[e](o,o.exports,i),o.exports}i.m=r,i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.f={},i.e=e=>Promise.all(Object.keys(i.f).reduce(((t,r)=>(i.f[r](e,t),t)),[])),i.u=e=>e+".build-time-mfe.js",i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="container:",i.l=(r,n,o,a)=>{if(e[r])e[r].push(n);else{var s,c;if(void 0!==o)for(var d=document.getElementsByTagName("script"),u=0;u<d.length;u++){var l=d[u];if(l.getAttribute("src")==r||l.getAttribute("data-webpack")==t+o){s=l;break}}s||(c=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,i.nc&&s.setAttribute("nonce",i.nc),s.setAttribute("data-webpack",t+o),s.src=r),e[r]=[n];var h=(t,n)=>{s.onerror=s.onload=null,clearTimeout(f);var i=e[r];if(delete e[r],s.parentNode&&s.parentNode.removeChild(s),i&&i.forEach((e=>e(n))),t)return t(n)},f=setTimeout(h.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=h.bind(null,s.onerror),s.onload=h.bind(null,s.onload),c&&document.head.appendChild(s)}},i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),(()=>{var e={179:0};i.f.j=(t,r)=>{var n=i.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else{var o=new Promise(((r,i)=>n=e[t]=[r,i]));r.push(n[2]=o);var a=i.p+i.u(t),s=new Error;i.l(a,(r=>{if(i.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var o=r&&("load"===r.type?"missing":r.type),a=r&&r.target&&r.target.src;s.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",s.name="ChunkLoadError",s.type=o,s.request=a,n[1](s)}}),"chunk-"+t,t)}};var t=(t,r)=>{var n,o,[a,s,c]=r,d=0;if(a.some((t=>0!==e[t]))){for(n in s)i.o(s,n)&&(i.m[n]=s[n]);c&&c(i)}for(t&&t(r);d<a.length;d++)o=a[d],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0},r=self.webpackChunkcontainer=self.webpackChunkcontainer||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o={};return(()=>{"use strict";i.r(o);var e,t=i(8162),r=i(6608),n=i(5763),a=i(6682);class s{constructor(e){this.name=e,this._enabled=!0,this._auto=!0}get enabled(){return this._enabled}set enabled(e){this._enabled=Boolean(e)}get auto(){return this._auto}set auto(e){this._auto=e}}!function(e){e.JSERRORS="js-errors"}(e||(e={}));var c=i(4759);class d{constructor(e){this.importedMethods={storeError:null},this._initialized=!1,this._initialized=!0,this._parent=e}noticeError(t,r){if(this._initialized&&this.importedMethods.storeError){if("string"!=typeof t&&!(t instanceof Error))return"noticeError",n=t,"Error | String",void console.warn(`"noticeError" was called with an invalid argument: ${n}. This method only accepts Error | String types for that argument.`);t="string"==typeof t?new Error(t):t;const e=(0,c.zO)(),i=!1;return this.importedMethods.storeError(t,e,i,r)}var n,i,o;return this._parent.initialized||this.importedMethods.storeError?this._parent.initialized&&!this.importedMethods.storeError?function(e,t,r){console.warn(`The ${t} Feature of agent ${e} Has Been Disabled. Method "noticeError" will not do anything!`)}(this._parent.id,e.JSERRORS):void 0:(i=this._parent.id,o=e.JSERRORS,void console.warn(`Agent ${i} is calling a ${o} Feature API, but the Browser Agent has not been started... Please start the agent using .start({...opts})`))}}class u{constructor(){this.errors=new s(e.JSERRORS)}getEnabledFeatures(){return Object.values(this).filter((e=>e.enabled))}}var l=i(2643),h=i(4917),f=i(9946),g=i(3274);class m extends f.w{constructor(e){super(e),this.aggregatedData={}}store(e,t,r,n,i){var o=this.getBucket(e,t,r,i);return o.metrics=function(e,t){return t||(t={count:0}),t.count+=1,(0,g.D)(e,(function(e,r){t[e]=p(r,t[e])})),t}(n,o.metrics),o}merge(e,t,r,n,i){var o=this.getBucket(e,t,n,i);if(o.metrics){var a=o.metrics;a.count+=r.count,(0,g.D)(r,(function(e,t){if("count"!==e){var n=a[e],i=r[e];i&&!i.c?a[e]=p(i.t,n):a[e]=function(e,t){return t?(t.c||(t=v(t.t)),t.min=Math.min(e.min,t.min),t.max=Math.max(e.max,t.max),t.t+=e.t,t.sos+=e.sos,t.c+=e.c,t):e}(i,a[e])}}))}else o.metrics=r}storeMetric(e,t,r,n){var i=this.getBucket(e,t,r);return i.stats=p(n,i.stats),i}getBucket(e,t,r,n){this.aggregatedData[e]||(this.aggregatedData[e]={});var i=this.aggregatedData[e][t];return i||(i=this.aggregatedData[e][t]={params:r||{}},n&&(i.custom=n)),i}get(e,t){return t?this.aggregatedData[e]&&this.aggregatedData[e][t]:this.aggregatedData[e]}take(e){for(var t={},r="",n=!1,i=0;i<e.length;i++)t[r=e[i]]="object"!=typeof(o=this.aggregatedData[r])?[]:(0,g.D)(o,w),t[r].length&&(n=!0),delete this.aggregatedData[r];var o;return n?t:null}}function p(e,t){return null==e?function(e){return e?e.c++:e={c:1},e}(t):t?(t.c||(t=v(t.t)),t.c+=1,t.t+=e,t.sos+=e*e,e>t.max&&(t.max=e),e<t.min&&(t.min=e),t):{t:e}}function v(e){return{t:e,min:e,max:e,sos:e*e,c:1}}function w(e,t){return t}class y{constructor(){this._initialized=!1,this._id=(0,h.ky)(16),this._api=new d(this),this._aggregator=new m({agentIdentifier:this._id}),this.features=new u,this.start=o=>{return s=this,c=void 0,u=function*(){if(this._initialized)return!1;this._initialized=!0;const{info:s,config:c,loader_config:d}=function(e){const t={beacon:"",errorBeacon:void 0,licenseKey:"",applicationID:"",sa:void 0,queueTime:void 0,applicationTime:void 0,ttGuid:void 0,user:void 0,account:void 0,product:void 0,extra:void 0,userAttributes:void 0,atts:void 0,transactionName:void 0,tNamePlain:void 0},r={privacy:{cookies_enabled:void 0},ajax:{deny_list:void 0},distributed_tracing:{enabled:void 0,exclude_newrelic_header:void 0,cors_use_newrelic_header:void 0,cors_use_tracecontext_headers:void 0,allowed_origins:void 0},page_view_timing:{enabled:void 0},ssl:void 0,obfuscate:void 0},n={accountID:void 0,trustKey:void 0,agentID:void 0,licenseKey:"",applicationID:"",xpid:void 0};return Object.keys(e).forEach((i=>{"beacon"===i&&(t.beacon=e[i],t.errorBeacon=e[i]),Object.keys(t).includes(i)&&(t[i]=e[i]),Object.keys(r).includes(i)&&(r[i]=e[i]),Object.keys(n).includes(i)&&(n[i]=e[i])})),function(e){return!(!e.applicationID||!e.licenseKey||!e.beacon)}(t)&&function(e){return!(!e.applicationID||!e.licenseKey)}(n)||console.warn("Missing required config data"),{info:t,config:r,loader_config:n}}(o);s&&(0,t.L)(this._id,s),c&&(0,r.Dg)(this._id,c),d&&(0,n.G)(this._id,c),(0,a.s)(this._id,{maxBytes:3e4});const u=yield function(t,r,n,o){return Promise.all(o.getEnabledFeatures().map((o=>{return a=this,s=void 0,d=function*(){if(o.auto){const{Instrument:e}=yield i(7371)(`./${o.name}/instrument`);new e(t)}const{Aggregate:a}=yield i(8524)(`./${o.name}/aggregate`),s=new a(t,n);return o.name===e.JSERRORS&&(r.importedMethods.storeError=(...e)=>s.storeError(...e)),o.name},new((c=void 0)||(c=Promise))((function(e,t){function r(e){try{i(d.next(e))}catch(e){t(e)}}function n(e){try{i(d.throw(e))}catch(e){t(e)}}function i(t){var i;t.done?e(t.value):(i=t.value,i instanceof c?i:new c((function(e){e(i)}))).then(r,n)}i((d=d.apply(a,s||[])).next())}));var a,s,c,d})))}(this._id,this._api,this._aggregator,this.features);return(0,l.Qy)(this._id,u,"features"),!0},new((d=void 0)||(d=Promise))((function(e,t){function r(e){try{i(u.next(e))}catch(e){t(e)}}function n(e){try{i(u.throw(e))}catch(e){t(e)}}function i(t){var i;t.done?e(t.value):(i=t.value,i instanceof d?i:new d((function(e){e(i)}))).then(r,n)}i((u=u.apply(s,c||[])).next())}));var s,c,d,u},this.noticeError=(e,t)=>this._api.noticeError(e,t)}get config(){return{info:(0,t.C)(this._id),config:(0,r.P_)(this._id),loader_config:(0,n.D)(this._id)}}get initialized(){return this._initialized}get id(){return this._id}}const b={...NREUM.init,...NREUM.info,...NREUM.loader_config,applicationID:1},E=new y;E.features.errors.auto=!1,E.start(b).then((()=>{console.debug("agent initialized! -- Puppies Component",b)}));class _ extends HTMLElement{static name="puppy-component";constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),this.elem=document.createElement("img"),this.name="Puppy Component",this.setImg()}fetchImg=async()=>{const e={api_key:"TMWFkdtKTv6To8CjL9OqC2KBNQTM8D3N",q:"puppy",limit:100},t=new URL("https://api.giphy.com/v1/gifs/search");Object.keys(e).forEach((r=>t.searchParams.append(r,e[r])));const r=await fetch(t),n=await r.json();return n.data.length>0?n.data[Math.floor(Math.random()*n.data.length)].images.downsized.url:"https://media.giphy.com/media/3zhxq2ttgN6rEw8SDx/giphy.gif"};setImg=async()=>{const e=await this.fetchImg();this.elem.src=e,this.elem.style.maxWidth="100vw",this.elem.style.maxHeight="250px",this.shadow.appendChild(this.elem),this.sendError()};sendError=()=>{console.debug(`NOTICING (nr.noticeError()) an error in ${this.name}`);const e=new Error(`nr.noticeError() called in ${this.name} (Component-1)!`);throw E.noticeError(e,{customAttr:"hi"}),new Error("component-1 threw global error")}}function x(e){const t=document.createElement(_.name);e.appendChild(t)}customElements.define(_.name,_);const j={...NREUM.init,...NREUM.info,...NREUM.loader_config,applicationID:2},M=new y;M.features.errors.auto=!1,M.start(j).then((()=>{console.debug("agent initialized! -- Kitten Component")}));class O extends HTMLElement{static name="kitten-component";constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),this.elem=document.createElement("img"),this.name="Kitten Component",this.setImg()}fetchImg=async()=>{const e={api_key:"TMWFkdtKTv6To8CjL9OqC2KBNQTM8D3N",q:"kitten",limit:100},t=new URL("https://api.giphy.com/v1/gifs/search");Object.keys(e).forEach((r=>t.searchParams.append(r,e[r])));const r=await fetch(t),n=await r.json();return n.data.length>0?n.data[Math.floor(Math.random()*n.data.length)].images.downsized.url:"https://media.giphy.com/media/3zhxq2ttgN6rEw8SDx/giphy.gif"};setImg=async()=>{const e=await this.fetchImg();this.elem.src=e,this.elem.style.maxWidth="100vw",this.elem.style.maxHeight="250px",this.shadow.appendChild(this.elem),this.sendError()};sendError=()=>{console.debug(`NOTICING (nr.noticeError()) an error in ${this.name}`);const e=new Error(`nr.noticeError() called in ${this.name} (Component-2)!`);M.noticeError(e)}}function D(e){const t=document.createElement(O.name);e.appendChild(t)}customElements.define(O.name,O);const I={...NREUM.init,...NREUM.info,...NREUM.loader_config,applicationID:3};(new y).start(I),D(document.querySelector("#content")),x(document.querySelector("#content")),document.querySelector("#dogs").addEventListener("click",(()=>{document.querySelectorAll(O.name).forEach((e=>e.remove())),x(document.querySelector("#content"))})),document.querySelector("#cats").addEventListener("click",(()=>{document.querySelectorAll(_.name).forEach((e=>e.remove())),D(document.querySelector("#content"))}))})(),o})()));
//# sourceMappingURL=build-time-mfe.js.map