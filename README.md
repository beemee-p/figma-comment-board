## Getting Started

```bash
pnpm dev
```

## Structure

figma-comments-plugin/
├── public/
│ └── plugin-ui.html // 플러그인 iframe UI
├── app/
│ ├── api/
│ │ ├── oauth/
│ │ │ ├── login/route.ts // OAuth 로그인 시작
│ │ │ └── callback/route.ts // OAuth 콜백 처리 (토큰 발급)
│ │ └── comments/route.ts // 코멘트 API 중계
│ ├── page.tsx // 메인 페이지 (개발용)
├── src/
│ ├── components/
│ │ └── CommentTable.tsx // 코멘트 테이블 컴포넌트
│ └── lib/
│ └── figmaApi.ts // Figma API 호출 로직
├── .env.local // 환경변수 (Client ID, Secret 등)
├── next.config.js // Next.js 설정 파일
├── package.json
└── README.md

api

- login
  클라이언트ID, 리다이렉트 주소, 권한 등을 담아 oauthURL 로 날려보낸다
  이슈 : 여기서 막힘 => 제대로된 주소를 넣고 다시 테스트 해보자
