import { LegacyBanner } from '../components/common/LegacyBanner'
import { LegacyContactCta } from '../components/common/LegacyContactCta'
import { WorkShowcase } from '../components/work/WorkShowcase'
import { useLegacyPage } from '../hooks/useLegacyPage'

export function WorksPage() {
  useLegacyPage('LeeSeungyeol - WORKS', 'sub')

  return (
    <main id="works">
      <section className="sec_visual">
        <div className="inner">
          <em>(</em>
          <em>)</em>
          <div className="about_visual visual">
            <video playsInline autoPlay loop muted className="on">
              <source src="/assets/videos/work_v.mp4" />
            </video>
          </div>
          <h2>
            Projects I&apos;ve worked on as a front-end publisher. <br />
            Practical works from real projects. <br />
            Built with consistency, collaboration, and learning in mind.
          </h2>
        </div>
      </section>

      <LegacyBanner
        firstLine={['EACH', 'PROJECT', '/', 'BEGINS', 'WITH', 'AN', 'IDEA', '/', 'AND', 'GROWS', 'THROUGH', 'DETAIL.']}
        secondLine={['EVERY', 'PIXEL', '/', 'EVERY', 'MOTION', '/', 'EVERY', 'LINE', '/', 'TELLS', 'A', 'STORY.']}
      />

      <WorkShowcase />

      <LegacyContactCta />
    </main>
  )
}
