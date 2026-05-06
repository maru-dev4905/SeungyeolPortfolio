import { LegacyBanner } from "../components/common/LegacyBanner";
import { useAboutPageInteractions } from "../hooks/useAboutPageInteractions";
import { useLegacyPage } from "../hooks/useLegacyPage";

const skillCards = [
  {
    title: "HTML5",
    body: "시맨틱 태그와 data- 속성을 활용해 구조적이고 확장 가능한 마크업을 작성할 수 있습니다. <br />접근성과 표준성을 고려한 페이지 구조 설계가 가능합니다. <br /><br />Able to write semantic and structured markup using data- attributes. <br />Builds accessible, maintainable, and scalable HTML architecture.",
  },
  {
    title: "CSS3",
    body: "유틸리티 클래스와 커스텀 속성을 기반으로 빠르고 일관된 스타일 시스템을 구축합니다. <br />Flex와 Grid를 활용한 반응형/적응형 레이아웃을 구현할 수 있습니다. <br />트랜지션과 트랜스폼을 이용해 섬세한 인터랙션 표현도 가능합니다. <br /><br />Creates fast and reusable styling systems based on utility classes and key properties. <br />Uses Flex/Grid layouts to implement adaptive and responsive designs.",
  },
  {
    title: "Javascript",
    body: "ES6 문법 기반으로 DOM 제어와 이벤트 처리, 간단한 모듈 개발이 가능합니다. <br />Ajax를 통한 폼 전송, 입력값 유효성 검사 등 사용자 인터랙션 로직을 구현할 수 있습니다. <br />data-속성 기반으로 상태 제어를 하는 구조적 스크립트 작성에 익숙합니다. <br /><br />Develops dynamic interactions using ES6 syntax and DOM manipulation. <br />Handles Ajax form submissions and validation with efficiency. <br />Uses data- attributes for structured, reusable component scripting.",
  },
  {
    title: "jQuery",
    body: "이벤트 위임과 DOM 조작으로 UI의 반복적인 동작을 효율적으로 처리합니다. <br />data- 속성을 활용해 다양한 컴포넌트 제어 로직을 단순화합니다. <br />간단한 애니메이션, 모달, 탭, 아코디언 등 공통 UI 모듈 제작이 가능합니다. <br /><br />Implements efficient UI controls through event delegation and DOM handling. <br />Controls modular interactions such as tabs, modals, and accordions with simplicity.",
  },
  {
    title: "SCSS",
    body: "변수, 믹스인, 함수, 중첩을 활용해 구조적이고 체계적인 스타일 설계를 합니다. <br />유틸리티 클래스 중심의 스타일 시스템으로 빠른 퍼블리싱을 지원합니다. <br /><br />Builds structured and scalable style architecture using variables, mixins, and nesting. <br />Supports utility-based systems for fast and consistent styling across pages.",
  },
  {
    title: "PUG",
    body: "템플릿 상속, include, mixin 등을 이용해 HTML 구조를 모듈화합니다. <br />변수와 반복문을 활용해 동적인 페이지 구조를 효율적으로 구성합니다. <br /><br />Uses inheritance, includes, and mixins to create modular HTML templates. <br />Builds structured layouts for maintainable and reusable web pages.",
  },
  {
    title: "GIT",
    body: "기본적인 브랜치 생성과 커밋, 버전 관리 및 협업 환경 설정이 가능합니다. <br />작업 히스토리를 통해 변경점을 관리하고 안정적으로 코드 백업을 수행합니다. <br />단독 프로젝트와 협업 환경 모두에서 실무적으로 사용 경험이 있습니다. <br /><br />Handles project version control for stable collaboration. <br />Manages commits, merges, and updates in practical team environments.",
  },
  {
    title: "GSAP",
    body: "ScrollTrigger, MotionPathPlugin 등을 활용해 고급 인터랙션을 구현합니다. <br />SVG 요소나 DOM 객체의 모션 제어, 시차 스크롤 등의 애니메이션을 구성할 수 있습니다. <br /><br />Implements advanced animations using ScrollTrigger and MotionPathPlugin. <br />Creates smooth and interactive scroll-based and SVG path animations.",
  },
  {
    title: "Locomotive-Scroll",
    body: "부드러운 스크롤 감속 효과와 패럴랙스 연출을 구현할 수 있습니다. <br />GSAP ScrollTrigger와 연동해 자연스러운 인터랙션을 만듭니다. <br /><br />Builds smooth scrolling effects and parallax animations. <br />Integrates seamlessly with GSAP ScrollTrigger for immersive experiences.",
  },
  {
    title: "Swiper",
    body: "반응형 슬라이드 구현, 오토플레이, 네비게이션 커스터마이징이 가능합니다. <br />Breakpoints, Pagination, Loop 등 다양한 옵션 조합으로 상황에 맞게 활용합니다. <br />AJAX나 템플릿 데이터를 통해 슬라이드 콘텐츠를 동적으로 구성할 수도 있습니다. <br /><br />Creates responsive sliders with autoplay, navigation, and pagination options. <br />Supports AJAX-loaded dynamic slides for flexible content updates.",
  },
  {
    title: "FIGMA",
    body: "디자인 시안을 기반으로 정확한 구현이 가능하며, 리소스 추출 및 컴포넌트 확인에 능숙합니다. <br />간단한 레이아웃 수정이나 스타일 가이드 확인 작업도 직접 수행할 수 있습니다. <br /><br />Able to check design layouts and extract assets for front-end development. <br />Reviews components and structure for accurate implementation.",
  },
  {
    title: "XD, Photoshop",
    body: "디자인 시안을 분석하고 퍼블리싱에 필요한 리소스를 추출할 수 있습니다. <br />시안의 레이아웃, 간격, 폰트, 컬러를 기준으로 실제 페이지에 반영할 수 있습니다. <br /><br />Able to analyze and implement designs efficiently through layout analysis. <br />References colors, grids, and text for precise front-end reproduction.",
  },
];

