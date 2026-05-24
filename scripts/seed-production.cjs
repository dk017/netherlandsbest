const { PrismaClient } = require("@prisma/client");
const { existsSync, readFileSync } = require("fs");
const path = require("path");

const prisma = new PrismaClient();

function readMarkdownArticle(fileName, metadata) {
  const articlePath = path.join(process.cwd(), "articles", fileName);
  if (!existsSync(articlePath)) return null;

  const raw = readFileSync(articlePath, "utf8").trim();
  const coverImage = (raw.match(/!\[[^\]]*]\(([^)]+)\)/) || [])[1] || "";
  const content = raw
    .replace(/^# .+\r?\n+/, "")
    .replace(/^!\[[^\]]*]\([^)]+\)\r?\n\*[^*\r\n]+?\*\r?\n+/, "")
    .trim();

  return {
    ...metadata,
    coverImage,
    featured: metadata.featured || false,
    published: true,
    content,
  };
}

const categories = [
  {
    name: "Travel",
    slug: "travel",
    description: "Smart itineraries, city guides, and slow-travel ideas across the Netherlands.",
  },
  {
    name: "Expat Life",
    slug: "expat-life",
    description: "Practical advice for settling in, working, and feeling at home in the Netherlands.",
  },
  {
    name: "Dutch Culture",
    slug: "dutch-culture",
    description: "Clear, curious guides to Dutch habits, holidays, language, food, and everyday life.",
  },
  {
    name: "Where to Stay",
    slug: "where-to-stay",
    description: "Neighbourhood notes and hotel-area picks for weekends, moves, and longer stays.",
  },
];

const articles = [
  readMarkdownArticle("article-1-updated.md", {
    title: "Moving to the Netherlands: Complete Expat Checklist 2025",
    slug: "moving-to-the-netherlands-expat-checklist",
    category: "expat-life",
    seoTitle: "Moving to the Netherlands: Complete Expat Checklist 2025",
    metaDescription:
      "A practical Netherlands relocation checklist for expats, covering housing, gemeente registration, BSN, banking, health insurance, DigiD, transport, and the first three months.",
    pinterestDescription:
      "Save this complete moving to the Netherlands checklist for expats covering BSN, gemeente registration, banking, health insurance, housing, and first-month setup.",
  }),
  readMarkdownArticle("article-2-updated.md", {
    title: "How to Get Your BSN Number in the Netherlands (2025 Guide)",
    slug: "how-to-get-bsn-number-netherlands",
    category: "expat-life",
    seoTitle: "How to Get Your BSN Number in the Netherlands: 2025 Guide",
    metaDescription:
      "A clear 2025 guide to getting your BSN number in the Netherlands, including who needs one, gemeente appointments, required documents, timelines, RNI registration, and common problems.",
    pinterestDescription:
      "Save this BSN number guide for the Netherlands with the documents, appointment steps, timeline, RNI option, and common expat problems explained.",
  }),
  readMarkdownArticle("article-3-dutch-desserts.md", {
    title: "15 Best Dutch Desserts You Need to Try",
    slug: "best-dutch-desserts",
    category: "dutch-culture",
    seoTitle: "15 Best Dutch Desserts to Try in the Netherlands",
    metaDescription:
      "A guide to the best Dutch desserts to try, from stroopwafels, poffertjes and appeltaart to tompouce, oliebollen, bossche bol, vlaai, hagelslag and more.",
    pinterestDescription:
      "Save this guide to 15 Dutch desserts to try in the Netherlands, including stroopwafels, poffertjes, appeltaart, tompouce, oliebollen, vlaai and more.",
  }),
  readMarkdownArticle("article-4-things-that-make-you-want-to-move.md", {
    title: "10 Things About Dutch Life That Make Expats Want to Move There",
    slug: "things-about-the-netherlands-that-make-you-want-to-move",
    category: "dutch-culture",
    seoTitle: "10 Things About Dutch Life That Make Expats Want to Move There",
    metaDescription:
      "Ten practical, emotional and fun reasons expats fall for life in the Netherlands, from public trust and free festivals to gezelligheid and Dutch traditions.",
    pinterestDescription:
      "Save these 10 benefits of Dutch life that make expats want to move to the Netherlands, including public trust, free festivals, gezelligheid and fun traditions.",
  }),
].filter(Boolean);

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  console.log(`Seeded ${categories.length} categories and ${articles.length} markdown articles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
