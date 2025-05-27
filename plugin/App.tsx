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
		const comments = json.comments as FigmaComment[];
		return comments;
	} catch (err) {
		console.error("Error fetching comments:", err);
	}
}

const App = () => {
	const [commentList, setCommentList] = useState<FigmaComment[]>([]);

	useEffect(() => {
		const setData = async () => {
			const figmaComments = await getCommentList();
			if (!!figmaComments?.length) setCommentList(figmaComments);
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