export function AboutPage() {
  useLegacyPage("LeeSeungyeol - ABOUT", "sub");
  useAboutPageInteractions();

  return (
    <main id="about">
      <section className="sec_visual">
        <div className="inner">
          <em>(</em>
          <em>)</em>
          <div className="about_visual visual">
            <img
              src="/assets/images/visuals/hobby1.png"
              alt=""
              className="on"
            />
            <img src="/assets/images/visuals/hobby2.png" alt="" />
            <img src="/assets/images/visuals/hobby3.png" alt="" />
            <img src="/assets/images/visuals/hobby4.png" alt="" />
            <img src="/assets/images/visuals/hobby5.png" alt="" />
            <div className="marquee marquee_back">
              <div className="marquee_track">
                <div className="content">
                  <span>Leben wie ein Märchen</span>
                  <span>Leben wie ein Märchen</span>
                  <span>Leben wie ein Märchen</span>
                  <span>Leben wie ein Märchen</span>
                </div>
                <div className="content">
                  <span>Leben wie ein Märchen</span>
                  <span>Leben wie ein Märchen</span>
                  <span>Leben wie ein Märchen</span>
                  <span>Leben wie ein Märchen</span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="fade anim">
            I try to find beauty in everything I encounter in life. <br />
            Sometimes, the smallest moments become the greatest stories to me.{" "}
            <br />
            So I keep learning, imagining, and creating, adding to that story
            day by day.
            <br />
            Now, I live as someone who turns dreams within me into reality
          </h2>
        </div>
      </section>

      <section className="sec_introduce">
        <div className="inner">
          <h2>
            INTR<em>O</em>DU<em>C</em>E
          </h2>
          <div className="desc fade anim">
            <p>
              <strong>Lee Seungyeol</strong> <span>( Publisher )</span>
            </p>
            <p>
              <strong>2001 . 03 . 30</strong> <span>( 25 years old )</span>
            </p>
            <p>
              <strong>Seoul, Dobong-gu, South Korea</strong>{" "}
              <span>( ssangmun Station, Line 4 )</span>
            </p>
          </div>
        </div>
      </section>

      <section className="sec_message">
        <div className="inner">
          <p className="fade anim">
            I pursue publishing that balances visual clarity and structural
            depth. My work focuses on clean markup accessible UI and responsive
            interactions.
            <br />
            <br />
            Tools don't define the work — <br />
            but Figma, SCSS, and JavaScript help me build scalable systems. To
            offer users a richer experience, I explore GSAP, ScrollMagic, and
            Locomotive.js.
          </p>
          <div className="img_wrap anim">
            <img src="/assets/images/visuals/profile.png" alt="" />
          </div>
          <p className="fade anim">
            시각적 명확성과 구조적인 깊이의 균형을 지향하는 퍼블리싱을
            추구합니다.
            <br />
            깔끔한 마크업, 접근성 높은 UI, 반응형 인터랙션에 집중합니다.
            <br />
            <br />
            디자인은 도구가 전부는 아니지만 — <br />
            Figma, SCSS, JavaScript를 활용해 확장 가능한 시스템을 구축합니다.
            다양한 경험과 시각적 즐거움을 위해 GSAP, ScrollMagic, Locomotive.js
            등 인터랙션을 꾸준히 탐구합니다.
          </p>
          <h2 className="show">
            P<em>O</em>WER<em>E</em>D B<em>Y</em> CLA<em>R</em>ITY
          </h2>
        </div>
      </section>

      <section className="sec_career">
        <div className="inner">
          <div className="tit fade anim">
            <h2>
              <em>C</em>AREER
            </h2>
            <p>( 4 )</p>
          </div>
          <ul className="desc anim">
            <li className="anim">
              <p>2023. 03 ~ ing</p>
              <h3>W</h3>
              <span>WeverCNS</span>
            </li>
            <li className="anim">
              <p>2022. 06 ~ 2023. 02</p>
              <h3>B</h3>
              <span>Bstones</span>
            </li>
            <li className="anim">
              <p>2020. 10 ~ 2021. 08</p>
              <h3>D</h3>
              <span>Dfry</span>
            </li>
            <li className="anim">
              <p>2019. 11 ~ 2020. 02</p>
              <h3>M</h3>
              <span>MakeStar</span>
            </li>
          </ul>
          <h4 className="fade anim">
            <em>(</em> C<em>O</em>NTA<em>C</em>T <em>)</em>
          </h4>
          <div className="contact_message fade anim">
            <a href="#">
              <h5>CONNECT</h5>
              <div>
                <p>
                  This time, it&apos;s not just about working. <br />
                  <br />
                  I want to build a web experience with you that makes
                  someone&apos;s world a little more beautiful. <br />
                  <br />
                  And I want to finish that story together.
                </p>
                <img src="/assets/images/visuals/about_deco.png" alt="" />
              </div>
            </a>
          </div>
        </div>
      </section>

      <LegacyBanner
        firstLine={[
          "EACH",
          "LINE",
          "OF",
          "CODE",
          "/",
          "BUILDS",
          "STRUCTURE",
          "/",
          "AND",
          "SHAPES",
          "EXPERIENCE.",
        ]}
        secondLine={[
          "EVERY",
          "FUNCTION",
          "/",
          "EVERY",
          "ANIMATION",
          "/",
          "EXISTS",
          "FOR",
          "CLARITY.",
        ]}
      />

      <section className="sec_skills">
        <div className="inner">
          <h2>
            S<em>K</em>ILLS
          </h2>
          <ul>
            {skillCards.map((skill, index) => (
              <li key={skill.title}>
                <div className="skill">
                  <div className="hd">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>
                      <em>(</em> SKILLS <em>)</em>
                    </p>
                    <span>{skill.title}</span>
                  </div>
                  <div className="bd">
                    <p dangerouslySetInnerHTML={{ __html: skill.body }}></p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
