if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const f=e=>n(e,o),c={module:{uri:o},exports:t,require:f};i[o]=Promise.all(s.map((e=>c[e]||f(e)))).then((e=>(r(...e),t)))}}define(["./workbox-a879e9f2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CZBijGyO.js",revision:null},{url:"assets/index-FgZBA8F5.css",revision:null},{url:"index.html",revision:"96fbd6fd7e4d07057428f43031f77a0a"},{url:"registerSW.js",revision:"c59f69a97e2e064aad24de3ebfc9ea47"},{url:"favicon.ico",revision:"f2413d192135c1f5194f5e7016a8a4d0"},{url:"pwa-192x192.png",revision:"befb82638ebfb5c672ec7f706c36f760"},{url:"pwa-512x512.png",revision:"65d2283264dbc6fc7c46ed485302b02b"},{url:"manifest.webmanifest",revision:"1da272a70398ccb27a90511f25b832ac"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
