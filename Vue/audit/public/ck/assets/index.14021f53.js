import{r as m,c as d,o as _,a as f,b as p,d as h,e as v,f as y}from"./vendor.2a4ecb5d.js";const g=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}};g();var E=(n,s)=>{for(const[i,r]of s)n[i]=r;return n};const L={};function k(n,s){const i=m("router-view");return _(),d(i)}var O=E(L,[["render",k],["__scopeId","data-v-11de3e33"]]);const P="modulepreload",a={},b="./",c=function(s,i){return!i||i.length===0?s():Promise.all(i.map(r=>{if(r=`${b}${r}`,r in a)return;a[r]=!0;const e=r.endsWith(".css"),t=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${t}`))return;const o=document.createElement("link");if(o.rel=e?"stylesheet":P,e||(o.as="script",o.crossOrigin=""),o.href=r,document.head.appendChild(o),e)return new Promise((u,l)=>{o.addEventListener("load",u),o.addEventListener("error",l)})})).then(()=>s())},A=[{path:"/",redirect:"/home"},{path:"/home",name:"Home",component:()=>c(()=>import("./home.75c2c6b3.js"),["assets/home.75c2c6b3.js","assets/home.5bc5a415.css","assets/vendor.2a4ecb5d.js","assets/index.6016b074.js","assets/index.09488a1e.css"]),meta:{name:"\u9996\u9875"}},{path:"/ranking",name:"Ranking",component:()=>c(()=>import("./ranking.07093413.js"),["assets/ranking.07093413.js","assets/ranking.229f5aa4.css","assets/index.6016b074.js","assets/index.09488a1e.css","assets/vendor.2a4ecb5d.js","assets/index.7e396206.js","assets/index.5d8b303d.css"]),meta:{name:"\u4EA7\u54C1\u62BD\u68C0\u6392\u884C\u699C"}},{path:"/list",name:"List",component:()=>c(()=>import("./list.1f7aff33.js"),["assets/list.1f7aff33.js","assets/list.cc7f54ab.css","assets/index.6016b074.js","assets/index.09488a1e.css","assets/vendor.2a4ecb5d.js","assets/index.7e396206.js","assets/index.5d8b303d.css"]),meta:{name:"\u67E5\u8BE2\u5217\u8868"}},{path:"/detail",name:"Detail",component:()=>c(()=>import("./detail.a41006cc.js"),["assets/detail.a41006cc.js","assets/detail.abd94802.css","assets/index.6016b074.js","assets/index.09488a1e.css","assets/vendor.2a4ecb5d.js","assets/index.7e396206.js","assets/index.5d8b303d.css"]),meta:{name:"\u62BD\u67E5\u8BE6\u60C5"}}],R=f({history:p("/ck"),routes:A});var I=h({state(){return{}},mutations:{increment(n){n.count+=1}},actions:{increment(n){n.commit("increment")}},getters:{double(n){return 2*n.count}}});v(O).use(R).use(I).use(y).mount("#app");export{E as _};
