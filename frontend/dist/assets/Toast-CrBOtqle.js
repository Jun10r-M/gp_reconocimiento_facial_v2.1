var u=Object.defineProperty;var g=(r,t,e)=>t in r?u(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var d=(r,t,e)=>g(r,typeof t!="symbol"?t+"":t,e);class x{static getContainer(){return this.container||(this.container=document.createElement("div"),this.container.id="custom-toast-container",this.container.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `,document.body.appendChild(this.container)),this.container}static show(t,e="info",b=3500){const p=this.getContainer(),o=document.createElement("div");o.className=`custom-toast toast-${e}`;let s="",i="",n="",a="";switch(e){case"success":s="✓",i="#10b981",n="rgba(16, 185, 129, 0.08)",a="rgba(16, 185, 129, 0.2)";break;case"error":s="✕",i="#ef4444",n="rgba(239, 68, 68, 0.08)",a="rgba(239, 68, 68, 0.2)";break;case"warning":s="⚠",i="#fbbf24",n="rgba(251, 191, 36, 0.08)",a="rgba(251, 191, 36, 0.2)";break;case"info":default:s="ℹ",i="#3b82f6",n="rgba(59, 130, 246, 0.08)",a="rgba(59, 130, 246, 0.2)";break}o.style.cssText=`
      display: flex;
      align-items: center;
      gap: 12px;
      background: ${n};
      border: 1px solid ${a};
      border-left: 4px solid ${i};
      color: white;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      pointer-events: auto;
      min-width: 300px;
      max-width: 420px;
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
    `,o.innerHTML=`
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        color: ${i};
        font-weight: bold;
        font-size: 0.85rem;
        flex-shrink: 0;
      ">${s}</div>
      <div style="flex-grow: 1; line-height: 1.4;">${t}</div>
      <button type="button" class="toast-close-btn" style="
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 300;
        padding: 0 5px;
        line-height: 1;
        transition: color 0.15s;
      ">&times;</button>
    `,p.appendChild(o),requestAnimationFrame(()=>{o.style.transform="translateX(0)",o.style.opacity="1"});const l=()=>{o.style.transform="translateX(120%)",o.style.opacity="0",setTimeout(()=>{o.remove()},400)},c=o.querySelector(".toast-close-btn");c==null||c.addEventListener("click",()=>{l()});const h=setTimeout(l,b);o.addEventListener("mouseenter",()=>{clearTimeout(h)})}static success(t,e){this.show(t,"success",e)}static error(t,e){this.show(t,"error",e)}static warning(t,e){this.show(t,"warning",e)}static info(t,e){this.show(t,"info",e)}}d(x,"container",null);export{x as T};
