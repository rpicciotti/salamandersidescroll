import { Circle, Vector } from "../common/data-types/shapes.ts";
import { BriefingBundle, BriefingName, ChessBoard, ChessPiece, ChessRow, ChesswarId, CommandAction, PlayerRole, TeamName } from "../common/data-types/types-base.ts";
import { MovementState } from "../common/data-types/types-server.ts";

export interface ServerPlayerPhysics {
	mass: number,
	speed: Vector,
	position: Circle
}

export interface ServerPlayer {
	id: ChesswarId,
	team: TeamName,
	role: PlayerRole,
	commandOption: CommandAction | null,
	movement: MovementState,
	physics: ServerPlayerPhysics
}

type PlayerMap = Map<ChesswarId, ServerPlayer>;

interface Team {
	playerMap: PlayerMap
	teamBoard: ChessBoard
	briefings: BriefingBundle
}

interface ServerState {
	realBoard: ChessBoard,
	allPlayers: PlayerMap,
	[TeamName.ALPHA]: Team,
	[TeamName.BRAVO]: Team
}

const state: ServerState = {
	realBoard: newBoard(),
	allPlayers: new Map<ChesswarId, ServerPlayer>(),
	[TeamName.ALPHA]: {
		playerMap: new Map<ChesswarId, ServerPlayer>(),
		teamBoard: newBoard(),
		briefings: {
			[BriefingName.ONE]: null,
			[BriefingName.TWO]: null,
			[BriefingName.THREE]: null
		}
	},
	[TeamName.BRAVO]: {
		playerMap: new Map<ChesswarId, ServerPlayer>(),
		teamBoard: newBoard(),
		briefings: {
			[BriefingName.ONE]: null,
			[BriefingName.TWO]: null,
			[BriefingName.THREE]: null
		}
	}
};

function newBoard(): ChessBoard {
	const row1: ChessRow = [
		{team: TeamName.ALPHA, piece: ChessPiece.ROOK},
		{team: TeamName.ALPHA, piece: ChessPiece.KNIGHT},
		{team: TeamName.ALPHA, piece: ChessPiece.BISHOP},
		{team: TeamName.ALPHA, piece: ChessPiece.QUEEN},
		{team: TeamName.ALPHA, piece: ChessPiece.KING},
		{team: TeamName.ALPHA, piece: ChessPiece.BISHOP},
		{team: TeamName.ALPHA, piece: ChessPiece.KNIGHT},
		{team: TeamName.ALPHA, piece: ChessPiece.ROOK}
	];

	const row2: ChessRow = [
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN},
		{team: TeamName.ALPHA, piece: ChessPiece.PAWN}
	];

	const row3: ChessRow = [null, null, null, null, null, null, null, null];
	const row4: ChessRow = [null, null, null, null, null, null, null, null];
	const row5: ChessRow = [null, null, null, null, null, null, null, null];
	const row6: ChessRow = [null, null, null, null, null, null, null, null];

	const row7: ChessRow = [
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN},
		{team: TeamName.BRAVO, piece: ChessPiece.PAWN}
	];

	const row8: ChessRow = [
		{team: TeamName.BRAVO, piece: ChessPiece.ROOK},
		{team: TeamName.BRAVO, piece: ChessPiece.KNIGHT},
		{team: TeamName.BRAVO, piece: ChessPiece.BISHOP},
		{team: TeamName.BRAVO, piece: ChessPiece.QUEEN},
		{team: TeamName.BRAVO, piece: ChessPiece.KING},
		{team: TeamName.BRAVO, piece: ChessPiece.BISHOP},
		{team: TeamName.BRAVO, piece: ChessPiece.KNIGHT},
		{team: TeamName.BRAVO, piece: ChessPiece.ROOK}
	];

	return [row1, row2, row3, row4, row5, row6, row7, row8];
}

export default state;
