import { useEffect } from 'react'

export function useAboutPageInteractions() {
  useEffect(() => {
    const images = Array.from(
      document.querySelectorAll('.about_visual img'),
    ) as HTMLImageElement[]

    if (images.length === 0) {
      return
    }

    let currentIndex = 0
    let intervalId = 0

    const showCurrentImage = () => {
      images.forEach((image, index) => {
        image.classList.toggle('on', index === currentIndex)
      })
    }

    const startRolling = () => {
      window.clearInterval(intervalId)
      intervalId = window.setInterval(() => {
        currentIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1
        showCurrentImage()
      }, 2000)
    }

    const stopRolling = () => window.clearInterval(intervalId)

    images.forEach((image) => {
      image.addEventListener('mouseenter', stopRolling)
      image.addEventListener('mouseleave', startRolling)
    })

    showCurrentImage()
    startRolling()

    return () => {
      window.clearInterval(intervalId)
      images.forEach((image) => {
        image.removeEventListener('mouseenter', stopRolling)
        image.removeEventListener('mouseleave', startRolling)
      })
    }
  }, [])
}
