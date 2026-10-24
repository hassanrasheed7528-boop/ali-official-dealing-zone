import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ADMIN_EMAIL, firebaseConfig } from "./config.js";
const $=s=>document.querySelector(s), authStatus=$("#authStatus"), formStatus=$("#formStatus");
let auth,db,currentUser=null,items=[];
function message(el,msg,type=""){el.textContent=msg;el.className="status "+type;}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function clearForm(){$("#productId").value="";$("#productForm").reset();message(formStatus,"");}
function render(){
 $("#adminProducts").innerHTML=items.map(p=>`<div class="admin-row"><div><strong>${escapeHtml(p.title)}</strong><small>Rs. ${Number(p.price||0).toLocaleString("en-PK")} · ${escapeHtml(p.category||"Free Fire ID")}</small></div><div class="actions"><button class="btn secondary" data-edit="${p.id}">Edit</button><button class="btn secondary" data-delete="${p.id}">Delete</button></div></div>`).join("")||'<p class="status">No accounts added yet.</p>';
 $("#adminProducts").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{const p=items.find(x=>x.id===b.dataset.edit);$("#productId").value=p.id;$("#title").value=p.title||"";$("#price").value=p.price||0;$("#category").value=p.category||"";$("#image").value=p.image||"";$("#details").value=p.details||"";window.scrollTo({top:0,behavior:"smooth"});});
 $("#adminProducts").querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{const p=items.find(x=>x.id===b.dataset.delete);if(!confirm(`Delete "${p.title}"?`))return;try{await deleteDoc(doc(db,"products",p.id));await loadItems();message(formStatus,"Account deleted.","success");}catch(e){message(formStatus,"Delete failed. Check Firebase rules.","error");}});
}
async function loadItems(){const snap=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc")));items=snap.docs.map(d=>({id:d.id,...d.data()}));render();}
$("#login").onclick=async()=>{try{if(!auth)throw new Error("Setup required. Follow README.txt first.");await signInWithPopup(auth,new GoogleAuthProvider());}catch(e){message(authStatus,e.message||"Sign-in failed.","error");}};
$("#logout").onclick=()=>signOut(auth);
$("#clearForm").onclick=clearForm;
$("#productForm").onsubmit=async e=>{e.preventDefault();if(!currentUser||currentUser.email.toLowerCase()!==ADMIN_EMAIL.toLowerCase()){message(formStatus,"Owner access required.","error");return;}
const data={title:$("#title").value.trim(),price:Number($("#price").value),category:$("#category").value.trim(),image:$("#image").value.trim(),details:$("#details").value.trim(),updatedAt:serverTimestamp()};
try{const id=$("#productId").value;if(id)await updateDoc(doc(db,"products",id),data);else await addDoc(collection(db,"products"),{...data,createdAt:serverTimestamp()});clearForm();await loadItems();message(formStatus,"Account saved successfully.","success");}catch(e){message(formStatus,"Save failed. Check Firebase configuration and security rules.","error");}};
try{
 if(firebaseConfig.apiKey.startsWith("YOUR_")||ADMIN_EMAIL.includes("YOUR_"))throw new Error("Setup required. Add your Firebase config and your own Gmail in config.js.");
 const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
 onAuthStateChanged(auth,async user=>{
 currentUser=user;
 if(!user){$("#manager").hidden=true;$("#logout").hidden=true;$("#login").hidden=false;message(authStatus,"Not signed in.");return;}
 if(!user.email||user.email.toLowerCase()!==ADMIN_EMAIL.toLowerCase()){await signOut(auth);$("#manager").hidden=true;message(authStatus,"Access denied. This Google account is not the configured owner.","error");return;}
 $("#login").hidden=true;$("#logout").hidden=false;$("#manager").hidden=false;message(authStatus,"Signed in as owner: "+user.email,"success");
 try{await loadItems();}catch(e){message(formStatus,"Could not load inventory. Publish the Firestore rules from firestore.rules.","error");}
 });
}catch(e){$("#login").disabled=true;message(authStatus,e.message,"error");}
