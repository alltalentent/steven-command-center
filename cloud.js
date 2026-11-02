// Browser ESM Firebase integration. Firebase web config contains non-secret identifiers.
import {initializeApp} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const storageKey="steven_firebase_config_v1";
let auth,db,currentUser=null,ref=null,syncEnabled=false,working=false,latest=null;
const status=(s)=>{const e=document.getElementById("cloudStatus");if(e)e.textContent=s;};
const valid=d=>d&&["tasks","events","projects"].every(k=>Array.isArray(d[k]));
const errorText=e=>({ "auth/unauthorized-domain":"請先在 Firebase Authentication 加入 alltalentent.github.io 授權網域","auth/operation-not-allowed":"請先啟用 Google 登入供應商","permission-denied":"Firestore 權限不足：請確認 Rules 已發布","auth/popup-blocked":"瀏覽器封鎖登入視窗，請允許彈出視窗"}[e?.code]||e?.message||String(e));
function show(){const el=document.getElementById("cloudAccount");if(el)el.textContent=currentUser?currentUser.email+" · "+(syncEnabled?"雲端同步中":"待確認同步"):"尚未登入";}
const cloud={get ready(){return syncEnabled&&!!currentUser},get user(){return currentUser},get config(){try{return JSON.parse(localStorage.getItem(storageKey))}catch{return null}},
 async setup(raw){let c=typeof raw==="string"?JSON.parse(raw):raw;if(!c.apiKey||!c.appId||c.projectId!=="steven-command-center-513b5")throw Error("請貼上此專案完整的 Firebase Web App 設定（apiKey / appId / projectId）");localStorage.setItem(storageKey,JSON.stringify(c));location.reload()},
 async connect(){let c=cloud.config;if(!c){status("尚未設定 Firebase Web App");return}try{const app=initializeApp(c);auth=getAuth(app);db=getFirestore(app);onAuthStateChanged(auth,async user=>{currentUser=user;syncEnabled=false;ref=null;show();if(user){await initializeUser(user)}else{status("尚未登入 Google");show()}window.render?.()})}catch(e){status("Firebase 初始化失敗："+errorText(e))}},
 async login(){if(!auth){alert("請先在 Settings 貼上 Firebase Web App 設定");window.navigate?.("settings");return}try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){alert("Google 登入失敗："+errorText(e))}},
 async logout(){if(auth)await signOut(auth);syncEnabled=false;status("已登出；目前瀏覽器可能仍保留本機資料");show()},
 async write(d){if(!cloud.ready||!valid(d))return;latest=JSON.parse(JSON.stringify(d));if(working)return;working=true;try{while(latest){let value=latest;latest=null;await setDoc(ref,{data:value,updatedAt:new Date().toISOString(),schema:1});status("已同步至 Firebase · "+new Date().toLocaleTimeString("zh-TW"))}}catch(e){status("同步失敗："+errorText(e));alert("資料已保存在本機，但雲端同步失敗："+errorText(e))}finally{working=false}},
};
async function initializeUser(user){try{status("正在讀取雲端資料…");ref=doc(db,"users",user.uid,"dashboard","main");let snapshot=await getDoc(ref),remote=snapshot.exists()?snapshot.data().data:null;let local=window.data;let hasLocal=valid(local)&&["tasks","events","projects"].some(k=>local[k].length);
if(valid(remote)){if(hasLocal&&JSON.stringify(local)!==JSON.stringify(remote)){if(confirm("已找到雲端資料。按「確定」載入雲端資料（會取代本機顯示）；按「取消」保留本機資料並上傳覆蓋雲端。若不確定，先取消登入並匯出備份。")){window.data=remote;window.saveLocalOnly?.()}else{syncEnabled=true;await cloud.write(local)}}else{window.data=remote;window.saveLocalOnly?.()}}
else if(hasLocal){if(confirm("雲端尚無資料。是否將目前瀏覽器的待辦、行事曆與專案上傳至個人雲端？")){syncEnabled=true;await cloud.write(local)}else{status("尚未啟用同步，請先在 Settings 匯出備份後重新登入");show();return}}
else{window.data={tasks:[],events:[],projects:[]};window.saveLocalOnly?.();syncEnabled=true;await cloud.write(window.data)}
syncEnabled=true;status("雲端同步已啟用");show();window.render?.()
}catch(e){syncEnabled=false;status("無法連接 Firestore："+errorText(e));show();alert(errorText(e))}}
window.cloud=cloud;window.cloudLogin=()=>cloud.login();window.cloudLogout=()=>cloud.logout();window.cloudSetup=()=>{let raw=prompt("貼上 Firebase Web App 的 firebaseConfig JSON（不是服務帳戶金鑰）");if(raw)cloud.setup(raw).catch(e=>alert(errorText(e)))};
cloud.connect();
