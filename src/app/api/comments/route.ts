import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FigmaCommentRes } from "@/types/api";

// preflight req for cors
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin":
				process.env.NEXT_PUBLIC_VITE_URL || "http://localhost:5173",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}

// comment api
export async function GET(req: NextRequest) {
	// token & fileKey 가져오기
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token");
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
				Authorization: `Bearer ${token.value}`,
			},
		}
	);

	if (!res.ok) {
		return NextResponse.json(
			{ error: "Failed to fetch comments from Figma API" },
			{ status: res.status }
		);
	}

	const data: FigmaCommentRes[] = await res.json();

	return NextResponse.json(data, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin":
				process.env.NEXT_PUBLIC_VITE_URL || "http://localhost:5173",
			"Access-Control-Allow-Credentials": "true",
			"Content-Type": "application/json",
		},
	});
}
