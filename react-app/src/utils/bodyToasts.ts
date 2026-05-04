const TOAST_BOTTOM = '6.5rem'
const TOAST_Z = '1000001'
const VISIBLE_MS = 1400

function applyToastBase(el: HTMLDivElement) {
  el.style.position = 'fixed'
  el.style.left = '50%'
  el.style.bottom = TOAST_BOTTOM
  el.style.padding = '0.75rem 1.25rem'
  el.style.borderRadius = '3.125rem'
  el.style.backgroundColor = 'rgba(31, 31, 31, 0.75)'
  el.style.color = '#fff'
  el.style.fontSize = '0.875rem'
  el.style.fontWeight = '500'
  el.style.letterSpacing = '0.02rem'
  el.style.pointerEvents = 'none'
  el.style.zIndex = TOAST_Z
  el.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
  el.style.maxWidth = 'min(90vw, 24rem)'
  el.style.textAlign = 'center'
}

let copyToastEl: HTMLDivElement | null = null
let copyToastTimer: number | null = null

export function showCopyToast(message: string) {
  if (!copyToastEl) {
    const el = document.createElement('div')
    el.id = 'copyToast'
    el.setAttribute('role', 'status')
    el.setAttribute('aria-live', 'polite')
    applyToastBase(el)
    el.style.border = '1px solid #aaa'
    el.style.opacity = '0'
    el.style.transform = 'translateX(-50%) translateY(0)'
    document.body.appendChild(el)
    copyToastEl = el
  }

  const el = copyToastEl
  el.textContent = message
  el.style.border = '1px solid #aaa'
  el.style.opacity = '1'
  el.style.transform = 'translateX(-50%) translateY(-6px)'

  if (copyToastTimer !== null) {
    window.clearTimeout(copyToastTimer)
  }
  copyToastTimer = window.setTimeout(() => {
    if (!copyToastEl) return
    copyToastEl.style.opacity = '0'
    copyToastEl.style.transform = 'translateX(-50%) translateY(0)'
    copyToastTimer = null
  }, VISIBLE_MS)
}

export function disposeCopyToast() {
  if (copyToastTimer !== null) {
    window.clearTimeout(copyToastTimer)
    copyToastTimer = null
  }
  if (copyToastEl) {
    copyToastEl.remove()
    copyToastEl = null
  }
}

let mailToastEl: HTMLDivElement | null = null
let mailToastTimer: number | null = null

export function showMailResultToast(kind: 'success' | 'error') {
  const message =
    kind === 'success' ? '메일이 전송되었습니다!' : '메일 전송이 실패했습니다..'
  const border =
    kind === 'success' ? '1px solid #22c55e' : '1px solid #ef4444'

  if (!mailToastEl) {
    const el = document.createElement('div')
    el.id = 'mailToast'
    el.setAttribute('role', 'status')
    el.setAttribute('aria-live', 'polite')
    applyToastBase(el)
    el.style.opacity = '0'
    el.style.transform = 'translateX(-50%) translateY(0)'
    document.body.appendChild(el)
    mailToastEl = el
  }

  const el = mailToastEl
  el.textContent = message
  el.style.border = border
  el.style.opacity = '1'
  el.style.transform = 'translateX(-50%) translateY(-6px)'

  if (mailToastTimer !== null) {
    window.clearTimeout(mailToastTimer)
  }
  mailToastTimer = window.setTimeout(() => {
    if (!mailToastEl) return
    mailToastEl.style.opacity = '0'
    mailToastEl.style.transform = 'translateX(-50%) translateY(0)'
    mailToastTimer = null
  }, VISIBLE_MS)
}
