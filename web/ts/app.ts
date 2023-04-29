import socket from "./socket.js";
import screen from "./screen.js";
import inputs from "./inputs.js";
import game from "./game.js";

main();

function main() {
	socket.init();
	screen.init();
	inputs.init();

	game.init();
}