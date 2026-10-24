import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig, WHATSAPP_NUMBER } from "./config.js";
const status = document.querySelector("#status"), products = document.querySelector("#products"), search = document.querySelector("#search");
document.querySelector("#chatTop").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamualaikum, mujhe Free Fire ID ke bare mein maloomat chahiye.")}`;
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
let all=[];
function render(){
 const term=search.value.trim().toLowerCase();
 const list=all.filter(p=>`${p.title} ${p.category||""} ${p.details||""}`.toLowerCase().includes(term));
 products.innerHTML=list.map(p=>`<article class="product">${p.image?`<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.outerHTML='<div class=&quot;placeholder&quot;>FF</div>'">`:`<div class="placeholder">FF</div>`}<div class="product-body"><span class="category">${escapeHtml(p.category||"Free Fire ID")}</span><h3>${escapeHtml(p.title)}</h3><div class="details">${escapeHtml(p.details||"Contact us for account details.")}</div><div class="price">Rs. ${Number(p.price||0).toLocaleString("en-PK")}</div><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamualaikum, mujhe is account ke bare mein maloomat chahiye: "+p.title+" (Rs. "+p.price+")")}">Ask on WhatsApp</a></div></article>`).join("");
 if(!list.length) status.textContent=term?"No matching accounts found.":"No accounts listed yet. Please check again soon.";
 else status.textContent=`${list.length} account${list.length===1?"":"s"} available`;
}
search.addEventListener("input",render);
try{
 if(firebaseConfig.apiKey.startsWith("YOUR_")) throw new Error("Setup required: add your Firebase config in config.js.");
 const app=initializeApp(firebaseConfig), db=getFirestore(app);
 const snap=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc")));
 all=snap.docs.map(d=>({id:d.id,...d.data()})); render();
}catch(e){status.textContent=e.message.includes("Setup required")?"Website setup is not finished yet. See README.txt to connect Firebase.":"Could not load listings. Check Firebase setup and Firestore rules.";status.classList.add("error");}
