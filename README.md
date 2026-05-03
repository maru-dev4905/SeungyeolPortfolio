# Lee Seungyeol — Portfolio

웹·UI 퍼블리셔 **이승열**의 포트폴리오입니다.

**사이트:** [https://seungyeol.kr](https://seungyeol.kr)

![Lee Seungyeol Portfolio — 메인 화면](react-app/public/assets/images/main_img.jpg)

---

## 소개

프로젝트 아카이브, About, Contact 등을 **React Router** 기반 SPA로 구성했습니다.  
오프닝 인트로, 스크롤 스무딩, 커스텀 커서·노이즈 배경 등은 `src` 훅·레거시 스크립트와 GSAP으로 처리합니다.

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
├── react-app/                 # 앱 루트
│   ├── src/
│   ├── public/
│   │   ├── CNAME              # GitHub Pages 커스텀 도메인 → dist로 복사됨
│   │   └── assets/            # 이미지·폰트·CSS 등
│   ├── scripts/               # 빌드 후 404.html 생성 (GitHub Pages SPA)
│   └── package.json
└── README.md
```
