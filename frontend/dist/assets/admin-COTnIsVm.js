var O=Object.defineProperty;var J=(k,y,e)=>y in k?O(k,y,{enumerable:!0,configurable:!0,writable:!0,value:e}):k[y]=e;var c=(k,y,e)=>J(k,typeof y!="symbol"?y+"":y,e);import"./modulepreload-polyfill-B5Qt9EMX.js";import{T as m}from"./Toast-CrBOtqle.js";class L{constructor(y){c(this,"container");this.container=y}onInit(){}onDestroy(){}getAuthHeaders(){return{Authorization:`Bearer ${localStorage.getItem("auth_token")}`,"Content-Type":"application/json"}}hasScope(y){const e=localStorage.getItem("auth_scopes")||"[]";try{return JSON.parse(e).includes(y)}catch{return!1}}canWrite(y){return this.hasScope(`${y}:create`)||this.hasScope(`${y}:update`)||this.hasScope(`${y}:delete`)}}class U extends L{constructor(e,n,t){super(e);c(this,"activeSection");c(this,"onNavigate");c(this,"icons",{folder:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',users:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',settings:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',rect:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',resumen:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',asistencia:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',calendar:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',planilla:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',dollar:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',empleados:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',justificaciones:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',alert:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',turnos:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',clock:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',terminales:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>',cpu:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>',auditoria:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',"file-text":'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',administradores:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',"user-check":'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',prediccion:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',brain:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path></svg>',seguridad:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',lock:'<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'});c(this,"labels",{resumen:"Resumen",asistencia:"Asistencia",planilla:"Planilla",empleados:"Empleados",justificaciones:"Justificaciones",turnos:"Turnos",terminales:"Terminales",auditoria:"Auditoría",administradores:"Administradores",prediccion:"Predicción IA",seguridad:"Seguridad y RBAC"});this.activeSection=n,this.onNavigate=t}render(){const e=localStorage.getItem("auth_menu_details");let n=[];try{e&&(n=JSON.parse(e))}catch(s){console.error("Error parsing menu details",s)}let t="";if(n.length===0){const s=localStorage.getItem("auth_menus")||"[]";let a=[];try{a=JSON.parse(s)}catch{a=[]}a.forEach(o=>{const r=this.icons[o]||this.icons.folder,d=this.labels[o]||o,p=this.activeSection===o?'class="active"':"";t+=`
          <li ${p} data-section="${o}">
            ${r}
            <span class="nav-text">${d}</span>
          </li>
        `}),this.container.innerHTML=`
        <div class="sidebar-header">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
           <h5 class="sidebar-title">Kioga Computer Store</h5>
            <button id="sidebar-collapse-btn" class="sidebar-toggle-btn" title="Contraer/Expandir Menú">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          </div>
          <p class="sidebar-subtitle">RRHH v2.3</p>
        </div>
        <ul class="nav-links">
          ${t}
        </ul>
      `;return}n.filter(s=>s.parent_id===null||s.parent_id===void 0).forEach(s=>{const a=n.filter(d=>d.parent_id===s.id);if(a.length===0)return;const r=a.some(d=>d.key===this.activeSection)?"":"collapsed";t+=`
        <div class="sidebar-group ${r}" data-group-id="${s.id}">
          <div class="sidebar-group-header">
            <span class="sidebar-group-title">${s.label}</span>
            <span class="sidebar-group-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
          <div class="sidebar-group-content">
      `,a.forEach(d=>{const p=this.icons[d.icon]||this.icons[d.key]||this.icons.rect,l=this.activeSection===d.key?'class="active"':"";t+=`
          <li ${l} data-section="${d.key}">
            ${p}
            <span class="nav-text">${d.label}</span>
          </li>
        `}),t+=`
          </div>
        </div>
      `}),this.container.innerHTML=`
      <div class="sidebar-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <h5 class="sidebar-title">Kioga Computer Store</h5>
          <button id="sidebar-collapse-btn" class="sidebar-toggle-btn" title="Contraer/Expandir Menú">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        </div>
        <p class="sidebar-subtitle">RRHH v2.3</p>
      </div>
      <ul class="nav-links" style="list-style: none; flex-grow: 1;">
        ${t}
      </ul>
    `}onInit(){(()=>{const i=this.container.querySelectorAll(".nav-links li");i.forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-section");a&&(i.forEach(o=>o.classList.remove("active")),s.classList.add("active"),this.activeSection=a,this.onNavigate(a))})})})(),this.container.querySelectorAll(".sidebar-group-header").forEach(i=>{i.addEventListener("click",()=>{const s=i.closest(".sidebar-group");s&&s.classList.toggle("collapsed")})});const t=this.container.querySelector("#sidebar-collapse-btn");t&&t.addEventListener("click",()=>{this.container.classList.toggle("collapsed")})}setActiveSection(e){this.activeSection=e,this.container.querySelectorAll(".nav-links li").forEach(t=>{const i=t.getAttribute("data-section")===e;if(t.classList.toggle("active",i),i){const s=t.closest(".sidebar-group");s&&s.classList.remove("collapsed")}})}}class G extends L{constructor(){super(...arguments);c(this,"chartInstance",null);c(this,"allProcessed",[])}render(){this.container.innerHTML=`
      <section id="section-resumen" class="dashboard-section animate-fade-in">
        <div class="filter-date-bar" style="display:flex;gap:16px;align-items:center;margin-bottom:24px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="color:#9ca3af;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Desde</label>
            <input type="date" id="filter-date-from" style="background:#1c2333;border:1px solid #2d3748;color:#f0f6fc;padding:10px 14px;border-radius:10px;font-family:Outfit,sans-serif;outline:none;">
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="color:#9ca3af;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Hasta</label>
            <input type="date" id="filter-date-to" style="background:#1c2333;border:1px solid #2d3748;color:#f0f6fc;padding:10px 14px;border-radius:10px;font-family:Outfit,sans-serif;outline:none;">
          </div>
          <button id="filter-date-btn" style="background:#e74c3c;color:white;border:none;padding:10px 24px;border-radius:10px;font-weight:600;cursor:pointer;font-family:Outfit,sans-serif;">Filtrar</button>
          <button id="filter-date-clear" style="background:#2d3748;color:#9ca3af;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-family:Outfit,sans-serif;">Limpiar</button>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <h3 id="stat-att-label">Asistencias de Hoy</h3>
            <p id="stat-total-att">Cargando...</p>
          </div>
          <div class="stat-card">
            <h3 id="stat-pay-label">Planilla Total</h3>
            <p id="stat-total-pay">Cargando...</p>
          </div>
        </div>
        <div class="chart-container" style="position: relative; height: 350px; width: 100%;">
          <canvas id="mainChart"></canvas>
        </div>
      </section>
    `}async onInit(){try{const e=await fetch("/data",{headers:this.getAuthHeaders()});if(e.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}const n=await e.json(),t=n.attendance||[],i=n.employees||[];this.allProcessed=this.processAttendance(t,i);this.applyFilter();const btnFilter=document.getElementById("filter-date-btn");const btnClear=document.getElementById("filter-date-clear");if(btnFilter)btnFilter.addEventListener("click",()=>this.applyFilter());if(btnClear)btnClear.addEventListener("click",()=>{const f=document.getElementById("filter-date-from");const t=document.getElementById("filter-date-to");if(f)f.value="";if(t)t.value="";this.applyFilter()})}catch(e){console.error("Error al cargar resumen:",e)}}applyFilter(){const fromEl=document.getElementById("filter-date-from");const toEl=document.getElementById("filter-date-to");const fromVal=fromEl?fromEl.value:"";const toVal=toEl?toEl.value:"";const today=new Date().toISOString().split("T")[0];let filtered=this.allProcessed;const attLabel=document.getElementById("stat-att-label");const payLabel=document.getElementById("stat-pay-label");if(fromVal||toVal){filtered=this.allProcessed.filter(p=>{if(fromVal&&p.fecha<fromVal)return false;if(toVal&&p.fecha>toVal)return false;return true});if(attLabel)attLabel.innerText=fromVal===toVal&&fromVal?"Asistencias del "+fromVal:"Asistencias (Filtrado)";if(payLabel)payLabel.innerText="Planilla (Filtrado)"}else{filtered=this.allProcessed;if(attLabel)attLabel.innerText="Asistencias de Hoy";if(payLabel)payLabel.innerText="Planilla Total"}const a=document.getElementById("stat-total-att");const o=document.getElementById("stat-total-pay");if(!fromVal&&!toVal){if(a)a.innerText=this.allProcessed.filter(x=>x.fecha===today).length.toString()}else{if(a)a.innerText=filtered.length.toString()}const totalPay=filtered.reduce((s,p)=>s+(p.pago||0),0);if(o)o.innerText=`S/ ${totalPay.toFixed(2)}`;this.renderChart(filtered)}onDestroy(){this.chartInstance&&(this.chartInstance.destroy(),this.chartInstance=null)}processAttendance(e,n){const t={};return e.forEach(i=>{const s=i.timestamp;if(!s)return;const a=new Date(s.replace(" ","T"));if(isNaN(a.getTime()))return;const o=a.toISOString().split("T")[0],r=`${i.employee_id}_${o}`;if(!t[r]){const d=n.find(p=>p.id===i.employee_id)||{};t[r]={id:i.employee_id,nombre:d.full_name||i.nombre||"Desconocido",fecha:o,pago:(d.monthly_salary||1500)/30,timestamps:[]}}t[r].timestamps.push(a)}),Object.values(t)}renderChart(e){const n=document.getElementById("mainChart");if(!n)return;const t=n.getContext("2d");if(!t)return;const i={};e.forEach(r=>{i[r.fecha]||(i[r.fecha]={count:0,names:[]}),i[r.fecha].count++,i[r.fecha].names.push(r.nombre)});const s=Object.keys(i).sort(),a=s.map(r=>i[r].count),o=s.map(r=>i[r].names);this.chartInstance&&this.chartInstance.destroy(),this.chartInstance=new Chart(t,{type:"line",data:{labels:s,datasets:[{label:"Asistencias",data:a,borderColor:"#ef4444",backgroundColor:"rgba(239, 68, 68, 0.1)",tension:.4,fill:!0,pointBackgroundColor:"#ef4444",pointRadius:4,pointHoverRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"#1f2937",titleColor:"#fff",bodyColor:"#9ca3af",borderColor:"#ef4444",borderWidth:1,padding:12,displayColors:!1,callbacks:{label:function(r){const d=o[r.dataIndex];return[`Total: ${r.raw} empleados`,`Asistieron: ${d.join(", ")}`]}}}},scales:{y:{beginAtZero:!0,grid:{color:"#374151"},ticks:{color:"#9ca3af",stepSize:1}},x:{grid:{display:!1},ticks:{color:"#9ca3af"}}}}})}}class $ extends L{constructor(e,n){super(e);c(this,"config");this.config=n}render(){const{label:e="",name:n,type:t="text",required:i=!1,value:s="",placeholder:a="",minlength:o,autocomplete:r=""}=this.config,d=e?`<label>${e}</label>`:"",p=e?"":"margin-bottom: 0;";let l="";t==="textarea"?l=`
        <textarea 
          name="${n}" 
          ${i?"required":""} 
          placeholder="${a}"
          ${o?`minlength="${o}"`:""}
          style="width: 100%; min-height: 100px;"
          class="custom-input-field"
        >${s}</textarea>
      `:l=`
        <input 
          type="${t}" 
          name="${n}" 
          ${i?"required":""} 
          value="${s}" 
          placeholder="${a}"
          ${o?`minlength="${o}"`:""}
          ${r?`autocomplete="${r}"`:""}
          style="width: 100%;"
          class="custom-input-field"
        >
      `,this.container.innerHTML=`
      <div class="custom-form-group" style="${p}">
        ${d}
        ${l}
      </div>
    `}getValue(){const e=this.container.querySelector("input, textarea");return e?e.value.trim():""}setValue(e){const n=this.container.querySelector("input, textarea");n&&(n.value=e)}setDisabled(e){const n=this.container.querySelector("input, textarea");n&&(e?n.setAttribute("disabled","true"):n.removeAttribute("disabled"))}setRequired(e){const n=this.container.querySelector("input, textarea");n&&(e?n.setAttribute("required","true"):n.removeAttribute("required"))}}class T extends L{constructor(e,n){super(e);c(this,"config");c(this,"selectedValue","");c(this,"isOpen",!1);c(this,"isDisabled",!1);c(this,"searchTerm","");c(this,"dropdownEl",null);c(this,"triggerEl",null);c(this,"_scrollHandler",null);c(this,"_closeHandler",null);c(this,"_resizeHandler",null);this.config=n,this.selectedValue=n.defaultValue!==void 0?n.defaultValue:""}render(){const{label:e="",name:n,placeholder:t="-- Seleccionar Opción --"}=this.config,i=this.config.options.find(g=>g.value==this.selectedValue),s=i?i.label:t,a=e?`<label>${e}</label>`:"",o=e?"":"margin-bottom: 0;";this._destroyDropdown();const r=this.isDisabled?"disabled":"",d=this.isDisabled?"-1":"0";this.container.innerHTML=`
      <div class="custom-form-group select-container" style="${o}">
        ${a}
        <input type="hidden" name="${n}" value="${this.selectedValue}">
        <div class="custom-select-wrapper">
          <div class="custom-select-trigger ${r}" tabindex="${d}">
            <span class="selected-label">${s}</span>
          </div>
        </div>
      </div>
    `;const p=document.createElement("div");p.className="custom-select-options custom-select-fixed",p.style.cssText="position: fixed; display: none; z-index: 99999; min-width: 80px;";const u=this.config.options.length>5?`
      <div style="padding: 10px; border-bottom: 1px solid var(--border); margin-bottom: 5px; flex-shrink: 0;">
        <input type="text" class="custom-select-search" placeholder="Filtrar opciones..." style="width: 100%; padding: 8px 12px; background: #06080d; border: 1px solid var(--border); border-radius: 8px; color: white; font-family: inherit; font-size: 0.85rem; outline: none; box-sizing: border-box;">
      </div>
    `:"";p.innerHTML=`
      ${u}
      <div class="options-list-container" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
      </div>
    `,document.body.appendChild(p),this.dropdownEl=p,this.triggerEl=this.container.querySelector(".custom-select-trigger"),this.renderOptions(),this.setupListeners()}renderOptions(){const e=(this.dropdownEl||this.container).querySelector(".options-list-container");if(!e)return;const n=this.config.options.filter(t=>t.label.toLowerCase().includes(this.searchTerm.toLowerCase()));if(n.length===0){e.innerHTML='<div style="padding: 10px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Sin resultados</div>';return}e.innerHTML=n.map(t=>`
        <div class="custom-select-option ${t.value==this.selectedValue?"selected":""}" data-value="${t.value}">
          ${t.label}
        </div>
      `).join(""),e.querySelectorAll(".custom-select-option").forEach(t=>{t.addEventListener("click",i=>{const s=i.currentTarget.getAttribute("data-value")||"";this.selectValue(s)})})}_positionDropdown(){if(!this.triggerEl||!this.dropdownEl)return;const e=this.triggerEl.getBoundingClientRect();let n=this.dropdownEl.offsetHeight||this.dropdownEl.scrollHeight||180;n<100&&(n=180);const t=window.innerHeight-e.bottom,i=e.top,s=t<n&&i>t;this.dropdownEl.style.left=`${e.left}px`,this.dropdownEl.style.width=`${e.width}px`,s?(this.dropdownEl.style.top="auto",this.dropdownEl.style.bottom=`${window.innerHeight-e.top+6}px`):(this.dropdownEl.style.bottom="auto",this.dropdownEl.style.top=`${e.bottom+6}px`)}_openDropdown(){if(this.isDisabled||!this.dropdownEl||!this.triggerEl)return;this.isOpen=!0,this.dropdownEl.style.display="flex",this._positionDropdown(),this.dropdownEl.classList.add("open"),this.triggerEl.classList.add("active");const e=this.dropdownEl.querySelector(".custom-select-search");e==null||e.focus()}_closeDropdown(){!this.dropdownEl||!this.triggerEl||(this.isOpen=!1,this.dropdownEl.style.display="none",this.dropdownEl.classList.remove("open"),this.triggerEl.classList.remove("active"))}_destroyDropdown(){this.dropdownEl&&this.dropdownEl.parentNode&&this.dropdownEl.parentNode.removeChild(this.dropdownEl),this.dropdownEl=null,this._closeHandler&&(document.removeEventListener("click",this._closeHandler),this._closeHandler=null),this._scrollHandler&&(window.removeEventListener("scroll",this._scrollHandler,!0),this._scrollHandler=null),this._resizeHandler&&(window.removeEventListener("resize",this._resizeHandler),this._resizeHandler=null)}setupListeners(){const e=this.triggerEl,n=this.dropdownEl,t=n==null?void 0:n.querySelector(".custom-select-search");e==null||e.addEventListener("click",i=>{i.stopPropagation(),!this.isDisabled&&(this.isOpen?this._closeDropdown():this._openDropdown())}),t==null||t.addEventListener("input",i=>{this.searchTerm=i.target.value,this.renderOptions()}),this._closeHandler=i=>{this.isOpen&&n&&!n.contains(i.target)&&!(e!=null&&e.contains(i.target))&&this._closeDropdown()},document.addEventListener("click",this._closeHandler),this._scrollHandler=()=>{this.isOpen&&this._positionDropdown()},window.addEventListener("scroll",this._scrollHandler,!0),this._resizeHandler=()=>{this.isOpen&&this._positionDropdown()},window.addEventListener("resize",this._resizeHandler),n==null||n.addEventListener("click",i=>{i.stopPropagation()})}selectValue(e){this.selectedValue=e;const n=this.container.querySelector('input[type="hidden"]');n&&(n.value=`${e}`);const t=this.container.querySelector(".selected-label"),i=this.config.options.find(a=>a.value==e);t&&i?t.textContent=i.label:t&&(t.textContent=this.config.placeholder||"-- Seleccionar Opción --"),this._closeDropdown();const s=this.container.querySelector('input[type="hidden"]');if(s){const a=new Event("change",{bubbles:!0});s.dispatchEvent(a)}this.config.onChange&&this.config.onChange(e)}getValue(){return this.selectedValue}setValue(e){this.selectValue(e)}setOptions(e){this.config.options=e,this.renderOptions()}setDisabled(e){this.isDisabled=e,this.triggerEl&&(e?(this.triggerEl.classList.add("disabled"),this.triggerEl.setAttribute("tabindex","-1")):(this.triggerEl.classList.remove("disabled"),this.triggerEl.setAttribute("tabindex","0")))}destroy(){this._destroyDropdown()}}class H extends L{constructor(e,n){super(e);c(this,"config");c(this,"selectedDate","");c(this,"currentYear");c(this,"currentMonth");c(this,"isOpen",!1);this.config=n;const t=n.defaultValue!==void 0?n.defaultValue:new Date().toISOString().split("T")[0];this.selectedDate=t;const s=(t||new Date().toISOString().split("T")[0]).split("-");this.currentYear=parseInt(s[0]),this.currentMonth=parseInt(s[1])-1}render(){const{label:e="",name:n,placeholder:t="Seleccionar fecha"}=this.config,i=e?`<label>${e}</label>`:"",s=e?"":"margin-bottom: 0;";this.container.innerHTML=`
      <div class="custom-form-group calendar-container" style="${s}">
        ${i}
        <input type="hidden" name="${n}" value="${this.selectedDate}">

        <!-- Trigger del calendario -->
        <div class="custom-calendar-trigger custom-select-trigger" tabindex="0">
          <span class="selected-date-label">${this.selectedDate?this.formatDateLabel(this.selectedDate):t}</span>
        </div>

        <!-- Panel flotante del calendario -->
        <div class="custom-calendar-panel hidden" style="position: absolute; top: 100%; left: 0; width: 280px; background: #0b0f19; border: 1px solid var(--border); border-radius: 10px; z-index: 1000; margin-top: 5px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 15px; user-select: none;">
          <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <button type="button" class="btn-prev-month" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 1rem; padding: 5px;">◀</button>
            <span class="month-year-label" style="font-weight: 600; font-size: 0.9rem; color: white;">Mes Año</span>
            <button type="button" class="btn-next-month" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 1rem; padding: 5px;">▶</button>
          </div>
          <div class="calendar-days-header" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px;">
            <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
          </div>
          <div class="calendar-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center; font-size: 0.8rem;">
            <!-- Cargar celdas de días -->
          </div>
          <div class="calendar-footer" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end;">
            <button type="button" class="btn-clear-date" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.75rem; font-weight: 600; padding: 2px 5px;">Limpiar</button>
          </div>
        </div>
      </div>
    `,this.renderMonthDays(),this.setupListeners()}renderMonthDays(){const e=this.container.querySelector(".calendar-days-grid"),n=this.container.querySelector(".month-year-label");if(!e||!n)return;const t=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];n.textContent=`${t[this.currentMonth]} ${this.currentYear}`;const i=new Date(this.currentYear,this.currentMonth,1).getDay(),s=i===0?6:i-1,a=new Date(this.currentYear,this.currentMonth+1,0).getDate();let o="";for(let d=0;d<s;d++)o+='<span style="color: transparent;">-</span>';const r=new Date().toISOString().split("T")[0];for(let d=1;d<=a;d++){const p=`${this.currentYear}-${String(this.currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`,l=p===this.selectedDate,u=p===r;let g="padding: 6px 0; border-radius: 6px; cursor: pointer; transition: all 0.15s; display: block;";l?g+=" background: var(--primary); color: white; font-weight: bold;":u?g+=" border: 1px solid var(--primary); color: var(--primary);":g+=" color: white;",o+=`
        <span class="calendar-day-item" data-date="${p}" style="${g}" onmouseover="if(!${l}) this.style.background='rgba(255,255,255,0.05)'" onmouseout="if(!${l}) this.style.background='transparent'">
          ${d}
        </span>
      `}e.innerHTML=o,e.querySelectorAll(".calendar-day-item").forEach(d=>{d.addEventListener("click",p=>{const l=p.currentTarget.getAttribute("data-date")||"";this.selectDate(l)})})}setupListeners(){const e=this.container.querySelector(".custom-calendar-trigger"),n=this.container.querySelector(".custom-calendar-panel"),t=this.container.querySelector(".btn-prev-month"),i=this.container.querySelector(".btn-next-month");e==null||e.addEventListener("click",a=>{a.stopPropagation(),this.isOpen=!this.isOpen,this.isOpen?(e.classList.add("active"),n==null||n.classList.remove("hidden")):(e.classList.remove("active"),n==null||n.classList.add("hidden"))}),t==null||t.addEventListener("click",a=>{a.stopPropagation(),this.currentMonth--,this.currentMonth<0&&(this.currentMonth=11,this.currentYear--),this.renderMonthDays()}),i==null||i.addEventListener("click",a=>{a.stopPropagation(),this.currentMonth++,this.currentMonth>11&&(this.currentMonth=0,this.currentYear++),this.renderMonthDays()}),document.addEventListener("click",()=>{this.isOpen&&(this.isOpen=!1,e==null||e.classList.remove("active"),n==null||n.classList.add("hidden"))});const s=this.container.querySelector(".btn-clear-date");s==null||s.addEventListener("click",a=>{a.stopPropagation(),this.selectDate("")}),n==null||n.addEventListener("click",a=>{a.stopPropagation()})}selectDate(e){this.selectedDate=e;const n=this.container.querySelector('input[type="hidden"]');n&&(n.value=e);const t=this.container.querySelector(".selected-date-label");t&&(t.textContent=e?this.formatDateLabel(e):this.config.placeholder||"Seleccionar fecha"),this.isOpen=!1;const i=this.container.querySelector(".custom-calendar-trigger"),s=this.container.querySelector(".custom-calendar-panel");i==null||i.classList.remove("active"),s==null||s.classList.add("hidden"),this.config.onChange&&this.config.onChange(e)}formatDateLabel(e){const n=e.split("-");return n.length!==3?e:`${n[2]}/${n[1]}/${n[0]}`}getValue(){return this.selectedDate}setValue(e){this.selectDate(e);const n=e.split("-");n.length===3&&(this.currentYear=parseInt(n[0]),this.currentMonth=parseInt(n[1])-1,this.renderMonthDays())}}class W extends L{constructor(e,n){super(e);c(this,"config");c(this,"isChecked",!1);this.config=n,this.isChecked=!!n.checked}render(){const{label:e,name:n,required:t=!1}=this.config,i=`chk_${n}_${Math.random().toString(36).substring(2,9)}`;this.container.innerHTML=`
      <div class="custom-form-group checkbox-container" style="display: flex; align-items: center; gap: 10px; margin-bottom: 22px;">
        <div class="custom-checkbox-wrapper" style="position: relative; display: inline-flex; align-items: center; cursor: pointer;">
          <input 
            type="checkbox" 
            id="${i}" 
            name="${n}" 
            ${t?"required":""} 
            ${this.isChecked?"checked":""}
            style="position: absolute; opacity: 0; width: 0; height: 0;"
          >
          <div class="custom-checkbox-box" style="
            width: 20px; 
            height: 20px; 
            border: 1px solid var(--border); 
            border-radius: 6px; 
            background: #0f172a; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.2s ease-in-out;
          ">
            <svg class="custom-checkbox-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="
              color: white; 
              display: ${this.isChecked?"block":"none"};
            ">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label for="${i}" style="margin-left: 10px; cursor: pointer; user-select: none; font-size: 0.9rem; color: var(--text); margin-bottom: 0; text-transform: none; letter-spacing: normal;">
            ${e}
          </label>
        </div>
      </div>
    `,this.setupListeners(i)}setupListeners(e){const n=this.container.querySelector(`#${e}`),t=this.container.querySelector(".custom-checkbox-box"),i=this.container.querySelector(".custom-checkbox-icon");if(!n||!t||!i)return;n.addEventListener("change",()=>{this.isChecked=n.checked,this.updateVisualState(t,i),this.config.onChange&&this.config.onChange(this.isChecked)});const s=n.form;s&&s.addEventListener("reset",()=>{setTimeout(()=>{this.isChecked=n.checked,this.updateVisualState(t,i)},0)}),this.updateVisualState(t,i)}updateVisualState(e,n){this.isChecked?(e.style.background="var(--primary)",e.style.borderColor="var(--primary)",e.style.boxShadow="0 0 8px var(--primary-glow)",n.style.display="block"):(e.style.background="#0f172a",e.style.borderColor="var(--border)",e.style.boxShadow="none",n.style.display="none")}getValue(){return this.isChecked}setValue(e){this.isChecked=e;const n=this.container.querySelector('input[type="checkbox"]'),t=this.container.querySelector(".custom-checkbox-box"),i=this.container.querySelector(".custom-checkbox-icon");n&&(n.checked=e),t&&i&&this.updateVisualState(t,i)}}const z=class z{constructor(){c(this,"container");this.container=document.createElement("div"),this.container.id="custom-confirm-dialog-container",document.body.appendChild(this.container)}static ask(y,e="Confirmar Acción"){return this.instance||(this.instance=new z),this.instance.show(y,e)}show(y,e){return new Promise(n=>{this.container.innerHTML=`
        <div class="modal" style="z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);">
          <div class="modal-content" style="max-width: 450px; width: 100%; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); padding: 25px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="font-size: 1.25rem; font-weight: 600; color: #fff; margin: 0;">${e}</h2>
            </div>
            <div class="modal-body" style="margin-bottom: 24px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; text-align: left;">
              ${y}
            </div>
            <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
              <button id="confirm-cancel-btn" type="button" class="btn-primary" style="padding: 10px 20px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text); font-family: inherit; font-size: 0.9rem; cursor: pointer; transition: var(--transition); width: auto;">
                Cancelar
              </button>
              <button id="confirm-ok-btn" type="button" class="btn-primary" style="padding: 10px 20px; border-radius: 10px; border: none; background: var(--danger); color: white; font-family: inherit; font-size: 0.9rem; cursor: pointer; transition: var(--transition); width: auto;">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      `;const t=this.container.querySelector("#confirm-cancel-btn"),i=this.container.querySelector("#confirm-ok-btn");t&&(t.addEventListener("mouseenter",()=>{t.style.background="rgba(255, 255, 255, 0.05)",t.style.borderColor="var(--border-hover)"}),t.addEventListener("mouseleave",()=>{t.style.background="transparent",t.style.borderColor="var(--border)"})),i&&(i.addEventListener("mouseenter",()=>{i.style.background="var(--danger-hover)"}),i.addEventListener("mouseleave",()=>{i.style.background="var(--danger)"}));const s=()=>{this.container.innerHTML="",document.removeEventListener("keydown",a)};t==null||t.addEventListener("click",()=>{s(),n(!1)}),i==null||i.addEventListener("click",()=>{s(),n(!0)});const a=o=>{o.key==="Escape"?(s(),n(!1)):o.key==="Enter"&&(s(),n(!0))};document.addEventListener("keydown",a)})}};c(z,"instance",null);let _=z;class j extends L{constructor(e,n){super(e);c(this,"config");c(this,"limitSelect",null);this.config=n}render(){this.limitSelect&&(this.limitSelect.destroy(),this.limitSelect=null);const{page:e,limit:n,total:t,pages:i}=this.config,s=i>0?i:1,a=f=>`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${f?"rgba(255, 255, 255, 0.01)":"rgba(255, 255, 255, 0.04)"};
      border: 1px solid ${f?"rgba(255, 255, 255, 0.03)":"var(--border)"};
      color: ${f?"rgba(255, 255, 255, 0.15)":"white"};
      cursor: ${f?"not-allowed":"pointer"};
      pointer-events: ${f?"none":"auto"};
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
      padding: 0;
    `.replace(/\s+/g," ").trim(),o=a(e<=1),r=a(e>=s),d='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>',p='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',l='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',u='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>';this.container.innerHTML=`
      <div class="pagination-container" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; background: rgba(15, 23, 42, 0.4); border-top: 1px solid var(--border); border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; flex-wrap: wrap; gap: 15px; width: 100%; box-sizing: border-box;">
        
        <!-- Límite de página -->
        <div class="pagination-limit-group" style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-muted);">
          <span>Mostrar</span>
          <div class="pagination-limit-select-container" style="width: 80px; position: relative;"></div>
          <span>por página</span>
        </div>

        <!-- Botones de Navegación -->
        <div class="pagination-buttons" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn-page btn-page-first" ${e<=1?"disabled":""} style="${o}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${d}
          </button>
          <button type="button" class="btn-page btn-page-prev" ${e<=1?"disabled":""} style="${o}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${p}
          </button>
          
          <span style="font-size: 0.85rem; color: var(--text-muted); margin: 0 8px; font-family: inherit; user-select: none;">
            Página <strong style="color: white; font-weight: 600;">${e}</strong> de <strong style="color: white; font-weight: 600;">${s}</strong>
          </span>

          <button type="button" class="btn-page btn-page-next" ${e>=s?"disabled":""} style="${r}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${l}
          </button>
          <button type="button" class="btn-page btn-page-last" ${e>=s?"disabled":""} style="${r}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${u}
          </button>
        </div>

        <!-- Indicador de total -->
        <div class="pagination-info" style="font-size: 0.85rem; color: var(--text-muted); font-family: inherit; user-select: none;">
          Total: <strong style="color: white; font-weight: 600;">${t}</strong> registros
        </div>

      </div>
    `;const g=this.container.querySelector(".pagination-limit-select-container");g&&(this.limitSelect=new T(g,{name:"pagination_limit",options:[{value:10,label:"10"},{value:25,label:"25"},{value:50,label:"50"}],defaultValue:n,placeholder:`${n}`,onChange:f=>{this.config.onChangeLimit(Number(f))}}),this.limitSelect.render()),this.setupListeners()}setupListeners(){const e=this.container.querySelector(".btn-page-first");e==null||e.addEventListener("click",()=>{this.config.page>1&&this.config.onChangePage(1)});const n=this.container.querySelector(".btn-page-prev");n==null||n.addEventListener("click",()=>{this.config.page>1&&this.config.onChangePage(this.config.page-1)});const t=this.container.querySelector(".btn-page-next");t==null||t.addEventListener("click",()=>{this.config.page<this.config.pages&&this.config.onChangePage(this.config.page+1)});const i=this.container.querySelector(".btn-page-last");i==null||i.addEventListener("click",()=>{const s=this.config.pages>0?this.config.pages:1;this.config.page<s&&this.config.onChangePage(s)})}}const Y='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',K='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',Z='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-2.3.9-4.4 2.4-6"/><path d="M17.6 6A8 8 0 0 1 20 12c0 2.6-.5 5-1.5 7"/><path d="M12 8a4 4 0 0 1 4 4c0 1.7-.3 3.3-1 4.8"/><path d="M9 13a7 7 0 0 0 .5 2.5"/><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>',X='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';class Q extends L{constructor(){super(...arguments);c(this,"employees",[]);c(this,"editingEmployeeId",null);c(this,"currentPage",1);c(this,"pageSize",10);c(this,"totalRecords",0);c(this,"totalPages",0);c(this,"currentSearch","");c(this,"contractsCurrentPage",1);c(this,"contractsPageSize",10);c(this,"contractsTotalRecords",0);c(this,"contractsTotalPages",0);c(this,"currentContractsEmpId",null);c(this,"currentContractsEmpName","");c(this,"firstNamesInput",null);c(this,"lastNamesInput",null);c(this,"documentNumberInput",null);c(this,"emailInput",null);c(this,"phoneInput",null);c(this,"pensionSystemSelect",null);c(this,"hasChildrenCheckbox",null);c(this,"fingerprintDataInput",null);c(this,"contractPositionInput",null);c(this,"contractMonthlySalaryInput",null);c(this,"contractStartDateCalendar",null);c(this,"contractEndDateCalendar",null)}render(){const e=this.canWrite("employees");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="emp-search" placeholder="Buscar empleados DNI/nombre..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${e?'<button id="btn-new-emp" class="btn-primary">+ Nuevo Empleado</button>':""}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Cargo / Puesto</th>
                <th>Sueldo Mensual</th>
                <th>Pensiones</th>
                <th>Hijos</th>
                <th style="text-align: center;">Acciones</th>
              </tr>
            </thead>
            <tbody id="employees-table-body">
              <tr><td colspan="7" style="text-align: center;">Cargando empleados...</td></tr>
            </tbody>
          </table>
          <div id="employees-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Registrar / Editar Empleado -->
      <div id="modal-emp" class="modal hidden">
        <div class="modal-content" style="max-width: 700px;">
          <div class="modal-header">
            <h2 id="modal-emp-title">Registrar Nuevo Empleado</h2>
            <span class="close-modal" id="close-modal-emp">&times;</span>
          </div>
          <form id="form-emp" class="modal-form">
            <div class="form-grid">
              <div id="emp-first-names-container"></div>
              <div id="emp-last-names-container"></div>
              <div id="emp-document-number-container"></div>
              <div id="emp-email-container"></div>
              <div id="emp-phone-container"></div>
              <div id="emp-pension-system-container"></div>
              <div id="emp-has-children-container" style="grid-column: span 2;"></div>
              <div class="custom-form-group" style="grid-column: span 2;">
                <label id="foto-label">Foto de Rostro (Reconocimiento Facial)</label>
                <input type="file" name="foto" id="emp-foto-input" accept="image/*" required>
              </div>
            </div>
            <button type="submit" id="btn-emp-submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Registrar Empleado</button>
          </form>
        </div>
      </div>

      <!-- Modal Historial de Contratos / Promoción Unificado -->
      <div id="modal-contracts" class="modal hidden">
        <div class="modal-content" style="max-width: 1050px; width: 95%; display: flex; flex-direction: column; gap: 20px;">
          <div class="modal-header">
            <h2 id="contracts-title">Historial Laboral</h2>
            <span class="close-modal" id="close-modal-contracts">&times;</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Tabla Historial -->
            <div class="table-card" style="width: 100%; margin-top: 0; overflow-x: auto;">
              <table style="width: 100%;">
                <thead>
                  <tr>
                    <th>Cargo / Puesto</th>
                    <th>Sueldo Base</th>
                    <th>Pago por Hora</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th style="text-align: center;">Estado</th>
                  </tr>
                </thead>
                <tbody id="contracts-table-body"></tbody>
              </table>
              <div id="contracts-pagination-container"></div>
            </div>
            
            <!-- Formulario Nuevo Contrato / Ascenso -->
            ${e?`
              <div style="width: 100%; background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 20px; border-radius: 12px;">
                <h3 style="color: white; margin-bottom: 15px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Asignar Contrato / Promoción</h3>
                <form id="form-new-contract" class="modal-form" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                  <input type="hidden" name="employee_id" id="contract-emp-id">
                  <div id="contract-position-container"></div>
                  <div id="contract-monthly-salary-container"></div>
                  <div id="contract-start-date-container"></div>
                  <div id="contract-end-date-container"></div>
                  <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 10px;">
                    <button type="submit" class="btn-primary" style="width: 100%; max-width: 300px;">Asignar Contrato</button>
                  </div>
                </form>
              </div>
            `:""}
          </div>
        </div>
      </div>

      <!-- Modal Enrolar Huella -->
      <div id="modal-fingerprint" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Enrolar Huella Dactilar</h2>
            <span class="close-modal" id="close-modal-fingerprint">&times;</span>
          </div>
          <form id="form-fingerprint" class="modal-form">
            <input type="hidden" name="employee_id">
            <div id="emp-fingerprint-data-container"></div>
            <button type="submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Guardar Huella</button>
          </form>
        </div>
      </div>
    `}async onInit(){await this.loadEmployees(),this.initializeCustomFields(),this.setupEventListeners()}initializeCustomFields(){const e=document.getElementById("emp-first-names-container");e&&(this.firstNamesInput=new $(e,{label:"Nombres",name:"first_names",required:!0,placeholder:"Ej. Juan Manuel"}),this.firstNamesInput.render());const n=document.getElementById("emp-last-names-container");n&&(this.lastNamesInput=new $(n,{label:"Apellidos",name:"last_names",required:!0,placeholder:"Ej. Pérez Gómez"}),this.lastNamesInput.render());const t=document.getElementById("emp-document-number-container");if(t){this.documentNumberInput=new $(t,{label:"DNI (8 dígitos)",name:"document_number",required:!0,minlength:8,placeholder:"Ej. 70123456"}),this.documentNumberInput.render();const g=t.querySelector("input");g&&(g.setAttribute("maxlength","8"),g.addEventListener("input",()=>{g.value=g.value.replace(/\D/g,"")}))}const i=document.getElementById("emp-email-container");i&&(this.emailInput=new $(i,{label:"Email",name:"email",type:"email",required:!0,placeholder:"Ej. juan.perez@empresa.com"}),this.emailInput.render());const s=document.getElementById("emp-phone-container");s&&(this.phoneInput=new $(s,{label:"Teléfono",name:"phone",placeholder:"Ej. 987654321"}),this.phoneInput.render());const a=document.getElementById("emp-pension-system-container");a&&(this.pensionSystemSelect=new T(a,{label:"Sistema Pensiones",name:"pension_system",options:[{value:"ONP",label:"ONP (13.00%)"},{value:"Integra",label:"AFP Integra"},{value:"Habitat",label:"AFP Habitat"},{value:"Prima",label:"AFP Prima"},{value:"Profuturo",label:"AFP Profuturo"}],defaultValue:"ONP"}),this.pensionSystemSelect.render());const o=document.getElementById("contract-position-container");o&&(this.contractPositionInput=new $(o,{label:"Nuevo Cargo / Puesto",name:"position",required:!0,placeholder:"Ej. Supervisor de Operaciones"}),this.contractPositionInput.render());const r=document.getElementById("contract-monthly-salary-container");if(r){this.contractMonthlySalaryInput=new $(r,{label:"Nuevo Sueldo Base Mensual (S/.)",name:"monthly_salary",type:"number",required:!0,placeholder:"Ej. 3500"}),this.contractMonthlySalaryInput.render();const g=r.querySelector("input");g&&g.setAttribute("step","0.01")}const d=document.getElementById("contract-start-date-container");d&&(this.contractStartDateCalendar=new H(d,{label:"Fecha de Inicio",name:"start_date",required:!0}),this.contractStartDateCalendar.render());const p=document.getElementById("contract-end-date-container");p&&(this.contractEndDateCalendar=new H(p,{label:"Fecha de Fin (Opcional)",name:"end_date",defaultValue:""}),this.contractEndDateCalendar.render());const l=document.getElementById("emp-has-children-container");l&&(this.hasChildrenCheckbox=new W(l,{label:"Tiene hijos menores (Asig. Familiar)",name:"has_children"}),this.hasChildrenCheckbox.render());const u=document.getElementById("emp-fingerprint-data-container");u&&(this.fingerprintDataInput=new $(u,{label:"Firma Biométrica (Template Base64/Hex)",name:"fingerprint_data",type:"textarea",required:!0,placeholder:"Inserte los datos del sensor biométrico USB..."}),this.fingerprintDataInput.render())}async loadEmployees(e=""){try{this.currentSearch=e;const n=await fetch(`/employees?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(e)}`,{headers:this.getAuthHeaders()});if(n.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}const t=await n.json();this.employees=t.items||[],this.totalRecords=t.total||0,this.totalPages=t.pages||0,this.renderEmployeesTable(),this.renderPagination()}catch(n){console.error("Error al cargar empleados:",n),m.error("Error de conexión al cargar empleados.")}}renderPagination(){const e=document.getElementById("employees-pagination-container");if(!e)return;new j(e,{page:this.currentPage,limit:this.pageSize,total:this.totalRecords,pages:this.totalPages,onChangePage:async t=>{this.currentPage=t,await this.loadEmployees(this.currentSearch)},onChangeLimit:async t=>{this.pageSize=t,this.currentPage=1,await this.loadEmployees(this.currentSearch)}}).render()}renderEmployeesTable(){const e=document.getElementById("employees-table-body");if(!e)return;if(this.employees.length===0){e.innerHTML='<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No se encontraron empleados.</td></tr>';return}const n=this.canWrite("employees");e.innerHTML=this.employees.map(t=>`
      <tr>
        <td><strong>${t.document_number}</strong></td>
        <td>${t.full_name}</td>
        <td><span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;">${t.position}</span></td>
        <td>S/ ${parseFloat(t.monthly_salary).toFixed(2)}</td>
        <td><span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;">${t.pension_system}</span></td>
        <td>${t.has_children?"Sí":"No"}</td>
        <td>
          <div style="display: flex; gap: 4px; justify-content: center; align-items: center;">
            <button class="action-icon-btn btn-edit-emp" data-id="${t.id}" data-first-names="${t.first_names}" data-last-names="${t.last_names}" data-document-number="${t.document_number}" data-email="${t.email}" data-phone="${t.phone||""}" data-pension-system="${t.pension_system}" data-has-children="${t.has_children}" title="Editar ficha de empleado" style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
              ${Y}
            </button>
            <button class="action-icon-btn btn-contracts" data-id="${t.id}" data-name="${t.full_name}" title="Ver historial y contratos" style="background:transparent;border:none;cursor:pointer;color:#60a5fa;padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(96,165,250,0.1)'" onmouseout="this.style.background='transparent'">
              ${K}
            </button>
            ${n?`
              <button class="action-icon-btn btn-fingerprint-trigger" data-id="${t.id}" title="Enrolar huella dactilar" style="background:transparent;border:none;cursor:pointer;color:#fbbf24;padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(251,191,36,0.1)'" onmouseout="this.style.background='transparent'">
                ${Z}
              </button>
              <button class="action-icon-btn btn-delete-emp" data-id="${t.id}" title="Eliminar empleado" style="background:transparent;border:none;cursor:pointer;color:#f87171;padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                ${X}
              </button>
            `:""}
          </div>
        </td>
      </tr>
    `).join("")}setupEventListeners(){var g,f;const e=document.getElementById("emp-search");e==null||e.addEventListener("input",b=>{const h=b.target.value;this.currentPage=1,this.loadEmployees(h)});const n=document.getElementById("btn-new-emp"),t=document.getElementById("modal-emp"),i=document.getElementById("close-modal-emp"),s=document.getElementById("modal-emp-title"),a=document.getElementById("btn-emp-submit"),o=document.getElementById("emp-foto-input"),r=document.getElementById("form-emp");n==null||n.addEventListener("click",()=>{var b;this.editingEmployeeId=null,s&&(s.innerText="Registrar Nuevo Empleado"),a&&(a.innerText="Registrar Empleado"),o&&o.setAttribute("required","true"),r==null||r.reset(),(b=this.pensionSystemSelect)==null||b.setValue("ONP"),t==null||t.classList.remove("hidden")});const d=()=>{var b;t==null||t.classList.add("hidden"),this.editingEmployeeId=null,r==null||r.reset(),o&&o.setAttribute("required","true"),(b=this.pensionSystemSelect)==null||b.setValue("ONP")};i==null||i.addEventListener("click",d),r==null||r.addEventListener("submit",async b=>{b.preventDefault();const h=new FormData(r),x=r.querySelector('[name="has_children"]');h.set("has_children",x.checked?"true":"false"),this.editingEmployeeId!==null&&o&&o.files&&o.files.length===0&&h.delete("foto");try{const v=localStorage.getItem("auth_token"),w=this.editingEmployeeId===null?"/employees":`/employees/${this.editingEmployeeId}`,E=this.editingEmployeeId===null?"POST":"PUT",I=await fetch(w,{method:E,headers:{Authorization:`Bearer ${v}`},body:h}),S=await I.json();I.ok?(m.success(this.editingEmployeeId===null?"Empleado registrado exitosamente.":"Ficha de empleado actualizada correctamente."),d(),await this.loadEmployees()):m.error("Error: "+(S.detail||"Operación fallida."))}catch(v){console.error(v),m.error("Error de conexión.")}});const p=document.getElementById("employees-table-body");p==null||p.addEventListener("click",async b=>{var x,v,w,E,I,S;const h=b.target.closest("button");if(h){if(h.classList.contains("btn-edit-emp")){const C=h.getAttribute("data-id"),A=h.getAttribute("data-first-names"),M=h.getAttribute("data-last-names"),B=h.getAttribute("data-document-number"),P=h.getAttribute("data-email"),N=h.getAttribute("data-phone"),q=h.getAttribute("data-pension-system"),F=h.getAttribute("data-has-children")==="true";if(C&&A&&M&&B&&P){this.editingEmployeeId=parseInt(C),s&&(s.innerText="Editar Ficha de Empleado"),a&&(a.innerText="Guardar Cambios"),(x=this.firstNamesInput)==null||x.setValue(A),(v=this.lastNamesInput)==null||v.setValue(M),(w=this.documentNumberInput)==null||w.setValue(B),(E=this.emailInput)==null||E.setValue(P),(I=this.phoneInput)==null||I.setValue(N||""),(S=this.pensionSystemSelect)==null||S.setValue(q||"ONP");const V=r==null?void 0:r.querySelector('[name="has_children"]');V&&(V.checked=F),o&&(o.removeAttribute("required"),o.value=""),t==null||t.classList.remove("hidden")}}if(h.classList.contains("btn-contracts")){const C=h.getAttribute("data-id"),A=h.getAttribute("data-name");if(C){const M=parseInt(C),B=document.getElementById("contract-emp-id");B&&(B.value=C),await this.showContractsHistory(M,A||"")}}if(h.classList.contains("btn-fingerprint-trigger")){const C=h.getAttribute("data-id");C&&this.openFingerprintModal(parseInt(C))}if(h.classList.contains("btn-delete-emp")){const C=h.getAttribute("data-id");C&&await _.ask("¿Está seguro de eliminar lógicamente este empleado y todos sus contratos?")&&await this.deleteEmployee(parseInt(C))}}}),(g=document.getElementById("close-modal-contracts"))==null||g.addEventListener("click",()=>{var b;(b=document.getElementById("modal-contracts"))==null||b.classList.add("hidden")}),(f=document.getElementById("close-modal-fingerprint"))==null||f.addEventListener("click",()=>{var b;(b=document.getElementById("modal-fingerprint"))==null||b.classList.add("hidden")});const l=document.getElementById("form-new-contract");l==null||l.addEventListener("submit",async b=>{var E,I,S;b.preventDefault();const h=new FormData(l),x=h.get("employee_id"),v=parseInt(x),w={employee_id:v,position:h.get("position"),monthly_salary:parseFloat(h.get("monthly_salary")),start_date:h.get("start_date"),end_date:h.get("end_date")||null};try{const C=await fetch("/contracts",{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(w)}),A=await C.json();if(C.ok){m.success("Contrato / Ascenso registrado correctamente."),l.reset();const M=document.getElementById("contract-emp-id");M&&(M.value=x),(E=this.contractStartDateCalendar)==null||E.setValue(new Date().toISOString().split("T")[0]),(I=this.contractEndDateCalendar)==null||I.setValue("");const B=((S=this.employees.find(P=>P.id===v))==null?void 0:S.full_name)||"";await this.showContractsHistory(v,B),await this.loadEmployees()}else m.error("Error al registrar contrato: "+(A.detail||"Desconocido"))}catch{m.error("Error de conexión.")}});const u=document.getElementById("form-fingerprint");u==null||u.addEventListener("submit",async b=>{var w;b.preventDefault();const h=new FormData(u),x=h.get("employee_id"),v=h.get("fingerprint_data");try{const E=await fetch(`/employees/${x}/fingerprint`,{method:"POST",headers:{...this.getAuthHeaders(),"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({fingerprint_data:v})}),I=await E.json();E.ok?(m.success("Huella dactilar registrada exitosamente."),u.reset(),(w=document.getElementById("modal-fingerprint"))==null||w.classList.add("hidden")):m.error("Error al registrar huella: "+(I.detail||"Desconocido"))}catch{m.error("Error de conexión.")}})}async showContractsHistory(e,n){this.currentContractsEmpId=e,this.currentContractsEmpName=n,this.contractsCurrentPage=1,await this.loadContractsHistory()}async loadContractsHistory(){var i;const e=this.currentContractsEmpId;if(e===null)return;const n=document.getElementById("contracts-title");n&&(n.innerText=`Historial Laboral - ${this.currentContractsEmpName}`);const t=document.getElementById("contracts-table-body");if(t){t.innerHTML='<tr><td colspan="6" style="text-align: center;">Cargando historial...</td></tr>',(i=document.getElementById("modal-contracts"))==null||i.classList.remove("hidden");try{const s=await fetch(`/contracts/employee/${e}?page=${this.contractsCurrentPage}&limit=${this.contractsPageSize}`,{headers:this.getAuthHeaders()});if(!s.ok)throw new Error;const a=await s.json(),o=a.items||[];this.contractsTotalRecords=a.total||0,this.contractsTotalPages=a.pages||0,t.innerHTML=o.map(r=>`
        <tr>
          <td><strong>${r.position}</strong></td>
          <td>S/ ${parseFloat(r.monthly_salary).toFixed(2)}</td>
          <td>S/ ${parseFloat(r.hourly_wage).toFixed(2)}</td>
          <td>${r.start_date}</td>
          <td>${r.end_date||"Indefinido"}</td>
          <td style="text-align: center;"><span class="badge" style="background: ${r.is_active?"rgba(20, 184, 166, 0.1); color: #2dd4bf;":"rgba(239, 68, 68, 0.1); color: #f87171;"}">${r.is_active?"Activo":"Vencido"}</span></td>
        </tr>
      `).join(""),this.renderContractsPagination()}catch{t.innerHTML='<tr><td colspan="6" style="text-align: center; color: var(--danger);">Error al cargar contratos.</td></tr>';const s=document.getElementById("contracts-pagination-container");s&&(s.innerHTML="")}}}renderContractsPagination(){const e=document.getElementById("contracts-pagination-container");if(!e)return;new j(e,{page:this.contractsCurrentPage,limit:this.contractsPageSize,total:this.contractsTotalRecords,pages:this.contractsTotalPages,onChangePage:async t=>{this.contractsCurrentPage=t,await this.loadContractsHistory()},onChangeLimit:async t=>{this.contractsPageSize=t,this.contractsCurrentPage=1,await this.loadContractsHistory()}}).render()}openFingerprintModal(e){var t;const n=document.getElementById("form-fingerprint");if(n){n.reset();const i=n.querySelector('[name="employee_id"]');i&&(i.value=e.toString())}(t=document.getElementById("modal-fingerprint"))==null||t.classList.remove("hidden")}async deleteEmployee(e){try{const n=await fetch(`/employees/${e}`,{method:"DELETE",headers:this.getAuthHeaders()}),t=await n.json();n.ok?(m.success("Empleado eliminado exitosamente."),await this.loadEmployees()):m.error("Error al eliminar empleado: "+(t.detail||"Desconocido"))}catch{m.error("Error de conexión.")}}}class D extends L{constructor(e,n){super(e);c(this,"config");c(this,"selectedTime","08:00");c(this,"isOpen",!1);this.config=n,this.selectedTime=n.defaultValue||"08:00"}render(){const{label:e="",name:n,placeholder:t="Seleccionar hora"}=this.config,i=e?`<label>${e}</label>`:"",s=e?"":"margin-bottom: 0;",[a,o]=this.selectedTime.split(":");this.container.innerHTML=`
      <div class="custom-form-group time-container" style="${s}">
        ${i}
        <input type="hidden" name="${n}" value="${this.selectedTime}">

        <!-- Trigger del time picker -->
        <div class="custom-time-trigger custom-select-trigger" tabindex="0" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <span class="selected-time-label">${this.selectedTime||t}</span>
        </div>

        <!-- Panel del time picker -->
        <div class="custom-time-panel hidden" style="position: absolute; top: 100%; left: 0; width: 180px; background: #0b0f19; border: 1px solid var(--border); border-radius: 10px; z-index: 1050; margin-top: 5px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 10px; user-select: none;">
          <div style="display: flex; gap: 10px; height: 160px;">
            <!-- Columna Horas -->
            <div class="hours-column" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;">
              <div style="font-size: 0.75rem; text-align: center; color: var(--text-muted); font-weight: bold; margin-bottom: 4px; position: sticky; top: 0; background: #0b0f19;">HH</div>
              ${Array.from({length:24},(r,d)=>{const p=String(d).padStart(2,"0"),l=p===a;return`<div class="time-opt hour-opt ${l?"selected":""}" data-hour="${p}" style="padding: 6px; text-align: center; border-radius: 6px; cursor: pointer; color: ${l?"white":"var(--text-muted)"}; background: ${l?"var(--primary)":"transparent"}; font-size: 0.85rem;">${p}</div>`}).join("")}
            </div>
            <!-- Columna Minutos -->
            <div class="minutes-column" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;">
              <div style="font-size: 0.75rem; text-align: center; color: var(--text-muted); font-weight: bold; margin-bottom: 4px; position: sticky; top: 0; background: #0b0f19;">MM</div>
              ${Array.from({length:12},(r,d)=>{const p=String(d*5).padStart(2,"0"),l=p===o;return`<div class="time-opt minute-opt ${l?"selected":""}" data-minute="${p}" style="padding: 6px; text-align: center; border-radius: 6px; cursor: pointer; color: ${l?"white":"var(--text-muted)"}; background: ${l?"var(--primary)":"transparent"}; font-size: 0.85rem;">${p}</div>`}).join("")}
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 8px; border-top: 1px solid var(--border); padding-top: 8px;">
            <button type="button" class="btn-time-ok" style="background: var(--primary); border: none; color: white; border-radius: 6px; padding: 4px 10px; font-size: 0.8rem; cursor: pointer; font-family: inherit; font-weight: 600;">Aceptar</button>
          </div>
        </div>
      </div>
    `,this.setupListeners(),this.scrollToSelected()}scrollToSelected(){const e=this.container.querySelector(".hours-column"),n=this.container.querySelector(".minutes-column");if(e){const t=e.querySelector(".hour-opt.selected");t&&(e.scrollTop=t.offsetTop-e.offsetTop-40)}if(n){const t=n.querySelector(".minute-opt.selected");t&&(n.scrollTop=t.offsetTop-n.offsetTop-40)}}setupListeners(){const e=this.container.querySelector(".custom-time-trigger"),n=this.container.querySelector(".custom-time-panel"),t=this.container.querySelector(".btn-time-ok");e==null||e.addEventListener("click",a=>{a.stopPropagation(),this.isOpen=!this.isOpen,this.isOpen?(e.classList.add("active"),n==null||n.classList.remove("hidden"),this.scrollToSelected()):(e.classList.remove("active"),n==null||n.classList.add("hidden"))});const i=this.container.querySelector(".hours-column");i==null||i.addEventListener("click",a=>{const o=a.target;o.classList.contains("hour-opt")&&(i.querySelectorAll(".hour-opt").forEach(r=>{r.classList.remove("selected"),r.style.background="transparent",r.style.color="var(--text-muted)"}),o.classList.add("selected"),o.style.background="var(--primary)",o.style.color="white",this.updateTimeFromSelections())});const s=this.container.querySelector(".minutes-column");s==null||s.addEventListener("click",a=>{const o=a.target;o.classList.contains("minute-opt")&&(s.querySelectorAll(".minute-opt").forEach(r=>{r.classList.remove("selected"),r.style.background="transparent",r.style.color="var(--text-muted)"}),o.classList.add("selected"),o.style.background="var(--primary)",o.style.color="white",this.updateTimeFromSelections())}),t==null||t.addEventListener("click",a=>{a.stopPropagation(),this.closePanel()}),document.addEventListener("click",()=>{this.isOpen&&this.closePanel()}),n==null||n.addEventListener("click",a=>{a.stopPropagation()})}updateTimeFromSelections(){const e=this.container.querySelector(".hour-opt.selected"),n=this.container.querySelector(".minute-opt.selected"),t=e?e.getAttribute("data-hour"):"08",i=n?n.getAttribute("data-minute"):"00";this.selectedTime=`${t}:${i}`;const s=this.container.querySelector('input[type="hidden"]');s&&(s.value=this.selectedTime);const a=this.container.querySelector(".selected-time-label");a&&(a.textContent=this.selectedTime),this.config.onChange&&this.config.onChange(this.selectedTime)}closePanel(){this.isOpen=!1;const e=this.container.querySelector(".custom-time-trigger"),n=this.container.querySelector(".custom-time-panel");e==null||e.classList.remove("active"),n==null||n.classList.add("hidden")}getValue(){return this.selectedTime}setValue(e){this.selectedTime=e;const n=this.container.querySelector('input[type="hidden"]');n&&(n.value=e);const t=this.container.querySelector(".selected-time-label");t&&(t.textContent=e);const[i,s]=e.split(":"),a=this.container.querySelector(".hours-column");a&&a.querySelectorAll(".hour-opt").forEach(r=>{const d=r.getAttribute("data-hour")===i;r.classList.toggle("selected",d),r.style.background=d?"var(--primary)":"transparent",r.style.color=d?"white":"var(--text-muted)"});const o=this.container.querySelector(".minutes-column");o&&o.querySelectorAll(".minute-opt").forEach(r=>{const d=r.getAttribute("data-minute")===s;r.classList.toggle("selected",d),r.style.background=d?"var(--primary)":"transparent",r.style.color=d?"white":"var(--text-muted)"}),this.scrollToSelected()}}class ee extends L{constructor(){super(...arguments);c(this,"logs",[]);c(this,"employees",[]);c(this,"exportModalEmployeeSelect",null);c(this,"currentPage",1);c(this,"pageSize",10);c(this,"totalRecords",0);c(this,"totalPages",0);c(this,"currentSearch","")}render(){const e=this.canWrite("attendance_logs");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 15px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 15px; flex-grow: 1;">
              <input type="text" id="att-search" placeholder="Buscar por colaborador..." class="search-generic-input" style="width: 300px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none;">
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <button id="btn-open-export-modal" class="btn-primary" style="background: var(--success); display: flex; align-items: center; gap: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                Exportar
              </button>
              ${e?'<button id="btn-bulk-punch-trigger" class="btn-primary">+ Marcación Masiva</button>':""}
            </div>
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Colaborador</th>
                <th>Método de Marcación</th>
              </tr>
            </thead>
            <tbody id="attendance-table-body">
              <tr><td colspan="3" style="text-align: center;">Cargando bitácora de asistencia...</td></tr>
            </tbody>
          </table>
          <div id="attendance-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Exportar Asistencia -->
      <div id="modal-export-attendance" class="modal hidden">
        <div class="modal-content" style="max-width: 480px;">
          <div class="modal-header">
            <h2>Exportar Asistencia</h2>
            <span class="close-modal" id="close-modal-export">&times;</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">
            Seleccione el colaborador y el formato de exportación deseado.
          </p>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Colaborador</label>
            <div id="export-modal-employee-select-container"></div>
          </div>

          <div style="margin-bottom: 28px;">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Formato de exportación</label>
            <div style="display: flex; gap: 12px;">
              <label id="format-excel-label" style="flex: 1; display: flex; align-items: center; gap: 10px; padding: 14px 18px; border: 2px solid var(--success); border-radius: 12px; cursor: pointer; background: rgba(20,184,166,0.08); transition: all 0.2s;">
                <input type="radio" name="export-format" value="excel" checked style="accent-color: var(--success); width: 16px; height: 16px;">
                <span style="display: flex; flex-direction: column;">
                  <strong style="font-size: 0.95rem;">Excel</strong>
                  <small style="color: var(--text-muted); font-size: 0.78rem;">.xlsx — hoja de cálculo</small>
                </span>
              </label>
              <label id="format-pdf-label" style="flex: 1; display: flex; align-items: center; gap: 10px; padding: 14px 18px; border: 2px solid var(--border); border-radius: 12px; cursor: pointer; background: rgba(255,255,255,0.02); transition: all 0.2s;">
                <input type="radio" name="export-format" value="pdf" style="accent-color: #ef4444; width: 16px; height: 16px;">
                <span style="display: flex; flex-direction: column;">
                  <strong style="font-size: 0.95rem;">PDF</strong>
                  <small style="color: var(--text-muted); font-size: 0.78rem;">.pdf — documento listo</small>
                </span>
              </label>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="btn-cancel-export" class="btn-secondary" style="width: auto; padding: 10px 24px;">Cancelar</button>
            <button id="btn-confirm-export" class="btn-primary" style="width: auto; padding: 10px 24px; background: var(--success); display: flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
              Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Marcación Manual Masiva -->
      <div id="modal-bulk-punch" class="modal hidden">
        <div class="modal-content" style="max-width: 800px;">
          <div class="modal-header">
            <h2>Registrar Marcaciones Manuales Masivas (Contingencia)</h2>
            <span class="close-modal" id="close-modal-bulk">&times;</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
            Utilice este panel para registrar de forma simultánea múltiples ingresos/salidas que no pudieron marcarse biométricamente.
          </p>
          <form id="form-bulk-punch" class="modal-form">
            <div id="bulk-punch-rows" style="display: flex; flex-direction: column; gap: 15px; overflow: visible; margin-bottom: 20px;">
              <!-- Dynamic rows added here -->
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
              <button type="button" id="btn-add-punch-row" class="btn-primary" style="background: var(--border); color: white; width: auto;">+ Añadir Fila</button>
              <button type="submit" class="btn-primary" style="width: auto;">Guardar Marcaciones</button>
            </div>
          </form>
        </div>
      </div>
    `}async onInit(){await this.loadData(),this.setupEventListeners()}async loadData(){try{if(this.employees.length===0){const e=await fetch("/employees",{headers:this.getAuthHeaders()});this.employees=await e.json()}await this.loadLogs(this.currentSearch)}catch(e){console.error("Error al cargar datos:",e),m.error("Error de conexión.")}}initExportModalEmployeeSelect(){const e=document.getElementById("export-modal-employee-select-container");if(!e)return;e.innerHTML="",this.exportModalEmployeeSelect=null;const n=this.employees.map(t=>({value:t.id,label:`${t.document_number} - ${t.full_name}`}));this.exportModalEmployeeSelect=new T(e,{name:"export_modal_employee_id",options:n,placeholder:"-- Seleccionar colaborador --"}),this.exportModalEmployeeSelect.render()}async loadLogs(e=""){try{this.currentSearch=e;const n=await fetch(`/attendance/logs?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(e)}`,{headers:this.getAuthHeaders()});if(n.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}const t=await n.json();this.logs=t.items||[],this.totalRecords=t.total||0,this.totalPages=t.pages||0,this.renderTable(),this.renderPagination()}catch(n){console.error("Error al cargar asistencias:",n),m.error("Error al cargar la bitácora de asistencia.")}}renderPagination(){const e=document.getElementById("attendance-pagination-container");if(!e)return;new j(e,{page:this.currentPage,limit:this.pageSize,total:this.totalRecords,pages:this.totalPages,onChangePage:async t=>{this.currentPage=t,await this.loadLogs(this.currentSearch)},onChangeLimit:async t=>{this.pageSize=t,this.currentPage=1,await this.loadLogs(this.currentSearch)}}).render()}renderTable(e=""){const n=document.getElementById("attendance-table-body");if(!n)return;const t=this.logs.filter(i=>{const s=this.employees.find(o=>o.id===i.employee_id),a=s?s.full_name:i.nombre||"Desconocido";return e?a.toLowerCase().includes(e.toLowerCase()):!0});if(t.length===0){n.innerHTML='<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No hay registros de marcación.</td></tr>';return}t.sort((i,s)=>new Date(s.timestamp.replace(" ","T")).getTime()-new Date(i.timestamp.replace(" ","T")).getTime()),n.innerHTML=t.map(i=>{const s=this.employees.find(d=>d.id===i.employee_id),a=s?s.full_name:i.nombre||"Desconocido";let o="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;",r="Reconocimiento Facial";return i.method==="fingerprint"?(o="border-radius: 12px; padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: #fbbf24;",r="Huella Digital"):i.method==="manual"&&(o="border-radius: 12px; padding: 4px 8px; background: rgba(99, 102, 241, 0.1); color: #818cf8;",r="Marcación Manual"),`
        <tr>
          <td><strong>${i.timestamp}</strong></td>
          <td>${a}</td>
          <td><span class="badge" style="${o}">${r}</span></td>
        </tr>
      `}).join("")}setupEventListeners(){var r,d,p,l,u;const e=document.getElementById("att-search");e==null||e.addEventListener("input",g=>{const f=g.target.value;this.currentPage=1,this.loadLogs(f)});const n=document.getElementById("modal-export-attendance");(r=document.getElementById("btn-open-export-modal"))==null||r.addEventListener("click",()=>{this.initExportModalEmployeeSelect(),this.setupFormatRadioHighlight(),n==null||n.classList.remove("hidden")}),(d=document.getElementById("close-modal-export"))==null||d.addEventListener("click",()=>{n==null||n.classList.add("hidden")}),(p=document.getElementById("btn-cancel-export"))==null||p.addEventListener("click",()=>{n==null||n.classList.add("hidden")}),(l=document.getElementById("btn-confirm-export"))==null||l.addEventListener("click",async()=>{if(!this.exportModalEmployeeSelect)return;const g=this.exportModalEmployeeSelect.getValue();if(!g){m.warning("Por favor seleccione un colaborador.");return}const f=document.querySelector('input[name="export-format"]:checked'),b=(f==null?void 0:f.value)??"excel",h=document.getElementById("btn-confirm-export");h.disabled=!0,h.innerHTML="Generando...";try{const x=localStorage.getItem("auth_token"),v=await fetch(`/attendance/export/employee/${g}?format=${b}`,{headers:{Authorization:`Bearer ${x}`}});if(v.ok){const w=await v.blob(),E=window.URL.createObjectURL(w),I=document.createElement("a");I.href=E;const S=this.employees.find(M=>M.id===parseInt(g.toString())),C=S?S.full_name.replace(/\s+/g,"_").toLowerCase():"colaborador",A=b==="pdf"?"pdf":"xlsx";I.download=`asistencia_${C}_${(S==null?void 0:S.document_number)??""}.${A}`,document.body.appendChild(I),I.click(),I.remove(),window.URL.revokeObjectURL(E),n==null||n.classList.add("hidden"),m.success("Reporte exportado correctamente.")}else{const w=await v.json();m.error("Error: "+(w.detail||"No se pudo exportar."))}}catch(x){m.error(x.message||"Error de red al exportar.")}finally{h.disabled=!1,h.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg> Descargar'}});const t=document.getElementById("btn-bulk-punch-trigger"),i=document.getElementById("modal-bulk-punch"),s=document.getElementById("close-modal-bulk");t==null||t.addEventListener("click",()=>{this.resetBulkForm(),i==null||i.classList.remove("hidden")}),s==null||s.addEventListener("click",()=>{i==null||i.classList.add("hidden")}),(u=document.getElementById("btn-add-punch-row"))==null||u.addEventListener("click",()=>{this.addPunchRow()});const a=document.getElementById("bulk-punch-rows");a==null||a.addEventListener("click",g=>{const f=g.target;if(f.classList.contains("btn-remove-row")||f.closest(".btn-remove-row")){const b=f.closest(".bulk-row");b==null||b.remove()}});const o=document.getElementById("form-bulk-punch");o==null||o.addEventListener("submit",async g=>{g.preventDefault();const f=a==null?void 0:a.querySelectorAll(".bulk-row");if(!f||f.length===0){m.warning("Por favor agregue al menos una marcación válida.");return}const b=[];let h=!0;if(f.forEach(x=>{const v=x.querySelector('[name="employee_id"]'),w=x.querySelector('[name="date"]'),E=x.querySelector('[name="time"]');if(!v||!w||!E||!v.value||!w.value||!E.value){h=!1;return}b.push({employee_id:parseInt(v.value),timestamp:`${w.value} ${E.value}:00`})}),!h){m.warning("Por favor rellene todos los campos de las filas añadidas.");return}try{const x=await fetch("/attendance/punch-manual/bulk",{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({punches:b})}),v=await x.json();x.ok?(m.success(v.message||"Marcaciones registradas correctamente."),i==null||i.classList.add("hidden"),await this.loadData()):m.error("Error: "+(v.detail||"No se pudieron registrar las marcaciones."))}catch{m.error("Error de conexión.")}})}resetBulkForm(){const e=document.getElementById("bulk-punch-rows");e&&(e.innerHTML="",this.addPunchRow())}addPunchRow(){const e=document.getElementById("bulk-punch-rows");if(!e)return;const n=document.createElement("div");n.className="bulk-row",n.style.display="flex",n.style.gap="15px",n.style.alignItems="center",n.style.marginBottom="12px";const t=document.createElement("div");t.style.flex="2";const i=document.createElement("div");i.style.flex="1";const s=document.createElement("div");s.style.flex="1";const a=document.createElement("button");a.type="button",a.className="btn-danger btn-remove-row",a.style.padding="10px",a.style.width="42px",a.style.height="42px",a.style.display="flex",a.style.alignItems="center",a.style.justifyContent="center",a.style.background="rgba(239, 68, 68, 0.1)",a.style.color="#f87171",a.style.border="1px solid rgba(239, 68, 68, 0.2)",a.style.borderRadius="10px",a.style.cursor="pointer",a.style.fontSize="1.25rem",a.title="Quitar Fila",a.innerHTML="&times;",a.addEventListener("click",()=>{n.remove()}),n.appendChild(t),n.appendChild(i),n.appendChild(s),n.appendChild(a),e.appendChild(n);const o=this.employees.map(h=>({value:h.id,label:`${h.document_number} - ${h.full_name}`}));new T(t,{name:"employee_id",options:o,placeholder:"-- Seleccionar Colaborador --"}).render();const d=new Date().toISOString().split("T")[0];new H(i,{name:"date",defaultValue:d,placeholder:"Seleccionar fecha",required:!0}).render();const l=new Date,u=String(l.getHours()).padStart(2,"0"),g=String(Math.floor(l.getMinutes()/5)*5).padStart(2,"0"),f=`${u}:${g}`;new D(s,{name:"time",defaultValue:f,placeholder:"Seleccionar hora",required:!0}).render()}setupFormatRadioHighlight(){const e=document.querySelectorAll('input[name="export-format"]'),n=document.getElementById("format-excel-label"),t=document.getElementById("format-pdf-label"),i=a=>{n&&(n.style.border=a==="excel"?"2px solid var(--success)":"2px solid var(--border)",n.style.background=a==="excel"?"rgba(20,184,166,0.08)":"rgba(255,255,255,0.02)"),t&&(t.style.border=a==="pdf"?"2px solid #ef4444":"2px solid var(--border)",t.style.background=a==="pdf"?"rgba(239,68,68,0.08)":"rgba(255,255,255,0.02)")};e.forEach(a=>{a.addEventListener("change",()=>i(a.value))});const s=document.querySelector('input[name="export-format"]:checked');s&&i(s.value)}}class te extends L{constructor(){super(...arguments);c(this,"payrolls",[]);c(this,"periodCalendar",null);c(this,"afps",[]);c(this,"editingAfpId",null)}render(){const e=this.canWrite("payrolls");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div style="display: flex; align-items: center; gap: 15px; flex-grow: 1;">
              <label style="font-weight: 600; font-size: 0.9rem; color: var(--text-muted);">Periodo:</label>
              <div id="payroll-period-container"></div>
              <button id="btn-search-payroll" class="btn-primary" style="background: var(--border); color: white;">Consultar</button>
              ${e?`
                <button id="btn-calc-payroll" class="btn-primary">Calcular Planilla</button>
                <button id="btn-export-payroll" class="btn-primary" style="background: var(--success);">Exportar Lote</button>
                <button id="btn-config-afp" class="btn-primary" style="background: #4f46e5;">Configurar Tasas AFP</button>
              `:""}
            </div>
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Colaborador</th>
                <th>Periodo</th>
                <th>Días Trab.</th>
                <th>Tardanzas / S. Tempranas</th>
                <th>Horas Extra</th>
                <th>Descuentos</th>
                <th>Sueldo Bruto</th>
                <th>Pensiones</th>
                <th>Sueldo Neto</th>
                <th>Boleta</th>
              </tr>
            </thead>
            <tbody id="payroll-table-body">
              <tr><td colspan="11" style="text-align: center;">Seleccione un periodo y presione consultar...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Boleta de Pago -->
      <div id="modal-slip" class="modal hidden">
        <div class="modal-content" style="max-width: 650px; background: #0f172a; border: 1px solid var(--border); padding: 30px; border-radius: 20px;">
          <div class="modal-header" style="border-bottom: 2px solid var(--border); padding-bottom: 15px; margin-bottom: 20px;">
            <div style="text-align: left;">
              <h2 style="margin: 0; color: white;">Boleta de Pago</h2>
              <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.9rem;">Régimen Laboral General (D.L. 728)</p>
            </div>
            <span class="close-modal" id="close-modal-slip" style="font-size: 1.8rem;">&times;</span>
          </div>
          
          <div id="slip-detail-content" style="color: white; font-size: 0.95rem;">
            <!-- Dynamic Payslip structure here -->
          </div>
          
          <div class="print-actions" style="text-align: center; margin-top: 30px; border-top: 1px dashed var(--border); padding-top: 20px;">
            <button class="btn-primary" onclick="window.print()" style="background: var(--border); color: white; width: auto; padding: 10px 20px;">Imprimir Boleta</button>
          </div>
        </div>
      </div>

      <!-- Modal Configurar Tasas AFP -->
      <div id="modal-afp-config" class="modal hidden">
        <div class="modal-content" style="max-width: 850px; background: #0f172a; border: 1px solid var(--border); padding: 30px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <div class="modal-header" style="border-bottom: 2px solid var(--border); padding-bottom: 15px; margin-bottom: 20px;">
            <div style="text-align: left; display: flex; align-items: center; gap: 10px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings" style="color: #2dd4bf;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <h2 style="margin: 0; color: white;">Configuración de Tasas AFP</h2>
            </div>
            <span class="close-modal" id="close-modal-afp-config" style="font-size: 1.8rem; cursor: pointer;">&times;</span>
          </div>

          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: -10px; margin-bottom: 25px;">
            Modifique los valores porcentuales (0.00% - 100.00%) para cada administradora de fondos de pensiones.
          </p>
          
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border);">
                  <th style="text-align: left; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Administradora</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Aporte Obligatorio (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Prima de Seguro (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Comisión Flujo (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Total Retención (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Acciones</th>
                </tr>
              </thead>
              <tbody id="afp-config-table-body">
                <tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-muted);">Cargando tasas de AFP...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `}async onInit(){const n=new Date().toISOString().split("T")[0],t=n.substring(0,7),i=document.getElementById("payroll-period-container");i&&(this.periodCalendar=new H(i,{name:"payroll_period",defaultValue:n,placeholder:"Seleccionar periodo"}),this.periodCalendar.render());const s=this.periodCalendar?this.periodCalendar.getValue().substring(0,7):t;s&&await this.loadPayroll(s),await this.loadAfps(),this.setupEventListeners()}async loadPayroll(e){const n=document.getElementById("payroll-table-body");if(n){n.innerHTML='<tr><td colspan="11" style="text-align: center;">Buscando registros...</td></tr>';try{const t=await fetch(`/payroll/period/${e}`,{headers:this.getAuthHeaders()});if(t.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}this.payrolls=await t.json(),this.renderTable()}catch{n.innerHTML='<tr><td colspan="11" style="text-align: center; color: var(--danger);">Error de conexión al cargar la planilla.</td></tr>'}}}renderTable(){const e=document.getElementById("payroll-table-body");if(e){if(this.payrolls.length===0){e.innerHTML='<tr><td colspan="11" style="text-align: center;">No hay planillas calculadas para este periodo.</td></tr>';return}e.innerHTML=this.payrolls.map(n=>{const t=parseFloat(n.lateness_deduction)+parseFloat(n.absence_deduction);return`
        <tr>
          <td><strong>${n.document_number}</strong></td>
          <td>${n.full_name}</td>
          <td>${n.period}</td>
          <td>${n.days_worked} días</td>
          <td>${n.lateness_minutes} min</td>
          <td>S/ ${parseFloat(n.overtime_pay).toFixed(2)}</td>
          <td>S/ ${t.toFixed(2)}</td>
          <td>S/ ${parseFloat(n.gross_salary).toFixed(2)}</td>
          <td>S/ ${parseFloat(n.pension_deduction).toFixed(2)}</td>
          <td><strong style="color: #2dd4bf;">S/ ${parseFloat(n.net_salary).toFixed(2)}</strong></td>
          <td>
            <button class="btn-primary btn-view-slip" data-emp-id="${n.employee_id}" data-period="${n.period}" style="padding: 5px 10px; font-size: 0.8rem; background: var(--border); color: white;">Ver Boleta</button>
          </td>
        </tr>
      `}).join("")}}async loadAfps(){try{const e=await fetch("/payroll/afp",{headers:this.getAuthHeaders()});e.ok&&(this.afps=await e.json(),this.renderAfpTable())}catch(e){console.error("Error al cargar AFPs:",e)}}renderAfpTable(){const e=document.getElementById("afp-config-table-body");if(!e)return;const n=this.canWrite("payrolls");if(this.afps.length===0){e.innerHTML=`<tr><td colspan="${n?6:5}" style="text-align: center; padding: 20px; color: var(--text-muted);">No se encontraron configuraciones.</td></tr>`;return}e.innerHTML=this.afps.map(t=>{const i=(parseFloat(t.mandatory_contribution)+parseFloat(t.insurance_premium)+parseFloat(t.flow_commission))*100;return this.editingAfpId===t.id?`
          <tr style="border-bottom: 1px solid var(--border); background: rgba(255, 255, 255, 0.02);">
            <td style="padding: 12px; font-weight: bold; color: white;">${t.name}</td>
            <td style="padding: 12px; text-align: center;">
              <input type="number" id="edit-aporte-${t.id}" class="search-generic-input" style="width: 80px; text-align: center; padding: 5px; background: #0f172a; border: 1px solid var(--border); color: white; border-radius: 6px; font-family: inherit; font-size: 0.9rem;" value="${(t.mandatory_contribution*100).toFixed(2)}" step="0.01" min="0" max="100">
            </td>
            <td style="padding: 12px; text-align: center;">
              <input type="number" id="edit-prima-${t.id}" class="search-generic-input" style="width: 80px; text-align: center; padding: 5px; background: #0f172a; border: 1px solid var(--border); color: white; border-radius: 6px; font-family: inherit; font-size: 0.9rem;" value="${(t.insurance_premium*100).toFixed(2)}" step="0.01" min="0" max="100">
            </td>
            <td style="padding: 12px; text-align: center;">
              <input type="number" id="edit-comision-${t.id}" class="search-generic-input" style="width: 80px; text-align: center; padding: 5px; background: #0f172a; border: 1px solid var(--border); color: white; border-radius: 6px; font-family: inherit; font-size: 0.9rem;" value="${(t.flow_commission*100).toFixed(2)}" step="0.01" min="0" max="100">
            </td>
            <td style="padding: 12px; text-align: center; font-weight: bold; color: var(--text-muted);">-</td>
            <td style="padding: 12px; text-align: center;">
              <button class="btn-primary btn-save-afp" data-id="${t.id}" style="padding: 4px 10px; font-size: 0.8rem; background: var(--success); color: white; border-radius: 6px; margin-right: 5px; cursor: pointer;">Guardar</button>
              <button class="btn-primary btn-cancel-afp" style="padding: 4px 10px; font-size: 0.8rem; background: var(--border); color: white; border-radius: 6px; cursor: pointer;">Cancelar</button>
            </td>
          </tr>
        `:`
        <tr style="border-bottom: 1px solid var(--border); transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.01)'" onmouseout="this.style.background='transparent'">
          <td style="padding: 12px; font-weight: bold; color: white;">${t.name}</td>
          <td style="padding: 12px; text-align: center;">${(t.mandatory_contribution*100).toFixed(2)}%</td>
          <td style="padding: 12px; text-align: center;">${(t.insurance_premium*100).toFixed(2)}%</td>
          <td style="padding: 12px; text-align: center;">${(t.flow_commission*100).toFixed(2)}%</td>
          <td style="padding: 12px; text-align: center; font-weight: bold; color: #2dd4bf;">${i.toFixed(2)}%</td>
          ${n?`
            <td style="padding: 12px; text-align: center;">
              <button class="btn-primary btn-edit-afp" data-id="${t.id}" style="padding: 4px 10px; font-size: 0.8rem; background: var(--border); color: white; border-radius: 6px; cursor: pointer;">Editar</button>
            </td>
          `:""}
        </tr>
      `}).join("")}setupEventListeners(){var t,i,s,a,o,r;(t=document.getElementById("btn-search-payroll"))==null||t.addEventListener("click",async()=>{var l;const d=(l=this.periodCalendar)==null?void 0:l.getValue(),p=d?d.substring(0,7):"";p&&await this.loadPayroll(p)}),(i=document.getElementById("btn-calc-payroll"))==null||i.addEventListener("click",async()=>{var l;const d=(l=this.periodCalendar)==null?void 0:l.getValue(),p=d?d.substring(0,7):"";if(!p){m.warning("Por favor seleccione un periodo YYYY-MM.");return}if(await _.ask(`¿Está seguro de recalcular la planilla completa para el periodo ${p}?`))try{const u=await fetch("/payroll/calculate",{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({period:p})}),g=await u.json();u.ok?(m.success("Planilla del periodo calculada con éxito."),await this.loadPayroll(p)):m.error("Error al calcular planilla: "+(g.detail||"Desconocido"))}catch{m.error("Error de conexión con el motor de planilla.")}}),(s=document.getElementById("btn-export-payroll"))==null||s.addEventListener("click",async()=>{var l;const d=(l=this.periodCalendar)==null?void 0:l.getValue(),p=d?d.substring(0,7):"";if(!p){m.warning("Por favor seleccione un periodo válido.");return}try{const u=localStorage.getItem("auth_token"),g=await fetch(`/payroll/export/${p}`,{headers:{Authorization:`Bearer ${u}`}});if(g.ok){const f=await g.blob(),b=window.URL.createObjectURL(f),h=document.createElement("a");h.href=b,h.download=`lote_pago_planilla_${p}.csv`,document.body.appendChild(h),h.click(),h.remove(),m.success("Lote de pago exportado correctamente.")}else{const f=await g.json();m.error("Error: "+(f.detail||"No se pudo exportar."))}}catch(u){m.error(u.message||"Error de red al exportar.")}}),(a=document.getElementById("btn-config-afp"))==null||a.addEventListener("click",()=>{var d;(d=document.getElementById("modal-afp-config"))==null||d.classList.remove("hidden")}),(o=document.getElementById("close-modal-afp-config"))==null||o.addEventListener("click",()=>{var d;(d=document.getElementById("modal-afp-config"))==null||d.classList.add("hidden"),this.editingAfpId=null,this.renderAfpTable()});const e=document.getElementById("payroll-table-body");e==null||e.addEventListener("click",async d=>{const p=d.target;if(p.classList.contains("btn-view-slip")){const l=p.getAttribute("data-emp-id"),u=p.getAttribute("data-period");l&&u&&await this.showPayslip(parseInt(l),u)}}),(r=document.getElementById("close-modal-slip"))==null||r.addEventListener("click",()=>{var d;(d=document.getElementById("modal-slip"))==null||d.classList.add("hidden")});const n=document.getElementById("afp-config-table-body");n==null||n.addEventListener("click",async d=>{var l;const p=d.target;if(p.classList.contains("btn-edit-afp")){const u=p.getAttribute("data-id");u&&(this.editingAfpId=parseInt(u),this.renderAfpTable())}if(p.classList.contains("btn-cancel-afp")&&(this.editingAfpId=null,this.renderAfpTable()),p.classList.contains("btn-save-afp")){const u=p.getAttribute("data-id");if(!u)return;const g=parseInt(u),f=document.getElementById(`edit-aporte-${g}`),b=document.getElementById(`edit-prima-${g}`),h=document.getElementById(`edit-comision-${g}`);if(f&&b&&h){const x=parseFloat(f.value)/100,v=parseFloat(b.value)/100,w=parseFloat(h.value)/100;if(isNaN(x)||x<0||x>1||isNaN(v)||v<0||v>1||isNaN(w)||w<0||w>1){m.warning("Por favor ingrese valores numéricos válidos entre 0% y 100%.");return}try{const E=await fetch(`/payroll/afp/${g}`,{method:"PUT",headers:{...this.getAuthHeaders(),"Content-Type":"application/json"},body:JSON.stringify({mandatory_contribution:x,insurance_premium:v,flow_commission:w})});if(E.ok){m.success("Tasas de AFP actualizadas correctamente."),this.editingAfpId=null,await this.loadAfps();const I=(l=this.periodCalendar)==null?void 0:l.getValue(),S=I?I.substring(0,7):"";S&&await this.loadPayroll(S)}else{const I=await E.json();m.error("Error al guardar: "+(I.detail||"Desconocido"))}}catch{m.error("Error de conexión.")}}}})}async showPayslip(e,n){const t=document.getElementById("modal-slip"),i=document.getElementById("slip-detail-content");if(i){i.innerHTML='<p style="text-align: center;">Cargando boleta...</p>',t==null||t.classList.remove("hidden");try{const s=await fetch(`/payroll/slip/employee/${e}/period/${n}`,{headers:this.getAuthHeaders()});if(!s.ok)throw new Error;const a=await s.json(),o=a.base_salary+a.family_allowance+a.overtime_pay,r=a.lateness_deduction+a.absence_deduction+a.pension_deduction;i.innerHTML=`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
          <div>
            <strong>Colaborador:</strong> ${a.full_name}<br>
            <strong>DNI:</strong> ${a.document_number}<br>
            <strong>Periodo:</strong> ${a.period}
          </div>
          <div style="text-align: right;">
            <strong>Días Trabajados:</strong> ${a.days_worked} días<br>
            <strong>Tardanzas / S. Tempranas:</strong> ${a.lateness_minutes} min<br>
            <strong>Aporte Patronal EsSalud (9%):</strong> S/ ${parseFloat(a.essalud_contribution).toFixed(2)}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Ingresos (Remuneraciones) -->
          <div style="border-right: 1px solid var(--border); padding-right: 15px;">
            <h4 style="border-bottom: 1px solid var(--border); padding-bottom: 5px; color: #2dd4bf; margin-top: 0;">Remuneraciones / Ingresos</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Sueldo Base:</span>
              <span>S/ ${parseFloat(a.base_salary).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Asignación Familiar:</span>
              <span>S/ ${parseFloat(a.family_allowance).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Horas Extras:</span>
              <span>S/ ${parseFloat(a.overtime_pay).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border); padding-top: 8px; font-weight: 600;">
              <span>Total Ingresos:</span>
              <span>S/ ${o.toFixed(2)}</span>
            </div>
          </div>

          <!-- Descuentos y Aportes del trabajador -->
          <div>
            <h4 style="border-bottom: 1px solid var(--border); padding-bottom: 5px; color: #f87171; margin-top: 0;">Descuentos / Retenciones</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tardanzas y S. Tempranas:</span>
              <span>S/ ${parseFloat(a.lateness_deduction).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Inasistencias:</span>
              <span>S/ ${parseFloat(a.absence_deduction).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Retención Pensión:</span>
              <span>S/ ${parseFloat(a.pension_deduction).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border); padding-top: 8px; font-weight: 600;">
              <span>Total Descuentos:</span>
              <span>S/ ${r.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border); border-radius: 12px; margin-top: 25px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1.1rem; font-weight: 600;">NETO A PAGAR:</span>
          <span style="font-size: 1.4rem; font-weight: 600; color: #2dd4bf;">S/ ${parseFloat(a.net_salary).toFixed(2)}</span>
        </div>

        <!-- Firma digital/física formal -->
        <div class="print-signatures" style="display: none;">
          <div style="text-align: center; width: 40%; border-top: 1px solid var(--text-muted); padding-top: 8px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Firma del Trabajador</span>
          </div>
          <div style="text-align: center; width: 40%; border-top: 1px solid var(--text-muted); padding-top: 8px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Firma del Empleador</span>
          </div>
        </div>
      `}catch{i.innerHTML='<p style="text-align: center; color: var(--danger);">Error al recuperar boleta de pago.</p>'}}}}const ne='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';class ie extends L{constructor(){super(...arguments);c(this,"justifications",[]);c(this,"employees",[]);c(this,"empSelect",null);c(this,"dateCalendar",null);c(this,"typeSelect",null);c(this,"descriptionInput",null);c(this,"editingJustificationId",null);c(this,"currentPage",1);c(this,"pageSize",10);c(this,"totalRecords",0);c(this,"totalPages",0);c(this,"currentSearch","")}render(){const e=this.canWrite("justifications");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="just-search" placeholder="Buscar por colaborador..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${e?'<button id="btn-new-just" class="btn-primary">+ Registrar Justificación</button>':""}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Fecha Justificada</th>
                <th>Tipo</th>
                <th>Descripción / Motivo</th>
                ${e?'<th style="text-align: center;">Acciones</th>':""}
              </tr>
            </thead>
            <tbody id="justifications-table-body">
              <tr><td colspan="5" style="text-align: center;">Cargando justificaciones...</td></tr>
            </tbody>
          </table>
          <div id="justifications-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Registrar/Editar Justificación -->
      <div id="modal-just" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-just-title">Registrar Justificación / Licencia</h2>
            <span class="close-modal" id="close-modal-just">&times;</span>
          </div>
          <form id="form-just" class="modal-form">
            <div id="select-employee-just-container"></div>
            <div id="calendar-date-just-container"></div>
            <div id="select-type-just-container"></div>
            <div id="just-description-container"></div>
            <button type="submit" id="btn-just-submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Guardar Justificación</button>
          </form>
        </div>
      </div>
    `}async onInit(){await this.loadData(),this.setupEventListeners()}async loadData(){try{if(this.employees.length===0){const e=await fetch("/employees",{headers:this.getAuthHeaders()});if(e.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}this.employees=await e.json()}await this.loadJustifications(this.currentSearch),this.initializeCustomFields()}catch(e){console.error("Error al cargar datos:",e),m.error("Error de conexión.")}}async loadJustifications(e=""){try{this.currentSearch=e;const n=await fetch(`/justifications?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(e)}`,{headers:this.getAuthHeaders()});if(n.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}const t=await n.json();this.justifications=t.items||[],this.totalRecords=t.total||0,this.totalPages=t.pages||0,this.renderTable(),this.renderPagination()}catch(n){console.error("Error al cargar justificaciones:",n),m.error("Error al cargar justificaciones.")}}renderPagination(){const e=document.getElementById("justifications-pagination-container");if(!e)return;new j(e,{page:this.currentPage,limit:this.pageSize,total:this.totalRecords,pages:this.totalPages,onChangePage:async t=>{this.currentPage=t,await this.loadJustifications(this.currentSearch)},onChangeLimit:async t=>{this.pageSize=t,this.currentPage=1,await this.loadJustifications(this.currentSearch)}}).render()}renderTable(){const e=document.getElementById("justifications-table-body");if(!e)return;if(this.justifications.length===0){e.innerHTML='<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No se encontraron justificaciones registradas.</td></tr>';return}const n=this.canWrite("justifications"),t='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';e.innerHTML=this.justifications.map(i=>{const s=i.full_name||"Desconocido";let a="",o="";return i.justification_type==="medical"?(a="border-radius: 12px; padding: 4px 8px; background: rgba(239, 68, 68, 0.1); color: #f87171;",o="Médico"):i.justification_type==="license"?(a="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;",o="Licencia"):(a="border-radius: 12px; padding: 4px 8px; background: rgba(99, 102, 241, 0.1); color: #818cf8;",o="Permiso"),`
        <tr>
          <td><strong>${s}</strong></td>
          <td>${i.date}</td>
          <td><span class="badge" style="${a}">${o}</span></td>
          <td>${i.description||"-"}</td>
          ${n?`
            <td style="text-align: center; display: flex; gap: 8px; justify-content: center; align-items: center; border-bottom: none;">
              <button class="action-icon-btn btn-edit-just" data-id="${i.id}" data-emp-id="${i.employee_id}" data-date="${i.date}" data-type="${i.justification_type}" data-desc="${i.description||""}" title="Editar justificación"
                style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
                ${t}
              </button>
              <button class="action-icon-btn btn-delete-just" data-emp-id="${i.employee_id}" data-date="${i.date}" title="Eliminar justificación"
                style="background:transparent;border:none;cursor:pointer;color:#f87171;padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                ${ne}
              </button>
            </td>
          `:""}
        </tr>
      `}).join("")}initializeCustomFields(){const e=document.getElementById("select-employee-just-container");if(e){const s=this.employees.map(a=>({value:a.id,label:`${a.document_number} - ${a.full_name}`}));this.empSelect=new T(e,{label:"Colaborador",name:"employee_id",options:s,placeholder:"-- Seleccionar Colaborador --"}),this.empSelect.render()}const n=document.getElementById("calendar-date-just-container");n&&(this.dateCalendar=new H(n,{label:"Fecha del Permiso / Licencia",name:"date",placeholder:"Seleccionar fecha"}),this.dateCalendar.render());const t=document.getElementById("select-type-just-container");if(t){const s=[{value:"medical",label:"Descanso Médico"},{value:"license",label:"Licencia Legal con Goce"},{value:"permit",label:"Permiso Personal Autorizado"}];this.typeSelect=new T(t,{label:"Tipo de Justificación",name:"justification_type",options:s,defaultValue:"medical"}),this.typeSelect.render()}const i=document.getElementById("just-description-container");i&&(this.descriptionInput=new $(i,{label:"Descripción / Motivo",name:"description",type:"textarea",required:!0,placeholder:"Inserte detalles del descanso médico, diagnóstico o memorándum..."}),this.descriptionInput.render())}setupEventListeners(){const e=document.getElementById("just-search");e==null||e.addEventListener("input",p=>{const l=p.target.value;this.currentPage=1,this.loadJustifications(l)});const n=document.getElementById("btn-new-just"),t=document.getElementById("modal-just"),i=document.getElementById("close-modal-just"),s=document.getElementById("modal-just-title"),a=document.getElementById("btn-just-submit"),o=document.getElementById("form-just");n==null||n.addEventListener("click",()=>{var l;this.editingJustificationId=null,s&&(s.innerText="Registrar Justificación / Licencia"),a&&(a.innerText="Guardar Justificación"),o==null||o.reset(),(l=this.empSelect)==null||l.setDisabled(!1);const p=document.querySelector("#calendar-date-just-container input");p&&(p.disabled=!1),t==null||t.classList.remove("hidden")});const r=()=>{var l;t==null||t.classList.add("hidden"),this.editingJustificationId=null,o==null||o.reset(),(l=this.empSelect)==null||l.setDisabled(!1);const p=document.querySelector("#calendar-date-just-container input");p&&(p.disabled=!1)};i==null||i.addEventListener("click",r),o==null||o.addEventListener("submit",async p=>{var u,g,f,b;p.preventDefault();const l={justification_type:((u=this.typeSelect)==null?void 0:u.getValue())||"medical",description:((g=this.descriptionInput)==null?void 0:g.getValue())||""};if(this.editingJustificationId===null){l.employee_id=parseInt((((f=this.empSelect)==null?void 0:f.getValue())||"0").toString()),l.date=((b=this.dateCalendar)==null?void 0:b.getValue())||"";try{const h=await fetch("/justifications",{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(l)}),x=await h.json();h.ok?(m.success("Justificación registrada correctamente."),r(),await this.loadData()):m.error("Error al registrar justificación: "+(x.detail||"Desconocido"))}catch{m.error("Error de conexión.")}}else try{const h=await fetch(`/justifications/${this.editingJustificationId}`,{method:"PUT",headers:this.getAuthHeaders(),body:JSON.stringify(l)}),x=await h.json();h.ok?(m.success("Justificación actualizada correctamente."),r(),await this.loadData()):m.error("Error al actualizar justificación: "+(x.detail||"Desconocido"))}catch{m.error("Error de conexión.")}});const d=document.getElementById("justifications-table-body");d==null||d.addEventListener("click",async p=>{var u,g,f,b,h;const l=p.target.closest("button");if(l){if(l.classList.contains("btn-delete-just")){const x=l.getAttribute("data-emp-id"),v=l.getAttribute("data-date");x&&v&&await _.ask("¿Desea eliminar esta justificación?")&&await this.deleteJustification(parseInt(x),v)}else if(l.classList.contains("btn-edit-just")){const x=l.getAttribute("data-id"),v=l.getAttribute("data-emp-id"),w=l.getAttribute("data-date"),E=l.getAttribute("data-type"),I=l.getAttribute("data-desc");if(x&&v&&w&&E){this.editingJustificationId=parseInt(x),s&&(s.innerText="Editar Justificación"),a&&(a.innerText="Guardar Cambios"),(u=this.empSelect)==null||u.setValue(v),(g=this.empSelect)==null||g.setDisabled(!0),(f=this.dateCalendar)==null||f.setValue(w);const S=document.querySelector("#calendar-date-just-container input");S&&(S.disabled=!0),(b=this.typeSelect)==null||b.setValue(E),(h=this.descriptionInput)==null||h.setValue(I||""),t==null||t.classList.remove("hidden")}}}})}async deleteJustification(e,n){try{const t=await fetch(`/justifications/employee/${e}/date/${n}`,{method:"DELETE",headers:this.getAuthHeaders()}),i=await t.json();t.ok?(m.success("Justificación eliminada exitosamente."),await this.loadData()):m.error("Error: "+(i.detail||"No se pudo eliminar"))}catch{m.error("Error de conexión.")}}}class ae extends L{constructor(){super(...arguments);c(this,"employees",[]);c(this,"allEmployees",[]);c(this,"shifts",{});c(this,"empSelect",null);c(this,"daySelect",null);c(this,"startTimeInput",null);c(this,"endTimeInput",null);c(this,"toleranceInput",null);c(this,"editingShiftId",null);c(this,"currentPage",1);c(this,"pageSize",10);c(this,"totalRecords",0);c(this,"totalPages",0);c(this,"currentSearch","")}render(){const e=this.canWrite("shifts");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="shift-search" placeholder="Buscar por colaborador..." style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${e?'<button id="btn-new-shift" class="btn-primary">+ Asignar Horario</button>':""}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
                <th>Domingo</th>
              </tr>
            </thead>
            <tbody id="shifts-table-body">
              <tr><td colspan="8" style="text-align: center;">Cargando turnos...</td></tr>
            </tbody>
          </table>
          <div id="shifts-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Asignar Horario Semanal -->
      <div id="modal-shift" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-shift-title">Asignar Horario Semanal</h2>
            <span class="close-modal" id="close-modal-shift">&times;</span>
          </div>
          <form id="form-shift" class="modal-form">
            <div id="select-employee-container"></div>
            <div id="select-day-of-week-container"></div>
            <div id="shift-start-time-container"></div>
            <div id="shift-end-time-container"></div>
            <div id="shift-tolerance-container"></div>
            <button type="submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Asignar Horario</button>
          </form>
        </div>
      </div>
    `}async onInit(){await this.loadData(),this.setupEventListeners()}async loadData(){try{if(this.allEmployees.length===0){const t=await fetch("/employees",{headers:this.getAuthHeaders()});t.ok&&(this.allEmployees=await t.json())}const e=await fetch(`/attendance/shifts?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(this.currentSearch)}`,{headers:this.getAuthHeaders()});if(e.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}if(!e.ok)throw new Error;const n=await e.json();this.employees=n.items.map(t=>t.employee),this.shifts={};for(const t of n.items)this.shifts[t.employee.id]=t.shifts;this.totalRecords=n.total||0,this.totalPages=n.pages||0,this.renderTable(),this.renderPagination(),this.populateEmployeeSelect()}catch(e){console.error("Error al cargar turnos:",e)}}renderPagination(){const e=document.getElementById("shifts-pagination-container");if(!e)return;new j(e,{page:this.currentPage,limit:this.pageSize,total:this.totalRecords,pages:this.totalPages,onChangePage:async t=>{this.currentPage=t,await this.loadData()},onChangeLimit:async t=>{this.pageSize=t,this.currentPage=1,await this.loadData()}}).render()}renderTable(){const e=document.getElementById("shifts-table-body");if(!e)return;if(this.employees.length===0){e.innerHTML='<tr><td colspan="8" style="text-align: center;">No se encontraron colaboradores.</td></tr>';const i=document.getElementById("shifts-pagination-container");i&&(i.innerHTML="");return}const n=this.canWrite("shifts"),t='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';e.innerHTML=this.employees.map(i=>{const s=this.shifts[i.id]||[],o=[1,2,3,4,5,6,0].map(r=>{const d=s.find(p=>p.day_of_week===r);if(d){const p=d.start_time.substring(0,5),l=d.end_time.substring(0,5);return`
            <td>
              <span class="badge" style="padding: 4px 8px; font-size: 0.8rem; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 8px; width: 100%; box-sizing: border-box;">
                <span>${p} - ${l}</span>
                ${n?`
                  <button class="btn-edit-shift" data-id="${d.id}" data-emp-id="${i.id}" data-day="${d.day_of_week}" data-start="${p}" data-end="${l}" data-tolerance="${d.tolerance??10}" title="Editar este turno" style="background:none;border:none;cursor:pointer;color:#818cf8;padding:2px;display:flex;align-items:center;transition:color 0.15s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#818cf8'">
                    ${t}
                  </button>
                `:""}
              </span>
            </td>
          `}return'<td><span style="color: var(--text-muted); font-size: 0.8rem; display: block; text-align: center;">-</span></td>'}).join("");return`
        <tr class="shift-row-clickable" data-id="${i.id}">
          <td>
            <strong>${i.full_name}</strong><br>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${i.position}</span>
          </td>
          ${o}
        </tr>
      `}).join("")}populateEmployeeSelect(){const e=document.getElementById("select-employee-container");if(e){const a=this.allEmployees.map(o=>({value:o.id,label:`${o.document_number} - ${o.full_name}`}));this.empSelect=new T(e,{label:"Colaborador",name:"employee_id",options:a,placeholder:"-- Seleccionar Colaborador --"}),this.empSelect.render()}const n=document.getElementById("select-day-of-week-container");n&&(this.daySelect=new T(n,{label:"Día de la Semana",name:"day_of_week",options:[{value:"1",label:"Lunes"},{value:"2",label:"Martes"},{value:"3",label:"Miércoles"},{value:"4",label:"Jueves"},{value:"5",label:"Viernes"},{value:"6",label:"Sábado"},{value:"0",label:"Domingo"}],defaultValue:"1"}),this.daySelect.render());const t=document.getElementById("shift-start-time-container");t&&(this.startTimeInput=new D(t,{label:"Hora de Entrada (HH:MM)",name:"start_time",defaultValue:"08:00",placeholder:"Seleccionar hora de entrada",required:!0}),this.startTimeInput.render());const i=document.getElementById("shift-end-time-container");i&&(this.endTimeInput=new D(i,{label:"Hora de Salida (HH:MM)",name:"end_time",defaultValue:"17:00",placeholder:"Seleccionar hora de salida",required:!0}),this.endTimeInput.render());const s=document.getElementById("shift-tolerance-container");if(s){this.toleranceInput=new $(s,{label:"Tolerancia de Entrada (minutos)",name:"tolerance",type:"number",value:"10",placeholder:"Ej. 10",required:!0}),this.toleranceInput.render();const a=s.querySelector("input");a&&a.setAttribute("min","0")}}setupEventListeners(){var p;const e=document.getElementById("shift-search");e==null||e.addEventListener("input",l=>{const u=l.target.value;this.currentSearch=u,this.currentPage=1,this.loadData()});const n=document.getElementById("btn-new-shift"),t=document.getElementById("modal-shift"),i=document.getElementById("close-modal-shift"),s=document.getElementById("modal-shift-title"),a=(p=document.getElementById("form-shift"))==null?void 0:p.querySelector('button[type="submit"]'),o=document.getElementById("form-shift");n==null||n.addEventListener("click",()=>{var l,u,g,f,b,h,x;this.editingShiftId=null,s&&(s.innerText="Asignar Horario Semanal"),a&&(a.innerText="Asignar Horario"),o==null||o.reset(),(l=this.empSelect)==null||l.setDisabled(!1),(u=this.daySelect)==null||u.setDisabled(!1),(g=this.empSelect)==null||g.setValue(""),(f=this.daySelect)==null||f.setValue("1"),(b=this.startTimeInput)==null||b.setValue("08:00"),(h=this.endTimeInput)==null||h.setValue("17:00"),(x=this.toleranceInput)==null||x.setValue("10"),t==null||t.classList.remove("hidden")});const r=()=>{var l,u;t==null||t.classList.add("hidden"),this.editingShiftId=null,o==null||o.reset(),(l=this.empSelect)==null||l.setDisabled(!1),(u=this.daySelect)==null||u.setDisabled(!1)};i==null||i.addEventListener("click",r);const d=document.getElementById("shifts-table-body");d==null||d.addEventListener("click",l=>{var f,b,h,x,v,w,E,I;const u=l.target.closest(".btn-edit-shift");if(u&&this.canWrite("shifts")){l.stopPropagation();const S=u.getAttribute("data-id"),C=u.getAttribute("data-emp-id"),A=u.getAttribute("data-day"),M=u.getAttribute("data-start"),B=u.getAttribute("data-end"),P=u.getAttribute("data-tolerance")||"10";S&&C&&A&&M&&B&&(this.editingShiftId=parseInt(S),s&&(s.innerText="Editar Horario Semanal"),a&&(a.innerText="Guardar Cambios"),(f=this.empSelect)==null||f.setValue(C),(b=this.empSelect)==null||b.setDisabled(!0),(h=this.daySelect)==null||h.setValue(A),(x=this.daySelect)==null||x.setDisabled(!0),(v=this.startTimeInput)==null||v.setValue(M),(w=this.endTimeInput)==null||w.setValue(B),(E=this.toleranceInput)==null||E.setValue(P),t==null||t.classList.remove("hidden"));return}const g=l.target.closest(".shift-row-clickable");if(g&&this.canWrite("shifts")){const S=g.getAttribute("data-id");this.empSelect&&S&&(this.editingShiftId=null,s&&(s.innerText="Asignar Horario Semanal"),a&&(a.innerText="Asignar Horario"),this.empSelect.setValue(parseInt(S)),this.empSelect.setDisabled(!1),(I=this.daySelect)==null||I.setDisabled(!1),t==null||t.classList.remove("hidden"))}}),o==null||o.addEventListener("submit",async l=>{var g,f,b,h,x;l.preventDefault();const u={start_time:`${((g=this.startTimeInput)==null?void 0:g.getValue())||"08:00"}:00`,end_time:`${((f=this.endTimeInput)==null?void 0:f.getValue())||"17:00"}:00`,tolerance:parseInt((((b=this.toleranceInput)==null?void 0:b.getValue())||"10").toString())};try{let v;this.editingShiftId===null?(u.employee_id=parseInt((((h=this.empSelect)==null?void 0:h.getValue())||"0").toString()),u.day_of_week=parseInt((((x=this.daySelect)==null?void 0:x.getValue())||"1").toString()),v=await fetch("/attendance/shifts",{method:"POST",headers:{...this.getAuthHeaders(),"Content-Type":"application/json"},body:JSON.stringify(u)})):v=await fetch(`/attendance/shifts/${this.editingShiftId}`,{method:"PUT",headers:{...this.getAuthHeaders(),"Content-Type":"application/json"},body:JSON.stringify(u)});const w=await v.json();v.ok?(m.success(this.editingShiftId===null?"Horario asignado exitosamente.":"Horario actualizado exitosamente."),t==null||t.classList.add("hidden"),this.editingShiftId=null,await this.loadData()):m.error("Error: "+(w.detail||"No se pudo guardar el horario."))}catch{m.error("Error de conexión.")}})}}class se extends L{constructor(){super(...arguments);c(this,"terminals",[]);c(this,"nameInput",null);c(this,"statusSelect",null);c(this,"editingTerminalId",null)}render(){this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="stats-grid" id="terminals-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; width: 100%;">
          <p style="grid-column: 1/-1; text-align: center;">Cargando terminales...</p>
        </div>
      </section>

      <!-- Modal Editar Terminal -->
      <div id="modal-terminal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Configurar Dispositivo Biométrico</h2>
            <span class="close-modal" id="close-modal-terminal">&times;</span>
          </div>
          <form id="form-terminal" class="modal-form">
            <div id="terminal-name-container"></div>
            <div id="terminal-status-container"></div>
            <button type="submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Guardar Cambios</button>
          </form>
        </div>
      </div>
    `}async onInit(){this.initializeCustomFields(),await this.loadData(),this.setupEventListeners()}initializeCustomFields(){const e=document.getElementById("terminal-name-container");e&&(this.nameInput=new $(e,{label:"Nombre del Dispositivo",name:"name",required:!0,placeholder:"Ej. Cámara Facial Principal"}),this.nameInput.render());const n=document.getElementById("terminal-status-container");n&&(this.statusSelect=new T(n,{label:"Estado de Conexión",name:"status",options:[{value:"online",label:"En línea (Online)"},{value:"offline",label:"Desconectado (Offline)"}],defaultValue:"online"}),this.statusSelect.render())}async loadData(){try{const e=await fetch("/system/terminals",{headers:this.getAuthHeaders()});if(e.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}if(!e.ok)throw new Error;this.terminals=await e.json(),this.renderGrid()}catch{const e=document.getElementById("terminals-grid");e&&(e.innerHTML='<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Error de conexión al cargar las terminales.</p>')}}renderGrid(){const e=document.getElementById("terminals-grid");if(!e)return;if(this.terminals.length===0){e.innerHTML='<p style="grid-column: 1/-1; text-align: center;">No hay terminales registradas.</p>';return}const n=this.canWrite("system"),t='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';e.innerHTML=this.terminals.map(i=>{const s=i.status.toLowerCase()==="online",a=s?"#2dd4bf":"#f87171",o=s?"EN LÍNEA":"DESCONECTADO";return`
        <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${a}; padding: 25px; position: relative;">
          ${n?`
            <button class="btn-edit-terminal" data-id="${i.id}" data-name="${i.name}" data-status="${i.status}" title="Configurar terminal"
              style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s; padding: 4px; border-radius: 6px;"
              onmouseover="this.style.color='white'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.color='var(--text-muted)'; this.style.background='transparent'">
              ${t}
            </button>
          `:""}
          <div>
            <h4 style="margin: 0 0 10px 0; font-size: 1.1rem; color: var(--text-muted); width: 85%;">${i.name}</h4>
            <span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 5px 8px; border-radius: 5px; color: var(--text-muted); font-family: monospace;">Tipo: ${i.type.toUpperCase()}</span>
          </div>
          <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: ${a}; font-size: 0.9rem;">● ${o}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${i.last_ping}</span>
          </div>
        </div>
      `}).join("")}setupEventListeners(){const e=document.getElementById("modal-terminal"),n=document.getElementById("close-modal-terminal"),t=document.getElementById("form-terminal");n==null||n.addEventListener("click",()=>{e==null||e.classList.add("hidden"),this.editingTerminalId=null});const i=document.getElementById("terminals-grid");i==null||i.addEventListener("click",s=>{var o,r;const a=s.target.closest(".btn-edit-terminal");if(a){const d=a.getAttribute("data-id"),p=a.getAttribute("data-name"),l=a.getAttribute("data-status");d&&p&&l&&(this.editingTerminalId=d,(o=this.nameInput)==null||o.setValue(p),(r=this.statusSelect)==null||r.setValue(l),e==null||e.classList.remove("hidden"))}}),t==null||t.addEventListener("submit",async s=>{var o,r;if(s.preventDefault(),!this.editingTerminalId)return;const a={name:((o=this.nameInput)==null?void 0:o.getValue())||"",status:((r=this.statusSelect)==null?void 0:r.getValue())||"online"};try{const d=await fetch(`/system/terminals/${this.editingTerminalId}`,{method:"PUT",headers:this.getAuthHeaders(),body:JSON.stringify(a)}),p=await d.json();d.ok?(m.success("Terminal configurada correctamente."),e==null||e.classList.add("hidden"),this.editingTerminalId=null,await this.loadData()):m.error("Error al configurar terminal: "+(p.detail||"Desconocido"))}catch{m.error("Error de conexión.")}})}}class oe extends L{constructor(){super(...arguments);c(this,"logs",[]);c(this,"currentPage",1);c(this,"pageSize",10);c(this,"totalRecords",0);c(this,"totalPages",0);c(this,"currentSearch","")}render(){this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="audit-search" placeholder="Buscar logs por acción, usuario o detalles..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none;">
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Administrador</th>
                <th>Operación / Acción</th>
                <th>Detalles del Evento</th>
                <th>Fecha / Hora</th>
              </tr>
            </thead>
            <tbody id="audit-table-body">
              <tr><td colspan="5" style="text-align: center;">Cargando bitácora de auditoría...</td></tr>
            </tbody>
          </table>
          <div id="audit-pagination-container"></div>
        </div>
      </section>
    `}async onInit(){await this.loadLogs(this.currentSearch),this.setupEventListeners()}async loadLogs(e=""){try{this.currentSearch=e;const n=await fetch(`/system/audit-logs?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(e)}`,{headers:this.getAuthHeaders()});if(n.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}if(!n.ok)throw new Error;const t=await n.json();this.logs=t.items||[],this.totalRecords=t.total||0,this.totalPages=t.pages||0,this.renderTable(),this.renderPagination()}catch(n){console.error("Error al cargar logs de auditoría:",n);const t=document.getElementById("audit-table-body");t&&(t.innerHTML='<tr><td colspan="5" style="text-align: center; color: var(--danger);">Error al cargar logs de auditoría.</td></tr>')}}renderPagination(){const e=document.getElementById("audit-pagination-container");if(!e)return;new j(e,{page:this.currentPage,limit:this.pageSize,total:this.totalRecords,pages:this.totalPages,onChangePage:async t=>{this.currentPage=t,await this.loadLogs(this.currentSearch)},onChangeLimit:async t=>{this.pageSize=t,this.currentPage=1,await this.loadLogs(this.currentSearch)}}).render()}renderTable(){const e=document.getElementById("audit-table-body");if(e){if(this.logs.length===0){e.innerHTML='<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No se encontraron logs de auditoría.</td></tr>';return}e.innerHTML=this.logs.map(n=>{let t="background: rgba(255, 255, 255, 0.05); color: #fff;";const i=n.action.toUpperCase();return i.includes("ELIMINAR")?t="border-radius: 12px; padding: 4px 8px; background: rgba(239, 68, 68, 0.1); color: #f87171;":i.includes("REGISTRAR")||i.includes("CREAR")||i.includes("ENROLAR")?t="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;":i.includes("CALCULAR")||i.includes("EXPORTAR")?t="border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;":(i.includes("PROVISIÓN")||i.includes("RECUPERAR"))&&(t="border-radius: 12px; padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: #fbbf24;"),`
        <tr>
          <td><strong>#${n.id}</strong></td>
          <td>${n.username}</td>
          <td><span class="badge" style="${t}">${n.action}</span></td>
          <td style="max-width: 400px; white-space: normal; line-height: 1.4;">${n.description||"-"}</td>
          <td>${n.timestamp||n.created_at||"-"}</td>
        </tr>
      `}).join("")}}setupEventListeners(){const e=document.getElementById("audit-search");e==null||e.addEventListener("input",n=>{const t=n.target.value;this.currentPage=1,this.loadLogs(t)})}}const re='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',R='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';class le extends L{constructor(){super(...arguments);c(this,"users",[]);c(this,"usernameInput",null);c(this,"emailInput",null);c(this,"passwordInput",null);c(this,"roleSelect",null);c(this,"editingUserId",null)}render(){const e=this.canWrite("administrators");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="admin-search" placeholder="Buscar por usuario o correo..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${e?'<button id="btn-new-admin" class="btn-primary">+ Nuevo Administrador</button>':""}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol / Privilegios</th>
                <th>Estado</th>
                ${e?'<th style="text-align: center;">Acciones</th>':""}
              </tr>
            </thead>
            <tbody id="admins-table-body">
              <tr><td colspan="6" style="text-align: center;">Cargando administradores...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Nuevo Administrador / Editar -->
      <div id="modal-admin" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-admin-title">Registrar Nueva Cuenta Administrativa</h2>
            <span class="close-modal" id="close-modal-admin">&times;</span>
          </div>
          <form id="form-admin" class="modal-form">
            <div id="admin-username-container"></div>
            <div id="admin-email-container"></div>
            <div id="admin-password-container"></div>
            <div id="admin-role-container"></div>
            <button type="submit" id="btn-admin-submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Crear Cuenta</button>
          </form>
        </div>
      </div>
    `}async onInit(){await this.loadData(),this.initializeCustomFields(),this.setupEventListeners()}initializeCustomFields(){const e=document.getElementById("admin-username-container");e&&(this.usernameInput=new $(e,{label:"Nombre de Usuario",name:"username",required:!0,placeholder:"Ej. admin_user"}),this.usernameInput.render());const n=document.getElementById("admin-email-container");n&&(this.emailInput=new $(n,{label:"Correo Electrónico",name:"email",type:"email",required:!0,placeholder:"Ej. admin@empresa.com"}),this.emailInput.render());const t=document.getElementById("admin-password-container");t&&(this.passwordInput=new $(t,{label:"Contraseña de Acceso",name:"password",type:"password",required:!0,minlength:6,placeholder:"Mínimo 6 caracteres"}),this.passwordInput.render());const i=document.getElementById("admin-role-container");i&&(this.roleSelect=new T(i,{label:"Rol asignado",name:"role",options:[{value:"admin",label:"Administrador (RRHH)"},{value:"super_admin",label:"Super Administrador (TI/Soporte)"},{value:"operator",label:"Operador (Consulta/Lectura)"}],defaultValue:"admin"}),this.roleSelect.render())}async loadData(){try{const e=await fetch("/auth/users",{headers:this.getAuthHeaders()});if(e.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}if(!e.ok)throw new Error;this.users=await e.json(),this.renderTable()}catch{const e=document.getElementById("admins-table-body");e&&(e.innerHTML='<tr><td colspan="6" style="text-align: center; color: var(--danger);">Error al cargar administradores.</td></tr>')}}renderTable(e=""){const n=document.getElementById("admins-table-body");if(!n)return;const t=this.users.filter(o=>{if(!e)return!0;const r=e.toLowerCase();return o.username.toLowerCase().includes(r)||o.email.toLowerCase().includes(r)});if(t.length===0){n.innerHTML='<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No se encontraron cuentas.</td></tr>';return}const i=this.canWrite("administrators"),s=localStorage.getItem("auth_username")||"",a='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';n.innerHTML=t.map(o=>{let r="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;",d="Administrador";o.role==="super_admin"?(r="border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;",d="Super Admin"):o.role==="operator"&&(r="border-radius: 12px; padding: 4px 8px; background: rgba(148, 163, 184, 0.1); color: #94a3b8;",d="Operador");const p=o.username===s,l=!!o.locked_at,u=o.failed_login_attempts??0,g=l?`<span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.3);" title="Bloqueado tras ${u} intento(s) fallido(s)">
             ${R}&nbsp;Bloqueado
           </span>`:'<span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;">Activo</span>';return`
        <tr ${l?'style="opacity: 0.85;"':""}>
          <td><strong>#${o.id}</strong></td>
          <td>${o.username} ${p?'<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">(tú)</span>':""}</td>
          <td>${o.email}</td>
          <td><span class="badge" style="${r}">${d}</span></td>
          <td>${g}</td>
          ${i?`
            <td style="text-align: center; display: flex; gap: 8px; justify-content: center; align-items: center; border-bottom: none;">
              <button class="action-icon-btn btn-edit-admin" data-id="${o.id}" data-username="${o.username}" data-email="${o.email}" data-role="${o.role}" title="Editar administrador"
                style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
                ${a}
              </button>
              ${l&&!p?`
                <button class="action-icon-btn btn-unlock-admin" data-id="${o.id}" data-name="${o.username}" title="Desbloquear cuenta"
                  style="background:transparent;border:none;cursor:pointer;color:#fb923c;padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                  onmouseover="this.style.background='rgba(251,146,60,0.1)'" onmouseout="this.style.background='transparent'">
                  ${R}
                </button>
              `:""}
              ${p?"":`
                <button class="action-icon-btn btn-delete-admin" data-id="${o.id}" data-name="${o.username}" title="Eliminar administrador"
                  style="background:transparent;border:none;cursor:pointer;color:#f87171;padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                  onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                  ${re}
                </button>
              `}
            </td>
          `:""}
        </tr>
      `}).join("")}setupEventListeners(){const e=document.getElementById("admin-search");e==null||e.addEventListener("input",p=>{const l=p.target.value;this.renderTable(l)});const n=document.getElementById("btn-new-admin"),t=document.getElementById("modal-admin"),i=document.getElementById("close-modal-admin"),s=document.getElementById("modal-admin-title"),a=document.getElementById("btn-admin-submit"),o=document.getElementById("form-admin");n==null||n.addEventListener("click",()=>{var p,l,u;this.editingUserId=null,s&&(s.innerText="Registrar Nueva Cuenta Administrativa"),a&&(a.innerText="Crear Cuenta"),o==null||o.reset(),(p=this.usernameInput)==null||p.setDisabled(!1),(l=this.passwordInput)==null||l.setRequired(!0),(u=this.roleSelect)==null||u.setValue("admin"),t==null||t.classList.remove("hidden")});const r=()=>{var p,l,u;t==null||t.classList.add("hidden"),this.editingUserId=null,o==null||o.reset(),(p=this.usernameInput)==null||p.setDisabled(!1),(l=this.passwordInput)==null||l.setRequired(!0),(u=this.roleSelect)==null||u.setValue("admin")};i==null||i.addEventListener("click",r),o==null||o.addEventListener("submit",async p=>{var g,f,b,h;p.preventDefault();const l={email:((g=this.emailInput)==null?void 0:g.getValue())||"",role:((f=this.roleSelect)==null?void 0:f.getValue())||"admin"},u=(b=this.passwordInput)==null?void 0:b.getValue();if(u&&(l.password=u),this.editingUserId===null){l.username=((h=this.usernameInput)==null?void 0:h.getValue())||"",l.password=u||"";try{const x=await fetch("/auth/register",{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(l)}),v=await x.json();x.ok?(m.success(`Cuenta administrativa "${l.username}" creada exitosamente.`),r(),await this.loadData()):m.error("Error: "+(v.detail||"No se pudo crear la cuenta."))}catch{m.error("Error de conexión.")}}else try{const x=await fetch(`/auth/users/${this.editingUserId}`,{method:"PUT",headers:this.getAuthHeaders(),body:JSON.stringify(l)}),v=await x.json();x.ok?(m.success("Cuenta administrativa actualizada con éxito."),r(),await this.loadData()):m.error("Error: "+(v.detail||"No se pudo actualizar la cuenta."))}catch{m.error("Error de conexión.")}});const d=document.getElementById("admins-table-body");d==null||d.addEventListener("click",async p=>{var u,g,f,b,h,x;const l=p.target.closest("button");if(l){if(l.classList.contains("btn-delete-admin")){const v=l.getAttribute("data-id"),w=l.getAttribute("data-name");v&&w&&await _.ask(`¿Está seguro de eliminar lógicamente al administrador "${w}"?`)&&await this.deleteAdmin(parseInt(v),w)}else if(l.classList.contains("btn-unlock-admin")){const v=l.getAttribute("data-id"),w=l.getAttribute("data-name");v&&w&&await _.ask(`¿Desbloquear la cuenta de "${w}"? Se reiniciará su contador de intentos fallidos.`)&&await this.unlockAdmin(parseInt(v),w)}else if(l.classList.contains("btn-edit-admin")){const v=l.getAttribute("data-id"),w=l.getAttribute("data-username"),E=l.getAttribute("data-email"),I=l.getAttribute("data-role");v&&w&&E&&I&&(this.editingUserId=parseInt(v),s&&(s.innerText="Editar Cuenta Administrativa"),a&&(a.innerText="Guardar Cambios"),(u=this.usernameInput)==null||u.setValue(w),(g=this.usernameInput)==null||g.setDisabled(!0),(f=this.emailInput)==null||f.setValue(E),(b=this.roleSelect)==null||b.setValue(I),(h=this.passwordInput)==null||h.setValue(""),(x=this.passwordInput)==null||x.setRequired(!1),t==null||t.classList.remove("hidden"))}}})}async deleteAdmin(e,n){try{const t=await fetch(`/auth/users/${e}`,{method:"DELETE",headers:this.getAuthHeaders()}),i=await t.json();t.ok?(m.success(`El administrador ${n} ha sido eliminado.`),await this.loadData()):m.error("Error al eliminar administrador: "+(i.detail||"Desconocido"))}catch{m.error("Error de conexión.")}}async unlockAdmin(e,n){try{const t=await fetch(`/auth/users/${e}/unlock`,{method:"PUT",headers:this.getAuthHeaders()}),i=await t.json();t.ok?(m.success(`Cuenta de "${n}" desbloqueada correctamente.`),await this.loadData()):m.error("Error al desbloquear: "+(i.detail||"Desconocido"))}catch{m.error("Error de conexión.")}}}class de extends L{constructor(){super(...arguments);c(this,"newEmpInput",null);c(this,"overtimeInput",null)}render(){this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in" style="width: 100%;">
        
        <!-- Alerta Informativa Académica -->
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 15px 20px; margin-bottom: 30px; display: flex; gap: 15px; align-items: center;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v14"/></svg>
          </div>
          <div style="font-size: 0.9rem; color: #93c5fd; line-height: 1.5;">
            <strong>Módulo de Inteligencia Artificial (Sistemas Inteligentes)</strong><br>
            Los modelos predictivos han sido entrenados mediante <strong>Regresión de Cresta (Ridge Regression - OLS)</strong> en NumPy. 
            El sistema pobla automáticamente series temporales de 12 meses para aprender tendencias, volumen de horas extras y estacionalidad de gratificaciones (Jul/Dic) y ausentismo.
          </div>
        </div>
 
        <!-- Fila de Pronósticos Principales (Próximo Mes) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;" id="forecasts-cards-container">
          <p style="grid-column: 1/-1; text-align: center;">Entrenando modelos y calculando pronósticos...</p>
        </div>
 
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;" id="details-grid">
          <!-- Panel de Simulación Presupuestaria -->
          <div class="stat-card" style="padding: 30px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 1.25rem; display: flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders" style="margin-right: 8px;"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
                Simulador Presupuestario IA
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 25px;">Proyecta el impacto de decisiones de contratación y metas de producción en el costo total de la planilla del mes siguiente.</p>
              
              <form id="simulation-form" style="display: flex; flex-direction: column; gap: 20px;">
                <div id="sim-new-employees-container"></div>
                <div id="sim-overtime-hours-container"></div>
                <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; margin-top: 10px;">Calcular Impacto Proyectado</button>
              </form>
            </div>
 
            <!-- Resultado de Simulación -->
            <div id="simulation-result" class="hidden" style="margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border); border-radius: 12px;">
              <h4 style="margin-top: 0; margin-bottom: 15px; font-size: 0.95rem; color: var(--text-muted);">RESULTADO DE SIMULACIÓN</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Empleados Totales:</span>
                  <span id="sim-result-emps" style="font-weight: 600;">0</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Costo por Horas Extras:</span>
                  <span id="sim-result-ot-pay" style="font-weight: 600;">S/. 0.00</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Aporte EsSalud Extra:</span>
                  <span id="sim-result-essalud" style="font-weight: 600;">S/. 0.00</span>
                </div>
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: white;">Planilla Simulada Total:</span>
                  <span id="sim-result-total" style="font-weight: 600; color: var(--primary); font-size: 1.15rem;">S/. 0.00</span>
                </div>
                <div style="text-align: right; font-size: 0.8rem; color: #10b981; font-weight: 600; margin-top: 5px;" id="sim-result-variation">
                  +0.0% respecto al pronóstico base
                </div>
              </div>
            </div>
          </div>
 
          <!-- Métricas de Evaluación Cuantitativa (Sistemas Inteligentes) -->
          <div class="stat-card" style="padding: 30px;">
            <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 1.25rem; display: flex; align-items: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-3" style="margin-right: 8px;"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              Evaluación Cuantitativa de Modelos
            </h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 25px;">Métricas obtenidas mediante validación cruzada con partición de prueba (20% del historial de planillas).</p>
            
            <div style="display: flex; flex-direction: column; gap: 20px;" id="metrics-details-container">
              <p>Cargando métricas de error...</p>
            </div>
          </div>
        </div>
 
      </section>
    `}async onInit(){const e=document.getElementById("sim-new-employees-container"),n=document.getElementById("sim-overtime-hours-container");e&&(this.newEmpInput=new $(e,{label:"Contratación de Empleados (Nuevos)",type:"number",name:"new_employees",required:!0,placeholder:"Ej. 2"}),this.newEmpInput.render(),this.newEmpInput.setValue("0")),n&&(this.overtimeInput=new $(n,{label:"Meta de Horas Extras Totales (Mensual)",type:"number",name:"target_overtime_hours",required:!0,placeholder:"Ej. 50"}),this.overtimeInput.render(),this.overtimeInput.setValue("0"));const t=document.getElementById("simulation-form");t==null||t.addEventListener("submit",i=>{i.preventDefault(),this.runSimulation()}),await this.loadForecastData()}async loadForecastData(){try{const e=await fetch("/prediction/dashboard",{headers:this.getAuthHeaders()});if(e.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}if(!e.ok)throw new Error;const n=await e.json();this.renderForecastCards(n),this.renderMetricsDetails(n)}catch(e){console.error(e);const n=document.getElementById("forecasts-cards-container");n&&(n.innerHTML='<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Error de conexión al entrenar los modelos IA y obtener los pronósticos.</p>')}}renderForecastCards(e){const n=document.getElementById("forecasts-cards-container");n&&(n.innerHTML=`
      <!-- Pronóstico Costo Planilla -->
      <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid var(--primary); padding: 25px;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Gasto de Planilla Proyectado</h4>
          <span style="font-size: 1.6rem; font-weight: 600; color: white;">S/. ${e.payroll_forecast.toLocaleString("es-PE",{minimumFractionDigits:2})}</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Mes: ${e.next_period}</span>
          <span style="color: #10b981; font-weight: 600;">Regresión Ridge IA</span>
        </div>
      </div>

      <!-- Pronóstico Horas Extras -->
      <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid #eab308; padding: 25px;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Volumen Horas Extras Estimado</h4>
          <span style="font-size: 1.6rem; font-weight: 600; color: white;">${e.overtime_forecast.toLocaleString("es-PE")} horas</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Planilla Activa: ${e.current_emp_count} emp.</span>
          <span style="color: #eab308; font-weight: 600;">Tendencia Mensual</span>
        </div>
      </div>

      <!-- Pronóstico Ausentismo -->
      <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid #f87171; padding: 25px;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Días de Ausencia Previstos</h4>
          <span style="font-size: 1.6rem; font-weight: 600; color: white;">${e.absenteeism_forecast.toLocaleString("es-PE")} días</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Ausentismo acumulado</span>
          <span style="color: #f87171; font-weight: 600;">Impacto Estacional</span>
        </div>
      </div>
    `)}renderMetricsDetails(e){const n=document.getElementById("metrics-details-container");n&&(n.innerHTML=`
      <!-- Métrica Planilla -->
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 15px; border-radius: 12px;">
        <h5 style="margin: 0 0 10px 0; font-size: 0.9rem; color: var(--primary);">Modelo Presupuesto de Planilla</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">MAE</div>
            <div style="font-weight: 600; color: white;">S/. ${e.payroll_mae}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">RMSE</div>
            <div style="font-weight: 600; color: white;">S/. ${e.payroll_rmse}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">R²</div>
            <div style="font-weight: 600; color: #10b981;">${e.payroll_r2}</div>
          </div>
        </div>
      </div>

      <!-- Métrica Horas Extra -->
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 15px; border-radius: 12px;">
        <h5 style="margin: 0 0 10px 0; font-size: 0.9rem; color: #eab308;">Modelo Volumen de Horas Extras</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">MAE</div>
            <div style="font-weight: 600; color: white;">${e.overtime_mae} hrs</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">RMSE</div>
            <div style="font-weight: 600; color: white;">${e.overtime_rmse} hrs</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">R²</div>
            <div style="font-weight: 600; color: #10b981;">${e.overtime_r2}</div>
          </div>
        </div>
      </div>

      <!-- Métrica Ausencias -->
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 15px; border-radius: 12px;">
        <h5 style="margin: 0 0 10px 0; font-size: 0.9rem; color: #f87171;">Modelo Tendencia de Ausentismo</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">MAE</div>
            <div style="font-weight: 600; color: white;">${e.absenteeism_mae} días</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">RMSE</div>
            <div style="font-weight: 600; color: white;">${e.absenteeism_rmse} días</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">R²</div>
            <div style="font-weight: 600; color: #10b981;">${e.absenteeism_r2}</div>
          </div>
        </div>
      </div>
    `)}async runSimulation(){var t,i;const e=parseInt(((t=this.newEmpInput)==null?void 0:t.getValue())||"0"),n=parseFloat(((i=this.overtimeInput)==null?void 0:i.getValue())||"0.0");if(isNaN(e)||e<0){m.error("El número de nuevos empleados debe ser mayor o igual a 0.");return}if(isNaN(n)||n<0){m.error("La meta de horas extras debe ser mayor o igual a 0.");return}try{const s=await fetch("/prediction/simulate",{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({new_employees:e,target_overtime_hours:n})});if(!s.ok)throw new Error;const a=await s.json();this.showSimulationResult(a)}catch{m.error("Error al procesar la simulación de presupuesto.")}}showSimulationResult(e){const n=document.getElementById("simulation-result");if(!n)return;n.classList.remove("hidden");const t=document.getElementById("sim-result-emps"),i=document.getElementById("sim-result-ot-pay"),s=document.getElementById("sim-result-essalud"),a=document.getElementById("sim-result-total"),o=document.getElementById("sim-result-variation");if(t&&(t.innerText=`${e.simulated_employees} empleados`),i&&(i.innerText=`S/. ${e.overtime_cost_impact.toLocaleString("es-PE",{minimumFractionDigits:2})}`),s&&(s.innerText=`S/. ${e.essalud_impact.toLocaleString("es-PE",{minimumFractionDigits:2})}`),a&&(a.innerText=`S/. ${e.simulated_payroll_cost.toLocaleString("es-PE",{minimumFractionDigits:2})}`),o){const r=e.variation_pct,d=r>0;o.style.color=d?"#f87171":"#10b981",o.innerText=`${d?"+":""}${r}% respecto al pronóstico base`}}}class ce extends L{constructor(){super(...arguments);c(this,"activeTab","matrix");c(this,"roles",[]);c(this,"allMenus",[]);c(this,"allPermissions",[]);c(this,"selectedRoleId",null);c(this,"roleMenuIds",[]);c(this,"rolePermissionIds",[]);c(this,"rbacRoleSelect",null);c(this,"editMenuLabelInput",null);c(this,"editMenuParentSelect",null);c(this,"editingMenuId",null);c(this,"selectedIcon","folder");c(this,"menuIcons",[{name:"folder",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'},{name:"users",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'},{name:"settings",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'},{name:"rect",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>'},{name:"calendar",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'},{name:"alert",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'},{name:"clock",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'},{name:"dollar",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>'},{name:"brain",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path></svg>'},{name:"cpu",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>'},{name:"file-text",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'},{name:"user-check",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'},{name:"lock",svg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'}])}render(){const e=this.canWrite("security");this.container.innerHTML=`
      <section class="dashboard-section animate-fade-in" style="width: 100%;">
        
        <!-- Pestañas -->
        <div class="login-tabs" style="margin-bottom: 30px;">
          <div class="login-tab ${this.activeTab==="matrix"?"active":""}" id="tab-matrix">Matriz de Roles y Privilegios</div>
          <div class="login-tab ${this.activeTab==="menus"?"active":""}" id="tab-menus">Configuración de Menús</div>
        </div>

        <!-- Contenedor Pestaña 1: Matriz de Roles -->
        <div id="pane-matrix" class="${this.activeTab!=="matrix"?"hidden":""}">
          <div class="stat-card" style="padding: 30px; margin-bottom: 30px; overflow: visible;">
            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.25rem;">Seleccionar Rol para Asignar</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
              Los cambios aplicados aquí determinarán qué apartados del panel puede visualizar el rol seleccionado y qué operaciones CRUD está autorizado a realizar.
            </p>
            <div id="rbac-role-select-container" style="max-width: 300px;"></div>
            <div id="role-description" style="margin-top: 15px; font-size: 0.85rem; color: var(--primary); font-weight: 500;"></div>
          </div>

          <!-- Matriz de Checkboxes -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;" id="matrix-checkboxes-container" class="hidden">
            
            <!-- Acceso a Menús -->
            <div class="stat-card" style="padding: 25px;">
              <h4 style="margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: white;">
                Acceso a Secciones (Menú)
              </h4>
              <div id="menu-checks-list" style="display: flex; flex-direction: column; gap: 14px;">
                <!-- Cargado dinámicamente -->
              </div>
            </div>

            <!-- Acceso a Permisos (CRUD Módulos) -->
            <div class="stat-card" style="padding: 25px;">
              <h4 style="margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: white;">
                Permisos de Operaciones CRUD
              </h4>
              <div id="permission-checks-list" style="display: flex; flex-direction: column; gap: 20px; max-height: 500px; overflow-y: auto; padding-right: 10px;">
                <!-- Cargado dinámicamente -->
              </div>
            </div>
          </div>

          <!-- Botón Guardar -->
          <div id="matrix-actions-container" class="hidden" style="text-align: right; margin-bottom: 40px;">
            <button id="btn-save-matrix" class="btn-primary" style="padding: 14px 40px;" ${e?"":"disabled"}>
              Guardar Matriz de Seguridad
            </button>
          </div>
        </div>

        <!-- Contenedor Pestaña 2: Gestión de Menús (Sin Formulario de Creación Libre) -->
        <div id="pane-menus" class="${this.activeTab!=="menus"?"hidden":""}">
          <div style="width: 100%;">
            <!-- Listado de Menús Existentes -->
            <div class="table-card" style="margin-top: 0; width: 100%;">
              <div style="padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="margin: 0; font-size: 1.1rem; color: white;">Menús Activos del Sistema</h3>
                  <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">Solo se permite modificar etiquetas, grupos e iconos de los menús mapeados para preservar la consistencia.</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Clave</th>
                    <th>Etiqueta</th>
                    <th>Grupo / Menú Padre</th>
                    <th>Icono SVG</th>
                    ${e?'<th style="text-align: center;">Acciones</th>':""}
                  </tr>
                </thead>
                <tbody id="menus-table-body">
                  <tr><td colspan="6" style="text-align: center;">Cargando menús...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Editar Menú -->
        <div id="modal-edit-menu" class="modal hidden">
          <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
              <h2>Editar Configuración de Menú</h2>
              <span class="close-modal" id="close-modal-edit-menu">&times;</span>
            </div>
            <form id="form-edit-menu" class="modal-form">
              <div id="edit-menu-label-container"></div>
              <div id="edit-menu-parent-container"></div>
              
              <!-- Grid de Iconos Personalizado -->
              <div class="custom-form-group">
                <label style="margin-bottom: 8px; display: block;">Seleccionar Icono del Menú</label>
                <div id="menu-icons-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 8px;">
                  <!-- Poblado dinámicamente -->
                </div>
              </div>
              
              <button type="submit" class="btn-primary" style="margin-top: 25px; width: 100%;">Guardar Configuración</button>
            </form>
          </div>
        </div>

      </section>
    `}async onInit(){this.setupTabs(),await this.loadMasterData(),this.setupEventListeners()}setupTabs(){const e=document.getElementById("tab-matrix"),n=document.getElementById("tab-menus"),t=document.getElementById("pane-matrix"),i=document.getElementById("pane-menus");e==null||e.addEventListener("click",()=>{this.activeTab="matrix",e.classList.add("active"),n==null||n.classList.remove("active"),t==null||t.classList.remove("hidden"),i==null||i.classList.add("hidden")}),n==null||n.addEventListener("click",()=>{this.activeTab="menus",n.classList.add("active"),e==null||e.classList.remove("active"),i==null||i.classList.remove("hidden"),t==null||t.classList.add("hidden")})}initializeCustomFields(){const e=document.getElementById("edit-menu-label-container");e&&(this.editMenuLabelInput=new $(e,{label:"Etiqueta Visual (label)",name:"label",required:!0,placeholder:"Ej. Asistencia, Planilla de Costos"}),this.editMenuLabelInput.render())}initializeParentSelect(){const e=document.getElementById("edit-menu-parent-container");if(e){const n=this.allMenus.filter(t=>(t.parent_id===null||t.parent_id===void 0)&&t.id!==this.editingMenuId).map(t=>({value:t.id,label:t.label}));n.unshift({value:"",label:"Ninguno (Elemento Raíz o Grupo)"}),this.editMenuParentSelect=new T(e,{label:"Menú / Grupo Padre",name:"parent_id",options:n,placeholder:"-- Seleccionar Grupo Padre --"}),this.editMenuParentSelect.render()}}renderIconsGrid(){const e=document.getElementById("menu-icons-grid");e&&(e.innerHTML=this.menuIcons.map(n=>{const i=n.name===this.selectedIcon?"border: 2px solid var(--primary); background: rgba(79,70,229,0.15);":"border: 1px solid var(--border);";return`
        <button type="button" class="btn-icon-option" data-name="${n.name}"
          style="display: flex; align-items: center; justify-content: center; padding: 12px; border-radius: 8px; cursor: pointer; color: white; transition: var(--transition); background: transparent; ${i}"
          onmouseover="this.style.borderColor='var(--primary)'" 
          onmouseout="if('${n.name}' !== '${this.selectedIcon}') this.style.borderColor='var(--border)'">
          ${n.svg}
        </button>
      `}).join(""),e.querySelectorAll(".btn-icon-option").forEach(n=>{n.addEventListener("click",()=>{const t=n.getAttribute("data-name");t&&(this.selectedIcon=t,this.renderIconsGrid())})}))}async loadMasterData(){try{const e=await fetch("/security/menus",{headers:this.getAuthHeaders()});if(!e.ok)throw new Error;this.allMenus=await e.json(),this.renderMenusTable();const n=await fetch("/security/permissions",{headers:this.getAuthHeaders()});if(!n.ok)throw new Error;this.allPermissions=await n.json();const t=await fetch("/security/roles",{headers:this.getAuthHeaders()});if(!t.ok)throw new Error;this.roles=await t.json(),this.renderRolesSelect()}catch{m.error("Error de comunicación al cargar la configuración de seguridad.")}}renderRolesSelect(){const e=document.getElementById("rbac-role-select-container");if(!e)return;const n=this.roles.map(t=>({value:t.id,label:t.name.toUpperCase()}));this.rbacRoleSelect=new T(e,{label:"Rol del Sistema",name:"role_id",options:n,placeholder:"-- Seleccionar Rol --",onChange:async t=>{const i=document.getElementById("role-description"),s=document.getElementById("matrix-checkboxes-container"),a=document.getElementById("matrix-actions-container");if(!t){this.selectedRoleId=null,i&&(i.innerText=""),s==null||s.classList.add("hidden"),a==null||a.classList.add("hidden");return}this.selectedRoleId=parseInt(t.toString());const o=this.roles.find(r=>r.id===this.selectedRoleId);i&&o&&(i.innerText=`Descripción: ${o.description}`),await this.loadRoleAssignments(this.selectedRoleId),this.renderMatrixCheckboxes(),s==null||s.classList.remove("hidden"),a==null||a.classList.remove("hidden")}}),this.rbacRoleSelect.render()}renderMenusTable(){const e=document.getElementById("menus-table-body");if(!e)return;if(this.allMenus.length===0){e.innerHTML='<tr><td colspan="6" style="text-align: center;">No hay menús registrados.</td></tr>';return}const n=this.canWrite("security"),t='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';e.innerHTML=this.allMenus.map(i=>{let s="Raíz / Grupo";if(i.parent_id){const a=this.allMenus.find(o=>o.id===i.parent_id);a&&(s=`<span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;">${a.label}</span>`)}return`
        <tr>
          <td>${i.id}</td>
          <td><strong style="color: var(--primary);">${i.key}</strong></td>
          <td>${i.label}</td>
          <td>${s}</td>
          <td><span style="font-family: monospace; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 6px;">${i.icon}</span></td>
          ${n?`
            <td style="text-align: center;">
              <button class="action-icon-btn btn-edit-menu" data-id="${i.id}" data-label="${i.label}" data-icon="${i.icon}" data-parent-id="${i.parent_id||""}" title="Editar menú"
                style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
                ${t}
              </button>
            </td>
          `:""}
        </tr>
      `}).join("")}setupEventListeners(){const e=document.getElementById("btn-save-matrix");e==null||e.addEventListener("click",async()=>{this.selectedRoleId&&await this.saveMatrixAssignments()});const n=document.getElementById("modal-edit-menu"),t=document.getElementById("close-modal-edit-menu"),i=document.getElementById("form-edit-menu");t==null||t.addEventListener("click",()=>{n==null||n.classList.add("hidden"),this.editingMenuId=null});const s=document.getElementById("menus-table-body");s==null||s.addEventListener("click",a=>{var r,d,p;const o=a.target.closest(".btn-edit-menu");if(o){const l=o.getAttribute("data-id"),u=o.getAttribute("data-label"),g=o.getAttribute("data-icon"),f=o.getAttribute("data-parent-id");l&&u&&g&&(this.editingMenuId=parseInt(l),this.selectedIcon=g,this.initializeCustomFields(),(r=this.editMenuLabelInput)==null||r.setValue(u),this.initializeParentSelect(),f?(d=this.editMenuParentSelect)==null||d.setValue(f):(p=this.editMenuParentSelect)==null||p.setValue(""),this.renderIconsGrid(),n==null||n.classList.remove("hidden"))}}),i==null||i.addEventListener("submit",async a=>{var p,l;if(a.preventDefault(),!this.editingMenuId)return;const o=(p=this.editMenuParentSelect)==null?void 0:p.getValue(),r=o?parseInt(o.toString()):null,d={label:((l=this.editMenuLabelInput)==null?void 0:l.getValue())||"",icon:this.selectedIcon,parent_id:r};try{const u=await fetch(`/security/menus/${this.editingMenuId}`,{method:"PUT",headers:{...this.getAuthHeaders(),"Content-Type":"application/json"},body:JSON.stringify(d)}),g=await u.json();u.ok?(m.success(`Menú '${d.label}' actualizado con éxito.`),n==null||n.classList.add("hidden"),this.editingMenuId=null,await this.loadMasterData(),m.warning("Recarga el panel para que los cambios se reflejen en la barra lateral.")):m.error("Error: "+(g.detail||"No se pudo actualizar el menú."))}catch{m.error("Error de conexión.")}})}async loadRoleAssignments(e){try{const n=await fetch(`/security/roles/${e}/assignments`,{headers:this.getAuthHeaders()});if(!n.ok)throw new Error;const t=await n.json();this.roleMenuIds=t.menu_ids,this.rolePermissionIds=t.permission_ids}catch{m.error("Error al obtener privilegios del rol.")}}renderMatrixCheckboxes(){const e=document.getElementById("menu-checks-list");e&&(e.innerHTML=this.allMenus.map(t=>{const i=this.roleMenuIds.includes(t.id)?"checked":"";return`
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; font-size: 0.95rem;">
            <input type="checkbox" class="menu-checkbox" value="${t.id}" ${i} style="width: 18px; height: 18px; accent-color: var(--primary);">
            <span>${t.label} <small style="color: var(--text-muted);">(${t.key})</small></span>
          </label>
        `}).join(""));const n=document.getElementById("permission-checks-list");if(n){const t={};this.allPermissions.forEach(s=>{t[s.module]||(t[s.module]=[]),t[s.module].push(s)});let i="";for(const[s,a]of Object.entries(t))i+=`
          <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border); padding: 16px; border-radius: 12px;">
            <h5 style="margin-top: 0; margin-bottom: 12px; font-size: 0.9rem; text-transform: uppercase; color: var(--primary); letter-spacing: 0.5px;">
              Módulo: ${s.toUpperCase()}
            </h5>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        `,a.forEach(o=>{const r=this.rolePermissionIds.includes(o.id)?"checked":"";let d=o.action;o.action==="create"?d="Crear":o.action==="read"?d="Leer":o.action==="update"?d="Editar":o.action==="delete"&&(d="Eliminar"),i+=`
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; font-size: 0.85rem;">
              <input type="checkbox" class="perm-checkbox" value="${o.id}" ${r} style="width: 16px; height: 16px; accent-color: var(--success);">
              <span>${d} <small style="color: var(--text-muted);">(${o.code})</small></span>
            </label>
          `}),i+=`
            </div>
          </div>
        `;n.innerHTML=i}}async saveMatrixAssignments(){if(!this.selectedRoleId)return;const e=document.querySelectorAll(".menu-checkbox:checked"),n=Array.from(e).map(s=>parseInt(s.value)),t=document.querySelectorAll(".perm-checkbox:checked"),i=Array.from(t).map(s=>parseInt(s.value));try{if(!(await fetch(`/security/roles/${this.selectedRoleId}/assignments`,{method:"POST",headers:{...this.getAuthHeaders(),"Content-Type":"application/json"},body:JSON.stringify({menu_ids:n,permission_ids:i})})).ok)throw new Error;this.roleMenuIds=n,this.rolePermissionIds=i,m.success("¡Matriz de seguridad guardada con éxito!");const a=localStorage.getItem("auth_role"),o=this.roles.find(r=>r.id===this.selectedRoleId);o&&o.name===a&&m.warning("Has modificado tus propios permisos. Recarga la página para aplicar los cambios en el menú.")}catch{m.error("Error al guardar la matriz de seguridad.")}}}class pe{constructor(y){c(this,"container");c(this,"currentComponent",null);c(this,"routes",{resumen:G,empleados:Q,asistencia:ee,planilla:te,justificaciones:ie,turnos:ae,terminales:se,auditoria:oe,administradores:le,prediccion:de,seguridad:ce});this.container=y}navigate(y,e=!0){const n=localStorage.getItem("auth_menus")||"[]";let t=[];try{t=JSON.parse(n)}catch{t=[]}t.includes(y)||(y=t.length>0?t[0]:"resumen");const i=`/admin/${y}`;window.location.pathname!==i&&(e?history.pushState(null,"",i):history.replaceState(null,"",i)),this.currentComponent&&this.currentComponent.onDestroy(),this.container.innerHTML="";const s=document.getElementById("section-title");s&&(s.innerText=this.getSectionLabel(y));const a=this.routes[y];a&&(this.currentComponent=new a(this.container),this.currentComponent.render(),this.currentComponent.onInit())}getSectionFromUrl(y){const n=window.location.pathname.split("/").filter(t=>t.length>0);if(n.length>=2&&n[0]==="admin"){const t=n[1];if(this.routes[t])return t}return y}getSectionLabel(y){return{resumen:"Resumen de Estadísticas",asistencia:"Asistencia General",planilla:"Motor de Planillas",empleados:"Fichas de Personal",justificaciones:"Licencias y Justificaciones",turnos:"Asignación de Turnos",terminales:"Monitoreo de Terminales",auditoria:"Bitácora de Auditoría",administradores:"Administradores del Sistema",prediccion:"Planificación Presupuestaria IA",seguridad:"Seguridad y Control de Acceso (RBAC)"}[y]||"Panel General"}}async function ue(){const k=localStorage.getItem("auth_token");if(!k){window.location.href="/login";return}try{const y=await fetch("/auth/profile",{headers:{Authorization:`Bearer ${k}`}});if(y.status===401){localStorage.removeItem("auth_token"),window.location.href="/login";return}const e=await y.json();localStorage.setItem("auth_username",e.username),localStorage.setItem("auth_role",e.role),localStorage.setItem("auth_menus",JSON.stringify(e.menus)),localStorage.setItem("auth_menu_details",JSON.stringify(e.menu_details)),localStorage.setItem("auth_scopes",JSON.stringify(e.scopes));const n=document.getElementById("admin-user-btn");n&&(n.innerText=e.username.toUpperCase());const t=document.getElementById("content-area");if(!t)return;const i=new pe(t),s=document.getElementById("sidebar-container");if(s){const a=e.menus.length>0?e.menus[0]:"resumen",o=i.getSectionFromUrl(a),r=new U(s,o,d=>{i.navigate(d)});r.render(),r.onInit(),i.navigate(o,!1),window.addEventListener("popstate",()=>{const d=i.getSectionFromUrl(a);r.setActiveSection(d),i.navigate(d,!1)})}he(),me()}catch(y){console.error("Error inicializando aplicación:",y),localStorage.removeItem("auth_token"),window.location.href="/login"}}function he(){var e,n;const k=document.getElementById("admin-user-btn"),y=document.getElementById("admin-dropdown");k==null||k.addEventListener("click",t=>{t.stopPropagation(),y==null||y.classList.toggle("hidden")}),document.addEventListener("click",()=>{y==null||y.classList.add("hidden")}),(e=document.getElementById("btn-scanner"))==null||e.addEventListener("click",()=>{window.location.href="/"}),(n=document.getElementById("btn-logout"))==null||n.addEventListener("click",()=>{localStorage.removeItem("auth_token"),localStorage.removeItem("auth_username"),localStorage.removeItem("auth_role"),localStorage.removeItem("auth_menus"),localStorage.removeItem("auth_scopes"),window.location.href="/login"})}function me(){const k=document.getElementById("chat-toggle-btn"),y=document.getElementById("chat-window"),e=document.getElementById("chat-send-btn"),n=document.getElementById("chat-input"),t=document.getElementById("chat-messages");if(!k||!y||!e||!n||!t)return;k.addEventListener("click",()=>{y.classList.toggle("hidden"),n.focus()});const i=async()=>{const a=n.value.trim();if(!a)return;n.value="";const o=document.createElement("div");o.className="user-msg",o.innerText=a,t.appendChild(o),t.scrollTop=t.scrollHeight;const r=document.createElement("div");r.className="bot-msg",r.innerText="Pensando...",t.appendChild(r),t.scrollTop=t.scrollHeight;try{const d=localStorage.getItem("auth_token"),p={"Content-Type":"application/json"};d&&(p.Authorization=`Bearer ${d}`);const l=await fetch("/knowledge/ask",{method:"POST",headers:p,body:JSON.stringify({question:a})});if(!l.ok)throw new Error;const u=await l.json();r.innerText=u.answer}catch{r.innerText="Error al conectar con el asistente IA de administración."}t.scrollTop=t.scrollHeight};e.addEventListener("click",i),n.addEventListener("keypress",a=>{a.key==="Enter"&&i()});const s=document.getElementById("chat-suggestions");s&&s.addEventListener("click",a=>{const o=a.target;if(o&&o.classList.contains("suggestion-pill")){const r=o.innerText;n.value=r,i()}})}document.addEventListener("DOMContentLoaded",ue);
