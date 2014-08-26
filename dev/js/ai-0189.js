/*(function() {
    if (!window.ai0188)
        window.ai0188 = function(element){

        };
}());*/

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function AI0188(element, background){
	this.el = element;
	this.divEl = $("#" + element);
	this.width = this.divEl.width();
	this.height = this.divEl.height();
	this.bkg = background;
	this.raphael = null;
	//this.graph = null;
	this.pts = [];
	
	//this.divEl.css("background-color", "blue");

	this.wheelPercentage = 0.6;
	//Medidas da roda em metros
	this.wheel = {
		ray: 1,
		linearVel: 1,
	}
	//x pixels = 1 metro
	this.toPixel = 100;
	this.toRad = 180/Math.PI;
	this.svgHeight = 400;//=4m
	this.wheel.theta = this.wheel.linearVel/this.wheel.ray;

	this.wheelSize = 300;
	this.svgSize = 540;
	//this.theta = 0.6;
	this.vTrans = this.theta * this.wheelSize/2;

	this.ptR = 5;
	this.tcurrent = 0;
	this.count = 0;
	this.tTotal = 0;
	this.pause = false;

	this.init(element);
}

AI0188.prototype.init = function(element){
	this.createButtons();
	//this.createBackground(this.bkg);
	this.createWheelDiv();
	this.createRaphael();
}

AI0188.prototype.createButtons = function(){
	$('<div/>', {
	    id: 'playPause',
	    text: 'Pause'
	}).css({
		position: "absolute",
		width: "100px",
		height: "40px",
		top: "10px",
		right: "10px",
		"background-color": "red",
		"font-weight": "bold",
		"line-height": "40px",
		"text-align": "center",
		cursor: "pointer"
	}).on("click", this.playPause.bind(this)
	).appendTo('#'+this.el);

	$('<div/>', {
	    id: 'playPause',
	    text: 'Remover pontos'
	}).css({
		position: "absolute",
		width: "170px",
		height: "40px",
		top: "10px",
		right: "120px",
		"background-color": "blue",
		"font-weight": "bold",
		"line-height": "40px",
		"text-align": "center",
		cursor: "pointer"
	}).on("click", this.removeAllPoints.bind(this)
	).appendTo('#'+this.el);
}

AI0188.prototype.playPause = function(){
	//$('#backRollingImg').spToggle();
	if(this.pause){
		this.pause = false;
		$("#playPause").html("Pause").css("background-color", "red");
	}else{
		this.pause = true;
		$("#playPause").html("Play").css("background-color", "green");
	}
}

AI0188.prototype.createWheelDiv = function(){
	this.widthProportion = 21;
	this.heightProportion = 8;

	var wWidth = this.width;
	var wHeight = this.height;
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * this.wheelPercentage;
	}

	$('<div/>', {
	    id: 'wheelDiv'
	}).css({
		position: "absolute",
		width: wWidth + "px",
		height: whSize + "px",
		bottom: "0px",
		left: "0px"
	}).appendTo('#'+this.el);

	//this.wheelLeft = wWidth;
	this.wheelDiv = $("#wheelDiv");

	$(window).resize(this.repositionWheel.bind(this));
}

AI0188.prototype.repositionWheel = function(){
	//console.log(this.wheelPercentage)

	this.width = this.divEl.width();
	this.height = this.divEl.height();

	var wWidth = this.width;
	var wHeight = this.height;
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * this.wheelPercentage;
	}

	this.wheelDiv.width(wWidth);
	this.wheelDiv.height(whSize);

	this.svgWidth = (wWidth * this.svgHeight) / whSize;

	this.raphael.setViewBox(0,0,this.svgWidth,this.svgHeight);
    this.raphael.setSize(wWidth + 'px', whSize + 'px');

    var corners = {
    	x0: 0,
    	y0: 300,
    	width: this.svgWidth,
    	height: this.svgHeight
    }
    this.ground.attr("path", "M" + corners.x0 + "," + corners.y0 + "L" + corners.width + "," + corners.y0 + "L" + corners.width + "," + corners.height + "L" + corners.x0 + "," + corners.height + "L" + corners.x0 + "," + corners.y0);
}

