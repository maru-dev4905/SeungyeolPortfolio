import { useEffect } from 'react'

const rollingTexts = [
  'Turning design into living interaction',
  'Building structures that last.',
  'Balancing accessibility with creativity.',
]

type GsapWindow = Window &
  typeof globalThis & {
    gsap?: {
      set?: (target: unknown, vars: Record<string, unknown>) => void
      to?: (
        target: unknown,
        vars: Record<string, unknown>,
      ) => { kill?: () => void; scrollTrigger?: { kill?: () => void } }
    }
    ScrollTrigger?: {
      create?: (vars: Record<string, unknown>) => { kill?: () => void }
    }
  }

export function useHomePageInteractions() {
  useEffect(() => {
    const win = window as GsapWindow
    const gsap = win.gsap
    const scrollTriggers: Array<{ kill?: () => void }> = []
    const rollingImage = document.querySelector('.rolling_img img') as HTMLImageElement | null
    const rollingText = document.querySelector('.rolling_txt') as HTMLElement | null
    const rollingTextSpan = rollingText?.querySelector('span')
    const aboutHeadline = document.querySelector('.sec_about h2 span')
    const aboutSubTexts = Array.from(document.querySelectorAll('.sec_about h3 p'))

    let rollingImageIndex = 1
    let rollingTextIndex = 0

    const imageTimer = window.setInterval(() => {
      if (!rollingImage) {
        return
      }

      rollingImageIndex = rollingImageIndex >= 4 ? 1 : rollingImageIndex + 1
      rollingImage.src = `/assets/images/visuals/rolling_v${rollingImageIndex}.png`
    }, 300)

    const textTimer = window.setInterval(() => {
      if (!rollingText || !rollingTextSpan) {
        return
      }

      rollingText.classList.add('hide')
      rollingTextIndex =
        rollingTextIndex >= rollingTexts.length - 1 ? 0 : rollingTextIndex + 1

      window.setTimeout(() => {
        rollingTextSpan.textContent = rollingTexts[rollingTextIndex]
        rollingText.classList.remove('hide')
      }, 1000)
    }, 4000)

    if (aboutHeadline && win.ScrollTrigger?.create) {
      const trigger = win.ScrollTrigger.create({
        trigger: '.sec_about h2 span',
        start: 'bottom center',
        onEnter: () => {
          aboutHeadline.classList.add('show')
          aboutSubTexts.forEach((element) => element.classList.add('show'))
        },
        onLeaveBack: () => {
          aboutHeadline.classList.remove('show')
          aboutSubTexts.forEach((element) => element.classList.remove('show'))
        },
      })

      scrollTriggers.push(trigger)
    }

    gsap?.set?.('.skills_wrap', { clearProps: 'borderRadius,width,maxWidth' })

    if (window.innerWidth <= 768) {
      gsap?.set?.('.skills_wrap', {
        maxWidth: '80%',
        borderRadius: '20px',
      })
    }

    const skillsTween = gsap?.to?.('.skills_wrap', {
      borderRadius: 0,
      width: '100%',
      maxWidth: '100%',
      scrollTrigger: {
        trigger: '.skills_wrap',
        scrub: true,
        start: 'top center',
        end: 'center top',
        invalidateOnRefresh: true,
      },
    })

    return () => {
      window.clearInterval(imageTimer)
      window.clearInterval(textTimer)
      scrollTriggers.forEach((trigger) => trigger.kill?.())
      skillsTween?.scrollTrigger?.kill?.()
      skillsTween?.kill?.()
    }
  }, [])
}
