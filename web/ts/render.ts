import settings from "./settings.ts";
import camera from "./camera.js";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { Circle, Point, Rect } from "../../common/data-types/structures.ts";
import { ClientPlayer } from "../../common/data-types/types-client.ts";

const rensets = settings.rendering;

function render(state: SafeState) {
	const selfPlayer = getSelf(state);
	setCamera(state, selfPlayer);
	renderBackground();
	renderPlayers(state);
	renderMap();
}

function getSelf(state: SafeState): ClientPlayer {
	const maybeSelf = state.playerMap.get(state.self);

	if (!maybeSelf) {
		throw "Could not find self";
	}

	return maybeSelf;
}

function setCamera(state: SafeState, selfPlayer: ClientPlayer) {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = selfPlayer.position;

	const topLeft = new Point(center.x - width / 2, center.y - height / 2);
	const bottomRight = new Point(
		center.x + width / 2,
		center.y + height / 2
	);

	const cameraRect = new Rect(topLeft, bottomRight);

	camera.setCamera(cameraRect);
}

function renderBackground() {
	// Fill in the background color
	camera.fillScreen(rensets.background);

	// Fill in the map background color
	const mapTopLeft = new Point(0, 0);
	const mapBottomRight = new Point(map.width, map.height);
	const mapRect = new Rect(mapTopLeft, mapBottomRight);
	camera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = new Point(x, 0);
		const finish = new Point(x, map.height);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = new Point(0, y);
		const finish = new Point(map.width, y);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}

function renderPlayers(state: SafeState) {
	for (const player of state.playerMap.values()) {
		const circle = new Circle(player.position, rensets.players.radius);
		let color;

		if (player.id == state.self) {
			color = rensets.players.self;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(circle, color);
	}
}

function renderMap() {
	// Draw death rects
	for (const deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw map boundaries
	const mapTopLeft = new Point(0, 0);
	const mapBottomRight = new Point(map.width, map.height);
	const mapRect = new Rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

export default render;