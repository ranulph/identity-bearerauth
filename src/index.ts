import { Hono } from 'hono';
import { lucia } from "lucia";
import { cors } from 'hono/cors';
import { hono } from "lucia/middleware";
import { d1 } from "@lucia-auth/adapter-sqlite";
import { createStorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";
import { unstorage } from "@lucia-auth/adapter-session-unstorage";

type Bindings = {
	IDENTITY_DB: D1Database;
	IDENTITY_SESSIONS: KVNamespace;
};

const initializeLucia = (db: D1Database, kv: KVNamespace) => {
	const sessions = createStorage({
		driver: cloudflareKVBindingDriver({ binding: kv }),
	});
	const auth = lucia({
		adapter: {
			user: d1(db, {
				user: "user",
				key: "user_key",
				session: null
			}),
			session: unstorage(sessions)
		},
        env: "PROD",
        middleware: hono(),
        sessionCookie: {
            expires: false
        },
		getUserAttributes: (data) => {
			return {
				githubUsername: data.username
			};
		}
	});
	return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.all('/', async (c) => {

	const auth = initializeLucia(c.env.IDENTITY_DB, c.env.IDENTITY_SESSIONS);
	const authRequest = auth.handleRequest(c);

	const session = await authRequest.validateBearerToken();
	
	if (session) {
		return c.newResponse(null, 200, {
			userId: session.user.userId
		});
	}
	return c.newResponse(JSON.stringify({ error: 'Unauthorized Request' }), 401);
});

export default app;
