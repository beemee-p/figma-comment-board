import { NextResponse } from "next/server";

// 로그인 리퀘스트
export async function GET() {
	const scope = "file_read";
	const state = "secureRandomState123"; // CSRF 방지
	const clientID = process.env.FIGMA_CLIENT_ID;
	const redirectURI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/callback`;

	const oauthUrl = `https://www.figma.com/oauth?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}&response_type=code`;

	return NextResponse.redirect(oauthUrl);
}
