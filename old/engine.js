var canvas = document.querySelector('canvas');
var sizeModifier = 3; //how many pixels to a game pixel
var globalGravity = 0;//-.05;
var physicsSubSteps = 8; // how many steps a frame to resolve physics
canvas.width = window.innerWidth/sizeModifier;
canvas.height = window.innerHeight/sizeModifier;
var c = canvas.getContext('2d');
c.imageSmoothingEnabled = false



// most basic functions

function isObject(obj) {
	return ((obj) && (typeof obj === 'object'));
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

//angles pulled from https://github.com/davidfig/anglejs
function differenceAngles(a, b) {
    var c = Math.abs(a - b) % (Math.PI*2);
    return c > Math.PI ? ((Math.PI*2) - c) : c;
}
function differenceAnglesSign(target, source) {
    function mod(a, n) {
        return (a % n + n) % n;
    }
    var a = target - source;
    return mod((a + Math.PI), (Math.PI*2)) - Math.PI > 0 ? 1 : -1;
}
function shortestAngle(start, to) {
    var difference = differenceAngles(to, start);
    var sign = differenceAnglesSign(to, start);
    var delta = difference * sign;
    return delta + start;
}

//interesting but not a good idea probably
/*function translateChildren(node,tx,ty) {
	node.o.set(node.o.x + tx, node.o.y + ty);
	node.lasto.set(node.o.x + tx, node.o.y + ty);
	if (node.objectChildren.length > 0) {
		for (var i = 0; i < node.objectChildren.length; i++) {
			translateChildren(node.objectChildren[i],tx,ty)
		}
	}
}*/



// most basic objects

function Vector(angle = 0,distance = 1) {
	this.ang = angle;
	this.dis = distance;

	this.pointFromVector = function(point) {
		return new Coord(this.x + (vect.dis * Math.cos(vect.ang)), this.y + (vect.dis * Math.sin(vect.ang)));
	}
}



function Coord(x = 0, y = 0) {
	this.x = x;
	this.y = y;
	
	this.set = function(point, pointy = 0) {
		if (isObject(point)) {
			this.x = point.x;
			this.y = point.y;
		}
		else {
			this.x = point;
			this.y = pointy;
		}
	}

	this.distanceBetween = function(point) {
		return (Math.sqrt(((point.x - this.x)**2)+((point.y - this.y)**2)));
	}
	this.angleBetween = function(point) {
		return (Math.atan2(point.y - this.y, point.x - this.x)+ Math.PI*2);
	}
	this.pointFromVector = function(angle, distance) {
		return new Coord(this.x + (distance * Math.cos(angle)), this.y + (distance * Math.sin(angle)));
	}
	this.vectorBetween = function(point){
		return new Vector(this.distanceBetween(point),this.angleBetween(point))
	}
}




// simplest game element object

function node(type, origin, direction, radius = 3, mass = 1, color = 'white', objectParent = {}, parentOffsetMax = 0, parentOffsetMin = 0, parentOffsetAngle = 0, parentOffsetStiffness = 0) {
	this.type = type;
	this.o = origin;
	this.mass = mass;

	this.lasto = new Coord(this.o.x,this.o.y)
	if (mass == -1) {
		this.accel = -1; //acceleration or velocity of -1 is used to note a static or fixed object that cannot move
		this.acceldir = 0;
	}
	else {
		//this.lasto = this.o.pointFromVector(direction + Math.PI,velocity); depricated objecrt creation
		this.accel = 0;
		this.acceldir = 0;
	}
	
	this.direction = direction;
	this.radius = radius;
	this.radiusPadding = .2;
	this.color = color;
	
	this.objectParent = objectParent;
	this.objectChildren = [];
	
	if (!(isEmpty(this.objectParent))) {
		this.objectParent.objectChildren.push(this);
	}
	
	this.parentOffsetMax = parentOffsetMax
	this.parentOffsetMin = parentOffsetMin
	this.parentOffsetAngle = parentOffsetAngle
	this.parentOffsetStiffness = parentOffsetStiffness

	let gravity = globalGravity;
	
	let massOffset = 0;
	let angBet = 0;
	let distBet = 0;
	let moveDistance = 0;
	
	
	this.draw = function() {
		if (this.type == 'circle') {
			c.beginPath();
			c.arc(this.o.x, this.o.y, this.radius + this.radiusPadding, 0, Math.PI*2, false);
			c.fillStyle = this.color;
			c.fill();
		}
		
		if (this.type == 'link') {
			
			
			if (! (isEmpty(this.objectParent))) {
				if (this.radius + this.radiusPadding >= 1) {
					c.beginPath();
					c.arc(this.o.x, this.o.y, this.radius + this.radiusPadding, 0, Math.PI*2, false);
					c.fillStyle = this.color;
					c.fill();
				}
				
				c.beginPath();
				c.moveTo(this.o.x,this.o.y);
				c.lineTo(this.objectParent.o.x, this.objectParent.o.y);
				c.strokeStyle = this.color;
				c.lineWidth = (this.radius + this.radiusPadding) * 2 + .5;
				if (this.radius > this.objectParent.radius) {
					c.lineWidth = (this.objectParent.radius + this.objectParent.radiusPadding) * 2;
				}
				c.stroke();
			}
			else {
				c.beginPath();
				c.arc(this.o.x, this.o.y, this.radius + this.radiusPadding, 0, Math.PI*2, false);
				c.fillStyle = this.color;
				c.fill();
			}
		}


		//debug show directionality
		c.beginPath();
		c.lineWidth = 1;
		c.moveTo(this.o.x,this.o.y);
		let point = this.o.pointFromVector(this.direction, this.radius)
		c.lineTo(point.x, point.y);
		c.strokeStyle = 'black';
		c.stroke();
	}
	
	this.update = function() {
		let tx = this.o.x;
		let ty = this.o.y;
		
		
		//substeps
		for (var ss = 0; ss < physicsSubSteps; ss++) {
			
			
			if (this.o.x + this.radius > canvas.width) {
				this.o.x = canvas.width - this.radius;
			}
			if (this.o.x - this.radius < 0) {
				this.o.x = this.radius;
			}
			if (this.o.y + this.radius > canvas.height) {
				this.o.y = canvas.height - this.radius;
			}
			if (this.o.y - this.radius < 0) {
				this.o.y = this.radius;
			}
			
			
			//resolves velocity
			this.o.x += (tx - this.lasto.x)/physicsSubSteps
			this.o.y += (ty - this.lasto.y)/physicsSubSteps
			
			//resolves acceleration
			if (this.accel>0) {
				this.o.x += (this.accel * Math.cos(this.acceldir))/physicsSubSteps
				this.o.y += (this.accel * Math.sin(this.acceldir))/physicsSubSteps
			}
			
			//resolves gravity
			this.o.y -= gravity / physicsSubSteps
			
			
			//resolves collisions
			for (var i = 0; i < nodeArray.length; i++) {
				if ((nodeArray[i] !== this) &&  (Math.abs(nodeArray[i].o.x - this.o.x) < (nodeArray[i].radius+this.radius)) && (Math.abs(nodeArray[i].o.y - this.o.y) < (nodeArray[i].radius+this.radius))) {
					
					distBet = this.o.distanceBetween(nodeArray[i].o);
					angBet = this.o.angleBetween(nodeArray[i].o);


					if (distBet < this.radius + nodeArray[i].radius) {
						moveDistance = (this.radius + nodeArray[i].radius - distBet)/2;
						
						if (this.mass == -1) massOffset = 1;
						else if (nodeArray[i].mass == -1) massOffset = 0;
						else massOffset = this.mass / (this.mass + nodeArray[i].mass);
						
						let point = this.o.pointFromVector(angBet + Math.PI, moveDistance * (1-massOffset));
						this.o.x = point.x;
						this.o.y = point.y;
						point = nodeArray[i].o.pointFromVector(angBet, moveDistance * (massOffset));
						nodeArray[i].o.x = point.x;
						nodeArray[i].o.y = point.y;
						
					}
					
				}
			}
		
		
			//resolves links between parents and children
			if (! (isEmpty(this.objectParent)) && (this.parentOffsetMax > 0)) {
				
				
				if (this.mass == -1) massOffset = 0;
				else if (this.objectParent.mass == -1) massOffset = 1;
				else massOffset = this.mass / (this.mass + this.objectParent.mass);
				
				
				
				

				
				
				distBet = this.o.distanceBetween(this.objectParent.o);
				angBet = this.o.angleBetween(this.objectParent.o);
				let angDifference = differenceAngles(angBet, this.direction);
				if ((angDifference > this.parentOffsetAngle) && (parentOffsetStiffness > 0)) {
					
					moveDistance = 0;
					if (distBet > this.parentOffsetMax) {
						moveDistance = (distBet - this.parentOffsetMax)/2;
					}
					else if ((this.parentOffsetMin < this.parentOffsetMax)) {
						if (distBet < this.parentOffsetMin) {
							moveDistance = -(this.parentOffsetMin - distBet)/2;
						}
					}
					
					let angleSign = differenceAnglesSign(angBet, this.direction);
					let point = this.objectParent.o.pointFromVector(angBet + ((this.parentOffsetAngle - angDifference)*angleSign*parentOffsetStiffness/physicsSubSteps)+Math.PI, distBet - moveDistance);
					let transX = point.x - this.o.x;
					let transY = point.y - this.o.y;
					//translateChildren(this, transX, transY);
					this.o.set(this.o.x + transX, this.o.y + transY);
					this.lasto.set(this.o.x + transX, this.o.y + transY);
					
					
				}
				else if (distBet > this.parentOffsetMax) {
					moveDistance = (distBet - this.parentOffsetMax)/2;
					let point = this.o.pointFromVector(angBet, moveDistance * massOffset);
					this.o.set(point);
					point = this.objectParent.o.pointFromVector(angBet + Math.PI, moveDistance * (1-massOffset));
					this.objectParent.o.set(point);
				}
				else if ((this.parentOffsetMin < this.parentOffsetMax)) {
					if (distBet < this.parentOffsetMin) {
						moveDistance = (this.parentOffsetMin - distBet)/2;
						let point = this.o.pointFromVector(angBet + Math.PI, moveDistance * massOffset);
						this.o.set(point);
						point = this.objectParent.o.pointFromVector(angBet, moveDistance * (1-massOffset));
						this.objectParent.o.set(point);
					}
				}
			}
		}
		
		if (this.accel == -1) {
			this.o.set(this.lasto);
		}
		else {
			this.lasto.x = tx
			this.lasto.y = ty
		}
		
		
	}
	

	//this.constrain = function(shape) {
	//	
	//}
}