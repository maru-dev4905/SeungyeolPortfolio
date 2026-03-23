import { useEffect } from 'react'

import {
  getLegacyScrollerElement,
  refreshLegacyMotion,
} from './useLegacyInteractions'

type GsapWindow = Window &
  typeof globalThis & {
    gsap?: {
      to?: (target: unknown, vars: Record<string, unknown>) => {
        kill?: () => void
        scrollTrigger?: { kill?: () => void }
      }
    }
  }

export function useWorkDetailInteractions(
  previousLabel?: string,
  nextLabel?: string,
) {
  useEffect(() => {
    const win = window as GsapWindow
    const gsap = win.gsap
    const paging = document.querySelector('.paging')
    const titleSpan = paging?.querySelector('h2 span')
    const previousLink = paging?.querySelector('a:first-of-type') ?? null
    const nextLink = paging?.querySelector('a:last-of-type') ?? null
    const labels = [previousLabel?.trim().toUpperCase(), nextLabel?.trim().toUpperCase()]
    const activeLabels = labels.filter(Boolean) as string[]

    let scrambleTimeoutId = 0

    const scrambleTo = (text: string) => {
      if (!titleSpan) {
        return
      }

      window.clearInterval(scrambleTimeoutId)

      if (!text) {
        titleSpan.textContent = ''
        return
      }

      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let frame = 0

      const render = () => {
        if (!titleSpan) {
          return
        }

        const output = text
          .split('')
          .map((character, index) => {
            if (character === ' ') {
              return ' '
            }

            if (index < frame) {
              return text[index]
            }

            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')

        titleSpan.textContent = output

        if (frame >= text.length) {
          window.clearInterval(scrambleTimeoutId)
          titleSpan.textContent = text
          return
        }

        frame += 1 / 2
      }

      render()
      scrambleTimeoutId = window.setInterval(render, 30)
    }

    const bindHover = (element: Element | null, text: string) => {
      if (!element) {
        return () => undefined
      }

      const handleEnter = () => scrambleTo(text)
      const handleLeave = () => scrambleTo('')

      element.addEventListener('mouseenter', handleEnter)
      element.addEventListener('mouseleave', handleLeave)

      return () => {
        element.removeEventListener('mouseenter', handleEnter)
        element.removeEventListener('mouseleave', handleLeave)
      }
    }

    if (titleSpan) {
      if (activeLabels.length === 1) {
        titleSpan.textContent = activeLabels[0]
      } else {
        titleSpan.textContent = ''
      }
    }

    const cleanupPrevious = bindHover(
      previousLink,
      labels[0] ?? '',
    )
    const cleanupNext = bindHover(
      nextLink,
      labels[1] ?? '',
    )

    const visualTween = gsap?.to?.('.sec_visual .img_box', {
      maxWidth: '100%',
      borderRadius: 0,
      scrollTrigger: {
        trigger: '.sec_visual .img_box',
        start: 'top center',
        end: 'top top',
        scrub: 1,
        scroller: getLegacyScrollerElement(),
      },
    })

    refreshLegacyMotion()

    return () => {
      window.clearInterval(scrambleTimeoutId)
      cleanupPrevious()
      cleanupNext()
      visualTween?.scrollTrigger?.kill?.()
      visualTween?.kill?.()
    }
  }, [nextLabel, previousLabel])
}
