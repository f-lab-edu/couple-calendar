import { decrypt } from "@/app/lib/session-crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login"];
const protectedRoutes = ["/home"];

export async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => path.includes(route));
	const isPublicRoute = publicRoutes.some((route) => path.includes(route));
	
	const cookie = (await cookies()).get('session')?.value;
	const session = await decrypt(cookie)

	if (isProtectedRoute && !session) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (isPublicRoute && session) {
		return NextResponse.redirect(new URL("/home", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
