import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

export interface BlogPost {
  slug: string
  title: string
  titleEn?: string | undefined
  date: string
  description: string
  descriptionEn?: string | undefined
  tags: string[]
  readingTime: number
  content: string
}

export type BlogPostMeta = Omit<BlogPost, "content">

function parseFrontmatter(slug: string): BlogPost | null {
  // Prevent path traversal — only allow slug-safe characters
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return null
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  const stats = readingTime(content)

  return {
    slug,
    title: (data.title as string) ?? slug,
    titleEn: data.titleEn as string | undefined,
    date: (data.date as string) ?? new Date().toISOString().split("T")[0],
    description: (data.description as string) ?? "",
    descriptionEn: data.descriptionEn as string | undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    readingTime: typeof data.readingTime === "number"
      ? data.readingTime
      : Math.ceil(stats.minutes),
    content,
  }
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "")
      const post = parseFrontmatter(slug)
      if (!post) return null
      const { content: _content, ...meta } = post
      return meta
    })
    .filter((p): p is BlogPostMeta => p !== null)

  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getPostBySlug(slug: string): BlogPost | null {
  return parseFrontmatter(slug)
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
}
