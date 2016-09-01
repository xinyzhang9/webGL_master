window.onload = main;

var canvas,
	gl,
	ratio,
	vertices,
	velocities,
	colorLoc,
	numLines = 30000;


function main(){
	canvas = document.getElementById('c');
	gl = canvas.getContext('webgl');
	if(!gl){
		alert('Unable to load Webgl context. Your browser may not support it!');
		return;
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0,0,canvas.width,canvas.height);

	//load vertex shader
	var vertexShaderScript = document.getElementById('shader-vs');
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vertexShaderScript.text);
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		alert('Error while compiling the vertex shader!');
		gl.deleteShader(vertexShader);
		return;
	}
	//load fragment shader
	var fragmentShaderScript = document.getElementById('shader-fs');
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fragmentShaderScript.text);
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		alert('Error while compiling the fragment shader!');
		gl.deleteShader(fragmentShader);
		return;
	}

	//create shader program
	gl.program = gl.createProgram();
	gl.attachShader(gl.program,vertexShader);
	gl.attachShader(gl.program,fragmentShader);
	gl.linkProgram(gl.program);
	if(!gl.getProgramParameter(gl.program,gl.LINK_STATUS)){
		alert("Error while initializing shaders!");
		gl.deleteProgram(gl.program);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return;
	}
}


