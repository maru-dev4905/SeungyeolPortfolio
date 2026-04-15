import { Fragment } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { LegacyBanner } from '../components/common/LegacyBanner'
import { TransitionLink } from '../components/common/TransitionLink'
import { useWorkDetailInteractions } from '../hooks/useWorkDetailInteractions'
import { getProjectBySlug, getProjectNeighbors, getProjectVisualPath, toProjectKey } from '../lib/portfolio'
import { useLegacyPage } from '../hooks/useLegacyPage'

export function WorkDetailPage() {
  const location = useLocation()
  const { projectSlug } = useParams()
  const legacyProjectSlug = toProjectKey(new URLSearchParams(location.search).get('w') ?? '')
  const resolvedProjectSlug = projectSlug ?? legacyProjectSlug
  const project = getProjectBySlug(resolvedProjectSlug)
  const { currentIndex, nextProject, previousProject } = getProjectNeighbors(resolvedProjectSlug)
  const previousProjectName = previousProject?.projectEN ?? ''
  const nextProjectName = nextProject?.projectEN ?? ''
  const projectKey = toProjectKey(project?.projectEN ?? '')
  const initialPagingLabel =
    previousProjectName && !nextProjectName
      ? previousProjectName
      : !previousProjectName && nextProjectName
        ? nextProjectName
        : ''

  useLegacyPage(
    project ? `LeeSeungyeol - ${project.projectEN}` : 'LeeSeungyeol - WORK DETAIL',
    'sub',
  )
  useWorkDetailInteractions(previousProject?.projectEN, nextProject?.projectEN)

  const detailImageClassList =
    !project || project.dType || !Array.isArray(project.imgCol) ? [] : project.imgCol
  const detailImageCount =
    !project || !project.dType || typeof project.imgCol !== 'number' ? 0 : project.imgCol

  if (!project) {
    return (
      <main id="work">
        <section className="sec_visual">
          <div className="inner">
            <p>
              <em>(</em> 00 <em>)</em>
            </p>
            <h2>PROJECT NOT FOUND</h2>
            <h3>존재하지 않는 작업입니다.</h3>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main id="work">
      <section className="sec_visual">
        <div className="inner">
          <p>
            <em>(</em>
            {String(currentIndex + 1).padStart(2, '0')}
            <em>)</em>
          </p>
          <h2>{project.projectEN}</h2>
          <h3>{project.role}</h3>
        </div>
        <div className="img_box_wrap">
          <div className="img_box">
            <img src={getProjectVisualPath(project.projectEN)} alt={project.projectEN} />
          </div>
        </div>
      </section>

      <section className="sec_overview">
        <div className="inner">
          <h2>
            PR<em>O</em>JE<em>C</em>T OVERVIE<em>W</em>
          </h2>
          <div className="overview show">
            <ul>
              <li className="anim">
                <strong>Project</strong>
                <p className="project">{project.projectKR}</p>
              </li>
              <li className="anim">
                <strong>Type</strong>
                <p className="type">{project.type}</p>
              </li>
              <li className="anim">
                <strong>Company</strong>
                <p className="company">{project.company}</p>
              </li>
              <li className="anim">
                <strong>Role</strong>
                <p className="role">{project.role}</p>
              </li>
              <li className="anim">
                <strong>Period</strong>
                <p className="period">{project.period}</p>
              </li>
              <li className="anim">
                <strong>Description</strong>
                <p
                  className="description"
                  dangerouslySetInnerHTML={{ __html: project.descriptionKR }}
                ></p>
              </li>
              <li className="anim">
                <strong>Skills</strong>
                <dl className="skills">
                  {project.skills.map((skill) => (
                    <dd key={skill}>{skill}</dd>
                  ))}
                </dl>
              </li>
              {project.awards.filter(Boolean).length > 0 ? (
                <li className="anim">
                  <strong>Awards</strong>
                  <dl className="awards">
                    {project.awards.filter(Boolean).map((award) => (
                      <dd key={award}>
                        <img
                          src={`/assets/images/icons/ico_${award === 'wa' ? 'webaward' : 'gdweb'}.svg`}
                          alt={award}
                        />
                      </dd>
                    ))}
                  </dl>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="en_description">
            <h3 className="fade anim">{project.projectEN} Website :</h3>
            <p
              className="fade anim"
              dangerouslySetInnerHTML={{ __html: project.descriptionEN }}
            ></p>
          </div>
        </div>
      </section>

      <section className={`sec_work ${project.dType ? 'dType_b' : 'dType_a'}`}>
        <div className="inner">
          {project.dType ? (
            <div className="grid">
              <div className="grid-sizer"></div>
              {Array.from({ length: detailImageCount }).map((_, index) => (
                <img
                  key={`${project.projectEN}-grid-${index + 1}`}
                  src={`/assets/images/works/${projectKey}/img0${index + 1}.png`}
                  alt={`${project.projectEN} detail ${index + 1}`}
                  className="grid-item fade anim"
                />
              ))}
            </div>
          ) : (
            <>
              {detailImageClassList.map((classNames, index) => (
                <Fragment key={`${project.projectEN}-detail-${index + 1}`}>
                  {index === 3 && project.pointTxt ? (
                    <div className="point_txt colST1 colED5 fade anim">
                      <div className="point">
                        <div className="hd">
                          <p>
                            <em>(</em> {project.pointTxt[0]} <em>)</em>
                          </p>
                          <span>{project.pointTxt[1]}</span>
                        </div>
                        <div className="bd">
                          <p dangerouslySetInnerHTML={{ __html: project.pointTxt[2] }}></p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <img
                    src={`/assets/images/works/${projectKey}/img0${index + 1}.png`}
                    alt={`${project.projectEN} detail ${index + 1}`}
                    className={`${classNames} fade anim`}
                  />
                </Fragment>
              ))}
            </>
          )}
        </div>
        <div className="mo_imgs">
          {project.dType ? (
            <img src={`/assets/images/works/${projectKey}/mo_imgs.png`} alt={`${project.projectEN} mobile view`} />
          ) : null}
        </div>

        <LegacyBanner
          firstLine={['NEXT', 'WORK', '/', 'KEEP', 'SCROLLING', '/', 'KEEP', 'CONNECTING.']}
          secondLine={['STRUCTURE', 'FIRST', '/', 'MOTION', 'WITH', 'PURPOSE', '/', 'ACCESSIBLE', 'BY', 'DEFAULT.']}
        />

        <div className="paging">
          {previousProject ? (
            <TransitionLink
              to={`/works/${toProjectKey(previousProject.projectEN)}`}
              className="target"
            >
              <em>[</em>
            </TransitionLink>
          ) : (
            <a
              href="#"
              className="target disabled"
              aria-disabled="true"
              onClick={(event) => event.preventDefault()}
            >
              <em>[</em>
            </a>
          )}
          {nextProject ? (
            <TransitionLink to={`/works/${toProjectKey(nextProject.projectEN)}`} className="target">
              <em>]</em>
            </TransitionLink>
          ) : (
            <a
              href="#"
              className="target disabled"
              aria-disabled="true"
              onClick={(event) => event.preventDefault()}
            >
              <em>]</em>
            </a>
          )}
          <div className="img_box">
            <img
              src={previousProject ? getProjectVisualPath(previousProject.projectEN) : getProjectVisualPath(project.projectEN)}
              alt=""
              className={previousProject ? 'prev' : 'prev disabled'}
            />
            <img
              src={nextProject ? getProjectVisualPath(nextProject.projectEN) : getProjectVisualPath(project.projectEN)}
              alt=""
              className={nextProject ? 'next' : 'next disabled'}
            />
          </div>
          <h2>
            <span>{initialPagingLabel}</span>
          </h2>
        </div>
      </section>
    </main>
  )
}
