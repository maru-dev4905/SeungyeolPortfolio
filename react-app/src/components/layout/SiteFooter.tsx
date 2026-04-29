import { useCallback, useEffect, useRef } from 'react'

export function SiteFooter() {
  const copyToastRef = useRef<HTMLDivElement | null>(null)
  const copyToastTimerRef = useRef<number | null>(null)

  const showCopyToast = useCallback((message: string) => {
    if (!copyToastRef.current) {
      const el = document.createElement('div')
      el.id = 'copyToast'
      el.setAttribute('role', 'status')
      el.setAttribute('aria-live', 'polite')

      el.style.position = 'fixed'
      el.style.left = '50%'
      el.style.bottom = '2.5rem'
      el.style.transform = 'translateX(-50%) translateY(0)'
      el.style.padding = '0.75rem 1.25rem'
      el.style.borderRadius = '3.125rem'
      el.style.backgroundColor = 'rgba(31, 31, 31, 0.75)'
      el.style.border = '1px solid #aaa'
      el.style.color = '#fff'
      el.style.fontSize = '0.875rem'
      el.style.fontWeight = '500'
      el.style.letterSpacing = '0.02rem'
      el.style.opacity = '0'
      el.style.pointerEvents = 'none'
      el.style.zIndex = '1000001'
      el.style.transition = 'opacity 0.25s ease, transform 0.25s ease'

      document.body.appendChild(el)
      copyToastRef.current = el
    }

    const el = copyToastRef.current
    if (!el) return

    el.textContent = message
    el.style.opacity = '1'
    el.style.transform = 'translateX(-50%) translateY(-6px)'

    if (copyToastTimerRef.current) {
      window.clearTimeout(copyToastTimerRef.current)
    }

    copyToastTimerRef.current = window.setTimeout(() => {
      if (!copyToastRef.current) return
      copyToastRef.current.style.opacity = '0'
      copyToastRef.current.style.transform = 'translateX(-50%) translateY(0)'
    }, 1400)
  }, [])

  useEffect(() => {
    return () => {
      if (copyToastTimerRef.current) {
        window.clearTimeout(copyToastTimerRef.current)
        copyToastTimerRef.current = null
      }
      if (copyToastRef.current) {
        copyToastRef.current.remove()
        copyToastRef.current = null
      }
    }
  }, [])

  const copyValue = useCallback(async (value: string) => {
    let ok = false

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(value)
        ok = true
      }
    } catch {
      ok = false
    }

    if (!ok) {
      try {
        // insecure context 대응(로컬/깃헙 pages): 임시 textarea fallback
        const ta = document.createElement('textarea')
        ta.value = value
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        ta.style.top = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        ok = true
      } catch {
        ok = false
      }
    }

    showCopyToast(ok ? '복사가 완료되었습니다' : '복사가 실패했습니다')
  }, [showCopyToast])

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
