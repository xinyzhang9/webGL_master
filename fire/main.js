var options = {
	fireEmitPositionSpread: {x:100, y:20},

	fireEmitRate: 1600,
	fireEmitRateSlider: {min: 1, max: 5000},

	fireSize: 40.0,
	fireSizeSlider: {min: 2.0, max: 100.0},

	fireEmitAngleVariance: 42,
	fireEmitAngleVarianceSlider: {min:0.0, max:Math.PI/2},

	fireSpeed: 200.0,
	fireSpeedSlider: {min: 20.0, max: 500.0},

	fireSpeedVariance: 80.0,
	fireSpeedVarianceSlider: {min: 0.0, max: 100.0}，

	fireDeathSpeed: 0.003,
	fireDeathSpeedSlider: {min: 0.001, max: 0.05},

	fireTriangleness: 0.00015,
	fireTrianglenessSlider: {min: 0.0, max: 0.0003},

	fireTextureHue: 25.0,
	fireTextureHueSlider: {min: -180, max: 180},

	fireTextureHueVariance: 15.0,
	fireTextureHueVarianceSlider: {min: 0.0, max: 180},

	fireTextureColorize: true,
	wind: true,
	omnidirectionalWind: false,

	windStrength: 20.0,
	windStrengthSlider: {min:0.0, max:60.0},

	windTurbulance: 0.0003,
	windTurbulanceSlider: {min:0.0, max: 0.001},

	sparks: true,

	sparkEmitRate: 6.0,
	sparkEmitSlider: {min:0.0,max:10.0},

	sparkSize: 10.0,
	sparkSizeSlider: {min:5.0,max:100.0},

	sparkSizeVariance: 20.0,
	sparkSizeVarianceSlider: {min:0.0,max:100.0},

	sparkSpeed: 400.0,
	sparkSpeedSlider: {min:20.0, max:700.0},

	sparkSpeedVariance: 80.0,
	sparkSpeedVarianceSlider: {min:0.0, max:100.0},

	sparkDeathSpeed: 0.0085,
	sparkDeathSpeedSlider: {min: 0.002, max: 0.05},
}

textureList = ["rectangle.png","circle.png","gradient.png","thicker_gradient.png","explosion.png","flame.png","smilie.png","heart.png"];
images = [];
textures = [];
currentTextureIndex = 2;

function loadTexture(textureName,index){
	textures[index] = gl.createTexture();
	images[index] = new Image();
	images[index].onload = function(){
		handleTextureLoaded(images[index],index,textureName)
	};
	images[index].onerror = function(){
		alert('ERROR: texture ' + textureName + " can't be loaded!");
		console.error('ERROR: texture ' + textureName + " can't be loaded!");
	}
	images[index].src = textureName;
	console.log("starting to load " + textureName);
}

function handleTextureLoaded(image,index,textureName){
	console.log("loaded texture " + textureName);
	gl.bindTexture(gl.TEXTURE_2D, textures[index]);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D,null);

	//load next texture
	if(index < textureList.length - 1){
		loadTexture('textures/' + textureList[index+1],index+1);
	}
}

function loadAllTextures(){
	var fireTextureCombobox = document.getElementById('fireTexture');
	fireTextureCombobox.onchange = function(){
		var image = document.getElementById('fireTextureVal');
		var newIndex = fireTextureCombobox.selectedIndex;
		image.src = 'textures/' + textureList[newIndex];
		currentTextureIndex = newIndex;
	}
	for(var i = 0; i < textureList.length; i++){
		fireTextureCombobox.options.add(new Option(textureList[i],i));
	}
	fireTextureCombobox.selectedIndex = 2;
	loadTexture('textures/' + textureList[0],0);
}

fireParticles = [];
sparkParticles = [];

function createFireParticle(emitCenter){
	var size = randomSpread(options.fireSize,options.fireSize * (options.fireSizeVariance/100.0));
	var speed = randomSpread(options.fireSpeed,options.fireSpeed * options.fireSpeedVariance/100.0);
	var color = {};
	if(!options.fireTextureColorize){
		color = {r:1.0,h:1.0,b:1.0,a:0.5};
	}else{
		var hue = randomSpread(options.fireTextureHue,options.fireTextureHueVariance);
		color = HSVtoGRB(convertHue(hue),1.0,1.0);
		color.a = 0.5;
	}

	var particle = {
		pos: random2DVec(emitCenter,options.fireEmitPositionSpread),
		vel: scaleVec(randomUnitVec(Math.PI/2,options.fireEmitAngleVariance),speed),
		size: {
			width: size,
			height: size
		},
		color: color
	};
	fireParticles.push(particle);

}

function createSparkParticle(emitCenter){
	var size = randomSpread(options.sparkSize,options.sparkSize * (options.sparkSizeVariance / 100.0));
	var origin = clone2DVec(emitCenter);
	var speed = randomSpread(options.sparkSpeed,options.sparkSpeed * options.sparkSizeVariance / 100.0);
	var particle = {
		origin: origin,
		pos: random2DVec(emitCenter,options.fireEmitPositionSpread),
		vel: scaleVec(randomUnitVec(Math.PI/2,options.fireEmitAngleVariance * 2.0),speed),
		size: {
			width: size,
			height: size
		},
		color: {r:1.0,g:0.8,b:0.3,a:1.0}
	};
	sparkParticles.push(particle);
}

var currentlyPressedKeys = {};
mouseDown = false;
mousePos = {};

function handleKeyDown(e){
	currentlyPressedKeys[e.keyCode] = true;
}

function handleKeyUp(e){
	currentlyPressedKeys[e.keyCode] = false;
}

function canvasCoordinates(canvas,pos){
	var rect = canvas.getBoundingClientRect();
	return {
		x: pos.x - rect.left,
		y: pos.y - rect.top
	};
}

function handleMouseDown(e){
	mouseDown = true;
	mousePos = canvasCoordinates(canvas,{x:e.clientX,y:e.clientY});

}

function handleMouseMove(e){
	mousePos = canvasCoordinates(canvas,{x:e.clientX,y:e.clientY});
}

function handleMouseUp(e){
	mouseDown = false;
}

function setupSlider(id,valueId,value,sliderMinMax,step,changeCallback){
	var slider = document.getElementById(id);
	var sliderDiv = document.getElementById(valueId);
	console.log(id + " " + valueId);
	slider.min = sliderMinMax.min;
	slider.max = sliderMinMax.max;
	slider.step = step;
	slider.value = value;
	slider.oninput = function(){
		newValue = this.value;
		sliderDiv.innderHTML = newValue;
		changeCallback(newValue);
	}
	slider.oninput();
}





