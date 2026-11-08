import "../styles/engineering.css";

import { LegacyContactCta } from "../components/common/LegacyContactCta";
import { TransitionLink } from "../components/common/TransitionLink";
import { useEngineeringReveal } from "../hooks/useEngineeringReveal";
import { useLegacyPage } from "../hooks/useLegacyPage";
import { engineeringProjects } from "../data/engineering.data";

export function EngineeringPage() {
  useLegacyPage("LeeSeungyeol - ENGINEERING", "sub");
  useEngineeringReveal();

  return (
    <main id="engineering">
      <section className="eng_hero">
        <div className="inner">
          <p className="eng_label eng_reveal">
            <em>(</em> ENGINEERING <em>)</em>
          </p>
          <h2 className="eng_reveal">
            Problems I found myself, <br />
            decisions I made, and what changed after.
          </h2>
          <p className="eng_lead eng_reveal">
            의뢰받은 화면이 아니라 직접 문제를 정의하고 만든 두 프로젝트입니다.
            무엇이 문제였는지, 어떤 선택지 중에 왜 그것을 골랐는지, 결과가
            어땠는지를 기록과 함께 정리했습니다.
          </p>
        </div>
      </section>

      <section className="eng_list">
        <div className="inner">
          <ul>
            {engineeringProjects.map((project, index) => (
              <li key={project.slug} className="eng_reveal">
                <TransitionLink
                  to={`/engineering/${project.slug}`}
                  className="eng_card"
                >
                  <span className="eng_no">
                    <em>(</em>
                    {String(index + 1).padStart(2, "0")}
                    <em>)</em>
                  </span>
                  <div className="eng_card_body">
                    <h3>{project.nameEN}</h3>
                    <p className="eng_card_tag">{project.tagline}</p>
                    <ul className="eng_metrics">
                      {project.metrics.map((metric) => (
                        <li key={metric.label}>
                          <strong data-count={/^\d+$/.test(metric.value) ? metric.value : undefined}>
                            {metric.value}
                          </strong>
                          <span>{metric.label}</span>
                        </li>
                      ))}
                    </ul>
                    <dl className="eng_chips">
                      {project.skills.map((skill) => (
                        <dd key={skill}>{skill}</dd>
                      ))}
                    </dl>
                  </div>
                  <span className="eng_more">Case Study →</span>
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
