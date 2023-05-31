import { EventEmitter } from 'events';
import {
	ReconnectableWebSocket,
	ReconnectableWebSocketOptions,
} from './socket';
import { parseMessage } from './util';
import WebSocket from 'ws';

export class Client {
	private emitter = new EventEmitter();
	private socket: ReconnectableWebSocket;
	private subscriptions: Record<string, number> = {};
	constructor(
		url: string,
		protocols: string[] = [],
		options?: ReconnectableWebSocketOptions
	) {
		this.socket = new ReconnectableWebSocket(url, protocols, options);

		this.socket.onmessage = this.onMessageInternal.bind(this);
		this.socket.onreconnect = this.onReconnectInternal.bind(this);
	}

	publish(channel: string, message: any) {
		const data = {
			type: 'message',
			channel: channel,
			data: message,
		};

		this.sendInternal(data);
	}

	subscribe<T = any>(channel: string, cb: (messge: T) => void) {
		const data = {
			type: 'subscribe',
			subscriptions: [channel],
		};
		this.sendInternal(data);
		this.subscribeInternal(channel, cb);
	}

	unsubscribe(channel: string, cb?: () => void) {
		const data = {
			type: 'subscribe',
			subscriptions: [channel],
		};
		this.sendInternal(data);
		this.unsubscribeInternal(channel);

		cb && cb();
	}

	unsubscribeAll() {
		for (let channel in this.subscriptions) {
			const counter = this.subscriptions[channel];

			for (let i = 0; i < counter; i++) this.unsubscribe(channel);
		}
	}

	close(code?: number, reason?: string | Buffer) {
		this.socket.close(code, reason);
	}

	private sendInternal(message: any) {
		const data = JSON.stringify(message);
		this.socket.send(data);
	}

	private subscribeInternal(channel: string, cb: (messge: any) => void) {
		this.subscriptions[channel] = this.subscriptions[channel] || 0;
		this.subscriptions[channel] += 1;
		this.emitter.on(channel, cb);
	}

	private unsubscribeInternal(channel: string) {
		this.subscriptions[channel] = this.subscriptions[channel] || 0;
		this.subscriptions[channel] -= 1;

		if (this.subscriptions[channel] > 0) return;

		this.emitter.removeAllListeners(channel);
	}

	private onMessageInternal(data: WebSocket.MessageEvent) {
		const message = parseMessage(data.data.toString());
		this.emitter.emit(message.channel, message.data);
	}

	private onReconnectInternal() {
		const subs = [];

		for (let channel in this.subscriptions) {
			if (this.subscriptions[channel] <= 0) continue;
			subs.push(channel);
		}

		const data = {
			type: 'subscribe',
			subscriptions: subs,
		};

		this.sendInternal(data);
	}
}
