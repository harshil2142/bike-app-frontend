import { NextResponse } from "next/server";

export default function middleware(req) {
  let verify = req.cookies.get('loggedin');
  
  let url = req.url;
console.log(verify);
//   if (!verify && !url.includes('/login')) {
//     // If the user is not logged in and is not on the login page, redirect to the login page.
//     const protocol = req.headers['x-forwarded-proto'] || 'http';
//     const host = req.headers['host'] || 'localhost:3000';
//     const loginUrl = `${protocol}://${host}/login`;
//     return NextResponse.redirect(loginUrl);
//   }
// console.log("middleware");
  // If the user is logged in or is already on the login page, allow the request to continue.
  if(verify === false){
      return NextResponse.redirect(new URL('/login',req.url));
  }
}


export const config = {
    matcher : "/admin/:path*"
}