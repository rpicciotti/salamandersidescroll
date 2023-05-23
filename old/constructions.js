function rope(origin, thickness, linkLength, linkCount, fixed, stiffness, mass = 1, color) {
	this.mass = mass;
	if (fixed) mass = -1;
	else mass = mass/linkCount;
	this.origin = origin;
	this.thickness = thickness;
	this.linkLength = linkLength;
	this.linkCount = linkCount;
	this.fixed = fixed;
	this.stiffness = stiffness;
	
	
	var temp = (new node('circle', origin, Math.PI/2, thickness/2, mass, color))
	nodeArray.push(temp);
	for (var i = 1; i < linkCount; i++) {
		temp = new node('link', new Coord(origin.x, origin.y + i*(this.linkLength+1)), Math.PI/2, thickness/2, this.mass/linkCount, color, temp, this.linkLength, this.linkLength-1, 0, this.stiffness);
		temp.radiusPadding = 0;
		nodeArray.push(temp);
	}
	
}






function salamanderLeg(parentSalamander, parentNode, kinimaticsDirection = Math.PI/2, kinimaticsJointDirection = Math.PI) {
	this.type = 'salamander';
	this.parentNode = parentNode;
	this.o = new Coord(parentSalamander.o.x, parentSalamander.o.y);
	
	this.direction = parentSalamander.direction;
	this.kinimaticsDirection = kinimaticsDirection;
	this.kinimaticsJointDirection = kinimaticsJointDirection;
	this.kiniamticsExtentAng = 1;
	this.kinimaticsExtentDis = 12;
	this.steppingSpeed = 2;
	
	this.mass = .5;//parentSalamander.mass;
	
	this.lasto = new Coord(this.o.x, this.o.y);
	this.target = this.parentNode.o.pointFromVector(this.kinimaticsDirection,this.kinimaticsExtentDis);
	this.accel = 0;
	this.acceldir = 0;
	
	
	this.size = parentSalamander.size;
	this.radius = [1, 1];
	this.radiusPadding = .5;
	this.color = parentSalamander.color;
	
	let gravity = parentSalamander.gravity;
	
	
	this.nodes = [];
	this.nodes[0] = new node('link', this.parentNode.o.pointFromVector(this.kinimaticsDirection, 5), this.kinimaticsDirection, this.radius[0], this.mass, this.color, this.parentNode, 5);
	for (var i = 1; i < this.radius.length; i++) {
		this.nodes[i] = new node('link', this.nodes[i-1].o.pointFromVector(this.kinimaticsDirection, 5), this.kinimaticsDirection, this.radius[i], this.mass, this.color, this.nodes[i-1], 5);
	}

	//temp variables
	let massOffset = 0;

	
	
	
	this.draw = function() {
		for (var j = 0; j < this.nodes.length; j++) {
			this.nodes[j].draw();
		}
		
		c.strokeStyle = this.color;
		c.lineWidth = (1);
		let point = this.nodes[1].o.pointFromVector(this.direction,3)
		c.beginPath();
		c.moveTo(this.nodes[1].o.x,this.nodes[1].o.y);
		c.lineTo(point.x, point.y);
		c.stroke();
		point = this.nodes[1].o.pointFromVector(this.direction + 1,3)
		c.beginPath();
		c.moveTo(this.nodes[1].o.x,this.nodes[1].o.y);
		c.lineTo(point.x, point.y);
		c.stroke();
		point = this.nodes[1].o.pointFromVector(this.direction - 1,3)
		c.beginPath();
		c.moveTo(this.nodes[1].o.x,this.nodes[1].o.y);
		c.lineTo(point.x, point.y);
		c.stroke();
	}
	
	this.update = function() {
		
		let tx = this.nodes[0].o.x;
		let ty = this.nodes[0].o.y;
		let distBet = 0;
		let angBet = 0;
		let moveDistance = 0;
		let point = {};
		//substeps
		//for (var ss = 0; ss < physicsSubSteps; ss++) {
			
			
			
			//resolves velocity
			//this.o.x += (tx - this.lasto.x)/physicsSubSteps
			//this.o.y += (ty - this.lasto.y)/physicsSubSteps
			
			//resolves acceleration
			//if (this.accel>0) {
			//	this.nodes[0].o.set(this.nodes[0].o.pointFromVector(this.acceldir,this.accel));
			//	this.nodes[0].direction = this.acceldir;
			//}
			
			//resolves gravity
			//this.o.y -= gravity / physicsSubSteps
			
			/*for (var j = 0; j < this.nodes.length; j++) {
				//resolves collisions
				
				if (this.nodes[j].o.x + this.nodes[j].radius > canvas.width) {
					this.nodes[j].o.x = canvas.width - this.nodes[j].radius;
				}
				if (this.nodes[j].o.x - this.nodes[j].radius < 0) {
					this.nodes[j].o.x = this.nodes[j].radius;
				}
				if (this.nodes[j].o.y + this.nodes[j].radius > canvas.height) {
					this.nodes[j].o.y = canvas.height - this.nodes[j].radius;
				}
				if (this.nodes[j].o.y - this.nodes[j].radius < 0) {
					this.nodes[j].o.y = this.nodes[j].radius;
				}
				
				
				
				for (var i = 0; i < nodeArray.length; i++) {
					if ((nodeArray[i] !== this) &&  (Math.abs(nodeArray[i].o.x - this.o.x) < (50)) && (Math.abs(nodeArray[i].o.y - this.o.y) < (50))) {
						
						let distBet = this.nodes[j].o.distanceBetween(nodeArray[i].o);
						let angBet = this.nodes[j].o.angleBetween(nodeArray[i].o);


						if (distBet < this.nodes[j].radius + nodeArray[i].radius) {
							let moveDistance = (this.nodes[j].radius + nodeArray[i].radius - distBet)/2;
							
							if (this.mass == -1) massOffset = 1;
							else if (nodeArray[i].mass == -1) massOffset = 0;
							else massOffset = this.mass / (this.mass + nodeArray[i].mass);
							
							let point = this.nodes[j].o.pointFromVector(angBet + Math.PI, moveDistance * (1-massOffset));
							this.nodes[j].o.set(point);
							point = nodeArray[i].o.pointFromVector(angBet, moveDistance * (massOffset));
							nodeArray[i].o.set(point);
							
						}
						
						nodeArray[i].direction = angBet;
					}
				}
			}*/
			

				
			if (this.parentNode.o.distanceBetween(this.target) > this.kinimaticsExtentDis) {
				//angBet = ((this.parentNode.o.angleBetween(this.target) - (this.parentNode.direction + this.kinimaticsDirection)) * -1) + (this.parentNode.direction + this.kinimaticsDirection)
				this.direction = this.parentNode.direction
				this.target = this.parentNode.o.pointFromVector(this.direction + this.kinimaticsDirection,this.kinimaticsExtentDis);
				
			}
			
			distBet = this.nodes[1].o.distanceBetween(this.target);
			angBet = this.nodes[1].o.angleBetween(this.target);
			
			moveDistance = this.steppingSpeed;
			if (moveDistance > distBet) moveDistance = distBet;

			if (distBet > 0) {
				//for (var j = (this.nodes.length-1); j >= 0; j--) {
				//resolves step
					
				point = this.nodes[1].o.pointFromVector(angBet, moveDistance);
				this.nodes[1].lasto.set(this.nodes[1].o);
				this.nodes[1].o.set(point);
				
				distBet = this.nodes[0].o.distanceBetween(this.nodes[1].o);
				angBet = this.nodes[0].o.angleBetween(this.nodes[1].o);
				
				if (distBet > this.kinimaticsExtentDis*.5) {
					distBet = this.nodes[0].o.distanceBetween(this.nodes[1].o);
					angBet = this.nodes[0].o.angleBetween(this.nodes[1].o);
					point = this.nodes[0].o.pointFromVector(angBet, distBet-(this.kinimaticsExtentDis*.5));
					this.nodes[0].lasto.set(this.nodes[0].o);
					this.nodes[0].o.set(point);
				}
				//}
			}
			
			distBet = this.nodes[0].o.distanceBetween(this.parentNode.o);
			angBet = this.nodes[0].o.angleBetween(this.parentNode.o);

			if (distBet > this.kinimaticsExtentDis*.5) {
				for (var j = 0; j < this.nodes.length; j++) {
					//resolves links between parents and children
					
					moveDistance = (distBet - (this.kinimaticsExtentDis*.5));
					point = this.nodes[j].o.pointFromVector(angBet, moveDistance);
					this.nodes[j].lasto.set(this.nodes[j].o);
					this.nodes[j].o.set(point);
				}
			}


			
		//}
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].update();
		}
		
		
		
		this.nodes[0].lasto.x = tx
		this.nodes[0].lasto.y = ty
		this.o.set(this.nodes[0].o);
	}
}






