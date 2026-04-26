import { LegacyBanner } from "../components/common/LegacyBanner";
import { LegacyContactCta } from "../components/common/LegacyContactCta";
import { TransitionLink } from "../components/common/TransitionLink";
import { featuredProjects } from "../data/portfolio.data";
import { useHomePageInteractions } from "../hooks/useHomePageInteractions";
import { useLegacyPage } from "../hooks/useLegacyPage";
import { getProjectVisualPath, toProjectKey } from "../lib/portfolio";

const homeSkills = [
  "HTML5",
  "CSS3",
  "Javascript",
  "jQuery",
  "GSAP",
  "Swiper",
  "PUG",
  "GULP",
  "A11Y",
  "FIGMA",
];

export function HomePage() {
  useLegacyPage("LeeSeungyeol - PORTFOLIO", "main");
  useHomePageInteractions();

  return (
    <main>
      <section className="sec_visual">
        <div className="visual">
          <h2>
            <p>
              <i>
                <span>SY</span>
                <span>
                  P<em>U</em>BLIS<em>H</em>ER
                </span>
              </i>
            </p>
            <p>
              <i>
                P<em>O</em>RTF<em>O</em>LI<em>O</em>
              </i>
            </p>
          </h2>
          <img src="/assets/images/visuals/visual.png" alt="" />
        </div>
        <div className="inner">
          <div className="desc">
            <p>
              In this portfolio, I expressed structure and flow through lines -
              as a publisher. <br />
              Each line serves as a tool that connects information, design, and
              user navigation. <br />
              These lines are my language, and a core element of my work. <br />
              The lines that run through this portfolio <br />
              represent fragments of the web I&apos;ve built and connected.
            </p>
            <TransitionLink to="/works" className="target">
              GO TO WORKS
            </TransitionLink>
          </div>
          <button type="button" className="scr_down_btn target">
            <span>SCROLL DOWN</span>
          </button>
        </div>
      </section>

      <section className="sec_about">
        <div className="inner">
          <div className="desc fade anim">
            <h2>
              TO ME,
              <span>
                <em>PUBLISHING IS</em>
              </span>
              ABOUT CLARITY <br />
              AND FLOW
            </h2>
            <h3>
              <p>
                <em>PUBLISHING IS</em>
              </p>
              <p className="rolling_txt">
                <span>Turning design into living interaction</span>
              </p>
            </h3>
            <div className="sub_txt">
              <div>
                <p>IMAGINATIVE.</p>
                <p>PRECISE.</p>
              </div>
              <div className="rolling_img">
                <img src="/assets/images/visuals/rolling_v1.png" alt="" />
              </div>
              <div>
                <p>GOAL-DRIVEN.</p>
                <p>LASTING.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec_skill">
        <h2 className="fade anim">
          Always refining, <br />
          never standing still
        </h2>
        <div className="skills_wrap">
          <ul>
            {homeSkills.map((skill) => (
              <li key={skill}>
                <p className="fade anim">{skill}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec_values">
        <div className="inner">
          <h2 className="fade anim">
            Every line of code becomes an interaction, <br />
            every detail builds connection.
          </h2>
          <div className="value_video fade anim">
            <video loop autoPlay playsInline muted>
              <source src="/assets/videos/main_v.mp4" />
            </video>
          </div>
          <h3 className="fade anim">
            Turning skills into meaningful experiences
          </h3>

          <div className="line anim"></div>
          <ul className="desc">
            <li className="anim">
              <span>(1)</span>
              <p>
                STR<em>U</em>CTUR<em>E</em>
              </p>
            </li>
            <li className="anim">
              <span>(2)</span>
              <p>
                M<em>O</em>TI<em>O</em>N
              </p>
            </li>
            <li className="anim">
              <span>(3)</span>
              <p>
                HA<em>R</em>MON<em>Y</em>
              </p>
            </li>
          </ul>
        </div>
      </section>

      <LegacyBanner
        firstLine={[
          "EACH",
          "PROJECT",
          "/",
          "BEGINS",
          "WITH",
          "AN",
          "IDEA",
          "/",
          "AND",
          "GROWS",
          "THROUGH",
          "DETAIL.",
        ]}
        secondLine={[
          "EVERY",
          "PIXEL",
          "/",
          "EVERY",
          "MOTION",
          "/",
          "EVERY",
          "LINE",
          "/",
          "TELLS",
          "A",
          "STORY.",
        ]}
      />

      <section className="work_list">
        <div className="inner">
          <span className="anim">20</span>
          <span className="anim">21</span>
          <span className="anim">20</span>
          <span className="anim">25</span>
          <ul>
            {featuredProjects.slice(0, 5).map((project) => (
              <li
                key={project.projectEN}
                className={`colST${project.colPC} on_${project.anim} md_colST${project.colMO} anim`}
                style={{ background: project.color }}
              >
                <TransitionLink
                  to={`/works/${toProjectKey(project.projectEN)}`}
                  className="target"
                >
                  <img
                    src={getProjectVisualPath(project.projectEN)}
                    alt={project.projectEN}
                  />
                  <span className="awards">
                    {project.awards.includes("wa") ? (
                      <span className="webaward"></span>
                    ) : null}
                    {project.awards.includes("gd") ? (
                      <span className="gdweb"></span>
                    ) : null}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LegacyContactCta />
    </main>
  );
}
