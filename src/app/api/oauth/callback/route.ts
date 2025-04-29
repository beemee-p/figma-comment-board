import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get("code");

	if (!code) {
		return new NextResponse("Missing code", { status: 400 });
	}

	// res
	const res = await fetch("https://www.figma.com/api/oauth/token", {
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

	// 리디렉션하면서 토큰을 쿼리로 넘김 (보안상 취약하므로 나중에 쿠키/세션으로 교체 추천)
	return NextResponse.redirect(
		`${process.env.NEXT_PUBLIC_BASE_URL}/?access_token=${tokenData.access_token}`
	);
}