function salamander(origin, direction = 0, color = 'orange') {
	this.type = 'salamander';
	this.o = origin;
	this.direction = direction;
	this.mass = 4;
	
	this.lasto = new Coord(this.o.x,this.o.y)
	this.accel = 0;
	this.acceldir = 0;
	
	
	this.size = 1;
	this.radius = [3, 4, 3, 3.5, 4, 4, 3.5, 3.5, 3, 2.5, 2.5, 2, 1.5, 1, 1, .5, .5, .1];
	this.radiusPadding = .5;
	this.color = color;
	
	let gravity = 0;//-.1;
	
	this.maxTurnAngle = .5;
	this.legs = [];
	this.nodes = [];
	this.nodes[0] = new node('circle', this.o, this.direction, this.radius[0], this.mass, this.color);
	for (var i = 1; i < this.radius.length; i++) {
		this.nodes[i] = new node('link', this.nodes[i-1].o.pointFromVector(this.direction + Math.PI, 5), this.direction, this.radius[i], this.mass, this.color, this.nodes[i-1], 5, 4.5, 0, .4);
		//if (i==2) this.nodes[i].type = 'circle';
	}
	
	
	this.legs[0] = new salamanderLeg(this, this.nodes[2], Math.PI*.3, Math.PI)
	this.legs[1] = new salamanderLeg(this, this.nodes[2], Math.PI*1.7, Math.PI)
	this.legs[2] = new salamanderLeg(this, this.nodes[7], Math.PI*.3, Math.PI)
	this.legs[3] = new salamanderLeg(this, this.nodes[7], Math.PI*1.7, Math.PI)

	//temp variables
	let massOffset = 0;

	
	
	
	this.draw = function() {
		for (var j = 0; j < this.nodes.length; j++) {
			this.nodes[j].draw();
		}
		for (var k = 0; k < this.legs.length; k++) {
			this.legs[k].draw();
		}

		let point = this.nodes[0].o.pointFromVector(this.nodes[0].direction + Math.PI*1.25,3)
		c.beginPath();
		c.arc(point.x, point.y, .75, 0, Math.PI*2, false);
		c.fillStyle = 'black';
		c.fill();
		point = this.nodes[0].o.pointFromVector(this.nodes[0].direction + Math.PI*.75,3)
		c.beginPath();
		c.arc(point.x, point.y, .75, 0, Math.PI*2, false);
		c.fill();
		
	}
	
	this.update = function() {
		
		let tx = this.nodes[0].o.x;
		let ty = this.nodes[0].o.y;
		
		if (this.accel > .15) {
			this.accel = .15;
		}
		
		//substeps
		//for (var ss = 0; ss < physicsSubSteps; ss++) {
			
			
			
			//resolves velocity
			//this.o.x += (tx - this.lasto.x)/physicsSubSteps
			//this.o.y += (ty - this.lasto.y)/physicsSubSteps
			
			//resolves acceleration
			if (this.accel>0) {
				
				//if (Math.abs(this.acceldir - this.nodes[1].direction) > this.maxTurnAngle) {
					
					//this.direction = this.nodes[1].direction + this.maxTurnAngle * ((this.acceldir - this.nodes[1].direction)/(Math.abs(this.acceldir - this.nodes[1].direction)))
				//}
				//else {
					this.direction = this.acceldir;
				//}
				
				this.nodes[0].o.set(this.nodes[0].o.pointFromVector(this.direction,this.accel));
				this.nodes[0].direction = this.direction;
				
			}
			
			//resolves gravity
			//this.o.y -= gravity / physicsSubSteps
			
			/*for (var j = 0; j < this.nodes.length; j++) {
				//resolves collisions
				
				if (this.nodes[j].o.x + this.nodes[j].radius > canvas.width) {
					this.nodes[j].o.x = canvas.width - this.nodes[j].radius;
				}
				if (this.nodes[j].o.x - this.nodes[j].radius < 0) {
					this.nodes[j].o.x = this.nodes[j].radius;
				}
				if (this.nodes[j].o.y + this.nodes[j].radius > canvas.height) {
					this.nodes[j].o.y = canvas.height - this.nodes[j].radius;
				}
				if (this.nodes[j].o.y - this.nodes[j].radius < 0) {
					this.nodes[j].o.y = this.nodes[j].radius;
				}
				
				
				
				for (var i = 0; i < nodeArray.length; i++) {
					if ((nodeArray[i] !== this) &&  (Math.abs(nodeArray[i].o.x - this.o.x) < (50)) && (Math.abs(nodeArray[i].o.y - this.o.y) < (50))) {
						
						let distBet = this.nodes[j].o.distanceBetween(nodeArray[i].o);
						let angBet = this.nodes[j].o.angleBetween(nodeArray[i].o);


						if (distBet < this.nodes[j].radius + nodeArray[i].radius) {
							let moveDistance = (this.nodes[j].radius + nodeArray[i].radius - distBet)/2;
							
							if (this.mass == -1) massOffset = 1;
							else if (nodeArray[i].mass == -1) massOffset = 0;
							else massOffset = this.mass / (this.mass + nodeArray[i].mass);
							
							let point = this.nodes[j].o.pointFromVector(angBet + Math.PI, moveDistance * (1-massOffset));
							this.nodes[j].o.set(point);
							point = nodeArray[i].o.pointFromVector(angBet, moveDistance * (massOffset));
							nodeArray[i].o.set(point);
							
						}
						
						nodeArray[i].direction = angBet;
					}
				}
			}*/
			
			
			for (var j = 1; j < this.nodes.length; j++) {
				
				//resolves links between parents and children
				
				let distBet = this.nodes[j].o.distanceBetween(this.nodes[j-1].o);
				let angBet = this.nodes[j].o.angleBetween(this.nodes[j-1].o);
				
				

				if (distBet > 5) {
					let moveDistance = (distBet - 5);
					let point = this.nodes[j].o.pointFromVector(angBet, moveDistance);
					this.nodes[j].lasto.set(this.nodes[j].o);
					this.nodes[j].o.set(point);
					this.nodes[j].direction = angBet;
				}
				/*else if ((this.parentOffsetMin < this.parentOffsetMax)) {
					if (distBet < this.parentOffsetMin) {
						let moveDistance = (this.parentOffsetMin - distBet)/2;
						let point = this.o.pointFromVector(angBet + Math.PI, moveDistance * massOffset);
						this.o.x = point.x;
						this.o.y = point.y;
						point = this.objectParent.o.pointFromVector(angBet, moveDistance * (1-massOffset));
						this.objectParent.o.x = point.x;
						this.objectParent.o.y = point.y;
						
					}
				}*/
				
				
				
				
				
			}
			
			for (var k = 0; k < this.legs.length; k++) {
				this.legs[k].update();
			}
			
		//}
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].update();
		}
		
		
		
		this.nodes[0].lasto.x = tx;
		this.nodes[0].lasto.y = ty;
		this.o.set(this.nodes[0].o);
	}
}