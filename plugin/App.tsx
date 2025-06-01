import { FigmaComment } from "@/types/api";
import React, { useEffect, useState } from "react";

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

	// o(n)
	// 코멘트 객체에 replies 배열을 추가하고,
	comments.forEach(comment => {
		comment.replies = [];
		// o(1) 코멘트 ID를 키로 하는 맵을 생성
		commentMap.set(comment.id, comment);
	});

	// o(n)
	comments.forEach(comment => {
		// 각 코멘트를 순회하며 부모 ID가 있는 경우
		if (comment.parent_id && commentMap.has(comment.parent_id)) {
			// o(1) 해당 부모의 replies 배열에 추가
			commentMap.get(comment.parent_id)!.replies!.push(comment);
		} else {
			roots.push(comment);
		}
	});

	return roots;
}

const App = () => {
	const [commentList, setCommentList] = useState<FigmaComment[]>([]);

	useEffect(() => {
		const setData = async () => {
			const figmaComment = await getCommentList();
			if (!!figmaComment?.length) setCommentList(figmaComment);
		};

		setData();
	}, []);

	return (
		<main>
			<h2>피그마 테이블</h2>
			<table>
				{commentList.map(comment => (
					<tr key={comment.id}>
						<td> {comment.user.handle} : </td>
						<td>{comment.message}</td>
					</tr>
				))}
			</table>
		</main>
	);
};

export default App;
