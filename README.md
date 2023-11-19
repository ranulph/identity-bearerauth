## Identity Bearer Auth

Used for determining if a request has a valid session. Authentication.

Uses Cloudflare Workers, D1 and KV Store. Is accessed via Cloudflare Worker-to-Worker service binding - without going over the internet.
  
Uses LuciaAuth(CF D1 SQLite for users and CF KV Store for sessions) to check if an incoming request has a valid session key for Bearer Auth, if so, returns users user-id.  
   
Serverless, highly-available, globally distributed, auto-scaling.    
