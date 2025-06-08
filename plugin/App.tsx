/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { FigmaComment } from "@/types/api";
import CommentTable from "@/components/CommentTable";

async function getCommentList(): Promise<FigmaComment[] | undefined> {
	try {
		const res = await fetch(
			`${import.meta.env.VITE_BASE_URL}/api/comments?fileKey=IwoeDSFLT7lnGXlQs2qZrc`,
			{
				credentials: "include",
			}
		);

		if (!res.ok) {
			throw new Error("Network response was not ok");
		}

		const json = await res.json();
		const commentList = updateCommentsByParent(json.comments);
		return commentList;
	} catch (err) {
		console.error("Error fetching comments:", err);
	}
}

function updateCommentsByParent(comments: FigmaComment[]): FigmaComment[] {
	const commentMap = new Map<string, FigmaComment>();
	const roots: FigmaComment[] = [];

	// 코멘트 객체에 replies 배열을 추가하고,
	comments.forEach(comment => {
		comment.replies = [];
		// 코멘트 ID를 키로 하는 맵을 생성 o(1)
		commentMap.set(comment.id, comment);
	});

	comments.forEach(comment => {
		// 각 코멘트를 순회하며 부모 ID가 있는 경우
		if (comment.parent_id && commentMap.has(comment.parent_id)) {
			// 해당 부모의 replies 배열에 추가 o(1)
			commentMap.get(comment.parent_id)!.replies!.push(comment);
		} else {
			roots.push(comment);
		}
	});

	return roots;
}

const App = () => {
	const [commentList, setCommentList] = useState<FigmaComment[] | undefined>(
		undefined
	);

	useEffect(() => {
		const setData = async () => {
			const figmaComment = await getCommentList();
			if (!!figmaComment?.length) setCommentList(figmaComment);
		};

		setData();
	}, []);

	// token 이 없을때는 서버에서 undefined 를 반환
	// front 에서는 undfined 를 받으면 로그인 버튼을 보여줌
	// 이게 맞는지 확인
	return (
		<main>
			<h1>📝 Figma Comments</h1>
			{!commentList ? (
				<a
					href={`${import.meta.env.VITE_BASE_URL}/api/oauth/login`}
					className="px-4 py-2 bg-black text-white rounded"
				>
					Login with Figma
				</a>
			) : (
				<CommentTable commentList={commentList} />
			)}
		</main>
	);
};

export default App;
