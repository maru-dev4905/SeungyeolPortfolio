export interface EngineeringLink {
  label: string
  href: string
}

export interface EngineeringMetric {
  value: string
  label: string
}

export interface EngineeringDecision {
  title: string
  why: string
  alternative?: string
}

export interface EngineeringIssue {
  id: string
  title: string
  symptom: string
  cause: string
  action: string
  verify: string
  pr?: { repo: string; number: number }[]
}

export interface EngineeringProject {
  slug: string
  nameEN: string
  nameKR: string
  tagline: string
  summary: string
  overview: { label: string; value: string }[]
  links: EngineeringLink[]
  metrics: EngineeringMetric[]
  problem: { title: string; body: string[] }
  decisions: EngineeringDecision[]
  timeline: { date: string; text: string }[]
  issues: EngineeringIssue[]
  result: string[]
  limits: string[]
  skills: string[]
}

const MEERKIT_REPO = 'SNACKCUP/meerkit'

export const engineeringProjects: EngineeringProject[] = [
  {
    slug: 'meerkit',
    nameEN: 'MEERKIT',
    nameKR: '미어킷',
    tagline: 'AI 서비스 셋업을 npx 한 줄로 줄이는 스타터킷',
    summary:
      'FastAPI, Next.js, LangChain으로 AI 서비스를 시작할 때마다 반복하던 환경 설정을 CLI로 묶은 스타터킷입니다. 만드는 것보다 "처음 쓰는 사람이 막히는 지점"을 찾아 없애는 일에 시간을 많이 썼습니다.',
    overview: [
      { label: 'Project', value: 'MeerKit (미어킷)' },
      { label: 'Type', value: 'AI 서비스 스타터킷 (FastAPI · Next.js · LangChain) + CLI' },
      { label: 'Team', value: '구름 부트캠프 SNACKCUP, 3인' },
      { label: 'Role', value: '프론트엔드 / CLI 패키징 / Claude 하네스 설계·운영' },
      { label: 'Period', value: '2026.10 ~ 2026.11' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/SNACKCUP/meerkit' },
      { label: 'npm', href: 'https://www.npmjs.com/package/@snackcup/meerkit' },
    ],
    metrics: [
      { value: '41', label: 'PR 작성 (전체 44개 중)' },
      { value: '11', label: '프리릴리스 배포 (rc.0 ~ rc.10, 6일)' },
      { value: '36', label: 'CLI 테스트 (PR #14 당시 25개)' },
      { value: '16', label: '트러블슈팅 기록 (TR-001 ~ 016)' },
    ],
    problem: {
      title: '프로젝트를 시작할 때마다 셋업이 여러 단계로 흩어져 있었음',
      body: [
        'AI 서비스를 새로 시작하려면 환경변수 파일 만들기, Docker로 DB 띄우기, 프론트엔드 의존성 설치, 파이썬 의존성 설치를 각각 따로 해야 했음. 순서가 틀리거나 한 단계가 빠지면 어디서 막혔는지 알기 어려웠고, 같은 설정을 팀원마다 반복했음.',
        '두 번째 문제는 Claude Code로 개발하면서 드러났음. 환경변수 접두사, 빌드로 확인하지 않은 CSS 수정처럼 같은 종류의 실수가 반복될 수 있었고, 해결 과정이 대화 안에만 남으면 다음 세션과 다른 팀원이 알 수 없었음.',
        '그래서 목표를 두 가지로 잡았음. 셋업을 명령 하나로 묶되 실패했을 때 원인을 알려 주는 CLI를 만들고, 한 번 겪은 실수는 규칙으로 남겨 다시 겪지 않게 하는 구조를 만드는 것이었음.',
      ],
    },
    decisions: [
      {
        title: '설치 가이드 문서 대신 CLI로 묶음',
        why: '막히는 지점이 각 단계 안이 아니라 단계 "사이"(DB가 아직 준비되지 않았는데 마이그레이션이 시작됨 등)에 있었음. 문서로는 순서와 현재 상태를 검사할 수 없지만 CLI는 검사한 뒤 다음 단계로 넘어갈 수 있다고 판단함.',
        alternative: 'README에 단계별 설치 가이드를 쓰는 방식. 쓰기는 쉽지만 사용자가 순서를 어겼을 때 막을 수 없음.',
      },
      {
        title: '실패하면 스택 트레이스 대신 "원인 한 줄, 실제 에러 줄, 해결 순서"를 보여 줌',
        why: 'DB 없이 `test`를 돌렸을 때 SQLAlchemy 스택 40줄이 출력되어 실제 원인인 "5432 연결 실패"가 묻혔음. 사용자가 로그를 읽을 수 있다고 가정하지 않기로 함. 분류는 `explain.js` 한 곳에 모아 새 유형을 추가하기 쉽게 함.',
        alternative: '로그를 그대로 보여 주고 문서에서 해결법을 찾게 하는 방식. 원인을 모르는 실패만 원래 출력을 보여 주도록 남겨 둠.',
      },
      {
        title: '검증을 템플릿으로 만든 프로젝트와 저장소 Fork 두 곳에서 모두 함',
        why: '템플릿으로 만든 프로젝트에서만 검증했다가, 저장소를 그대로 Fork한 사용자의 `backend/.env.example` DB 주소(Supabase 54322)가 `setup`이 띄우는 DB(5432)와 달랐음을 놓친 적이 있음. 사용자가 들어오는 입구가 둘이면 검증도 둘이어야 한다고 판단함.',
        alternative: '템플릿 생성 단계에서만 값을 덮어쓰는 방식. 저장소 기본값과 템플릿이 어긋나서 같은 문제가 다시 생김. 기본값 자체를 맞추고 템플릿은 대체용 줄만 빼도록 바꿈.',
      },
      {
        title: '규칙은 문서에만 두지 않고 가능하면 검사로 만듦',
        why: '문서 3곳이 "ESLint가 import 방향을 검사한다"고 적었지만 실제 규칙은 없었음(PR #23에서 발견). 문서를 낮춰 쓰는 데서 멈추지 않고 `no-restricted-imports` 규칙을 실제로 추가함(PR #24). 이후에는 자동 검사가 있다고 쓰기 전에 설정 파일에서 확인하는 규칙을 하네스에 넣음.',
        alternative: '문서에 "이렇게 하세요"만 적어 두는 방식. 어긴 사람이 있어도 아무도 알 수 없음.',
      },
      {
        title: '에러를 해결하면 "Always / Never" 규칙으로 승격하는 하네스를 둠',
        why: '해결이 끝난 직후 Claude가 세션의 diff와 에러 로그로 트러블슈팅 표를 초안으로 쓰고(80%), 사람은 근본 원인과 "왜 그렇게 결정했는지"만 1~2줄 검토함(20%). 같은 실수가 2회 이상 나오거나 치명적이면 `CLAUDE.md`와 `.claude/harness/`의 규칙으로 승격함. 사람은 원인 확정과 결정 맥락 기록에 집중하는 구조임.',
        alternative: '대화 로그에만 남기는 방식. 다음 세션과 다른 팀원이 읽을 수 없음.',
      },
    ],
    timeline: [
      { date: '2026.10.20', text: '트러블슈팅 기록 시작 (TR-001)' },
      { date: '2026.10.29', text: 'CLI 첫 배포 (0.1.0-rc.0). 이날 rc.4까지 5번 배포' },
      { date: '2026.10.30', text: 'rc.5 검증 중 첫 setup 간헐 실패 발견 → DB 헬스체크 (PR #17). Linux·Windows CI 도입 (PR #14)' },
      { date: '2026.11.01', text: 'Docker 무응답 오진(#20), DB 포트 소유 확인(#29), 실패 원인 안내(#27) 반영. ESLint 오기재 발견(#23) 후 규칙 추가(#24)' },
      { date: '2026.11.03', text: '빈 환경변수로 Docs 버튼이 깨지는 문제 수정 (#43, rc.10)' },
    ],
    issues: [
      {
        id: 'ISSUE 01',
        title: '새 사용자의 첫 setup이 4번 중 1번 꼴로 실패함',
        symptom:
          '마이그레이션 단계에서 `server closed the connection unexpectedly`가 났고, 다시 실행하면 통과했음. rc.5를 검증하던 중에 발견함.',
        cause:
          '`docker compose up --wait`는 컨테이너가 "실행 중"이 되면 바로 반환했는데, 새 볼륨의 Postgres는 초기화 중 한 번 재시작함. 그 사이에 마이그레이션이 시작되어 연결이 끊겼음.',
        action:
          '`db`에 healthcheck를 추가하고 `pg_isready -h 127.0.0.1`로 TCP를 확인하게 함. 초기화용 임시 서버는 TCP를 받지 않으므로 소켓만 보는 확인은 너무 일찍 통과하기 때문임. `--wait`가 healthy가 될 때까지 기다리게 하고, compose에 healthcheck가 유지되는지 확인하는 테스트도 추가함.',
        verify:
          '수정 전 `db reset`(볼륨 삭제 → 새로 켜기 → 마이그레이션)을 4번 돌려 1번 실패한 것을 재현했고, 수정 후 8번 모두 성공함.',
        pr: [{ repo: MEERKIT_REPO, number: 17 }],
      },
      {
        id: 'ISSUE 02',
        title: 'Docker가 켜져 있는데 CLI는 "꺼져 있다"고 안내함',
        symptom:
          '`docker info`가 응답하지 않았고 CLI는 Docker가 실행 중이 아니라고 안내했음. 실제로는 Docker Desktop이 켜져 있었음.',
        cause:
          '디스크가 가득 차면 켜져 있는 Docker Desktop이 멈춤. CLI는 타임아웃(`ETIMEDOUT`)을 "미실행"으로 같이 처리하고 있었음. 같은 시기 `npm install`의 ENOSPC도 같은 원인에서 났음.',
        action:
          '타임아웃과 미실행을 구분해서 안내하고(공간 확보 → Docker Desktop 재시작 → 재시도), `setup` 전에 디스크 여유 공간(최소 2GB)을 확인하게 함. 같은 판단 실수를 반복하지 않도록 "타임아웃을 미실행으로 해석하지 않는다"를 하네스 규칙으로 남김.',
        verify: '타임아웃과 정상 응답 분기를 단위 테스트로 추가함 (테스트 29개 통과).',
        pr: [{ repo: MEERKIT_REPO, number: 20 }],
      },
      {
        id: 'ISSUE 03',
        title: '5432 포트를 다른 컨테이너가 쓸 때, 남의 DB에 마이그레이션이 실행됨',
        symptom:
          '`setup`을 두 번째 실행하면 4단계가 "완료"로 끝났고, 5~6단계(마이그레이션, 관리자 계정)가 다른 컨테이너의 DB에서 실행됐음. 첫 실행은 `port is already allocated`로 정상 실패했기 때문에 문제가 가려져 있었음.',
        cause:
          '`docker compose up`이 성공하면 "내 DB가 떠 있다"고 가정했음. 실제로는 이 프로젝트의 DB가 호스트 포트에 열리지 않은 상태였고, 접속 주소만 같은 다른 DB가 응답하고 있었음.',
        action:
          '`docker compose port db 5432`로 실제 연결 포트를 읽어 `.env`의 `DATABASE_URL` 포트와 비교하고, 마이그레이션·시드 "전에" 검사하게 함. 포트를 쓰는 컨테이너 이름과 해결 방법을 알려 주고, 다른 컨테이너를 CLI가 멈추거나 지우지는 않는다는 규칙을 하네스에 남김.',
        verify:
          '실제로 5432를 다른 컨테이너가 쓰는 상태를 만들어 재현함. 수정 후 `setup` 재실행이 컨테이너 이름을 알려 주며 멈췄고 마이그레이션은 0회 실행됨. compose 5433과 .env 5432가 다른 경우의 안내, 둘 다 5433인 정상 경우의 통과도 확인함.',
        pr: [{ repo: MEERKIT_REPO, number: 29 }],
      },
      {
        id: 'ISSUE 04',
        title: 'Windows에서만 CI가 실패함',
        symptom:
          '`sync-template`이 "WelcomePage에서 docsButton을 찾지 못했습니다"로 실패했음. macOS에서는 모두 통과했음.',
        cause:
          'Windows 러너가 파일을 CRLF로 체크아웃해서 정규식이 맞지 않았음. 같은 원인으로 `update`의 파일 해시도 OS마다 달라질 수 있어, 고치지 않은 파일이 "고친 파일"로 오인될 위험이 있었음.',
        action:
          '`.gitattributes`(`* text=auto eol=lf`)로 체크아웃 줄바꿈을 고정하고, 해시는 텍스트 파일의 CRLF를 LF로 바꾼 뒤 계산함(바이너리는 그대로). LF 파일의 해시는 바뀌지 않아 기존 `manifest.json`과 호환됨. 줄바꿈에 민감한 코드는 Linux와 Windows 러너에서 모두 테스트하는 규칙을 남김.',
        verify:
          'ubuntu와 windows 러너 모두 테스트와 스모크(`init`, `update`, `status` 등)를 통과함. CRLF 테스트를 추가함.',
        pr: [{ repo: MEERKIT_REPO, number: 14 }],
      },
      {
        id: 'ISSUE 05',
        title: '`npx`로 만든 프로젝트에서 웰컴 페이지의 Docs 버튼이 열리지 않음',
        symptom: '버튼의 `href`가 빈 문자열이어서 눌러도 이동하지 않았음.',
        cause:
          '`.env.example`의 `NEXT_PUBLIC_DOCS_URL=`(빈 값)이 `setup` 중 `.env.local`로 복사되었고, `??`는 빈 문자열을 그대로 통과시켜 기본 주소로 돌아가지 않았음. `sync-template.mjs`에도 같은 패턴이 있었음.',
        action:
          '`??`를 `||`로 바꾸고, 선택 값은 `.env.example`에서 주석 처리함. 이 일을 "빈 값으로 들어올 수 있는 환경변수의 기본값에는 `??`를 쓰지 않는다"는 규칙으로 하네스에 올림. `NEXT_PUBLIC_*`를 바꾼 뒤에는 개발 서버를 다시 켜야 한다는 주의도 함께 적음.',
        verify: '`npx`로 새 프로젝트를 만들어 Docs 버튼 이동을 확인했고, 0.1.0-rc.10으로 배포함.',
        pr: [
          { repo: MEERKIT_REPO, number: 41 },
          { repo: MEERKIT_REPO, number: 43 },
        ],
      },
    ],
    result: [
      '첫 `setup`의 간헐 실패를 재현 가능한 형태로 만들어 고쳤음. 수정 전 4번 중 1번 실패, 수정 후 8번 모두 성공.',
      '포트가 충돌한 상태에서 `setup`을 다시 실행해도 다른 DB에 마이그레이션과 시드가 실행되지 않음.',
      'CLI 명령 10개 이상이 실패했을 때 원인, 실제 에러 줄, 해결 순서를 보여 줌.',
      'CLI 테스트는 25개에서 36개로 늘었고, `packages/**`가 바뀌면 Linux와 Windows 러너에서 자동으로 돌아감.',
      '문서가 말하는 검사와 실제 검사가 일치함. import 방향은 ESLint와 `test_import_rules.py`, CLI 설명집은 `cli.test.js`가 확인함.',
      '트러블슈팅 16건과 하네스 문서 10개가 남아, 다른 팀원과 다음 세션이 같은 문제를 다시 풀지 않아도 됨.',
    ],
    limits: [
      '규칙이 같은 실수를 실제로 줄였는지는 아직 측정하지 못했음. 규칙을 만들기 전의 재발 횟수를 세어 두지 않아 비교할 기준이 없음. 다음에는 규칙을 만들 때 재발 횟수를 같이 기록하겠음.',
      '실제 Windows PC에서의 검증은 아직 못 했음. Windows 러너에는 Docker가 없어 CI는 단위 테스트와 `init` 스모크까지만 확인함. `stop`이 Windows에서 지원되지 않는 점은 문서에 그대로 적어 둠.',
      '하네스는 Claude Code와 협업하는 방식에 맞춰 만들었음. Claude가 초안을 쓰고 사람이 검토하는 구조이므로, 검토를 건너뛰면 틀린 원인이 규칙으로 굳을 수 있음. 그래서 근본 원인은 사람이 확정하도록 함.',
    ],
    skills: ['Next.js', 'TypeScript', 'FastAPI', 'Node.js CLI', 'Docker', 'GitHub Actions', 'Claude Code', 'ESLint'],
  },
  {
    slug: 'weave',
    nameEN: 'WEAVE',
    nameKR: '위브',
    tagline: '반복하던 퍼블리싱 세팅을 없애려고 만든 CSS 유틸리티와 JS 플러그인 라이브러리',
    summary:
      'Tailwind를 쓸 수 없는 PHP·Java 환경에서, 프로젝트마다 새로 만들던 reset, base, JS 공통 구조, 자주 쓰는 기능을 하나의 라이브러리와 문서 사이트로 묶었습니다.',
    overview: [
      { label: 'Project', value: 'WEAVE (위브)' },
      { label: 'Type', value: '퍼블리싱 CSS 유틸리티 + JS 플러그인 + 문서 사이트' },
      { label: 'Team', value: '개인 (웨버씨엔에스 재직 중 제작·적용)' },
      { label: 'Role', value: '설계 / 개발 / 문서 / 배포' },
      { label: 'Period', value: '2026.03 ~ 2026.05' },
    ],
    links: [
      { label: 'Docs', href: 'https://weavekit.kr' },
      { label: 'GitHub', href: 'https://github.com/maru-dev4905/Weave' },
    ],
    metrics: [
      { value: '5+', label: '회사 프로젝트에 적용' },
      { value: '11', label: 'JS 플러그인 (anim은 하위 6종)' },
      { value: '1.0.2', label: '현재 버전 (2026.04.13 1.0.0 정렬)' },
      { value: '8', label: '문서 사이트 페이지 유형' },
    ],
    problem: {
      title: '프로젝트마다 같은 세팅을 처음부터 다시 만들고 있었음',
      body: [
        '회사 프로젝트는 PHP·Java 서버 위에서 진행되는 경우가 많아 Tailwind나 번들러 기반 도구를 쓰기 어려웠음. 그래서 프로젝트를 시작할 때마다 reset.css, base.css, JS 공통 구조, 라이브러리 설정, 탭·모달·폼 검증 같은 자주 쓰는 기능을 새로 만들거나 이전 프로젝트에서 복사해 왔음.',
        '복사한 코드는 프로젝트마다 조금씩 달라졌고, 어느 쪽이 최신인지 알 수 없었음. 퍼블리셔가 바뀌면 클래스 이름과 구조를 다시 익혀야 했음.',
        '목표는 "불러오기만 하면 바로 쓰는" 하나의 기준을 만드는 것이었음. 새 프레임워크를 도입하는 것이 아니라, 기존 환경에서 그대로 쓸 수 있는 CSS와 JS로 만드는 것을 조건으로 잡았음.',
      ],
    },
    decisions: [
      {
        title: '빌드 도구 없이 쓸 수 있는 CSS 유틸리티와 플러그인 런타임으로 만듦',
        why: '서버 템플릿(PHP·Java)에 파일을 얹는 것만으로 쓸 수 있어야 한다는 환경 조건이 있었음. CSS는 토큰을 담은 `common.css`와 유틸리티·기본 스타일을 담은 `wv.css`로 나누고, JS는 `createWeave()` 하나로 필요한 플러그인(tabs, modal, validation, anim 등)만 골라 조합하게 함.',
      },
      {
        title: '라이브러리와 문서·데모 앱을 한 저장소(pnpm monorepo)에 둠',
        why: '`packages/wv`(라이브러리)와 `apps/docs`(문서 앱)를 같이 두어, 문서의 데모 페이지가 실제 플러그인을 mount하게 함. 문서가 설명이면서 동시에 동작을 확인하는 검증 환경 역할을 함. 폼 검증, 파일 드롭, 애니메이션처럼 동작이 중요한 기능을 같은 커밋 안에서 데모와 함께 확인할 수 있음.',
      },
      {
        title: '작업 중에 자주 쓰는 변환 도구를 문서 앱의 Tools 페이지로 가져옴',
        why: 'PX to VW, PX to REM, IMG to WEBP처럼 퍼블리싱 작업 중에 밖으로 나가서 하던 일을 문서 앱 안으로 통합함. 이후 에셋 파일 이름을 검사하는 linter와 이름 규칙 기능을 더해, 이름 규칙처럼 사람이 어기기 쉬운 부분을 도구로 확인하게 함.',
      },
      {
        title: '만든 뒤에 스스로 점검해서 약점을 문서로 정리함',
        why: '`WEAVE_STATUS_STRATEGY_2026Q2.md`에 현재 구성과 개선점을 나눠 적음. 유틸 클래스 `h_max_content`가 height가 아니라 width를 설정하는 오류, 색상 유틸의 `bgc_s_*` 네이밍과 토큰 참조 불일치 등을 "즉시 수정", "단기", "중기"로 분류해 두었음.',
      },
    ],
    timeline: [
      { date: '2026.03.06', text: '저장소 시작. 랜딩 페이지와 README' },
      { date: '2026.03.23', text: 'CSS 설명서와 문서 구조 정리' },
      { date: '2026.04.02', text: 'fileDrop, targetButton 플러그인 추가' },
      { date: '2026.04.06', text: 'GSAP 기반 anim 플러그인과 스타터 킷 구조 정리' },
      { date: '2026.04.08', text: '폼 유효성 검증 플러그인, Tools 페이지(px/rem, img/webp)' },
      { date: '2026.04.13', text: 'v1.0.0 정렬, 배포 파일 minify와 버전 헤더, GitHub Pages 배포' },
      { date: '2026.04.15', text: 'wv 패키지 import와 빌드 흐름 안정화' },
      { date: '2026.04.17', text: 'CSS 문서를 속성별 레퍼런스로 전면 개편' },
      { date: '2026.04.26', text: '도구 모듈 분리, linter와 에셋 이름 검사 고도화, v1.0.2' },
      { date: '2026.05.06', text: '커스텀 도메인(weavekit.kr) 배포, base 경로 수정' },
    ],
    issues: [
      {
        id: 'ISSUE 01',
        title: '커스텀 도메인으로 옮기자 문서 사이트의 경로가 어긋남',
        symptom: 'GitHub Pages 주소(저장소 이름 하위 경로)에서 잘 보이던 문서 사이트를 `weavekit.kr`로 옮기자 경로 설정이 맞지 않았음.',
        cause:
          '문서 앱의 base 경로를 저장소 하위 경로 기준으로 잡아 두었는데, 커스텀 도메인은 루트에서 시작함.',
        action:
          'CNAME을 추가하고 배포 설정의 base 경로를 루트로 바꿈(`fix(docs): use root base path for custom domain deploy`).',
        verify: '2026.05.06 수정 후 문서 사이트가 weavekit.kr에서 열림. 배포 경로가 바뀌는 시점에 base 경로를 같이 확인해야 한다는 점을 배웠음.',
      },
    ],
    result: [
      '회사 프로젝트 5개 이상에서 같은 라이브러리를 불러와 사용함. 프로젝트를 시작할 때 reset과 base, 자주 쓰는 기능을 새로 만드는 시간이 없어짐.',
      '문서 사이트(weavekit.kr)에서 CSS 유틸리티, JS 플러그인, 애니메이션, 폼 검증을 데모와 함께 확인할 수 있음.',
      '버전을 1.0.0으로 정렬하고 배포 파일에 저장소와 버전 헤더를 넣어, 가져다 쓴 파일이 어느 버전인지 알 수 있게 함.',
    ],
    limits: [
      '문서는 퇴사 직전에야 정리했음. 만들면서 같이 썼어야 했는데, 기능을 먼저 만들고 문서를 나중에 쓰는 순서가 되었음.',
      '회사 프로젝트 적용 결과(시간 절감 등)는 측정하지 않았음. "최소 5개 프로젝트"는 사용한 프로젝트 수이고, 절감 시간은 수치로 말할 수 없음.',
      '자동 테스트가 없음. 폼 검증이나 애니메이션 같은 동작은 문서 사이트의 데모 페이지에서 눈으로 확인하는 방식이어서, 수정할 때 다른 기능이 깨졌는지 자동으로 알 수 없음.',
    ],
    skills: ['CSS', 'SCSS', 'JavaScript', 'GSAP', 'pnpm monorepo', 'GitHub Pages'],
  },
]

export function getEngineeringBySlug(slug: string | undefined) {
  return engineeringProjects.find((project) => project.slug === slug)
}
