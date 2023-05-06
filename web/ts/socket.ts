import { createHook } from "../../common/hooks.ts";
import { ClientMessage } from "../../common/message-types/types-client.ts";
import { ServerMessage } from "../../common/message-types/types-server.ts";
import settings from "./settings.ts";

let sock: WebSocket;
const messageHook = createHook<ServerMessage>();

function init() {
	sock = new WebSocket(settings.server);

	sock.onopen = sockOpen;
	sock.onmessage = sockMessage;
	sock.onerror = sockError;
	sock.onclose = sockClose;
}

function sockOpen(_event: Event) {
	// Do nothing yet
}

function sockMessage(event: MessageEvent) {
	const data = event.data;
	const str = data.toString();
	const message = JSON.parse(str) as ServerMessage;

	messageHook.run(message);
}

function sockError(event: Event) {
	console.error(event);
}

function sockClose(event: CloseEvent) {
	console.warn(event);
}

function send(message: ClientMessage) {
	sock.send(JSON.stringify(message));
}

export default { init, send, listen: messageHook.register };