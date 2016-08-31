var canvas,
	gl,
	squareVerticesBuffer,
	squareVerticesColorBuffer,
	mvMatrix,
	shaderProgram,
	vertexPositionAttribute,
	vertexColorAttribute,
	perspectiveMatrix;
		function start(){
			canvas = document.getElementById('c');
			initWebGL();
			if(gl){
				gl.clearColor(0.0,0.0,0.0,1.0);
				gl.clearDepth(1.0);
				gl.enable(gl.DEPTH_TEST);
				gl.depthFunc(gl.LEQUAL);
				initShaders();
				initBuffers();
				setInterval(drawScene,15);
			}
		}
		function initWebGL(){
			gl = null;
			try{
				gl = canvas.getContext('webgl');
			}
			catch(e){

			}
			if (!gl){
				alert('Unable to initialize WebGL. Your browser may not support it.');
			}
		}

		function initBuffers(){
			squareVerticesBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER,squareVerticesBuffer);
			//vertices
			var vertices = [
				1.0,1.0,0.0,
				-1.0,1.0,0.0,
				1.0,-1.0,0.0,
				-1.0,-1.0,0.0
			];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);

			//colors
			var colors = [
				1.0,1.0,1.0,1.0,
				1.0,0.0,0.0,1.0,
				0.0,1.0,0.0,1.0,
				0.0,0.0,1.0,1.0
			];
			squareVerticesColorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER,squareVerticesColorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);
		}

		function drawScene(){
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			perspectiveMatrix = makePerspective(45,640.0/480.0,0.1,100.0);
			//at the center of scene
			loadIdentity();
			mvTranslate([-0.0,0.0,-6.0]);
			//set vertices attribute
			gl.bindBuffer(gl.ARRAY_BUFFER,squareVerticesBuffer);
			gl.vertexAttribPointer(vertexPositionAttribute,3,gl.FLOAT,false,0,0);
			//set color attribute
			gl.bindBuffer(gl.ARRAY_BUFFER,squareVerticesColorBuffer);
			gl.vertexAttribPointer(vertexColorAttribute,4,gl.FLOAT,false,0,0);

			//draw
			setMatrixUniforms();
			gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

		}

		function initShaders(){
			var fragmentShader = getShader(gl,'shader-fs');
			var vertexShader = getShader(gl,'shader-vs');
			shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram,vertexShader);
			gl.attachShader(shaderProgram,fragmentShader);
			gl.linkProgram(shaderProgram);

			if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
				alert('Unable to initialize the shader program: '+ gl.getProgramInfoLog(shader));
			}
			gl.useProgram(shaderProgram);
			vertexPositionAttribute = gl.getAttribLocation(shaderProgram,'aVertexPosition');
			gl.enableVertexAttribArray(vertexPositionAttribute);

			vertexColorAttribute = gl.getAttribLocation(shaderProgram,'aVertexColor');
			gl.enableVertexAttribArray(vertexColorAttribute);

		}

		function getShader(gl,id){
			var shaderScript = document.getElementById(id);
			if(!shaderScript){
				return null;
			}
			var theSource = '';
			var currentChild = shaderScript.firstChild;

			while(currentChild){
				if(currentChild.nodeType == 3){
					theSource += currentChild.textContent;
				}
				currentChild = currentChild.nextSibling;
			}

			var shader;
			if(shaderScript.type == 'x-shader/x-fragment'){
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			}else if (shaderScript.type == 'x-shader/x-vertex'){
				shader = gl.createShader(gl.VERTEX_SHADER);
			}else{
				return null;
			}

			//send the source to shader object
			gl.shaderSource(shader,theSource);
			//compile the shader program
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
				alert('An error occured while compiling the shaders: ' +gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;
		}

		function loadIdentity(){
			mvMatrix = Matrix.I(4);
		}
		function multMatrix(m){
			mvMatrix = mvMatrix.x(m);
		}
		function mvTranslate(v){
			multMatrix(Matrix.Translation($V([v[0],v[1],v[2]])).ensure4x4());
		}
		function setMatrixUniforms(){
			var pUniform = gl.getUniformLocation(shaderProgram,'uPMatrix');
			gl.uniformMatrix4fv(pUniform,false,new Float32Array(perspectiveMatrix.flatten()));

			var mvUniform = gl.getUniformLocation(shaderProgram,'uMVMatrix');
			gl.uniformMatrix4fv(mvUniform,false,new Float32Array(mvMatrix.flatten()));
		}