AI0188.prototype.createRaphael = function(){
	var wWidth = this.width;
	var wHeight = this.height;
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * (this.wheelPercentage + 0.2);
	}

   	this.svgWidth = (wWidth * this.svgHeight) / whSize;

	this.raphael = Raphael("wheelDiv");
	this.raphael.setViewBox(0,0,this.svgWidth,this.svgSize);
    this.raphael.setSize('100%', '100%');

    var corners = {
    	x0: 0,
    	y0: 300,
    	width: this.svgWidth,
    	height: this.svgHeight
    }
    this.ground = this.raphael.path("M" + corners.x0 + "," + corners.y0 + "L" + corners.width + "," + corners.y0 + "L" + corners.width + "," + corners.height + "L" + corners.x0 + "," + corners.height + "L" + corners.x0 + "," + corners.y0).attr({"stroke-width": "0", "stroke": "#575A5C", "fill": "90-#FFF-#188212:85-#188212"});

    this.wheel.center = {
    	x: -10 - (this.wheel.ray * this.toPixel),
    	y: this.svgHeight/2
    }
    this.wheelImage = this.raphael.image("img/roda.png", this.wheel.center.x - (this.wheel.ray * this.toPixel), this.wheel.center.y - (this.wheel.ray * this.toPixel), (this.wheel.ray * this.toPixel) * 2, (this.wheel.ray * this.toPixel) * 2);
   	//this.wheelImage = this.raphael.set();
   	//this.wheelImage.push(this.raphael.image("img/roda.png", this.wheel.center.x - (this.wheel.ray * this.toPixel), this.wheel.center.y - (this.wheel.ray * this.toPixel), (this.wheel.ray * this.toPixel) * 2, (this.wheel.ray * this.toPixel) * 2));
	
	this.divEl.on("click", this.wheelClick.bind(this));

	this.repositionWheel();

	requestAnimationFrame(this.updateT.bind(this));
}

AI0188.prototype.removeAllPoints = function(){
	//console.log(this);
	for (var i = this.pts.length - 1; i >= 0; i--) {
		this.removePt(this.pts.splice(i, 1)[0]);
	};
}

AI0188.prototype.wheelClick = function(evt){
	var ai = this;//.newParent;
	var div = $("#wheelDiv");
	var posx = Number(((evt.clientX - div.offset().left) * ai.svgWidth/div.width()).toFixed(0));
	var posy = Number(((evt.clientY - div.offset().top) * ai.svgHeight/div.height()).toFixed(0));
	var ray = distance(this.wheel.center.x, this.wheel.center.y, posx, posy);
	var minDist = 20;

	var wheelRay = this.wheel.ray * this.toPixel;

	if(ray <= wheelRay + 10) {
		if(distance(posx, posy, this.wheel.center.x, this.wheel.center.y) < minDist){
			//Posiciona o ponto no centro da roda:
			ai.addPoint(this.wheel.center.x,this.wheel.center.y, 0);

		}else if(distance(posx, posy, ai.svgSize/2 + ai.wheelSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no ponto 1 (0 graus)
			ai.addPoint(this.wheel.center.x + wheelRay, this.wheel.center.y, wheelRay);

		}else if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2 - ai.wheelSize/2) < minDist){
			//Posiciona o ponto no ponto 2 (90 graus)
			ai.addPoint(this.wheel.center.x, this.wheel.center.y - wheelRay, wheelRay);

		}else if(distance(posx, posy, ai.svgSize/2 - ai.wheelSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no ponto 3 (180 graus)
			ai.addPoint(this.wheel.center.x - wheelRay, this.wheel.center.y, wheelRay);

		}else if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2 + ai.wheelSize/2) < minDist){
			//Posiciona o ponto no ponto 4 (270 graus)
			ai.addPoint(this.wheel.center.x, this.wheel.center.y + wheelRay, wheelRay);
		}else{
			//Posiciona o ponto onde foi clicado.
			if(ray > wheelRay){
				ray = wheelRay;
				var angle = Math.atan2(posy - this.wheel.center.y, posx - this.wheel.center.x);
				posx = this.wheel.center.x + ray * Math.cos(angle);
				posy = this.wheel.center.y + ray * Math.sin(angle);
			}
			ai.addPoint(posx, posy, ray);
		}
	}else{
		//Clique fora do raio
		//console.log(evt.target.id)
		//if(evt.target.id == "backRollingImg" || evt.target.id == "content") ai.removeAllPoints();
	}
}

