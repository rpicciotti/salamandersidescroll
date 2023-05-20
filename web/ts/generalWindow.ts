import { Point, Rect } from "../../common/data-types/shapes.ts";
import { ChessPiece, TeamName } from "../../common/data-types/types-base.ts";
import { rensets } from "../../common/settings.ts";
import canvas from "./canvas.ts";
import { renderBishop, renderKing, renderPawn, renderQueen, renderRook } from "./chessboard.ts";
import { SafeState } from "./state.ts";

export function renderGeneralWindow(state: SafeState) {
	const genwin = rensets.generalWindow;

	const padding = genwin.padding;
	const squareSize = genwin.squareSize;
	const buttonSize = genwin.buttonSize;

	const boardSize = squareSize*8;
	const windowWidth = padding + boardSize + padding + buttonSize + padding;
	const windowHeight = padding + boardSize + padding;

	const middleX = state.screen.width/2;
	const middleY = state.screen.height/2;

	const topLeftX = middleX - windowWidth/2;
	const topLeftY = middleY - windowHeight/2;
	const bottomRightX = middleX + windowWidth/2;
	const bottomRightY = middleY + windowHeight/2;

	// Draw window
	const windowRect = Rect(Point(topLeftX, topLeftY), Point(bottomRightX, bottomRightY));
	canvas.fillRect(windowRect, genwin.windowInside);
	canvas.outlineRect(windowRect, genwin.windowOutline, 5);

	// Draw board squares
	const boardTopLeftX = topLeftX + padding;
	const boardTopLeftY = topLeftY + padding;
	for (let row = 0 ; row < 8 ; row++) {
		for (let col = 0 ; col < 8 ; col++) {
			const color = (row+col) % 2 == 0 ? genwin.boardLight : genwin.boardDark;
			const squareTLX = boardTopLeftX + (col*squareSize);
			const squareTLY = boardTopLeftY + (row*squareSize);
			const squareTL = Point(squareTLX, squareTLY);
			const squareRect = Rect(squareTL, Point(squareTLX+squareSize, squareTLY+squareSize));
			canvas.fillRect(squareRect, color);

			const cell = state.self.team == TeamName.ALPHA ? state.teamBoard[7-row][col] : state.teamBoard[row][col];
			if (cell) {
				if (cell.piece == ChessPiece.KING) {
					renderKing(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.QUEEN) {
					renderQueen(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.ROOK) {
					renderRook(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.BISHOP) {
					renderBishop(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.KNIGHT) {
					renderKing(squareTL, squareSize, cell.team);
				} else if (cell.piece == ChessPiece.PAWN) {
					renderPawn(squareTL, squareSize, cell.team);
				}
			}
		}
	}

	// Draw board outline
	const boardRect = Rect(Point(boardTopLeftX, boardTopLeftY), Point(topLeftX+boardSize+padding, topLeftY+boardSize+padding));
	canvas.outlineRect(boardRect, genwin.boardOutline, 2);

	// Draw buttons
	const buttonX = topLeftX + padding + boardSize + padding;
	const button1Y = topLeftY + padding;
	const button2Y = middleY - buttonSize/2;
	const button3Y = bottomRightY - padding - buttonSize;

	const button1Rect = Rect(Point(buttonX, button1Y), Point(buttonX+buttonSize, button1Y+buttonSize));
	const button2Rect = Rect(Point(buttonX, button2Y), Point(buttonX+buttonSize, button2Y+buttonSize));
	const button3Rect = Rect(Point(buttonX, button3Y), Point(buttonX+buttonSize, button3Y+buttonSize));

	canvas.fillRect(button1Rect, genwin.button);
	canvas.fillRect(button2Rect, genwin.button);
	canvas.fillRect(button3Rect, genwin.button);
}