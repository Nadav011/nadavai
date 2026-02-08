"use client"

import { motion } from "motion/react"

interface TextGenerateProps {
  words: string
  className?: string
}

export function TextGenerate({ words, className = "" }: TextGenerateProps) {
  const wordArray = words.split(" ")

  return (
    <motion.span className={className}>
      {wordArray.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: "easeOut",
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.span>
  )
}
