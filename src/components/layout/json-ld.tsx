import { useLocale } from "next-intl";

export function JsonLd() {
  const locale = useLocale();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nadav Cohen",
    alternateName: "נדב כהן",
    jobTitle: "AI-First Full-Stack Developer",
    url: "https://nadav.ai",
    sameAs: [
      "https://github.com/nadavcohen",
      "https://linkedin.com/in/nadavcohen",
      "https://youtube.com/@nadavcohen",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Full-Stack Development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
    ],
    worksFor: {
      "@type": "Organization",
      name: "NADAVAI",
      url: "https://nadav.ai",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NADAVAI",
    url: "https://nadav.ai",
    inLanguage: [locale === "he" ? "he-IL" : "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: `https://nadav.ai/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
