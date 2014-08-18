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
	this.graph = null;
	this.pts = [];
	
	//this.divEl.css("background-color", "blue");

	this.wheelPercentage = 0.6;
	this.wheelSize = 300;
	this.svgSize = 540;
	this.theta = 0.6;
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
	this.createBackground(this.bkg);
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

	/*$("#" + this.el).append("<div id='checks'></div>");
	$("#checks").append(
		"<input id='vetTrans' type='checkbox' value='translacao' checked='true'/><label for='vetTrans'> Translação</label><br>" 
	).append(
		"<input id='vetRot' type='checkbox' value='rotacao' checked='true'/><label for='vetRot'> Rotação</label><br>"
	).append(
		"<input id='vetResult' type='checkbox' value='resultante' checked='true'/><label for='vetResult'> Resultante</label>" 
	).css({
		"margin-left": "10px",
		"margin-top": "10px",
		width: "120px"
	});

	$("#vetTrans").on("change", this.checkChange.bind(this));
	$("#vetRot").on("change", this.checkChange.bind(this));
	$("#vetResult").on("change", this.checkChange.bind(this));*/
}

AI0188.prototype.checkChange = function(evt){
	var el = $(evt.target);
	this.showHideVectors(el.val(), el[0].checked)
}

AI0188.prototype.showHideVectors = function(vet, checked){
	//console.log(this);
	switch(vet){
		case "rotacao":
			for (var i = 0; i < this.pts.length; i++) {
				if(checked) this.pts[i].rot.show();
				else this.pts[i].rot.hide();
			};
			break;
		case "translacao":
			for (var i = 0; i < this.pts.length; i++) {
				if(checked) this.pts[i].trans.show();
				else this.pts[i].trans.hide();
			};
			break;
		case "resultante":
			for (var i = 0; i < this.pts.length; i++) {
				if(checked) this.pts[i].result.show();
				else this.pts[i].result.hide();
			};
			break;
	}
}

AI0188.prototype.playPause = function(){
	$('#backRollingImg').spToggle();
	if(this.pause){
		this.pause = false;
		$("#playPause").html("Pause").css("background-color", "red");
	}else{
		this.pause = true;
		$("#playPause").html("Play").css("background-color", "green");
	}
}

AI0188.prototype.createBackground = function(imgBkg){
	$('<div/>', {
	    id: 'backRollingImg'
	}).css({
		position: "absolute",
		width: "100%",
		height: "60%",
		bottom: "0px",
		background: "url(" + imgBkg + ")",
		'background-repeat': "repeat-x",
		'background-size': " auto 100%"
	}).pan({
		fps: 30, 
		speed: 3, 
		dir: 'right'
	}).appendTo('#'+this.el);

	setTimeout(this.adjustBackgroundImage.bind(this), 3000);
	//console.log("done")
}

AI0188.prototype.adjustBackgroundImage = function(){
	//console.log(this);
	this.imgProperties = {};
	this.imgProperties.width = $._spritely.instances.backRollingImg.options.img_width;
	this.imgProperties.height = $._spritely.instances.backRollingImg.options.img_height;

	var divScale = $("#backRollingImg").height()/this.imgProperties.height;
	var newWidth = this.imgProperties.width * divScale;
	var newHeight = this.imgProperties.height * divScale;
	$._spritely.instances.backRollingImg.options.img_width = newWidth;
	$._spritely.instances.backRollingImg.options.img_height = newHeight;
	//console.log("imagem ajustada")
}

AI0188.prototype.createWheelDiv = function(){
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * this.wheelPercentage;
	}

	$('<div/>', {
	    id: 'graphDiv'
	}).css({
		position: "absolute",
		width: wWidth + "px",
		height: whSize + "px",
		bottom: "0px",
		left: "0px",
		//"margin-left": marginLeft + "px"
		//"background-color": "green"
	}).appendTo('#'+this.el);

	var marginLeft = wWidth/2 - whSize/2;
	$('<div/>', {
	    id: 'wheelDiv'
	}).css({
		position: "absolute",
		width: whSize + "px",
		height: whSize + "px",
		bottom: "0%",
		"margin-left": "00%"
		//"margin-left": marginLeft + "px"
		//"background-color": "green"
	}).appendTo('#'+this.el);

	$(window).resize(this.repositionWheel.bind(this));
}

