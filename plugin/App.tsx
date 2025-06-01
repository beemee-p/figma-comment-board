/* eslint-disable @next/next/no-img-element */
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
				<thead>
					<tr>
						<th>
							<input type="checkbox" />
						</th>
						<th>코멘트</th>
						<th>작성자</th>
						<th>작성일</th>
						<th>파일 링크</th>
					</tr>
				</thead>

				<tbody>
					{commentList.map(comment => (
						<tr key={comment.id}>
							<td>
								<input type="checkbox" />
							</td>
							<td>{comment.message}</td>
							<td>
								<img
									src={comment.user.img_url}
									alt="una"
									width="20"
									height="20"
								/>
								{comment.user.handle}
							</td>
							<td>{comment.created_at}</td>
							<td>
								<a
									href={`${import.meta.env.VITE_FIGMA_URL}/design/${comment.file_key}?node-id=${comment.client_meta.node_id.split(":")[0]}-${comment.client_meta.node_id.split(":")[1]}#${comment.id}`}
									target="_blank"
								>
									코멘트 이동하기
								</a>
							</td>

							{comment.replies && comment.replies.length > 0 && (
								<tr>
									<ul>
										{comment.replies.map(reply => (
											<li key={reply.id}>
												{reply.message} - {reply.user.handle} (
												{new Date(reply.created_at).toLocaleDateString()})
											</li>
										))}
									</ul>
								</tr>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
};

export default App;
