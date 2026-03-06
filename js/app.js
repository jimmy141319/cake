const canvas=document.getElementById('stars');const ctx=canvas.getContext('2d');
function resize(){canvas.width=window.innerWidth*devicePixelRatio;canvas.height=window.innerHeight*devicePixelRatio;canvas.style.width=window.innerWidth+'px';canvas.style.height=window.innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
resize();window.addEventListener('resize',resize);
const stars=Array.from({length:120},()=>({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*1.8+.4,a:Math.random()*.6+.2,s:Math.random()*.3+.05}));
function draw(){ctx.clearRect(0,0,window.innerWidth,window.innerHeight);for(const star of stars){star.y+=star.s;if(star.y>window.innerHeight){star.y=-5;star.x=Math.random()*window.innerWidth}ctx.beginPath();ctx.fillStyle=`rgba(255,255,255,${star.a})`;ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}draw();
