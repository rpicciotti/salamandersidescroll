import camera from "./camera.ts";
import map from "../../common/map.ts";
import { SafeState } from "./state.ts";
import { Point, Rect } from "../../common/data-types/shapes.ts";
import { rensets } from "../../common/settings.ts";
import { Color } from "../../common/colors.ts";
import { PlayerRole } from "../../common/data-types/types-base.ts";
import { renderGeneralWindow } from "./generalWindow.ts";

function render(state: SafeState) {
	setCamera(state);
	renderBackground();
	renderMap(state);
	renderPlayers(state);

	if (state.self.role == PlayerRole.GENERAL) {
		renderGeneralWindow(state);
	}
}

function setCamera(state: SafeState) {
	const width = state.screen.width;
	const height = state.screen.height;
	const center = state.self.position.center;

	const topLeft = Point(center.x - width / 2, center.y - height / 2);
	const bottomRight = Point(
		center.x + width / 2,
		center.y + height / 2
	);

	const cameraRect = Rect(topLeft, bottomRight);

	camera.setCamera(cameraRect);
}

function renderBackground() {
	// Fill in the background color
	camera.fillScreen(rensets.background);

	// Fill in the map background color
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.fillRect(mapRect, rensets.grid.background);

	// Draw the vertical grid
	for (let x = 0; x <= map.width; x += rensets.grid.spacing) {
		const start = Point(x, 0);
		const finish = Point(x, map.height);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}

	// Draw the horizontal grid
	for (let y = 0; y <= map.height; y += rensets.grid.spacing) {
		const start = Point(0, y);
		const finish = Point(map.width, y);
		camera.line(start, finish, rensets.grid.color, rensets.grid.width);
	}
}

function renderMap(state: SafeState) {
	// Draw facilities
	const allyFacilityBundles = map.facilities.filter(fac => fac.team == state.self.team);
	const enemyFacilityBundles = map.facilities.filter(fac => fac.team != state.self.team);

	for (const bundle of allyFacilityBundles) {
		camera.fillRect(bundle.base, rensets.facilities.ally.base);
		camera.fillRect(bundle.command, rensets.facilities.ally.command);
		for (const briefing of bundle.briefings) {
			camera.fillRect(briefing, rensets.facilities.ally.pickup);
		}

		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.ally.outpost);
		}
		camera.fillRect(bundle.armory, rensets.facilities.ally.armory);
		camera.fillRect(bundle.intel, rensets.facilities.ally.intel);
	}

	for (const bundle of enemyFacilityBundles) {
		camera.fillRect(bundle.base, rensets.facilities.enemy.base);
		camera.fillRect(bundle.command, rensets.facilities.enemy.command);
		for (const briefing of bundle.briefings) {
			camera.fillRect(briefing, rensets.facilities.enemy.pickup);
		}

		for (const outpost of bundle.outposts) {
			camera.fillRect(outpost, rensets.facilities.enemy.outpost);
		}
		camera.fillRect(bundle.armory, rensets.facilities.enemy.armory);
		camera.fillRect(bundle.intel, rensets.facilities.enemy.intel);
	}

	// Draw death rects
	for (const deathRect of map.deathRects) {
		camera.fillRect(deathRect, rensets.death.color);
	}

	// Draw death circles
	for (const deathCircle of map.deathCircles) {
		camera.fillCircle(deathCircle, rensets.death.color);
	}

	// Draw safe zone
	camera.fillCircle(map.safeZone, rensets.safe.color);

	// Draw map boundaries
	const mapTopLeft = Point(0, 0);
	const mapBottomRight = Point(map.width, map.height);
	const mapRect = Rect(mapTopLeft, mapBottomRight);
	camera.outlineRect(mapRect, rensets.mapBorder.color, rensets.mapBorder.width);
}

function renderPlayers(state: SafeState) {
	for (const player of state.playerMap.values()) {
		let color: Color;

		if (player.id == state.selfId) {
			color = rensets.players.self;
		} else if (player.team == state.self.team) {
			color = rensets.players.allies;
		} else {
			color = rensets.players.enemies;
		}

		camera.fillCircle(player.position, color);
	}
}

export default render;
