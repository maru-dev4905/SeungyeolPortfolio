import { useCallback } from 'react'

export function SiteFooter() {
  const copyValue = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // clipboard 사용이 불가능한 환경에서는 조용히 무시합니다.
    }
  }, [])

  return (
    <footer>
      <div className="line">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <span></span>
      </div>
      <div className="inner">
        <div className="links">
          <div>
            <div>
              <strong>LINK :</strong>
              <a href="https://github.com/maru-dev4905" className="target">
                Github
              </a>
              <a
                href="https://www.facebook.com/seungyeol.lee.522/"
                className="target"
              >
                Facebook
              </a>
              <a href="https://www.instagram.com/syy1_publ/" className="target">
                Instagram
              </a>
              <a href="https://cssbattle.dev/player/maru102" className="target">
                CSS Battles
              </a>
            </div>
          </div>
          <div>
            <strong>CREDITS :</strong>
            <p>Site by Lee-Seungyeol</p>
            <strong>CONTACT :</strong>
            <p>
              <span id="emailTxt">iseung10e@gmail.com</span>{' '}
              <button
                type="button"
                className="copy_btn"
                onClick={() => copyValue('iseung10e@gmail.com')}
              ></button>
            </p>
            <p>
              <span id="phoneNum">010-2269-0763</span>{' '}
              <button
                type="button"
                className="copy_btn"
                onClick={() => copyValue('010-2269-0763')}
              ></button>
            </p>
          </div>
          <div>
            <strong>Resume :</strong>
            <a href="#" className="resume">
              Download Resume _ PDF, 3MB
            </a>
          </div>
        </div>
        <div className="desc">
          <div>
            <button
              type="button"
              className="scr_btn target"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            ></button>
            <p>Seungyeol Portfolio - Thank you for looking at my portfolio</p>
            <p>@ 2025 / All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
