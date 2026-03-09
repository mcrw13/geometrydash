const canvas=document.getElementById("game")
const ctx=canvas.getContext("2d")

canvas.width=innerWidth
canvas.height=innerHeight

let camera={x:0,y:0}

let player={
x:500,
y:500,
size:20,
speed:3,
inCar:false
}

let cars=[]
let police=[]

for(let i=0;i<20;i++){
cars.push({
x:Math.random()*2000,
y:Math.random()*2000,
w:40,
h:20,
speed:1+Math.random()*2
})
}

function spawnPolice(){
police.push({
x:player.x+300,
y:player.y+300,
speed:2
})
}

setInterval(spawnPolice,10000)

let joy={
active:false,
dx:0,
dy:0
}

const joystick=document.getElementById("joystick")
const stick=document.getElementById("stick")

joystick.addEventListener("touchstart",e=>{
joy.active=true
})

joystick.addEventListener("touchmove",e=>{
let rect=joystick.getBoundingClientRect()
let x=e.touches[0].clientX-rect.left-60
let y=e.touches[0].clientY-rect.top-60

joy.dx=x/40
joy.dy=y/40

stick.style.left=(30+x)+"px"
stick.style.top=(30+y)+"px"
})

joystick.addEventListener("touchend",()=>{
joy.active=false
joy.dx=0
joy.dy=0
stick.style.left="30px"
stick.style.top="30px"
})

document.getElementById("enter").onclick=()=>{
for(let car of cars){
let d=Math.hypot(player.x-car.x,player.y-car.y)
if(d<50){
player.inCar=!player.inCar
}
}
}

function update(){

player.x+=joy.dx*(player.inCar?6:3)
player.y+=joy.dy*(player.inCar?6:3)

camera.x=player.x-canvas.width/2
camera.y=player.y-canvas.height/2

cars.forEach(c=>{
c.x+=c.speed
if(c.x>2000)c.x=0
})

police.forEach(p=>{
let dx=player.x-p.x
let dy=player.y-p.y
let d=Math.hypot(dx,dy)

p.x+=dx/d*p.speed
p.y+=dy/d*p.speed
})
}

function drawRoads(){

ctx.fillStyle="#2e7d32"
ctx.fillRect(-camera.x,-camera.y,2000,2000)

ctx.fillStyle="#555"

for(let i=0;i<2000;i+=200){
ctx.fillRect(i-camera.x,0-camera.y,80,2000)
ctx.fillRect(0-camera.x,i-camera.y,2000,80)
}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawRoads()

ctx.fillStyle="blue"
cars.forEach(c=>{
ctx.fillRect(c.x-camera.x,c.y-camera.y,c.w,c.h)
})

ctx.fillStyle="red"
ctx.fillRect(player.x-camera.x,player.y-camera.y,player.size,player.size)

ctx.fillStyle="white"
police.forEach(p=>{
ctx.fillRect(p.x-camera.x,p.y-camera.y,20,20)
})

}

function loop(){
update()
draw()
requestAnimationFrame(loop)
}

loop()
