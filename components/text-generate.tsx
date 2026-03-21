"use client"

import { useEffect, useRef, useState } from "react"

interface TextGenerateProps {
  words: string
  className?: string
}

export function TextGenerate({ words, className = "" }: TextGenerateProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const wordArray = words.split(" ")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <span ref={ref} className={className}>
      {wordArray.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0px)" : "blur(8px)",
            transition: "opacity 0.4s ease-out " + String(i * 0.08) + "s, filter 0.4s ease-out " + String(i * 0.08) + "s",
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </span>
  )
}
