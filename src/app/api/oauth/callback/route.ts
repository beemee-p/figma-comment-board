import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get("code");

	if (!code) {
		return new NextResponse("Missing code", { status: 400 });
	}

	// res
	const res = await fetch("https://api.figma.com/v1/oauth/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			client_id: process.env.FIGMA_CLIENT_ID,
			client_secret: process.env.FIGMA_CLIENT_SECRET,
			redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/callback`,
			code,
			grant_type: "authorization_code",
		}),
	});

	const tokenData = await res.json();

	// 토큰이 없으면 에러
	if (!tokenData.access_token) {
		return new NextResponse("Token fetch failed", { status: 500 });
	}

	const response = NextResponse.redirect(
		process.env.NEXT_PUBLIC_BASE_URL || "/"
	);

	const cookieOptions: Partial<ResponseCookie> = {
		maxAge: 7776000, // 90 days in seconds
		httpOnly: true, // Optional: for security
		secure: process.env.NODE_ENV === "production", // Optional: use secure cookies in production
		sameSite: "lax",
	};

	response.cookies.set("access_token", tokenData.access_token, cookieOptions);

	return response;
}
