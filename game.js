const canvas=document.getElementById("game")
const ctx=canvas.getContext("2d")

canvas.width=innerWidth
canvas.height=innerHeight

const minimap=document.getElementById("minimap")
const mctx=minimap.getContext("2d")

let worldSize=3000

let time=0

let camera={x:0,y:0}

let player={
x:1500,
y:1500,
size:20,
speed:3,
car:null,
wanted:0
}

let joy={dx:0,dy:0}

let bullets=[]
let cars=[]
let police=[]
let npcs=[]
let buildings=[]

for(let i=0;i<25;i++){
cars.push({
x:Math.random()*worldSize,
y:Math.random()*worldSize,
w:50,
h:25,
speed:1+Math.random()*2
})
}

for(let i=0;i<40;i++){
npcs.push({
x:Math.random()*worldSize,
y:Math.random()*worldSize
})
}

for(let i=0;i<120;i++){
buildings.push({
x:Math.random()*worldSize,
y:Math.random()*worldSize,
w:60+Math.random()*60,
h:60+Math.random()*60
})
}

function spawnPolice(){
if(player.wanted>0){
police.push({
x:player.x+300,
y:player.y+300,
speed:2+player.wanted
})
}
}

setInterval(spawnPolice,5000)

const joystick=document.getElementById("joystick")
const stick=document.getElementById("stick")

joystick.addEventListener("touchmove",e=>{
let r=joystick.getBoundingClientRect()

let x=e.touches[0].clientX-r.left-60
let y=e.touches[0].clientY-r.top-60

joy.dx=x/40
joy.dy=y/40

stick.style.left=(30+x)+"px"
stick.style.top=(30+y)+"px"
})

joystick.addEventListener("touchend",()=>{
joy.dx=0
joy.dy=0
stick.style.left="30px"
stick.style.top="30px"
})

document.getElementById("shoot").onclick=()=>{
bullets.push({
x:player.x,
y:player.y,
vx:joy.dx*10,
vy:joy.dy*10
})

player.wanted=Math.min(5,player.wanted+1)
}

document.getElementById("enter").onclick=()=>{

if(player.car){
player.x=player.car.x
player.y=player.car.y
player.car=null
return
}

for(let car of cars){
let d=Math.hypot(player.x-car.x,player.y-car.y)
if(d<60){
player.car=car
break
}
}

}

function update(){

time+=0.002

if(player.car){
player.car.x+=joy.dx*6
player.car.y+=joy.dy*6
player.x=player.car.x
player.y=player.car.y
}else{
player.x+=joy.dx*player.speed
player.y+=joy.dy*player.speed
}

camera.x=player.x-canvas.width/2
camera.y=player.y-canvas.height/2

cars.forEach(c=>{
if(c!==player.car){
c.x+=c.speed
if(c.x>worldSize)c.x=0
}
})

npcs.forEach(n=>{
n.x+=Math.random()*2-1
n.y+=Math.random()*2-1
})

police.forEach(p=>{
let dx=player.x-p.x
let dy=player.y-p.y
let d=Math.hypot(dx,dy)

p.x+=dx/d*p.speed
p.y+=dy/d*p.speed
})

bullets.forEach(b=>{
b.x+=b.vx
b.y+=b.vy
})

document.getElementById("wanted").innerText="⭐".repeat(player.wanted)

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

let brightness=0.5+Math.sin(time)*0.5

ctx.fillStyle=`rgba(50,150,50,${brightness})`
ctx.fillRect(-camera.x,-camera.y,worldSize,worldSize)

ctx.fillStyle="#555"

for(let i=0;i<worldSize;i+=200){
ctx.fillRect(i-camera.x,0-camera.y,80,worldSize)
ctx.fillRect(0-camera.x,i-camera.y,worldSize,80)
}

ctx.fillStyle="#444"
buildings.forEach(b=>{
ctx.fillRect(b.x-camera.x,b.y-camera.y,b.w,b.h)
})

ctx.fillStyle="orange"
npcs.forEach(n=>{
ctx.fillRect(n.x-camera.x,n.y-camera.y,10,10)
})

ctx.fillStyle="blue"
cars.forEach(c=>{
ctx.fillRect(c.x-camera.x,c.y-camera.y,c.w,c.h)
})

if(!player.car){
ctx.fillStyle="red"
ctx.fillRect(player.x-camera.x,player.y-camera.y,player.size,player.size)
}

ctx.fillStyle="yellow"
bullets.forEach(b=>{
ctx.fillRect(b.x-camera.x,b.y-camera.y,5,5)
})

ctx.fillStyle="white"
police.forEach(p=>{
ctx.fillRect(p.x-camera.x,p.y-camera.y,20,20)
})

drawMinimap()

}

function drawMinimap(){

mctx.clearRect(0,0,120,120)

let scale=120/worldSize

mctx.fillStyle="green"
mctx.fillRect(0,0,120,120)

mctx.fillStyle="red"
mctx.fillRect(player.x*scale,player.y*scale,4,4)

mctx.fillStyle="blue"
cars.forEach(c=>{
mctx.fillRect(c.x*scale,c.y*scale,2,2)
})

}

function loop(){
update()
draw()
requestAnimationFrame(loop)
}

loop()
