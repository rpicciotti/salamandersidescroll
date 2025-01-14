import { createHook } from "../../common/hooks.ts";
import { ClientMessage } from "../../common/message-types/types-client.ts";
import { ServerMessage } from "../../common/message-types/types-server.ts";
import { localApiServerOrigin, remoteApiServerOrigin } from "../../common/settings.ts";
import env, { Environment } from "./environment.ts";

let sock: WebSocket;
const messageHook = createHook<ServerMessage>();

export function initSocket() {
	const origin = env == Environment.REMOTE ? remoteApiServerOrigin : localApiServerOrigin;
	sock = new WebSocket(origin);

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

export default { send, listen: messageHook.register };
