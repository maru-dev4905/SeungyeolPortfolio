import { TransitionLink } from './TransitionLink'

export function LegacyContactCta() {
  return (
    <section className="sec_contact">
      <h2 className="anim">
        <TransitionLink to="/contact" className="target">
          <p>
            <span>
              CONTACT M<em>E -</em> CONTACT M<em>E</em>
            </span>
          </p>
          <p>
            <span>
              CONTACT M<em>E -</em> CONTACT M<em>E</em>
            </span>
          </p>
          <p>
            <span>
              CONTACT M<em>E -</em> CONTACT M<em>E</em>
            </span>
          </p>
          <p>
            <span>
              CONTACT M<em>E -</em> CONTACT M<em>E</em>
            </span>
          </p>
          <p>
            <span>
              CONTACT M<em>E -</em> CONTACT M<em>E</em>
            </span>
          </p>
        </TransitionLink>
      </h2>
      <div className="marquee marquee_back fade anim">
        <div className="marquee_track">
          <div className="content">
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
          </div>
          <div className="content">
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
            <span>START A STORY - SHARE A DREAM - WRITE TO MARU -</span>
          </div>
        </div>
      </div>
    </section>
  )
}
