
const LINE_ID="jimmy141319";
const FREE_SHIPPING_AT=999, SHIPPING_FEE=80;
const products=JSON.parse(document.getElementById("seed").textContent);
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const fmt=n=>"NT$ "+n.toLocaleString("zh-Hant-TW");
let cart=load();
function save(){localStorage.setItem("mustar_cart_v3",JSON.stringify(cart));}
function load(){try{return JSON.parse(localStorage.getItem("mustar_cart_v3"))||{};}catch{return {};}} 
function count(){return Object.values(cart).reduce((a,b)=>a+b,0);}
function subtotal(){return Object.entries(cart).reduce((s,[id,q])=>{const p=products.find(x=>x.id===id);return s+(p?p.price*q:0);},0);}
function shipFee(sub){return sub===0?0:(sub>=FREE_SHIPPING_AT?0:SHIPPING_FEE);}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1400);}
function render(filter="all"){
  const list=products.filter(p=>filter==="all"?true:p.cat===filter);
  $("#grid").innerHTML=list.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="cb">
        <span class="tag">${p.tag}</span>
        <div class="cn">${p.name}</div>
        <p class="cd">${p.desc}</p>
        <div class="foot">
          <div class="price">${fmt(p.price)}</div>
          <button class="buy" data-add="${p.id}">加入購物車</button>
        </div>
      </div>
    </article>`).join("");
  $$(".buy").forEach(b=>b.onclick=()=>{const id=b.dataset.add;cart[id]=(cart[id]||0)+1;save();update();toast("已加入購物車 ✅");});
}
function update(){$("#cartCount").textContent=count();}
function openDrawer(){ $("#drawer").classList.add("on"); $("#drawer").setAttribute("aria-hidden","false"); renderCart(); }
function closeDrawer(){ $("#drawer").classList.remove("on"); $("#drawer").setAttribute("aria-hidden","true"); }
function renderCart(){
  const entries=Object.entries(cart);
  const items=$("#items");
  if(!entries.length){ items.innerHTML='<div class="muted">購物車是空的。先去選商品吧 👽</div>'; }
  else{
    items.innerHTML=entries.map(([id,q])=>{const p=products.find(x=>x.id===id);return `
      <div class="item">
        <div><div class="nm">${p.name}</div><div class="mt">${fmt(p.price)} · ${p.tag}</div></div>
        <div class="qty">
          <button class="q" data-dec="${id}">−</button><div>${q}</div><button class="q" data-inc="${id}">＋</button>
        </div>
      </div>`;}).join("");
    $$(".q").forEach(b=>b.onclick=()=>{
      if(b.dataset.inc){const id=b.dataset.inc;cart[id]=(cart[id]||0)+1;}
      if(b.dataset.dec){const id=b.dataset.dec;cart[id]=Math.max(0,(cart[id]||0)-1); if(cart[id]===0) delete cart[id];}
      save();update();renderCart();
    });
  }
  const sub=subtotal(), ship=shipFee(sub), tot=sub+ship;
  $("#sub").textContent=fmt(sub); $("#ship").textContent=fmt(ship); $("#tot").textContent=fmt(tot);
}
function orderText(){
  const sub=subtotal(), ship=shipFee(sub), tot=sub+ship;
  const n=$("#n").value.trim()||"(未填)", p=$("#p").value.trim()||"(未填)", a=$("#a").value.trim()||"(未填)", m=$("#m").value.trim()||"(無)";
  let lines=["【沐星人 MuStar｜訂單】","", "✅ 商品："];
  Object.entries(cart).forEach(([id,q])=>{const pr=products.find(x=>x.id===id);lines.push(`- ${pr.name} x${q}（${fmt(pr.price)}）`);});
  lines.push("",`小計：${fmt(sub)}`,`運費：${fmt(ship)}`,`總計：${fmt(tot)}`,"","📦 收件：",`姓名：${n}`,`電話：${p}`,`地址：${a}`,`備註：${m}`,"","請回覆確認可出貨時間/付款方式。");
  return lines.join("\n");
}
function openLine(){ window.open("https://line.me/R/msg/text/?"+encodeURIComponent(orderText()),"_blank","noopener"); }
function init(){
  // filters
  $("#filters").onclick=(e)=>{
    const b=e.target.closest("button"); if(!b) return;
    $$("#filters button").forEach(x=>x.classList.remove("on")); b.classList.add("on");
    render(b.dataset.f);
  };
  // drawer
  $("#cartBtn").onclick=openDrawer; $("#cartBtn2").onclick=openDrawer;
  $("#close").onclick=closeDrawer; $("#back").onclick=closeDrawer;
  $("#clear").onclick=()=>{cart={};save();update();renderCart();toast("已清空");};
  $("#checkout").onclick=()=>{if(!Object.keys(cart).length) return toast("購物車是空的"); openLine();};
  // line
  $("#lineIdTxt").textContent=LINE_ID;
  $("#openLine").href="https://line.me/R/ti/p/~"+encodeURIComponent(LINE_ID);
  $("#copyLine").onclick=async()=>{try{await navigator.clipboard.writeText(LINE_ID);toast("已複製 Line ID ✅");}catch{toast("複製失敗，手動複製即可");}};
  render("all"); update(); stars();
}
function stars(){
  const c=$("#stars"),x=c.getContext("2d"); let w,h,d; const N=170; let s=[];
  const rs=()=>{d=Math.min(2,devicePixelRatio||1);w=c.width=innerWidth*d;h=c.height=innerHeight*d;c.style.width=innerWidth+"px";c.style.height=innerHeight+"px";
    s=Array.from({length:N},()=>({x:Math.random()*w,y:Math.random()*h,v:(Math.random()*1+.2)*d,r:(Math.random()*1.2+.4)*d}));};
  rs(); addEventListener("resize",rs,{passive:true});
  let last=performance.now(); (function t(now){const dt=Math.min(40,now-last);last=now;x.clearRect(0,0,w,h);
    for(const a of s){a.y+=a.v*dt*.03; if(a.y>h){a.y=-10;a.x=Math.random()*w;} x.fillStyle="rgba(255,255,255,.85)"; x.beginPath(); x.arc(a.x,a.y,a.r,0,Math.PI*2); x.fill();}
    requestAnimationFrame(t);})(last);
}
document.addEventListener("DOMContentLoaded",init);
