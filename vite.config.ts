import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	root: "plugin",
	build: {
		rollupOptions: {
			// 다중 입력 파일 설정
			input: {
				pluginUI: resolve(__dirname, "plugin/plugin-ui.html"),
				code: resolve(__dirname, "plugin/code.ts"),
			},
			output: {
				entryFileNames: chunk => {
					if (chunk.name === "code") {
						return "code.js"; // code.ts 빌드 결과
					}
					return "[name].js"; // 기본 파일명
				},
			},
		},
		outDir: "../public", // 빌드 결과물 디렉터리
		emptyOutDir: true, // 기존 빌드 결과물 삭제
	},
});
