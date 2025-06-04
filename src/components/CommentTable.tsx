import { FigmaComment } from "@/types/api";
import React, { useMemo } from "react";

interface CommentTableProps {
	commentList: FigmaComment[];
}

const CommentTable = (props: CommentTableProps) => {
	const tableHeads = ["코멘트", "작성자", "작성일", "링크"];
	return (
		<table>
			<thead>
				<tr>
					{tableHeads.map((head, index) => (
						<th key={index}>{head}</th>
					))}
				</tr>
			</thead>

			<tbody>
				{props.commentList.map(comment => (
					<CommentItem key={comment.id} comment={comment} />
				))}
			</tbody>
		</table>
	);
};

const CommentItem = ({ comment }: { comment: FigmaComment }) => {
	const commentLink = useMemo(() => {
		const nodeIDarr = comment.client_meta?.node_id.split(":");
		return nodeIDarr?.length
			? `${import.meta.env.VITE_FIGMA_URL}/design/${comment.file_key}?node-id=${nodeIDarr[0]}-${nodeIDarr[1]}#${comment.id}`
			: null;
	}, [comment.client_meta]);

	return (
		<>
			<tr key={comment.id}>
				<td>{comment.message}</td>
				<td>
					<img src={comment.user.img_url} alt="una" width="20" height="20" />
					{comment.user.handle}
				</td>
				<td>{comment.created_at}</td>
				<td>
					{commentLink && (
						<a href={commentLink} target="_blank">
							코멘트 이동하기
						</a>
					)}
				</td>
			</tr>
			{comment.replies &&
				comment.replies.length > 0 &&
				comment.replies.map(reply => (
					<CommentItem key={reply.id} comment={reply} />
				))}
		</>
	);
};

export default CommentTable;
