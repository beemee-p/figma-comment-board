import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => {
	const isCodeBuild = mode === "code";
	const codeBuildOptions = {
		lib: {
			entry: "./code.ts",
			formats: ["cjs"], // CommonJS 형식으로 빌드
			fileName: () => "code.js",
		},
		rollupOptions: {
			external: ["figma"], // Figma API는 외부 의존성으로 처리
		},
	};

	const buildOptions = {
		rollupOptions: {
			input: {
				pluginUI: resolve(__dirname, "plugin/plugin-ui.html"),
			},
		},
	};

	return {
		plugins: [react(), reactRefresh(), viteSingleFile()],
		root: "plugin",
		resolve: {
			alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
		},
		css: {
			postcss: {
				plugins: [tailwindcss()],
			},
		},
		build: {
			...(isCodeBuild ? codeBuildOptions : buildOptions),
			outDir: "../public",
			emptyOutDir: false, // 기존 빌드 결과물 유지
		},
	};
});
