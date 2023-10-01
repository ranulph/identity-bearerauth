/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./index.ts").Auth;
	type DatabaseUserAttributes = {
		username: string;
	};
	type DatabaseSessionAttributes = {};
}
