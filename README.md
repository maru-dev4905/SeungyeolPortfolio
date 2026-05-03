# Lee Seungyeol — Portfolio

웹·UI 퍼블리셔 **이승열**의 포트폴리오입니다. 이 브랜치는 **React(Vite) SPA**만 포함합니다.

**사이트:** [https://seungyeol.kr](https://seungyeol.kr)

![Lee Seungyeol Portfolio — 메인 화면](react-app/public/assets/images/main_img.jpg)

---

## 소개

프로젝트 아카이브, About, Contact 등을 **React Router** 기반 SPA로 구성했습니다.  
오프닝 인트로, 스크롤 스무딩, 커스텀 커서·노이즈 배경 등은 `src` 훅·레거시 스크립트와 GSAP으로 처리합니다.

**예전 정적 멀티 페이지(Swup) 버전**은 브랜치 `legacy-static-html` 등에 보관해 두었습니다.

---

## 기술 스택

| 구분       | 사용 기술                                             |
| ---------- | ----------------------------------------------------- |
| UI·라우팅  | React 19, React Router                                |
| 스크립트   | TypeScript                                            |
| 스타일     | CSS                                                   |
| 빌드       | Vite 5                                                |
| 애니메이션 | GSAP (ScrollTrigger, ScrollSmoother, ScrambleText 등) |

---

## 저장소 구조

```
├── react-app/                 # 앱 루트 (npm 명령은 여기서)
│   ├── src/
│   ├── public/
│   │   ├── CNAME              # GitHub Pages 커스텀 도메인 → dist로 복사됨
│   │   └── assets/            # 이미지·폰트·CSS 등
│   ├── scripts/               # 빌드 후 404.html 생성 (GitHub Pages SPA)
│   └── package.json
└── README.md
```

---

## 로컬 실행

```bash
cd react-app
npm install
npm run dev
```

프로덕션 빌드 (`dist/`) — GitHub Pages에 **dist 내용 전체**를 올리면 됩니다.  
빌드 시 `index.html`을 복사해 **`404.html`**을 만들어 두어, 직접 URL·새로고침 시에도 SPA가 동작하도록 했습니다.

```bash
cd react-app
npm run build
npm run preview
```

---

## 라이선스 및 문의

저장소 소스·디자인 사용은 사전 협의를 권장합니다. 문의는 사이트 **Contact**를 이용해 주세요.
