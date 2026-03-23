interface LegacyBannerProps {
  firstLine: string[]
  secondLine: string[]
}

function renderWords(words: string[]) {
  return words.map((word, index) => <span key={`${word}-${index}`}>{word}</span>)
}

export function LegacyBanner({ firstLine, secondLine }: LegacyBannerProps) {
  return (
    <div className="banner anim">
      <p>{renderWords(firstLine)}</p>
      <p>{renderWords(secondLine)}</p>
    </div>
  )
}
