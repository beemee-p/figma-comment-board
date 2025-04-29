// Figma 코멘트 API 프록시
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	// token & fileKey 가져오기
	const token = req.headers.get("Authorization")?.replace("Bearer ", "");
	const fileKey = req.nextUrl.searchParams.get("fileKey");

	// 토큰과 fileKey가 없으면 에러
	if (!token || !fileKey) {
		return new NextResponse("Missing token or fileKey", { status: 400 });
	}

	// figma 코멘트 API 요청
	const res = await fetch(
		`https://api.figma.com/v1/files/${fileKey}/comments`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	const comments = await res.json();

	return NextResponse.json(comments);
}
