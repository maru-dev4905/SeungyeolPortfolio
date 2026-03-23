import { useEffect, useRef } from 'react'

import {
  getLegacyScrollerElement,
  refreshLegacyMotion,
  registerLegacyAnimToggles,
} from './useLegacyInteractions'

type GsapWindow = Window &
  typeof globalThis & {
    ScrollTrigger?: {
      create?: (vars: Record<string, unknown>) => { kill?: () => void }
    }
  }

export function useWorksPageInteractions(selectedGroup: string) {
  const didMountRef = useRef(false)

  useEffect(() => {
    const win = window as GsapWindow
    const createScrollTrigger = win.ScrollTrigger?.create
    const workList = document.querySelector('.work_list') as HTMLElement | null
    const pinText = document.querySelector('.work_list .pin_txt')

    if (!createScrollTrigger || !workList || !pinText) {
      return
    }

    const trigger = createScrollTrigger({
      trigger: '.work_list',
      start: 'top+=5% 50%',
      end: () => `+=${Math.max(0, workList.offsetHeight - window.innerHeight / 2)}`,
      pin: pinText,
      pinSpacing: false,
      onEnter: () => pinText.classList.add('on'),
      onEnterBack: () => pinText.classList.add('on'),
      onLeaveBack: () => pinText.classList.remove('on'),
      onLeave: () => pinText.classList.remove('on'),
      scroller: getLegacyScrollerElement(),
    })

    refreshLegacyMotion()

    return () => {
      trigger.kill?.()
      pinText.classList.remove('on')
    }
  }, [])

  useEffect(() => {
    const archiveRoot = document.querySelector('.work_list_all .cont')

    if (!archiveRoot) {
      return
    }

    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }

    const cleanupAnimations = registerLegacyAnimToggles(archiveRoot)
    const rafId = window.requestAnimationFrame(() => {
      refreshLegacyMotion()
    })

    return () => {
      window.cancelAnimationFrame(rafId)
      cleanupAnimations()
    }
  }, [selectedGroup])
}
