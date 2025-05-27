export interface FigmaComment {
	id: string;
	uuid: string;
	file_key: string;
	parent_id: string;
	order_id: string;
	message: string;
	created_at: string;
	resolved_at: string | null;
	user: FigmaUser;
	reactions: FigmaReaction[];
	client_meta: {
		node_id: string;
		node_offset: {
			x: number;
			y: number;
		};
		stable_path: string[];
	};
}

export interface FigmaUser {
	id: string;
	handle: string;
	img_url: string;
}

export interface FigmaReaction {
	emoji: string;
	created_at: string;
	user: FigmaUser;
}