AI0188.prototype.repositionWheel = function(){
	//console.log(this.wheelPercentage)
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * (this.wheelPercentage + 0.2);
	}
	//var marginLeft = wWidth/2 - whSize/2;

	$("#graphDiv").width(wWidth);
	$("#graphDiv").height(whSize);

	this.graph.setViewBox(0,0,wWidth,this.svgSize);
    this.graph.setSize(wWidth + 'px', whSize + 'px');

	$("#wheelDiv").width(whSize);
	$("#wheelDiv").height(whSize);
	//$("#wheelDiv").css("margin-left", marginLeft + "px");

	var divScale = $("#backRollingImg").height()/this.imgProperties.height;
	var newWidth = this.imgProperties.width * divScale;
	var newHeight = this.imgProperties.height * divScale;
	$._spritely.instances.backRollingImg.options.img_width = newWidth;
	$._spritely.instances.backRollingImg.options.img_height = newHeight;
}

AI0188.prototype.createRaphael = function(){
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * (this.wheelPercentage + 0.2);
	}

	this.graph = Raphael("graphDiv");
	this.graph.setViewBox(0,0,wWidth,this.svgSize);
    this.graph.setSize(wWidth + 'px', whSize + 'px');


	this.raphael = Raphael("wheelDiv");
	this.raphael.setViewBox(0,0,this.svgSize,this.svgSize);
    this.raphael.setSize('100%', '100%');

    this.wheelImage = this.raphael.image("img/roda.png", (this.svgSize - this.wheelSize)/2, (this.svgSize - this.wheelSize)/2, this.wheelSize, this.wheelSize);
    //this.wheelCircle = this.raphael.circle(250, 250, 250);
	//this.wheelCircle.click(this.wheelClick);
	//this.wheelImage.newParent = this;
	//this.wheelImage.click(this.wheelClick);
	this.divEl.on("click", this.wheelClick.bind(this));
	//this.wheelAnimation = Raphael.animation({transform: "r-360"}, 8000).repeat(Infinity);
	//this.wheelImage.animate(this.wheelAnimation);
	//$('#wheelDiv').rotate();
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
	//console.log(evt)
	var div = $("#wheelDiv");
	var posx = Number(((evt.clientX - div.offset().left) * ai.svgSize/div.width()).toFixed(0));
	var posy = Number(((evt.clientY - div.offset().top) * ai.svgSize/div.height()).toFixed(0));
	var ray = distance(ai.svgSize/2, ai.svgSize/2, posx, posy);
	var minDist = 15;

	if(ray <= ai.wheelSize/2 + 2) {
		if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no centro da roda:
			ai.addPoint(ai.svgSize/2, ai.svgSize/2, 0);

		}else if(distance(posx, posy, ai.svgSize/2 + ai.wheelSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no ponto 1 (0 graus)
			ai.addPoint(ai.svgSize/2 + ai.wheelSize/2, ai.svgSize/2, ai.wheelSize/2);

		}else if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2 - ai.wheelSize/2) < minDist){
			//Posiciona o ponto no ponto 2 (90 graus)
			ai.addPoint(ai.svgSize/2, ai.svgSize/2 - ai.wheelSize/2, ai.wheelSize/2);

		}else if(distance(posx, posy, ai.svgSize/2 - ai.wheelSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no ponto 3 (180 graus)
			ai.addPoint(ai.svgSize/2 - ai.wheelSize/2, ai.svgSize/2, ai.wheelSize/2);

		}else if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2 + ai.wheelSize/2) < minDist){
			//Posiciona o ponto no ponto 4 (270 graus)
			ai.addPoint(ai.svgSize/2, ai.svgSize/2 + ai.wheelSize/2, ai.wheelSize/2);
		}else{
			//Posiciona o ponto onde foi clicado.
			ai.addPoint(posx, posy, ray);
		}
	}else{
		//Clique fora do raio
		console.log(evt.target.id)
		if(evt.target.id == "backRollingImg" || evt.target.id == "content") ai.removeAllPoints();
	}
}

