import WebSocket from 'ws';

function getRandom(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export type ReconnectableWebSocketOptions = {
	automaticOpen: boolean;
	reconnectOnError: boolean;
	reconnectInterval: number;
	maxReconnectInterval: number;
	reconnectDecay: number;
	timeoutInterval: number;
	maxReconnectAttempts: any;
	randomRatio: number;
	reconnectOnCleanClose: boolean;
};

const defaultOptions: ReconnectableWebSocketOptions = {
	automaticOpen: true,
	reconnectOnError: true,
	reconnectInterval: 1000,
	maxReconnectInterval: 30000,
	reconnectDecay: 1.5,
	timeoutInterval: 2000,
	maxReconnectAttempts: null,
	randomRatio: 3,
	reconnectOnCleanClose: false,
};

enum CONNECTION_STATE {
	CONNECTING = 0,
	OPEN = 1,
	CLOSING = 2,
	CLOSED = 3,
}

const isCloseEvent = (
	data: WebSocket.CloseEvent | WebSocket.ErrorEvent
): data is WebSocket.CloseEvent => 'wasClean' in data;

export class ReconnectableWebSocket {
	private options: ReconnectableWebSocketOptions;
	private socket: WebSocket;
	private reconnectAttempts = 0;
	private readyState: CONNECTION_STATE = CONNECTION_STATE.CONNECTING;
	private _messageQueue: Array<string> = [];
	public onmessage?: (event: WebSocket.MessageEvent) => void;
	public onreconnect?: () => void;
	public onopen?: (event: WebSocket.Event) => void;
	public onclose?: (event: WebSocket.CloseEvent) => void;
	public onerror?: (event: WebSocket.ErrorEvent) => void;
	constructor(
		private readonly url: string,
		private readonly protocols: string[] = [],
		options?: ReconnectableWebSocketOptions
	) {
		this.options = Object.assign({}, defaultOptions, options);
	}

	open() {
		let socket = (this.socket = new WebSocket(this.url, this.protocols));

		if (
			this.options.maxReconnectAttempts &&
			this.options.maxReconnectAttempts < this.reconnectAttempts
		) {
			return;
		}

		this.syncState();

		socket.onmessage = this.onmessageInternal.bind(this);
		socket.onopen = this.onopenInternal.bind(this);
		socket.onclose = this.oncloseInternal.bind(this);
		socket.onerror = this.onerrorInternal.bind(this);
	}

	private onmessageInternal(ev: WebSocket.MessageEvent) {
		this.onmessage && this.onmessage(ev);
	}

	private onopenInternal(event: WebSocket.Event) {
		this.syncState();
		this.flushQueue();
		if (this.reconnectAttempts !== 0) {
			this.onreconnect && this.onreconnect();
		}
		this.reconnectAttempts = 0;

		this.onopen && this.onopen(event);
	}

	private oncloseInternal(event: WebSocket.CloseEvent) {
		this.syncState();

		this.onclose && this.onclose(event);

		this.tryReconnect(event);
	}

	private onerrorInternal(event: WebSocket.ErrorEvent) {
		this.socket.close();
		this.syncState();

		this.onerror && this.onerror(event);

		if (this.options.reconnectOnError) this.tryReconnect(event);
	}

	private flushQueue() {
		while (this._messageQueue.length !== 0) {
			let data = this._messageQueue.shift();
			if (!data) return;
			this.socket.send(data);
		}
	}

	send(data: string) {
		if (
			this.socket &&
			this.socket.readyState === WebSocket.OPEN &&
			this._messageQueue.length === 0
		) {
			this.socket.send(data);
		} else {
			this._messageQueue.push(data);
		}
	}

	close(code?: number, reason?: string | Buffer) {
		if (typeof code === 'undefined') code = 1000;

		if (this.socket) this.socket.close(code, reason);
	}

	private tryReconnect(event: WebSocket.CloseEvent | WebSocket.ErrorEvent) {
		if (
			isCloseEvent(event) &&
			event.wasClean &&
			!this.options.reconnectOnCleanClose
		) {
			return;
		}
		setTimeout(() => {
			if (
				this.readyState === CONNECTION_STATE.CLOSING ||
				this.readyState === CONNECTION_STATE.CLOSED
			) {
				this.reconnectAttempts++;
				this.open();
			}
		}, this.getTimeout());
	}

	private getTimeout() {
		let timeout =
			this.options.reconnectInterval *
			Math.pow(this.options.reconnectDecay, this.reconnectAttempts);
		timeout =
			timeout > this.options.maxReconnectInterval
				? this.options.maxReconnectInterval
				: timeout;
		return this.options.randomRatio
			? getRandom(timeout / this.options.randomRatio, timeout)
			: timeout;
	}

	private syncState() {
		this.readyState = this.socket.readyState;
	}
}
