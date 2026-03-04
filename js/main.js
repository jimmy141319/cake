
let cart=[];

function addCart(name,price){
cart.push({name,price});
renderCart();
}

function renderCart(){
let list=document.getElementById("cartList");
let total=0;

list.innerHTML="";

cart.forEach(i=>{
let li=document.createElement("li");
li.textContent=i.name+" $"+i.price;
list.appendChild(li);
total+=i.price;
});

document.getElementById("total").textContent="總金額: $"+total;

let msg="我要訂購:%0A";
cart.forEach(i=>{
msg+=i.name+" $"+i.price+"%0A";
});

document.getElementById("lineOrder").href=
"https://line.me/R/ti/p/~jimmy141319?text="+msg;
}
