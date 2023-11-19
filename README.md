## Identity Bearer Auth

Uses Cloudflare Workers, R1 and KV Store.  
Uses LuciaAuth(CF R1 SQLite for users and CF KV Store for sessions) to check if an incoming request has a valid session key for Bearer Auth, if so, returns users user-id.  
Serverless, auto-scaling.  
