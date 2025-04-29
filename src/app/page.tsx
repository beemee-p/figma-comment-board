"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get("access_token");
		if (accessToken) {
			setToken(accessToken);
		}
	}, []);

	const loginWithFigma = () => {
		window.location.href = "/api/oauth/login";
	};

	return (
		<main className="p-10">
			<h1 className="text-2xl font-bold mb-4">Figma Comment Board Plugin</h1>

			{!token ? (
				<button
					onClick={loginWithFigma}
					className="px-4 py-2 bg-black text-white rounded"
				>
					Login with Figma
				</button>
			) : (
				<>
					<p className="mb-2 text-green-600">
						✅ Logged in! Access Token: {token.slice(0, 10)}...
					</p>
					<iframe
						src={`/plugin-ui.html?access_token=${token}`}
						width="100%"
						height="600"
						className="border rounded"
					/>
				</>
			)}
		</main>
	);
}