AI0188.prototype.addPoint = function(ptx, pty, ray){
	if(this.pts.length >= 5){
		this.removePt(this.pts.splice(0,1)[0]);
	}

	var last = {};

	//Angulo do ponto em relação à origem.
	//last.angle = Math.atan2(pty - this.svgSize/2, ptx - this.svgSize/2);
	//last.ray = ray;
	last.tInicial = this.tcurrent * 1000;
	
	//Vetor translação
	//last.trans = this.raphael.path("M" + ptx + "," + pty + "L" + (ptx - this.vTrans) + "," + pty + drawArrow(ptx - this.vTrans, pty, Math.PI)).attr({"stroke-width": "3", "stroke": "#000000", fill:"#000000"});
	
	//Vetor rotação
	//last.d = this.theta * ray;
	//var rotx = ray * Math.cos(last.angle) + last.d * Math.sin(last.angle) + this.svgSize/2;
	//var roty = ray * Math.sin(last.angle) - last.d * Math.cos(last.angle) + this.svgSize/2;
	//if(distance(rotx, roty, ptx, pty) > 5) last.rot = this.raphael.path("M" + ptx + "," + pty + "L" + rotx + "," + roty + drawArrow(rotx, roty, last.angle - Math.PI/2)).attr({"stroke-width": "2", "stroke": "#0000FF", fill:"#0000FF"});
	//else last.rot = this.raphael.path("M" + ptx + "," + pty + "L" + rotx + "," + roty).attr({"stroke-width": "2", "stroke": "#0000FF", fill:"#0000FF"});

	//Vetor resultante
	//var resultx = (ptx - this.vTrans - ptx) + (rotx - ptx) + ptx;
	//var resulty = (pty - pty) + (roty - pty) + pty;
	//var angleResult = Math.atan2((pty - pty) + (roty - pty), (ptx - this.vTrans - ptx) + (rotx - ptx));
	//if(distance(resultx, resulty, ptx, pty) >= 10)last.result = this.raphael.path("M" + ptx + "," + pty + "L" + resultx + "," + resulty + drawArrow(resultx, resulty, angleResult)).attr({"stroke-width": "1", "stroke": "#00FF00", fill:"#00FF00"});
	//else last.result = this.raphael.path("M" + ptx + "," + pty + "L" + resultx + "," + resulty).attr({"stroke-width": "1", "stroke": "#00FF00", fill:"#00FF00"});
	
	//O ponto
	last.pt = this.raphael.circle(ptx, pty, this.ptR).attr("fill", "#F00");
	last.graphPts = [{x:ptx, y:pty}];
	last.graph = this.graph.path("").attr({"stroke-width": "1", "stroke": "#000"})

	//if(!$("#vetTrans")[0].checked) last.trans.hide();
	//if(!$("#vetRot")[0].checked) last.rot.hide();
	//if(!$("#vetResult")[0].checked) last.result.hide();
	
	this.pts.push(last);
}

AI0188.prototype.removePt = function(pt){
	//pt.trans.remove();
	//pt.rot.remove();
	//pt.result.remove();
	pt.pt.remove();
}

