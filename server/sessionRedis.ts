import session from 'express-session';
import MemoryStore from 'memorystore';
import Redis from 'ioredis';

const DevStore = MemoryStore(session);
const connectRedis = require("connect-redis");
const RedisStore = connectRedis(session);

const isProd = process.env.NODE_ENV === 'production';

let store;

if (isProd) {
	// Railway expõe a variável REDIS_URL automaticamente
	const redisClient = new Redis(process.env.REDIS_URL!);

	store = new RedisStore({
		client: redisClient,
		prefix: 'sess:',
	});
} else {
	store = new DevStore({
		checkPeriod: 86400000,
	});
}

export const RedisSession = {
	store,
};
