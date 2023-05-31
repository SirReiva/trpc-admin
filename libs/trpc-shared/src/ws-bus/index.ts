import { ServerOptions } from 'ws';
import { Client } from './client';
import { Server } from './server';
import { ReconnectableWebSocketOptions } from './socket';

export default {
	createClient: (
		url: string,
		protocols: Array<string>,
		options?: ReconnectableWebSocketOptions
	) => new Client(url, protocols, options),
	createServer: (options: ServerOptions) => new Server(options),
};
