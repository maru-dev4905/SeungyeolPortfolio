import "../styles/engineering.css";

import { useParams } from "react-router-dom";

import { LegacyContactCta } from "../components/common/LegacyContactCta";
import { TransitionLink } from "../components/common/TransitionLink";
import { useLegacyPage } from "../hooks/useLegacyPage";
import {
  engineeringProjects,
  getEngineeringBySlug,
} from "../data/engineering.data";

const ISSUE_ROWS = [
  { key: "symptom", label: "Symptom", ko: "증상" },
  { key: "cause", label: "Cause", ko: "원인" },
  { key: "action", label: "Action", ko: "결정과 조치" },
  { key: "verify", label: "Verify", ko: "확인" },
] as const;

function Code({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={index}>{part.slice(1, -1)}</code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function EngineeringDetailPage() {
  const { projectSlug } = useParams();
  const project = getEngineeringBySlug(projectSlug);
  const currentIndex = engineeringProjects.findIndex(
    (item) => item.slug === projectSlug,
  );
  const next =
    currentIndex >= 0
      ? engineeringProjects[(currentIndex + 1) % engineeringProjects.length]
      : undefined;

  useLegacyPage(
    project
      ? `LeeSeungyeol - ${project.nameEN}`
      : "LeeSeungyeol - ENGINEERING",
    "sub",
  );

  if (!project) {
    return (
      <main id="engineering">
        <section className="eng_hero">
          <div className="inner">
            <p className="eng_label">
              <em>(</em> 00 <em>)</em>
            </p>
            <h2>PROJECT NOT FOUND</h2>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="engineering" className="eng_detail">
      <section className="eng_hero">
        <div className="inner">
          <p className="eng_label">
            <em>(</em> {String(currentIndex + 1).padStart(2, "0")} <em>)</em>
          </p>
          <h2>{project.nameEN}</h2>
          <h3>{project.tagline}</h3>
          <p className="eng_lead">{project.summary}</p>
          <ul className="eng_metrics">
            {project.metrics.map((metric) => (
              <li key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="eng_sec eng_overview">
        <div className="inner">
          <dl>
            {project.overview.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
            <div>
              <dt>Skills</dt>
              <dd>
                <span className="eng_chips">
                  {project.skills.map((skill) => (
                    <i key={skill}>{skill}</i>
                  ))}
                </span>
              </dd>
            </div>
            <div>
              <dt>Links</dt>
              <dd className="eng_links">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="eng_sec">
        <div className="inner">
          <p className="eng_step">
            <em>(</em> 01 <em>)</em> PROBLEM
          </p>
          <h3 className="eng_title">
            <Code text={project.problem.title} />
          </h3>
          <div className="eng_body">
            {project.problem.body.map((paragraph) => (
              <p key={paragraph}>
                <Code text={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="eng_sec">
        <div className="inner">
          <p className="eng_step">
            <em>(</em> 02 <em>)</em> DECISIONS
          </p>
          <h3 className="eng_title">어떤 선택지가 있었고, 왜 이것을 골랐는가</h3>
          <ol className="eng_decisions">
            {project.decisions.map((decision, index) => (
              <li key={decision.title}>
                <span className="eng_idx">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4>
                    <Code text={decision.title} />
                  </h4>
                  <p>
                    <b>이유</b>
                    <Code text={decision.why} />
                  </p>
                  {decision.alternative ? (
                    <p className="eng_alt">
                      <b>선택하지 않은 방법</b>
                      <Code text={decision.alternative} />
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="eng_sec">
        <div className="inner">
          <p className="eng_step">
            <em>(</em> 03 <em>)</em> TIMELINE
          </p>
          <h3 className="eng_title">언제 무엇이 일어났는가</h3>
          <ul className="eng_timeline">
            {project.timeline.map((item) => (
              <li key={item.date}>
                <time>{item.date}</time>
                <p>
                  <Code text={item.text} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="eng_sec">
        <div className="inner">
          <p className="eng_step">
            <em>(</em> 04 <em>)</em> ISSUES
          </p>
          <h3 className="eng_title">문제를 만나고 고친 기록</h3>
          <div className="eng_issues">
            {project.issues.map((issue) => (
              <article key={issue.id + issue.title}>
                <div className="eng_issue_head">
                  <span>{issue.id}</span>
                  <h4>
                    <Code text={issue.title} />
                  </h4>
                  {issue.pr ? (
                    <p className="eng_pr">
                      {issue.pr.map((pr) => (
                        <a
                          key={pr.number}
                          href={`https://github.com/${pr.repo}/pull/${pr.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          PR #{pr.number} ↗
                        </a>
                      ))}
                    </p>
                  ) : null}
                </div>
                <dl>
                  {ISSUE_ROWS.map((row) => (
                    <div key={row.key}>
                      <dt>
                        {row.label}
                        <small>{row.ko}</small>
                      </dt>
                      <dd>
                        <Code text={issue[row.key]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="eng_sec">
        <div className="inner">
          <p className="eng_step">
            <em>(</em> 05 <em>)</em> RESULT
          </p>
          <h3 className="eng_title">무엇이 바뀌었는가</h3>
          <ul className="eng_bullets">
            {project.result.map((line) => (
              <li key={line}>
                <Code text={line} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="eng_sec">
        <div className="inner">
          <p className="eng_step">
            <em>(</em> 06 <em>)</em> LIMITS
          </p>
          <h3 className="eng_title">아직 해결하지 못한 것, 다시 한다면</h3>
          <ul className="eng_bullets">
            {project.limits.map((line) => (
              <li key={line}>
                <Code text={line} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {next ? (
        <section className="eng_next">
          <div className="inner">
            <TransitionLink to={`/engineering/${next.slug}`}>
              <span>NEXT</span>
              <strong>{next.nameEN}</strong>
            </TransitionLink>
            <TransitionLink to="/engineering" className="eng_back">
              ← All Engineering
            </TransitionLink>
          </div>
        </section>
      ) : null}

      <LegacyContactCta />
    </main>
  );
}
