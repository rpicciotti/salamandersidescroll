/* TO DO

manage physics sub-steps
break out physics from object
break out rendering loop from object
make primary object with secondary type objects
make rectangle obstructions and ramps with collision
add dampening and friction
add spring forces
add customizable and dynamic angle offset preferences to node children

*/

var mouseClick = new Coord(-10,-10);
var mouseLocation = new Coord(-10,-10);
var touchx = 0;
var touchy = 0;
var mouseDown = false;
var touchDown = false;



document.addEventListener("DOMContentLoaded", () => {
	
	addEventListener('resize', (event) => {
		canvas.width = window.innerWidth/sizeModifier;
		canvas.height = window.innerHeight/sizeModifier;
	});
	
	addEventListener("mousedown", (event) => {
		if (mouseDown == false) {
			mouseClick.set(event.pageX/sizeModifier,event.pageY/sizeModifier);
			mouseDown = true;
		}
	});
	addEventListener("mousemove", (event) => {
		mouseLocation.set(event.pageX/sizeModifier,event.pageY/sizeModifier);
		if (mouseDown == true) {
			setAccel(mouseClick.x,mouseClick.y,mouseLocation.x,mouseLocation.y);
		}
	});
	addEventListener("mouseup", (event) => {
		player.accel = 0;
		mouseDown = false;
	});

	/*addEventListener("touchstart", (event) => {
		if (touchDown == false) {
			touchx = event.pageX;
			touchy = event.pageY;
			touchDown = true;
		}
	});
	addEventListener("touchmove", (event) => {
		if (touchDown == true) {
			setAccel(touchx,touchy,event.pageX,event.pageY);
		}
	});
	addEventListener("touchend", (event) => {
		player.accel = 0;
		touchDown = false;
	});*/
	
	
	
	
	function setAccel(x,y,x2,y2) {
		
		player.accel = (Math.sqrt(((x2-x)**2)+((y2-y)**2)))/100*sizeModifier
		player.acceldir = Math.atan2(y2 - y, x2 - x)+ Math.PI*2
		player.direction = player.acceldir
		
		//console.log(((x2-x)**2) + ", " + ((y2-y)**2))
	}

});









var nodeArray = [];

for (var i = 0; i < 10; i++) {
	var radius = Math.random() * 3 + 3
	var x = Math.random() * (canvas.width - (radius*2)) + radius
	var y = Math.random() * (canvas.height - (radius*2)) + radius

	nodeArray.push(new node('circle', new Coord(x,y), 0, radius, 1, 'red'))
}
var player = new salamander(new Coord(200,50));
//var player = new node('circle', new Coord(50, 100), 0, 10, 10, 'white')
nodeArray.push(player)
//temp = player;
//for (var i = 1; i < 6; i++) {
//	temp = new node('circle', new Coord(50, 100), 0, 6, 6, 'white', temp, 18);
//	nodeArray.push(temp);
//}

var rope = new rope(new Coord(100, 100), 3 ,7, 10, true, .2, 2, 'white')
//temp = new node('link', new Coord(100 + i*4+4, 100), 0, 2, -1, 'blue', temp, 3);
//nodeArray.push(temp);


var temp = new node('circle', new Coord(180, 100), 0, 20, 20, 'red')
nodeArray.push(temp)
var temp = new node('circle', new Coord(150, 100), 0, 20, -1, 'blue')
nodeArray.push(temp)






function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	
	for (var i = 0; i < nodeArray.length; i++) {
		nodeArray[i].update();
	}
	for (var i = 0; i < nodeArray.length; i++) {
		nodeArray[i].draw();
	}
	
	//debug show mouse origin
	if (mouseDown) {
		c.beginPath();
		c.arc(mouseClick.x, mouseClick.y, 5, 0, Math.PI*2, false);
		c.strokeStyle = 'blue';
		c.stroke();
		c.beginPath();
		c.moveTo(mouseClick.x,mouseClick.y);
		c.lineTo(mouseLocation.x, mouseLocation.y);
		c.stroke();
	}
}


animate();