AI0188.prototype.addPoint = function(ptx, pty, ray){
	if(this.pts.length >= 5){
		this.removePt(this.pts.splice(0,1)[0]);
	}

	var last = {};

	//Angulo do ponto em relação à origem.
	last.angle = Math.atan2(pty - this.wheel.center.y, ptx - this.wheel.center.x);
	console.log(last.angle)
	last.ray = ray;
	last.ptCoords = {
		x: ptx,
		y:pty
	}
	last.tInicial = this.tcurrent;
		
	//O ponto
	//var wheelx = this.wheelDiv.offset().left * this.prop;
	//var wheely = 0;//this.wheelDiv.offset().top;

	var cor = getRandomColor();
	last.pt = this.raphael.circle(ptx, pty, this.ptR).attr("fill", cor);
	//this.wheelImage.push(last.pt);
	last.graphPath = "M" + (ptx) + "," + (pty);
	last.graph = this.raphael.path("").attr({"stroke-width": "2", "stroke": cor});
	last.lastRot = 0;
	last.count = 0;

	this.pts.push(last);
}

var colors = ["red", "green", "blue", "orange", "grey"];
var colorIndex = 0;
function getRandomColor() {
    /*var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;*/
    var cor = colors[colorIndex];
    colorIndex++;
    if(colorIndex >= colors.length) colorIndex = 0;

    return cor;
}

AI0188.prototype.removePt = function(pt){
	//pt.trans.remove();
	//pt.rot.remove();
	//pt.result.remove();
	pt.pt.remove();
	pt.graph.remove();
}

AI0188.prototype.count = 0;
AI0188.prototype.updateT = function(timestamp){

	var dt = (timestamp - this.tTotal)/1000;
	this.tTotal = timestamp;

	if(!this.pause){
		this.tcurrent += dt;
		//console.log(this.tcurrent)
		var newPos = (-10 - (this.wheel.ray * this.toPixel)) + this.wheel.linearVel * this.tcurrent * this.toPixel;
		var dsx = newPos - this.wheel.center.x;
		
		if(newPos > this.svgWidth + (this.wheel.ray * this.toPixel) + 10){
			newPos = -10 - (this.wheel.ray * this.toPixel);
			this.tcurrent = 0;
			dsx = 0;
			for (var i = 0; i < this.pts.length; i++) {
				pt = this.pts[i];
				pt.graphPath = "M" + (-10 - (this.wheel.ray * this.toPixel)) + "," + (this.svgHeight/2 - this.wheel.ray * this.toPixel);
			}
		}

		this.wheel.center.x = newPos;
		this.wheelImage.attr("x", this.wheel.center.x - (this.wheel.ray * this.toPixel));
		//this.wheelImage.translate(dsx);
		var rotAngle = (this.wheel.theta * this.tcurrent);
		this.wheelImage.attr("transform", "r" + rotAngle * this.toRad);// + " " + this.wheel.center.x + "," + this.wheel.center.y);
		
		var pt = null;
		var ptRotation = null;
		var ptx = null;
		var pty = null;

		for (var i = 0; i < this.pts.length; i++) {
			pt = this.pts[i];
			ptRotation = (this.wheel.theta * (this.tcurrent - pt.tInicial));
			ptx = this.wheel.center.x + pt.ray * Math.cos(pt.angle + ptRotation);
			pty = this.wheel.center.y + pt.ray * Math.sin(pt.angle + ptRotation);
			pt.pt.attr("cx", ptx);
			pt.pt.attr("cy", pty);

			pt.count++;

			if(pt.count > 3){
				pt.graphPath += "L" + ptx + "," + pty;
				pt.graph.attr("path", pt.graphPath);
				pt.count = 0;
			}
			
		};
	}

	requestAnimationFrame(this.updateT.bind(this));
}

