(()=>{"use strict";var e={d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function n(e,t){return function(){return e.apply(t,arguments)}}e.r(t),e.d(t,{hasBrowserEnv:()=>fe,hasStandardBrowserEnv:()=>he,hasStandardBrowserWebWorkerEnv:()=>pe,navigator:()=>de,origin:()=>me});const{toString:r}=Object.prototype,{getPrototypeOf:o}=Object,s=(i=Object.create(null),e=>{const t=r.call(e);return i[t]||(i[t]=t.slice(8,-1).toLowerCase())});var i;const a=e=>(e=e.toLowerCase(),t=>s(t)===e),c=e=>t=>typeof t===e,{isArray:l}=Array,u=c("undefined"),f=a("ArrayBuffer"),d=c("string"),h=c("function"),p=c("number"),m=e=>null!==e&&"object"==typeof e,y=e=>{if("object"!==s(e))return!1;const t=o(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)},b=a("Date"),g=a("File"),w=a("Blob"),E=a("FileList"),v=a("URLSearchParams"),[S,O,R,T]=["ReadableStream","Request","Response","Headers"].map(a);function A(e,t,{allOwnKeys:n=!1}={}){if(null==e)return;let r,o;if("object"!=typeof e&&(e=[e]),l(e))for(r=0,o=e.length;r<o;r++)t.call(null,e[r],r,e);else{const o=n?Object.getOwnPropertyNames(e):Object.keys(e),s=o.length;let i;for(r=0;r<s;r++)i=o[r],t.call(null,e[i],i,e)}}function j(e,t){t=t.toLowerCase();const n=Object.keys(e);let r,o=n.length;for(;o-- >0;)if(r=n[o],t===r.toLowerCase())return r;return null}const x="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:global,P=e=>!u(e)&&e!==x,C=(L="undefined"!=typeof Uint8Array&&o(Uint8Array),e=>L&&e instanceof L);var L;const N=a("HTMLFormElement"),_=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),k=a("RegExp"),F=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),r={};A(n,((n,o)=>{let s;!1!==(s=t(n,o,e))&&(r[o]=s||n)})),Object.defineProperties(e,r)},U="abcdefghijklmnopqrstuvwxyz",B="0123456789",D={DIGIT:B,ALPHA:U,ALPHA_DIGIT:U+U.toUpperCase()+B},q=a("AsyncFunction"),I=(M="function"==typeof setImmediate,H=h(x.postMessage),M?setImmediate:H?(z=`axios@${Math.random()}`,W=[],x.addEventListener("message",(({source:e,data:t})=>{e===x&&t===z&&W.length&&W.shift()()}),!1),e=>{W.push(e),x.postMessage(z,"*")}):e=>setTimeout(e));var M,H,z,W;const J="undefined"!=typeof queueMicrotask?queueMicrotask.bind(x):"undefined"!=typeof process&&process.nextTick||I,V={isArray:l,isArrayBuffer:f,isBuffer:function(e){return null!==e&&!u(e)&&null!==e.constructor&&!u(e.constructor)&&h(e.constructor.isBuffer)&&e.constructor.isBuffer(e)},isFormData:e=>{let t;return e&&("function"==typeof FormData&&e instanceof FormData||h(e.append)&&("formdata"===(t=s(e))||"object"===t&&h(e.toString)&&"[object FormData]"===e.toString()))},isArrayBufferView:function(e){let t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&f(e.buffer),t},isString:d,isNumber:p,isBoolean:e=>!0===e||!1===e,isObject:m,isPlainObject:y,isReadableStream:S,isRequest:O,isResponse:R,isHeaders:T,isUndefined:u,isDate:b,isFile:g,isBlob:w,isRegExp:k,isFunction:h,isStream:e=>m(e)&&h(e.pipe),isURLSearchParams:v,isTypedArray:C,isFileList:E,forEach:A,merge:function e(){const{caseless:t}=P(this)&&this||{},n={},r=(r,o)=>{const s=t&&j(n,o)||o;y(n[s])&&y(r)?n[s]=e(n[s],r):y(r)?n[s]=e({},r):l(r)?n[s]=r.slice():n[s]=r};for(let e=0,t=arguments.length;e<t;e++)arguments[e]&&A(arguments[e],r);return n},extend:(e,t,r,{allOwnKeys:o}={})=>(A(t,((t,o)=>{r&&h(t)?e[o]=n(t,r):e[o]=t}),{allOwnKeys:o}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},toFlatObject:(e,t,n,r)=>{let s,i,a;const c={};if(t=t||{},null==e)return t;do{for(s=Object.getOwnPropertyNames(e),i=s.length;i-- >0;)a=s[i],r&&!r(a,e,t)||c[a]||(t[a]=e[a],c[a]=!0);e=!1!==n&&o(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:s,kindOfTest:a,endsWith:(e,t,n)=>{e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;const r=e.indexOf(t,n);return-1!==r&&r===n},toArray:e=>{if(!e)return null;if(l(e))return e;let t=e.length;if(!p(t))return null;const n=new Array(t);for(;t-- >0;)n[t]=e[t];return n},forEachEntry:(e,t)=>{const n=(e&&e[Symbol.iterator]).call(e);let r;for(;(r=n.next())&&!r.done;){const n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let n;const r=[];for(;null!==(n=e.exec(t));)r.push(n);return r},isHTMLForm:N,hasOwnProperty:_,hasOwnProp:_,reduceDescriptors:F,freezeMethods:e=>{F(e,((t,n)=>{if(h(e)&&-1!==["arguments","caller","callee"].indexOf(n))return!1;const r=e[n];h(r)&&(t.enumerable=!1,"writable"in t?t.writable=!1:t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")}))}))},toObjectSet:(e,t)=>{const n={},r=e=>{e.forEach((e=>{n[e]=!0}))};return l(e)?r(e):r(String(e).split(t)),n},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,(function(e,t,n){return t.toUpperCase()+n})),noop:()=>{},toFiniteNumber:(e,t)=>null!=e&&Number.isFinite(e=+e)?e:t,findKey:j,global:x,isContextDefined:P,ALPHABET:D,generateString:(e=16,t=D.ALPHA_DIGIT)=>{let n="";const{length:r}=t;for(;e--;)n+=t[Math.random()*r|0];return n},isSpecCompliantForm:function(e){return!!(e&&h(e.append)&&"FormData"===e[Symbol.toStringTag]&&e[Symbol.iterator])},toJSONObject:e=>{const t=new Array(10),n=(e,r)=>{if(m(e)){if(t.indexOf(e)>=0)return;if(!("toJSON"in e)){t[r]=e;const o=l(e)?[]:{};return A(e,((e,t)=>{const s=n(e,r+1);!u(s)&&(o[t]=s)})),t[r]=void 0,o}}return e};return n(e,0)},isAsyncFn:q,isThenable:e=>e&&(m(e)||h(e))&&h(e.then)&&h(e.catch),setImmediate:I,asap:J};function K(e,t,n,r,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack,this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o,this.status=o.status?o.status:null)}V.inherits(K,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:V.toJSONObject(this.config),code:this.code,status:this.status}}});const $=K.prototype,G={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach((e=>{G[e]={value:e}})),Object.defineProperties(K,G),Object.defineProperty($,"isAxiosError",{value:!0}),K.from=(e,t,n,r,o,s)=>{const i=Object.create($);return V.toFlatObject(e,i,(function(e){return e!==Error.prototype}),(e=>"isAxiosError"!==e)),K.call(i,e.message,t,n,r,o),i.cause=e,i.name=e.name,s&&Object.assign(i,s),i};const X=K;function Q(e){return V.isPlainObject(e)||V.isArray(e)}function Z(e){return V.endsWith(e,"[]")?e.slice(0,-2):e}function Y(e,t,n){return e?e.concat(t).map((function(e,t){return e=Z(e),!n&&t?"["+e+"]":e})).join(n?".":""):t}const ee=V.toFlatObject(V,{},null,(function(e){return/^is[A-Z]/.test(e)})),te=function(e,t,n){if(!V.isObject(e))throw new TypeError("target must be an object");t=t||new FormData;const r=(n=V.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,(function(e,t){return!V.isUndefined(t[e])}))).metaTokens,o=n.visitor||l,s=n.dots,i=n.indexes,a=(n.Blob||"undefined"!=typeof Blob&&Blob)&&V.isSpecCompliantForm(t);if(!V.isFunction(o))throw new TypeError("visitor must be a function");function c(e){if(null===e)return"";if(V.isDate(e))return e.toISOString();if(!a&&V.isBlob(e))throw new X("Blob is not supported. Use a Buffer instead.");return V.isArrayBuffer(e)||V.isTypedArray(e)?a&&"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}function l(e,n,o){let a=e;if(e&&!o&&"object"==typeof e)if(V.endsWith(n,"{}"))n=r?n:n.slice(0,-2),e=JSON.stringify(e);else if(V.isArray(e)&&function(e){return V.isArray(e)&&!e.some(Q)}(e)||(V.isFileList(e)||V.endsWith(n,"[]"))&&(a=V.toArray(e)))return n=Z(n),a.forEach((function(e,r){!V.isUndefined(e)&&null!==e&&t.append(!0===i?Y([n],r,s):null===i?n:n+"[]",c(e))})),!1;return!!Q(e)||(t.append(Y(o,n,s),c(e)),!1)}const u=[],f=Object.assign(ee,{defaultVisitor:l,convertValue:c,isVisitable:Q});if(!V.isObject(e))throw new TypeError("data must be an object");return function e(n,r){if(!V.isUndefined(n)){if(-1!==u.indexOf(n))throw Error("Circular reference detected in "+r.join("."));u.push(n),V.forEach(n,(function(n,s){!0===(!(V.isUndefined(n)||null===n)&&o.call(t,n,V.isString(s)?s.trim():s,r,f))&&e(n,r?r.concat(s):[s])})),u.pop()}}(e),t};function ne(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,(function(e){return t[e]}))}function re(e,t){this._pairs=[],e&&te(e,this,t)}const oe=re.prototype;oe.append=function(e,t){this._pairs.push([e,t])},oe.toString=function(e){const t=e?function(t){return e.call(this,t,ne)}:ne;return this._pairs.map((function(e){return t(e[0])+"="+t(e[1])}),"").join("&")};const se=re;function ie(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function ae(e,t,n){if(!t)return e;const r=n&&n.encode||ie,o=n&&n.serialize;let s;if(s=o?o(t,n):V.isURLSearchParams(t)?t.toString():new se(t,n).toString(r),s){const t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+s}return e}const ce=class{constructor(){this.handlers=[]}use(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){V.forEach(this.handlers,(function(t){null!==t&&e(t)}))}},le={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},ue={isBrowser:!0,classes:{URLSearchParams:"undefined"!=typeof URLSearchParams?URLSearchParams:se,FormData:"undefined"!=typeof FormData?FormData:null,Blob:"undefined"!=typeof Blob?Blob:null},protocols:["http","https","file","blob","url","data"]},fe="undefined"!=typeof window&&"undefined"!=typeof document,de="object"==typeof navigator&&navigator||void 0,he=fe&&(!de||["ReactNative","NativeScript","NS"].indexOf(de.product)<0),pe="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,me=fe&&window.location.href||"http://localhost",ye={...t,...ue},be=function(e){function t(e,n,r,o){let s=e[o++];if("__proto__"===s)return!0;const i=Number.isFinite(+s),a=o>=e.length;return s=!s&&V.isArray(r)?r.length:s,a?(V.hasOwnProp(r,s)?r[s]=[r[s],n]:r[s]=n,!i):(r[s]&&V.isObject(r[s])||(r[s]=[]),t(e,n,r[s],o)&&V.isArray(r[s])&&(r[s]=function(e){const t={},n=Object.keys(e);let r;const o=n.length;let s;for(r=0;r<o;r++)s=n[r],t[s]=e[s];return t}(r[s])),!i)}if(V.isFormData(e)&&V.isFunction(e.entries)){const n={};return V.forEachEntry(e,((e,r)=>{t(function(e){return V.matchAll(/\w+|\[(\w*)]/g,e).map((e=>"[]"===e[0]?"":e[1]||e[0]))}(e),r,n,0)})),n}return null},ge={transitional:le,adapter:["xhr","http","fetch"],transformRequest:[function(e,t){const n=t.getContentType()||"",r=n.indexOf("application/json")>-1,o=V.isObject(e);if(o&&V.isHTMLForm(e)&&(e=new FormData(e)),V.isFormData(e))return r?JSON.stringify(be(e)):e;if(V.isArrayBuffer(e)||V.isBuffer(e)||V.isStream(e)||V.isFile(e)||V.isBlob(e)||V.isReadableStream(e))return e;if(V.isArrayBufferView(e))return e.buffer;if(V.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();let s;if(o){if(n.indexOf("application/x-www-form-urlencoded")>-1)return function(e,t){return te(e,new ye.classes.URLSearchParams,Object.assign({visitor:function(e,t,n,r){return ye.isNode&&V.isBuffer(e)?(this.append(t,e.toString("base64")),!1):r.defaultVisitor.apply(this,arguments)}},t))}(e,this.formSerializer).toString();if((s=V.isFileList(e))||n.indexOf("multipart/form-data")>-1){const t=this.env&&this.env.FormData;return te(s?{"files[]":e}:e,t&&new t,this.formSerializer)}}return o||r?(t.setContentType("application/json",!1),function(e,t,n){if(V.isString(e))try{return(0,JSON.parse)(e),V.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){const t=this.transitional||ge.transitional,n=t&&t.forcedJSONParsing,r="json"===this.responseType;if(V.isResponse(e)||V.isReadableStream(e))return e;if(e&&V.isString(e)&&(n&&!this.responseType||r)){const n=!(t&&t.silentJSONParsing)&&r;try{return JSON.parse(e)}catch(e){if(n){if("SyntaxError"===e.name)throw X.from(e,X.ERR_BAD_RESPONSE,this,null,this.response);throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ye.classes.FormData,Blob:ye.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};V.forEach(["delete","get","head","post","put","patch"],(e=>{ge.headers[e]={}}));const we=ge,Ee=V.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),ve=Symbol("internals");function Se(e){return e&&String(e).trim().toLowerCase()}function Oe(e){return!1===e||null==e?e:V.isArray(e)?e.map(Oe):String(e)}function Re(e,t,n,r,o){return V.isFunction(r)?r.call(this,t,n):(o&&(t=n),V.isString(t)?V.isString(r)?-1!==t.indexOf(r):V.isRegExp(r)?r.test(t):void 0:void 0)}class Te{constructor(e){e&&this.set(e)}set(e,t,n){const r=this;function o(e,t,n){const o=Se(t);if(!o)throw new Error("header name must be a non-empty string");const s=V.findKey(r,o);(!s||void 0===r[s]||!0===n||void 0===n&&!1!==r[s])&&(r[s||t]=Oe(e))}const s=(e,t)=>V.forEach(e,((e,n)=>o(e,n,t)));if(V.isPlainObject(e)||e instanceof this.constructor)s(e,t);else if(V.isString(e)&&(e=e.trim())&&!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim()))s((e=>{const t={};let n,r,o;return e&&e.split("\n").forEach((function(e){o=e.indexOf(":"),n=e.substring(0,o).trim().toLowerCase(),r=e.substring(o+1).trim(),!n||t[n]&&Ee[n]||("set-cookie"===n?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+", "+r:r)})),t})(e),t);else if(V.isHeaders(e))for(const[t,r]of e.entries())o(r,t,n);else null!=e&&o(t,e,n);return this}get(e,t){if(e=Se(e)){const n=V.findKey(this,e);if(n){const e=this[n];if(!t)return e;if(!0===t)return function(e){const t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}(e);if(V.isFunction(t))return t.call(this,e,n);if(V.isRegExp(t))return t.exec(e);throw new TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=Se(e)){const n=V.findKey(this,e);return!(!n||void 0===this[n]||t&&!Re(0,this[n],n,t))}return!1}delete(e,t){const n=this;let r=!1;function o(e){if(e=Se(e)){const o=V.findKey(n,e);!o||t&&!Re(0,n[o],o,t)||(delete n[o],r=!0)}}return V.isArray(e)?e.forEach(o):o(e),r}clear(e){const t=Object.keys(this);let n=t.length,r=!1;for(;n--;){const o=t[n];e&&!Re(0,this[o],o,e,!0)||(delete this[o],r=!0)}return r}normalize(e){const t=this,n={};return V.forEach(this,((r,o)=>{const s=V.findKey(n,o);if(s)return t[s]=Oe(r),void delete t[o];const i=e?function(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,((e,t,n)=>t.toUpperCase()+n))}(o):String(o).trim();i!==o&&delete t[o],t[i]=Oe(r),n[i]=!0})),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){const t=Object.create(null);return V.forEach(this,((n,r)=>{null!=n&&!1!==n&&(t[r]=e&&V.isArray(n)?n.join(", "):n)})),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map((([e,t])=>e+": "+t)).join("\n")}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){const n=new this(e);return t.forEach((e=>n.set(e))),n}static accessor(e){const t=(this[ve]=this[ve]={accessors:{}}).accessors,n=this.prototype;function r(e){const r=Se(e);t[r]||(function(e,t){const n=V.toCamelCase(" "+t);["get","set","has"].forEach((r=>{Object.defineProperty(e,r+n,{value:function(e,n,o){return this[r].call(this,t,e,n,o)},configurable:!0})}))}(n,e),t[r]=!0)}return V.isArray(e)?e.forEach(r):r(e),this}}Te.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),V.reduceDescriptors(Te.prototype,(({value:e},t)=>{let n=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[n]=e}}})),V.freezeMethods(Te);const Ae=Te;function je(e,t){const n=this||we,r=t||n,o=Ae.from(r.headers);let s=r.data;return V.forEach(e,(function(e){s=e.call(n,s,o.normalize(),t?t.status:void 0)})),o.normalize(),s}function xe(e){return!(!e||!e.__CANCEL__)}function Pe(e,t,n){X.call(this,null==e?"canceled":e,X.ERR_CANCELED,t,n),this.name="CanceledError"}V.inherits(Pe,X,{__CANCEL__:!0});const Ce=Pe;function Le(e,t,n){const r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(new X("Request failed with status code "+n.status,[X.ERR_BAD_REQUEST,X.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}const Ne=(e,t,n=3)=>{let r=0;const o=function(e,t){e=e||10;const n=new Array(e),r=new Array(e);let o,s=0,i=0;return t=void 0!==t?t:1e3,function(a){const c=Date.now(),l=r[i];o||(o=c),n[s]=a,r[s]=c;let u=i,f=0;for(;u!==s;)f+=n[u++],u%=e;if(s=(s+1)%e,s===i&&(i=(i+1)%e),c-o<t)return;const d=l&&c-l;return d?Math.round(1e3*f/d):void 0}}(50,250);return function(e,t){let n,r,o=0,s=1e3/t;const i=(t,s=Date.now())=>{o=s,n=null,r&&(clearTimeout(r),r=null),e.apply(null,t)};return[(...e)=>{const t=Date.now(),a=t-o;a>=s?i(e,t):(n=e,r||(r=setTimeout((()=>{r=null,i(n)}),s-a)))},()=>n&&i(n)]}((n=>{const s=n.loaded,i=n.lengthComputable?n.total:void 0,a=s-r,c=o(a);r=s,e({loaded:s,total:i,progress:i?s/i:void 0,bytes:a,rate:c||void 0,estimated:c&&i&&s<=i?(i-s)/c:void 0,event:n,lengthComputable:null!=i,[t?"download":"upload"]:!0})}),n)},_e=(e,t)=>{const n=null!=e;return[r=>t[0]({lengthComputable:n,total:e,loaded:r}),t[1]]},ke=e=>(...t)=>V.asap((()=>e(...t))),Fe=ye.hasStandardBrowserEnv?function(){const e=ye.navigator&&/(msie|trident)/i.test(ye.navigator.userAgent),t=document.createElement("a");let n;function r(n){let r=n;return e&&(t.setAttribute("href",r),r=t.href),t.setAttribute("href",r),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}return n=r(window.location.href),function(e){const t=V.isString(e)?r(e):e;return t.protocol===n.protocol&&t.host===n.host}}():function(){return!0},Ue=ye.hasStandardBrowserEnv?{write(e,t,n,r,o,s){const i=[e+"="+encodeURIComponent(t)];V.isNumber(n)&&i.push("expires="+new Date(n).toGMTString()),V.isString(r)&&i.push("path="+r),V.isString(o)&&i.push("domain="+o),!0===s&&i.push("secure"),document.cookie=i.join("; ")},read(e){const t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove(e){this.write(e,"",Date.now()-864e5)}}:{write(){},read:()=>null,remove(){}};function Be(e,t){return e&&!/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)?function(e,t){return t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e}(e,t):t}const De=e=>e instanceof Ae?{...e}:e;function qe(e,t){t=t||{};const n={};function r(e,t,n){return V.isPlainObject(e)&&V.isPlainObject(t)?V.merge.call({caseless:n},e,t):V.isPlainObject(t)?V.merge({},t):V.isArray(t)?t.slice():t}function o(e,t,n){return V.isUndefined(t)?V.isUndefined(e)?void 0:r(void 0,e,n):r(e,t,n)}function s(e,t){if(!V.isUndefined(t))return r(void 0,t)}function i(e,t){return V.isUndefined(t)?V.isUndefined(e)?void 0:r(void 0,e):r(void 0,t)}function a(n,o,s){return s in t?r(n,o):s in e?r(void 0,n):void 0}const c={url:s,method:s,data:s,baseURL:i,transformRequest:i,transformResponse:i,paramsSerializer:i,timeout:i,timeoutMessage:i,withCredentials:i,withXSRFToken:i,adapter:i,responseType:i,xsrfCookieName:i,xsrfHeaderName:i,onUploadProgress:i,onDownloadProgress:i,decompress:i,maxContentLength:i,maxBodyLength:i,beforeRedirect:i,transport:i,httpAgent:i,httpsAgent:i,cancelToken:i,socketPath:i,responseEncoding:i,validateStatus:a,headers:(e,t)=>o(De(e),De(t),!0)};return V.forEach(Object.keys(Object.assign({},e,t)),(function(r){const s=c[r]||o,i=s(e[r],t[r],r);V.isUndefined(i)&&s!==a||(n[r]=i)})),n}const Ie=e=>{const t=qe({},e);let n,{data:r,withXSRFToken:o,xsrfHeaderName:s,xsrfCookieName:i,headers:a,auth:c}=t;if(t.headers=a=Ae.from(a),t.url=ae(Be(t.baseURL,t.url),e.params,e.paramsSerializer),c&&a.set("Authorization","Basic "+btoa((c.username||"")+":"+(c.password?unescape(encodeURIComponent(c.password)):""))),V.isFormData(r))if(ye.hasStandardBrowserEnv||ye.hasStandardBrowserWebWorkerEnv)a.setContentType(void 0);else if(!1!==(n=a.getContentType())){const[e,...t]=n?n.split(";").map((e=>e.trim())).filter(Boolean):[];a.setContentType([e||"multipart/form-data",...t].join("; "))}if(ye.hasStandardBrowserEnv&&(o&&V.isFunction(o)&&(o=o(t)),o||!1!==o&&Fe(t.url))){const e=s&&i&&Ue.read(i);e&&a.set(s,e)}return t},Me="undefined"!=typeof XMLHttpRequest&&function(e){return new Promise((function(t,n){const r=Ie(e);let o=r.data;const s=Ae.from(r.headers).normalize();let i,a,c,l,u,{responseType:f,onUploadProgress:d,onDownloadProgress:h}=r;function p(){l&&l(),u&&u(),r.cancelToken&&r.cancelToken.unsubscribe(i),r.signal&&r.signal.removeEventListener("abort",i)}let m=new XMLHttpRequest;function y(){if(!m)return;const r=Ae.from("getAllResponseHeaders"in m&&m.getAllResponseHeaders());Le((function(e){t(e),p()}),(function(e){n(e),p()}),{data:f&&"text"!==f&&"json"!==f?m.response:m.responseText,status:m.status,statusText:m.statusText,headers:r,config:e,request:m}),m=null}m.open(r.method.toUpperCase(),r.url,!0),m.timeout=r.timeout,"onloadend"in m?m.onloadend=y:m.onreadystatechange=function(){m&&4===m.readyState&&(0!==m.status||m.responseURL&&0===m.responseURL.indexOf("file:"))&&setTimeout(y)},m.onabort=function(){m&&(n(new X("Request aborted",X.ECONNABORTED,e,m)),m=null)},m.onerror=function(){n(new X("Network Error",X.ERR_NETWORK,e,m)),m=null},m.ontimeout=function(){let t=r.timeout?"timeout of "+r.timeout+"ms exceeded":"timeout exceeded";const o=r.transitional||le;r.timeoutErrorMessage&&(t=r.timeoutErrorMessage),n(new X(t,o.clarifyTimeoutError?X.ETIMEDOUT:X.ECONNABORTED,e,m)),m=null},void 0===o&&s.setContentType(null),"setRequestHeader"in m&&V.forEach(s.toJSON(),(function(e,t){m.setRequestHeader(t,e)})),V.isUndefined(r.withCredentials)||(m.withCredentials=!!r.withCredentials),f&&"json"!==f&&(m.responseType=r.responseType),h&&([c,u]=Ne(h,!0),m.addEventListener("progress",c)),d&&m.upload&&([a,l]=Ne(d),m.upload.addEventListener("progress",a),m.upload.addEventListener("loadend",l)),(r.cancelToken||r.signal)&&(i=t=>{m&&(n(!t||t.type?new Ce(null,e,m):t),m.abort(),m=null)},r.cancelToken&&r.cancelToken.subscribe(i),r.signal&&(r.signal.aborted?i():r.signal.addEventListener("abort",i)));const b=function(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}(r.url);b&&-1===ye.protocols.indexOf(b)?n(new X("Unsupported protocol "+b+":",X.ERR_BAD_REQUEST,e)):m.send(o||null)}))},He=(e,t)=>{const{length:n}=e=e?e.filter(Boolean):[];if(t||n){let n,r=new AbortController;const o=function(e){if(!n){n=!0,i();const t=e instanceof Error?e:this.reason;r.abort(t instanceof X?t:new Ce(t instanceof Error?t.message:t))}};let s=t&&setTimeout((()=>{s=null,o(new X(`timeout ${t} of ms exceeded`,X.ETIMEDOUT))}),t);const i=()=>{e&&(s&&clearTimeout(s),s=null,e.forEach((e=>{e.unsubscribe?e.unsubscribe(o):e.removeEventListener("abort",o)})),e=null)};e.forEach((e=>e.addEventListener("abort",o)));const{signal:a}=r;return a.unsubscribe=()=>V.asap(i),a}},ze=function*(e,t){let n=e.byteLength;if(!t||n<t)return void(yield e);let r,o=0;for(;o<n;)r=o+t,yield e.slice(o,r),o=r},We=(e,t,n,r)=>{const o=async function*(e,t){for await(const n of async function*(e){if(e[Symbol.asyncIterator])return void(yield*e);const t=e.getReader();try{for(;;){const{done:e,value:n}=await t.read();if(e)break;yield n}}finally{await t.cancel()}}(e))yield*ze(n,t)}(e,t);let s,i=0,a=e=>{s||(s=!0,r&&r(e))};return new ReadableStream({async pull(e){try{const{done:t,value:r}=await o.next();if(t)return a(),void e.close();let s=r.byteLength;if(n){let e=i+=s;n(e)}e.enqueue(new Uint8Array(r))}catch(e){throw a(e),e}},cancel:e=>(a(e),o.return())},{highWaterMark:2})},Je="function"==typeof fetch&&"function"==typeof Request&&"function"==typeof Response,Ve=Je&&"function"==typeof ReadableStream,Ke=Je&&("function"==typeof TextEncoder?($e=new TextEncoder,e=>$e.encode(e)):async e=>new Uint8Array(await new Response(e).arrayBuffer()));var $e;const Ge=(e,...t)=>{try{return!!e(...t)}catch(e){return!1}},Xe=Ve&&Ge((()=>{let e=!1;const t=new Request(ye.origin,{body:new ReadableStream,method:"POST",get duplex(){return e=!0,"half"}}).headers.has("Content-Type");return e&&!t})),Qe=Ve&&Ge((()=>V.isReadableStream(new Response("").body))),Ze={stream:Qe&&(e=>e.body)};var Ye;Je&&(Ye=new Response,["text","arrayBuffer","blob","formData","stream"].forEach((e=>{!Ze[e]&&(Ze[e]=V.isFunction(Ye[e])?t=>t[e]():(t,n)=>{throw new X(`Response type '${e}' is not supported`,X.ERR_NOT_SUPPORT,n)})})));const et={http:null,xhr:Me,fetch:Je&&(async e=>{let{url:t,method:n,data:r,signal:o,cancelToken:s,timeout:i,onDownloadProgress:a,onUploadProgress:c,responseType:l,headers:u,withCredentials:f="same-origin",fetchOptions:d}=Ie(e);l=l?(l+"").toLowerCase():"text";let h,p=He([o,s&&s.toAbortSignal()],i);const m=p&&p.unsubscribe&&(()=>{p.unsubscribe()});let y;try{if(c&&Xe&&"get"!==n&&"head"!==n&&0!==(y=await(async(e,t)=>{const n=V.toFiniteNumber(e.getContentLength());return null==n?(async e=>{if(null==e)return 0;if(V.isBlob(e))return e.size;if(V.isSpecCompliantForm(e)){const t=new Request(ye.origin,{method:"POST",body:e});return(await t.arrayBuffer()).byteLength}return V.isArrayBufferView(e)||V.isArrayBuffer(e)?e.byteLength:(V.isURLSearchParams(e)&&(e+=""),V.isString(e)?(await Ke(e)).byteLength:void 0)})(t):n})(u,r))){let e,n=new Request(t,{method:"POST",body:r,duplex:"half"});if(V.isFormData(r)&&(e=n.headers.get("content-type"))&&u.setContentType(e),n.body){const[e,t]=_e(y,Ne(ke(c)));r=We(n.body,65536,e,t)}}V.isString(f)||(f=f?"include":"omit");const o="credentials"in Request.prototype;h=new Request(t,{...d,signal:p,method:n.toUpperCase(),headers:u.normalize().toJSON(),body:r,duplex:"half",credentials:o?f:void 0});let s=await fetch(h);const i=Qe&&("stream"===l||"response"===l);if(Qe&&(a||i&&m)){const e={};["status","statusText","headers"].forEach((t=>{e[t]=s[t]}));const t=V.toFiniteNumber(s.headers.get("content-length")),[n,r]=a&&_e(t,Ne(ke(a),!0))||[];s=new Response(We(s.body,65536,n,(()=>{r&&r(),m&&m()})),e)}l=l||"text";let b=await Ze[V.findKey(Ze,l)||"text"](s,e);return!i&&m&&m(),await new Promise(((t,n)=>{Le(t,n,{data:b,headers:Ae.from(s.headers),status:s.status,statusText:s.statusText,config:e,request:h})}))}catch(t){if(m&&m(),t&&"TypeError"===t.name&&/fetch/i.test(t.message))throw Object.assign(new X("Network Error",X.ERR_NETWORK,e,h),{cause:t.cause||t});throw X.from(t,t&&t.code,e,h)}})};V.forEach(et,((e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch(e){}Object.defineProperty(e,"adapterName",{value:t})}}));const tt=e=>`- ${e}`,nt=e=>V.isFunction(e)||null===e||!1===e,rt=e=>{e=V.isArray(e)?e:[e];const{length:t}=e;let n,r;const o={};for(let s=0;s<t;s++){let t;if(n=e[s],r=n,!nt(n)&&(r=et[(t=String(n)).toLowerCase()],void 0===r))throw new X(`Unknown adapter '${t}'`);if(r)break;o[t||"#"+s]=r}if(!r){const e=Object.entries(o).map((([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build")));let n=t?e.length>1?"since :\n"+e.map(tt).join("\n"):" "+tt(e[0]):"as no adapter specified";throw new X("There is no suitable adapter to dispatch the request "+n,"ERR_NOT_SUPPORT")}return r};function ot(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new Ce(null,e)}function st(e){return ot(e),e.headers=Ae.from(e.headers),e.data=je.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),rt(e.adapter||we.adapter)(e).then((function(t){return ot(e),t.data=je.call(e,e.transformResponse,t),t.headers=Ae.from(t.headers),t}),(function(t){return xe(t)||(ot(e),t&&t.response&&(t.response.data=je.call(e,e.transformResponse,t.response),t.response.headers=Ae.from(t.response.headers))),Promise.reject(t)}))}const it={};["object","boolean","number","function","string","symbol"].forEach(((e,t)=>{it[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));const at={};it.transitional=function(e,t,n){function r(e,t){return"[Axios v1.7.7] Transitional option '"+e+"'"+t+(n?". "+n:"")}return(n,o,s)=>{if(!1===e)throw new X(r(o," has been removed"+(t?" in "+t:"")),X.ERR_DEPRECATED);return t&&!at[o]&&(at[o]=!0,console.warn(r(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,o,s)}};const ct={assertOptions:function(e,t,n){if("object"!=typeof e)throw new X("options must be an object",X.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let o=r.length;for(;o-- >0;){const s=r[o],i=t[s];if(i){const t=e[s],n=void 0===t||i(t,s,e);if(!0!==n)throw new X("option "+s+" must be "+n,X.ERR_BAD_OPTION_VALUE)}else if(!0!==n)throw new X("Unknown option "+s,X.ERR_BAD_OPTION)}},validators:it},lt=ct.validators;class ut{constructor(e){this.defaults=e,this.interceptors={request:new ce,response:new ce}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error){let t;Error.captureStackTrace?Error.captureStackTrace(t={}):t=new Error;const n=t.stack?t.stack.replace(/^.+\n/,""):"";try{e.stack?n&&!String(e.stack).endsWith(n.replace(/^.+\n.+\n/,""))&&(e.stack+="\n"+n):e.stack=n}catch(e){}}throw e}}_request(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},t=qe(this.defaults,t);const{transitional:n,paramsSerializer:r,headers:o}=t;void 0!==n&&ct.assertOptions(n,{silentJSONParsing:lt.transitional(lt.boolean),forcedJSONParsing:lt.transitional(lt.boolean),clarifyTimeoutError:lt.transitional(lt.boolean)},!1),null!=r&&(V.isFunction(r)?t.paramsSerializer={serialize:r}:ct.assertOptions(r,{encode:lt.function,serialize:lt.function},!0)),t.method=(t.method||this.defaults.method||"get").toLowerCase();let s=o&&V.merge(o.common,o[t.method]);o&&V.forEach(["delete","get","head","post","put","patch","common"],(e=>{delete o[e]})),t.headers=Ae.concat(s,o);const i=[];let a=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(a=a&&e.synchronous,i.unshift(e.fulfilled,e.rejected))}));const c=[];let l;this.interceptors.response.forEach((function(e){c.push(e.fulfilled,e.rejected)}));let u,f=0;if(!a){const e=[st.bind(this),void 0];for(e.unshift.apply(e,i),e.push.apply(e,c),u=e.length,l=Promise.resolve(t);f<u;)l=l.then(e[f++],e[f++]);return l}u=i.length;let d=t;for(f=0;f<u;){const e=i[f++],t=i[f++];try{d=e(d)}catch(e){t.call(this,e);break}}try{l=st.call(this,d)}catch(e){return Promise.reject(e)}for(f=0,u=c.length;f<u;)l=l.then(c[f++],c[f++]);return l}getUri(e){return ae(Be((e=qe(this.defaults,e)).baseURL,e.url),e.params,e.paramsSerializer)}}V.forEach(["delete","get","head","options"],(function(e){ut.prototype[e]=function(t,n){return this.request(qe(n||{},{method:e,url:t,data:(n||{}).data}))}})),V.forEach(["post","put","patch"],(function(e){function t(t){return function(n,r,o){return this.request(qe(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}ut.prototype[e]=t(),ut.prototype[e+"Form"]=t(!0)}));const ft=ut;class dt{constructor(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");let t;this.promise=new Promise((function(e){t=e}));const n=this;this.promise.then((e=>{if(!n._listeners)return;let t=n._listeners.length;for(;t-- >0;)n._listeners[t](e);n._listeners=null})),this.promise.then=e=>{let t;const r=new Promise((e=>{n.subscribe(e),t=e})).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e((function(e,r,o){n.reason||(n.reason=new Ce(e,r,o),t(n.reason))}))}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;const t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}toAbortSignal(){const e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let e;return{token:new dt((function(t){e=t})),cancel:e}}}const ht=dt,pt={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(pt).forEach((([e,t])=>{pt[t]=e}));const mt=pt,yt=function e(t){const r=new ft(t),o=n(ft.prototype.request,r);return V.extend(o,ft.prototype,r,{allOwnKeys:!0}),V.extend(o,r,null,{allOwnKeys:!0}),o.create=function(n){return e(qe(t,n))},o}(we);yt.Axios=ft,yt.CanceledError=Ce,yt.CancelToken=ht,yt.isCancel=xe,yt.VERSION="1.7.7",yt.toFormData=te,yt.AxiosError=X,yt.Cancel=yt.CanceledError,yt.all=function(e){return Promise.all(e)},yt.spread=function(e){return function(t){return e.apply(null,t)}},yt.isAxiosError=function(e){return V.isObject(e)&&!0===e.isAxiosError},yt.mergeConfig=qe,yt.AxiosHeaders=Ae,yt.formToJSON=e=>be(V.isHTMLForm(e)?new FormData(e):e),yt.getAdapter=rt,yt.HttpStatusCode=mt,yt.default=yt;const bt=yt;function gt(e){return gt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},gt(e)}function wt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,Et(r.key),r)}}function Et(e){var t=function(e,t){if("object"!=gt(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,"string");if("object"!=gt(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==gt(t)?t:t+""}var vt=function(){return e=function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.injectHTML(),this.searchIcon=document.querySelector(".search-icon"),this.searchIcon2=document.querySelector(".search-icon-2"),this.resultOverlay=document.querySelector(".result-container"),this.loaderIcon=document.querySelector(".loader-container"),this.closeIcon=document.querySelector(".close-search"),this.searchField=document.querySelector("#live-search-field"),this.resultArea=document.querySelector(".result"),this.typingWaitTimer,this.previousValue="",this.events()},t=[{key:"events",value:function(){var e=this;this.searchIcon.addEventListener("click",(function(t){t.preventDefault(),e.openOverlay()})),this.closeIcon.addEventListener("click",(function(){return e.closeOverlay()})),this.searchField.addEventListener("keyup",(function(){return e.keyPressHandler()}))}},{key:"keyPressHandler",value:function(){var e=this,t=this.searchField.value;""!=t&&t!=this.previousValue&&(clearTimeout(this.typingWaitTimer),this.showLoaderIcon(),this.resultArea.innerHTML="",this.typingWaitTimer=setTimeout((function(){e.sendRequest()}),3e3)),this.previousValue=t}},{key:"sendRequest",value:function(){var e=this;bt.post("/search",{searchTerm:this.searchField.value}).then((function(t){if(0==t.data.length)e.resultArea.innerHTML='<p class="alert alert-danger text-center shadow-sm">No results found</p>',e.hideLoaderIcon();else{for(var n=0;n<t.data.length;n++)e.resultArea.innerHTML+="<p>".concat(n+1,'</p>\n                    <a href="/book/').concat(t.data[n].book_id,'" class="search-overlay__result">\n                    <p class="search-overlay__result-title">').concat(t.data[n].title,'</p>\n                    <p class="search-overlay__result-author">').concat(t.data[n].author,"</p>\n                    </a>");e.hideLoaderIcon()}})).catch((function(){alert("Hello, the request failed")}))}},{key:"showLoaderIcon",value:function(){this.loaderIcon.classList.add("loader-container--visible")}},{key:"hideLoaderIcon",value:function(){this.loaderIcon.classList.remove("loader-container--visible")}},{key:"openOverlay",value:function(){var e=this;this.searchIcon2.classList.add("search-icon-2--visible"),this.resultOverlay.classList.add("result-container--visible"),setTimeout((function(){return e.searchField.focus()}),50)}},{key:"closeOverlay",value:function(){this.searchIcon2.classList.remove("search-icon-2--visible"),this.resultOverlay.classList.remove("result-container--visible")}},{key:"injectHTML",value:function(){document.body.insertAdjacentHTML("beforeend",'<div class="search-icon-2 ">\n             <i class="fas fa-search"></i>\n             <input type="text" placeholder="Search" id="live-search-field">\n             <span class="close-search"><i class="fas fa-times-circle"></i></span>\n         </div>\n         <div class="result-container ">\n             <div class="loader-container">\n                 <div class="loader"></div>\n             </div>\n \n             <div class="result">\n             </div>\n         </div>')}}],t&&wt(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,t}();document.querySelector(".search-icon")&&new vt})();