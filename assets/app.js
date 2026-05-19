const STORAGE_KEY="malla_icinf_data_v1";
const CSV_FILE="malla_icinf_volcado.csv";
const AREAS=[
 "Año formativo","Área de Formación Básica","Área de Formación Especialidad","Área de Formación Práctica",
 "Área de Formación en Investigación","Área de Formación Integral Complementaria Obligatoria",
 "Área de Formación Integral Complementaria de Libre Elección"
];
const BG={
 "Año formativo":"#B7B7B7","Área de Formación Básica":"#6696E9","Área de Formación Especialidad":"#FF9F5D",
 "Área de Formación Práctica":"#E2DC69","Área de Formación en Investigación":"#66C4B6",
 "Área de Formación Integral Complementaria Obligatoria":"#E88090",
 "Área de Formación Integral Complementaria de Libre Elección":"#9E9CBC"
};
const BORDER={"Integradora":"#E30613","VcM":"#096D17","Troncal":"#170EC4"};
const FIELDS=[
 ["ID","id"],["Código de Asignatura","codigo"],["Nombre Asignatura","nombre"],["Número de Creditos SCT","creditos"],
 ["Semestre","semestre"],["Tipo de Asignatura","descriptor"],["Número de Horas","horasTotales"],
 ["Número de Horas Presenciales","hp"],["Número de Horas Teóricas Presenciales","htp"],["Número de Horas Prácticas Presenciales","hpp"],
 ["Número de Horas de Laboratorio Presenciales","hlp"],["Número de Horas Autónomas","ha"],["Número de Horas Teóricas Autónomas","hta"],
 ["Número de Horas Prácticas Autónomas","hpa"],["Número de Horas de Laboratorio Autónomas","hla"],["Prerrequisitos","prereqsRaw"],["Categoría","categoria"]
];
function norm(x){return (x??"").toString().trim()}
function num(x){const v=Number(String(x??"").replace(",",".").trim());return Number.isFinite(v)?v:0}
function safe(s){return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function fromCsvRow(r){return {id:norm(r["ID"]),codigo:norm(r["Código de Asignatura"]),nombre:norm(r["Nombre Asignatura"]),creditos:num(r["Número de Creditos SCT"]),semestre:norm(r["Semestre"]),descriptor:norm(r["Tipo de Asignatura"]),horasTotales:num(r["Número de Horas"]),hp:num(r["Número de Horas Presenciales"]),htp:num(r["Número de Horas Teóricas Presenciales"]),hpp:num(r["Número de Horas Prácticas Presenciales"]),hlp:num(r["Número de Horas de Laboratorio Presenciales"]),ha:num(r["Número de Horas Autónomas"]),hta:num(r["Número de Horas Teóricas Autónomas"]),hpa:num(r["Número de Horas Prácticas Autónomas"]),hla:num(r["Número de Horas de Laboratorio Autónomas"]),prereqsRaw:norm(r["Prerrequisitos"]),categoria:norm(r["Categoría"])}}
function toCsvRows(rows){return rows.map(r=>Object.fromEntries(FIELDS.map(([csv,k])=>[csv,r[k]??""])))}
function parsePrereqs(s){return norm(s).split("|").map(norm).filter(Boolean)}
function saveRows(rows){localStorage.setItem(STORAGE_KEY,JSON.stringify(rows)); window.dispatchEvent(new Event("malla-data-changed"))}
async function loadRows(){const saved=localStorage.getItem(STORAGE_KEY); if(saved){try{return JSON.parse(saved)}catch(e){}}
 const res=await fetch(CSV_FILE,{cache:"no-store"}); const txt=await res.text(); const parsed=Papa.parse(txt,{header:true,skipEmptyLines:true}); const rows=parsed.data.map(fromCsvRow); saveRows(rows); return rows}
function clearRows(){localStorage.removeItem(STORAGE_KEY)}
function download(name, text, type="text/plain"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function buildMaps(rows){const byId=new Map(), bySemester=new Map(), prereq=new Map(), dep=new Map(); rows.forEach(r=>{if(!r.id)return; byId.set(r.id,r); const s=r.semestre||"Sin semestre"; if(!bySemester.has(s))bySemester.set(s,[]); bySemester.get(s).push(r)}); rows.forEach(r=>{const ps=parsePrereqs(r.prereqsRaw); prereq.set(r.id,ps); ps.forEach(p=>{if(!dep.has(p))dep.set(p,[]); dep.get(p).push(r.id)})}); return {byId,bySemester,prereq,dep}}
function semSort(a,b){const na=Number(a),nb=Number(b); if(Number.isFinite(na)&&Number.isFinite(nb)) return na-nb; return String(a).localeCompare(String(b))}
function buildLegend(el){el.innerHTML=""; Object.entries(BG).forEach(([k,v])=>el.insertAdjacentHTML("beforeend",`<div class="legendItem"><span class="swatch" style="background:${v}"></span>${safe(k)}</div>`)); Object.entries(BORDER).forEach(([k,v])=>el.insertAdjacentHTML("beforeend",`<div class="legendItem"><span class="swatch" style="border:3px solid ${v}"></span>Borde: ${safe(k)}</div>`))}
function renderSummary(rows, tbody, meta){const total=rows.reduce((a,r)=>a+num(r.creditos),0); if(meta)meta.textContent=`${rows.length} asignaturas · ${total} créditos SCT`; const agg=new Map(AREAS.map(a=>[a,{count:0,credits:0}])); rows.forEach(r=>{if(agg.has(r.descriptor)){agg.get(r.descriptor).count++;agg.get(r.descriptor).credits+=num(r.creditos)}}); tbody.innerHTML=""; for(const a of AREAS.filter(x=>x!="Año formativo")){const x=agg.get(a)||{count:0,credits:0}; tbody.insertAdjacentHTML("beforeend",`<tr><td>${safe(a)}</td><td>${x.count}</td><td>${x.credits}</td><td>${total?((x.credits*100/total).toFixed(1)):"0.0"}%</td></tr>`)}}
function renderMalla(rows, root, onOpen){const {bySemester,prereq,dep}=buildMaps(rows); root.innerHTML=""; const keys=[...bySemester.keys()].sort(semSort); keys.forEach(sem=>{const list=bySemester.get(sem).sort((a,b)=>String(a.codigo).localeCompare(String(b.codigo))); const sec=document.createElement("section"); sec.className="semester"; sec.innerHTML=`<h2><span>Semestre ${safe(sem)}</span><span class="badge">${list.length}</span></h2><div class="cards"></div><div class="badge" style="margin-top:12px">Créditos: ${list.reduce((a,r)=>a+num(r.creditos),0)} · Horas: ${list.reduce((a,r)=>a+num(r.horasTotales),0)}</div>`; const cards=sec.querySelector(".cards"); list.forEach(r=>{const c=document.createElement("article"); c.className="course"; c.dataset.id=r.id; c.style.background=BG[r.descriptor]||"#cfd8e3"; c.style.borderColor=BORDER[r.categoria]||"rgba(0,0,0,.22)"; c.innerHTML=`<div class="code">${safe(r.codigo)}</div><div class="name">${safe(r.nombre)}</div><div class="foot"><span>${safe(r.creditos)}</span><span>${safe(r.horasTotales)}</span></div>`; c.onclick=()=>onOpen?.(r.id); c.onmouseenter=()=>highlight(r.id, prereq, dep); c.onmouseleave=clearHighlight; cards.appendChild(c)}); root.appendChild(sec)});}
function collectChain(id, prereq, dep){const set=new Set(); function up(x){if(set.has(x))return; set.add(x); (prereq.get(x)||[]).forEach(up)} function down(x){set.add(x); (dep.get(x)||[]).forEach(down)} up(id); down(id); return set}
function highlight(id, prereq, dep){const set=collectChain(id,prereq,dep); document.querySelectorAll(".course").forEach(el=>{el.classList.toggle("hl",set.has(el.dataset.id));el.classList.toggle("dim",!set.has(el.dataset.id))})}
function clearHighlight(){document.querySelectorAll(".course").forEach(el=>el.classList.remove("hl","dim"))}
function openCourseModal(rows,id){const r=rows.find(x=>x.id==id); if(!r)return; const bd=document.getElementById("modalBackdrop"), m=document.getElementById("modal"); document.getElementById("modalTitle").textContent=`${r.codigo} — ${r.nombre}`; const prereqs=parsePrereqs(r.prereqsRaw).map(pid=>{const pr=rows.find(x=>x.id==pid);return pr?`${pr.codigo} (${pid})`:`ID ${pid}`}).join(", ")||"Sin prerrequisitos"; document.getElementById("modalBody").innerHTML=`<p class="muted"><b>Área:</b> ${safe(r.descriptor)}<br><b>Categoría:</b> ${safe(r.categoria||"Normal")}<br><b>Prerrequisitos:</b> ${safe(prereqs)}</p><table><tr><th></th><th>Teóricas</th><th>Prácticas</th><th>Lab.</th></tr><tr><td>Presenciales</td><td>${r.htp}</td><td>${r.hpp}</td><td>${r.hlp}</td></tr><tr><td>Autónomas</td><td>${r.hta}</td><td>${r.hpa}</td><td>${r.hla}</td></tr><tr><td>Total</td><td colspan="3">${r.creditos} créditos · ${r.horasTotales} horas · Semestre ${safe(r.semestre)}</td></tr></table>`; bd.style.display=m.style.display="block"}