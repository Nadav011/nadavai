import { NextResponse } from "next/server"

const SITE_URL = "https://nadavc.ai"

const PROJECTS = [
  {
    title: "Mexicani — Enterprise Franchise Management",
    slug: "mexicani",
    description:
      "Enterprise franchise management system with 149 pages, 111 database tables, and 38 Edge Functions. Full branch, order, inventory, and employee management.",
    date: "2026-01-15",
  },
  {
    title: "APEX Engine — AI Code Audit System",
    slug: "apex-engine",
    description:
      "Code audit engine with 579 verification gates, auto-healing, automatic technology detection, and a 10x7 visual matrix for comprehensive quality assurance.",
    date: "2026-02-20",
  },
  {
    title: "Cash Control — Delivery Management PWA",
    slug: "cash-control",
    description:
      "Delivery management PWA with full offline support, smart sync, IndexedDB, and operation queuing for reliable field operations.",
    date: "2025-11-01",
  },
  {
    title: "Shifts — Employee Scheduling System",
    slug: "shifts",
    description:
      "Shift management system with Drag & Drop, Push notifications, and interactive scheduling. 154 components, 25 hooks.",
    date: "2025-09-15",
  },
]

function generateRssXml(): string {
  const items = PROJECTS.map(
    (project) => `
    <item>
      <title><![CDATA[${project.title}]]></title>
      <description><![CDATA[${project.description}]]></description>
      <link>${SITE_URL}/he#projects</link>
      <guid isPermaLink="false">${SITE_URL}/projects/${project.slug}</guid>
      <pubDate>${new Date(project.date).toUTCString()}</pubDate>
      <author>nadav@nadavc.ai (Nadav Cohen)</author>
      <dc:creator><![CDATA[Nadav Cohen]]></dc:creator>
    </item>`
  ).join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>NADAV.AI — Nadav Cohen | נדב כהן</title>
    <link>${SITE_URL}</link>
    <description>Full-Stack AI Developer building enterprise systems, AI agents, and automation solutions. 8+ production apps, 80 AI skills, 38+ agents.</description>
    <language>he</language>
    <managingEditor>nadav@nadavc.ai (Nadav Cohen)</managingEditor>
    <webMaster>nadav@nadavc.ai (Nadav Cohen)</webMaster>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date("2026-03-28").toUTCString()}</lastBuildDate>
    <image>
      <url>${SITE_URL}/opengraph-image</url>
      <title>NADAV.AI</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`
}

export async function GET() {
  const xml = generateRssXml()

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
