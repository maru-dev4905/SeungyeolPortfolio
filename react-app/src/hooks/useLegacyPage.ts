import { useEffect } from 'react'

type LegacyStyleName = 'main' | 'sub'

const STYLE_LINK_ID = 'legacy-page-style'

export function useLegacyPage(title: string, styleName: LegacyStyleName) {
  useEffect(() => {
    document.title = title

    let styleLink = document.getElementById(STYLE_LINK_ID) as HTMLLinkElement | null

    if (!styleLink) {
      styleLink = document.createElement('link')
      styleLink.id = STYLE_LINK_ID
      styleLink.rel = 'stylesheet'
      document.head.appendChild(styleLink)
    }

    styleLink.href = `/assets/css/${styleName}.css`

    return () => {
      styleLink?.remove()
    }
  }, [styleName, title])
}
