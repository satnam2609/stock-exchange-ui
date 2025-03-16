import { NextRequest, NextResponse } from "next/server";

// the list of all allowed origins
const allowedOrigins = [
  'http://localhost:3000', 
  'https://localhost:3500', 
   
];

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Retrieve the HTTP "Origin" header from the request
    const origin = req.headers.get("origin"); // <-- FIXED

    // If the origin is an allowed one, add it to the 'Access-Control-Allow-Origin' header
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.append('Access-Control-Allow-Origin', origin);
    }

    // Add the remaining CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true");
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    return res;
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/order/:path*',
}