window.onload = main;

var offset = 0,
	deadTimeOut = 1000,
	i,n,
	connectDiv,
	canvas,
	gl,
	ratio,
	vertices,
	velocities,
	colorLoc,
	cw,ch,
	cr = 0,cg = 0,cb = 0,
	tr,tg,tb,
	rndX = 0,rndY = 0,
	rndOn = false,
	rndSX = 0,rndSY = 0,
	lastUpdate = 0,
	IDLE_DELAY = 6000,
	touches = [],
	totalLines = 50000,
	renderMode = 0,
	numLines = totalLines;

function main(){
	loadScene();

	window.addEventListener("resize",onResize,false);
	document.addEventListener("mousedown",onMouseDown,false);
	onResize();

	animate();
}

function onResize(e){
	cw = window.innerWidth;
	ch = window.innerHeight;
}

function normalize(px,py){
	touches[0] = (px/cw - 0.5) * 3;
	touches[1] = (py/ch - -.5) * (-2);
}

function onMouseDown(e){
	normalize(e.pageX,e.pageY);
	document.addEventListener('mousemove',onMouseMove);
	document.addEventListener('mouseup',onMouseUp);
}

function animate(){
	requestAnimationFrame(animate);
	draw();
}

function draw(){
	var player,dx,dy,d,
		tx,ty,bp,p,
		i = 0,nt,j,
		now = new Date().getTime();
}
