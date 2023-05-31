import { ServerOptions, Server as WebSocketServer, WebSocket } from 'ws';
import { parseMessage } from './util';

interface SubWebSocket extends WebSocket {
	subscriptions?: Record<string, boolean>;
}

export class Server {
	private wss: WebSocketServer<SubWebSocket> | null;
	constructor(private readonly options: ServerOptions) {}

	listen() {
		this.wss = new WebSocketServer(this.options);
		this.wss.on('connection', client => {
			client.subscriptions = client.subscriptions || {};
			console.log('connected client');
			client.on('message', data => {
				const message = parseMessage(data.toString());
				this.handleIncomingMessage(client, message);
			});
		});
	}

	private handleIncomingMessage(client: SubWebSocket, message: any) {
		switch (message.type) {
			case 'subscribe':
				return this.handleSubscribe(client, message);
			case 'unsubscribe':
				return this.handleUnsubscribe(client, message);
			case 'message':
				return this.handleMessage(client, message);
			default:
				console.error('wrong message: %j', message);
		}
	}

	private handleSubscribe(client: SubWebSocket, message: any) {
		client.subscriptions = client.subscriptions || {};
		let subs = message.subscriptions;

		for (let subscription of subs) {
			client.subscriptions[subscription] = true;
		}
	}

	private handleUnsubscribe(client: SubWebSocket, message: any) {
		client.subscriptions = client.subscriptions || {};
		let subs = message.subscriptions;

		for (let subscription of subs) {
			delete client.subscriptions[subscription];
		}
	}

	private handleMessage(client: SubWebSocket, message: any) {
		this.sendMessage(client, message);
	}

	private sendMessage(myClient: SubWebSocket, message: any) {
		const data = JSON.stringify(message);
		this.wss?.clients.forEach(function each(client) {
			const isSubscribed = client.subscriptions?.[message.channel];
			if (client !== myClient && isSubscribed) client.send(data);
		});
	}

	close() {
		if (!this.wss) return;
		return new Promise<void>((res, rej) => {
			this.wss?.close(err => {
				if (err) rej(err);
				else res();
			});
		});
	}
}