AI0188.prototype.updateT = function(timestamp){
	
	var dt = (timestamp - this.tTotal)/1000;
	this.tTotal = timestamp;

	if(!this.pause){
		this.tcurrent += dt;
		//console.log(this.tcurrent)
		this.wheelImage.attr("transform", "r-" + this.theta * this.tcurrent*100);


		/*if(this.count < 1){
			this.count++;
			requestAnimationFrame(this.updateT.bind(this));
			return;
		}else{
			this.count = 0;
		}*/

		var inicial;
		var path = "";
		var pt = null;
		var ptRotation = null;
		var bbox = null;
		var ptx = null;
		var pty = null;
		/*var rotx = null;
		var roty = null;
		var resultx = null;
		var resulty = null;
		var angleResult = null;*/

		for (var i = 0; i < this.pts.length; i++) {
			pt = this.pts[i];
			ptRotation = this.theta * ((this.tcurrent * 1000) - pt.tInicial)/10;
			pt.pt.attr("transform", "r-" + ptRotation + " " + this.svgSize/2 + "," + this.svgSize/2);

			bbox = pt.pt.getBBox();
			ptx = bbox.x + this.ptR;
			pty = bbox.y + this.ptR;

			path = "M" + ptx + "," + pty;

			for (var j = pt.graphPts.length - 1; j >= 0; j--) {
				pt.graphPts[j].x += this.vTrans * dt;
				if(pt.graphPts[j].x > 1000){
					pt.graphPts.splice(j, 1);
				}else{
					path += "L" + pt.graphPts[j].x + "," + pt.graphPts[j].y;
				}
			};

			pt.graphPts.push({x:ptx, y:pty});

			pt.graph.attr("path", path);
			/*pt.angle = Math.atan2(pty - this.svgSize/2, ptx - this.svgSize/2);

			//Vetor translação:
			pt.trans.attr("path", "M" + ptx + "," + pty + "L" + (ptx - this.vTrans) + "," + (pty) + drawArrow(bbox.x - this.vTrans + this.ptR, bbox.y + this.ptR, Math.PI));

			//Vetor rotação:
			rotx = pt.ray * Math.cos(pt.angle) + pt.d * Math.sin(pt.angle) + this.svgSize/2;
			roty = pt.ray * Math.sin(pt.angle) - pt.d * Math.cos(pt.angle) + this.svgSize/2;
			if(distance(rotx, roty, ptx, pty) > 5) pt.rot.attr("path", "M" + ptx + "," + pty + "L" + rotx + "," + roty + drawArrow(rotx, roty, pt.angle - Math.PI/2));
			else pt.rot.attr("path", "M" + ptx + "," + pty + "Z");

			//Vetor resultante
			resultx = (ptx - this.vTrans - ptx) + (rotx - ptx) + ptx;
			resulty = (pty - pty) + (roty - pty) + pty;
			angleResult = Math.atan2((pty - pty) + (roty - pty), (ptx - this.vTrans - ptx) + (rotx - ptx));
			if(distance(resultx, resulty, ptx, pty) >= 10) pt.result.attr("path", "M" + ptx + "," + pty + "L" + resultx + "," + resulty + drawArrow(resultx, resulty, angleResult));
			else pt.result.attr("path", "M" + ptx + "," + pty + "L" + resultx + "," + resulty);*/
		};
	}

	requestAnimationFrame(this.updateT.bind(this));
}

function drawArrow(ptx, pty, angle){
	var r = 15;
	/*var angle1 = 160 * Math.PI/180 + angle;
	var angle2 = -160 * Math.PI/180 + angle;
	var pt1x = r * Math.cos(angle1) + ptx;
	var pt1y = r * Math.sin(angle1) + pty;
	var pt2x = r * Math.cos(angle2) + ptx;
	var pt2y = r * Math.sin(angle2) + pty;*/
	//return "Z";
	//return "L" + pt1x + "," + pt1y + "L" + pt2x + "," + pt2y + "L" + ptx + "," + pty + "Z";
	return "L" + (r * Math.cos(160 * Math.PI/180 + angle) + ptx) + "," + (r * Math.sin(160 * Math.PI/180 + angle) + pty) + "L" + (r * Math.cos(-160 * Math.PI/180 + angle) + ptx) + "," + (r * Math.sin(-160 * Math.PI/180 + angle) + pty) + "L" + ptx + "," + pty + "Z";
}
