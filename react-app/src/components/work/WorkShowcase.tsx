import { useMemo, useState } from 'react'

import { TransitionLink } from '../common/TransitionLink'
import { featuredProjects, projectGroups } from '../../data/portfolio.data'
import { useWorksPageInteractions } from '../../hooks/useWorksPageInteractions'
import { getProjectVisualPath, toProjectKey } from '../../lib/portfolio'

type GroupName = keyof typeof projectGroups | 'All'
type VisibleItem = {
  groupName: string
  name: string
  txt: string
  date: string
}

function getYearKey(dateText = '') {
  const value = String(dateText).trim()

  if (value.includes('-')) {
    const last = value.split('-').pop()?.trim() ?? ''
    return Number.parseInt(last, 10) || 0
  }

  return Number.parseInt(value, 10) || 0
}

function dedupeVisibleItems(items: VisibleItem[]) {
  const uniqueItems = new Map<string, VisibleItem>()

  items.forEach((item) => {
    const key = `${item.groupName}::${item.name}::${item.txt}::${item.date}`

    if (!uniqueItems.has(key)) {
      uniqueItems.set(key, item)
    }
  })

  return Array.from(uniqueItems.values())
}

type HeaderSuppressionWindow = Window & {
  __suppressHeaderShowCycleUntil?: number
}

export function WorkShowcase() {
  const groupNames = useMemo(
    () => ['All', ...Object.keys(projectGroups)] as GroupName[],
    [],
  )
  const [selectedGroup, setSelectedGroup] = useState<GroupName>('All')

  useWorksPageInteractions(selectedGroup)

  const visibleItems = useMemo(() => {
    if (selectedGroup === 'All') {
      return dedupeVisibleItems(
        Object.entries(projectGroups)
        .flatMap(([groupName, items]) =>
          items.map((item) => ({
            ...item,
            groupName,
          })),
        )
        .sort((a, b) => getYearKey(b.date) - getYearKey(a.date)),
      )
    }

    return dedupeVisibleItems((projectGroups[selectedGroup] ?? [])
      .map((item) => ({
        ...item,
        groupName: selectedGroup,
      }))
      .sort((a, b) => getYearKey(b.date) - getYearKey(a.date)))
  }, [selectedGroup])

  return (
    <>
      <section className="sec_work work_list">
        <div className="inner">
          <span className="anim">20</span>
          <span className="anim">21</span>
          <span className="anim">20</span>
          <span className="anim">25</span>
          <p className="pin_txt">
            W<em>O</em>RK ARC<em>H</em>IVE
          </p>
          <ul>
            {featuredProjects.map((project) => (
              <li
                key={project.projectEN}
                className={`colST${project.colPC} on_${project.anim} md_colST${project.colMO} anim`}
                style={{ background: project.color }}
              >
                <TransitionLink to={`/works/${toProjectKey(project.projectEN)}`} className="target">
                  <img src={getProjectVisualPath(project.projectEN)} alt={project.projectEN} />
                  <span className="awards">
                    {project.awards.includes('wa') ? <span className="webaward"></span> : null}
                    {project.awards.includes('gd') ? <span className="gdweb"></span> : null}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec_work2 work_list_all">
        <div className="inner">
          <div className="hd">
            <div className="sort fade anim">
              <p className="sort_current">{selectedGroup === 'All' ? 'All.' : selectedGroup}</p>
              <div className="sort_list">
                {groupNames.map((groupName) => (
                  <button
                    key={groupName}
                    type="button"
                    className={groupName === selectedGroup ? 'target on' : 'target'}
                    onClick={() => {
                      ;(window as HeaderSuppressionWindow).__suppressHeaderShowCycleUntil = Date.now() + 600
                      setSelectedGroup(groupName)
                    }}
                  >
                    {groupName === 'All' ? 'All.' : groupName}
                  </button>
                ))}
              </div>
            </div>
            <p className="total">{visibleItems.length}</p>
          </div>
          <div className="cont">
            <ul>
              {visibleItems.map((item) => (
                <li
                  key={`${item.groupName}-${item.name}-${item.date}`}
                  className="anim"
                >
                  <h3>
                    {item.name}
                    <span>{item.txt}</span>
                  </h3>
                  <i>{item.date}</i>
                  <p>{item.groupName}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
