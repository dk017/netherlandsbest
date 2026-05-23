import { PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "fs";
import path from "path";

const prisma = new PrismaClient();

function readMarkdownArticle(
  fileName: string,
  metadata: {
    title: string;
    slug: string;
    category: string;
    seoTitle: string;
    metaDescription: string;
    pinterestDescription: string;
    featured?: boolean;
  }
) {
  const articlePath = path.join(process.cwd(), "articles", fileName);
  if (!existsSync(articlePath)) return null;

  const raw = readFileSync(articlePath, "utf8").trim();
  const coverImage = raw.match(/!\[[^\]]*]\(([^)]+)\)/)?.[1] ?? "";
  const content = raw
    .replace(/^# .+\r?\n+/, "")
    .replace(/^!\[[^\]]*]\([^)]+\)\r?\n\*[^*\r\n]+?\*\r?\n+/, "")
    .trim();

  return {
    ...metadata,
    coverImage,
    featured: metadata.featured ?? false,
    published: true,
    content
  };
}

const categories = [
  {
    name: "Travel",
    slug: "travel",
    description: "Smart itineraries, city guides, and slow-travel ideas across the Netherlands."
  },
  {
    name: "Expat Life",
    slug: "expat-life",
    description: "Practical advice for settling in, working, and feeling at home in the Netherlands."
  },
  {
    name: "Dutch Culture",
    slug: "dutch-culture",
    description: "Clear, curious guides to Dutch habits, holidays, language, food, and everyday life."
  },
  {
    name: "Where to Stay",
    slug: "where-to-stay",
    description: "Neighbourhood notes and hotel-area picks for weekends, moves, and longer stays."
  }
];

const articles = [
  {
    title: "A First-Timer's Slow Weekend in Amsterdam",
    slug: "first-timers-slow-weekend-amsterdam",
    category: "travel",
    coverImage: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&q=85",
    seoTitle: "A Slow Weekend in Amsterdam: First-Timer Itinerary",
    metaDescription: "A polished Amsterdam weekend itinerary for first-time visitors who want canals, museums, calm neighbourhoods, and excellent food without rushing.",
    pinterestDescription: "Save this calm first-timer Amsterdam weekend itinerary with canals, museums, neighbourhood walks, and food stops.",
    featured: true,
    published: true,
    content: `Amsterdam rewards travellers who leave room between plans. Start with the canals, choose one museum, and give yourself time to sit beside the water instead of crossing the city for every recommendation.

## Friday evening

Arrive, check in, and walk the western canal ring before dinner. The light is softer here, and the streets around Jordaan give a good first sense of the city without the busiest crowds.

Book one relaxed dinner rather than chasing a long list. If you still have energy afterwards, take a short walk along Brouwersgracht and let the city slow down.

## Saturday

Pick either the Rijksmuseum or Van Gogh Museum and book a morning slot. Afterwards, cross into De Pijp for lunch and market browsing.

- Reserve major museums ahead of time
- Use trams for longer crossings
- Keep your best walks for early morning or golden hour

**The best Amsterdam weekend has fewer stops and better pacing.** Leave one afternoon open for a canal-side cafe, a ferry ride to Noord, or a neighbourhood you did not plan for.

## Sunday

Spend the morning in Noord or Oost before heading home. Both areas show a different side of Amsterdam and make the trip feel less like a checklist.`
  },
  {
    title: "What Expats Should Know Before Renting in the Netherlands",
    slug: "expat-renting-netherlands",
    category: "expat-life",
    coverImage: "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?auto=format&fit=crop&w=1600&q=85",
    seoTitle: "Renting in the Netherlands: Expat Basics",
    metaDescription: "A practical rental guide for expats in the Netherlands covering viewings, documents, deposits, neighbourhood choices, and red flags.",
    pinterestDescription: "A practical Netherlands rental checklist for expats preparing documents, viewings, and neighbourhood research.",
    featured: false,
    published: true,
    content: `Renting in the Netherlands can move quickly, especially in Amsterdam, Utrecht, Rotterdam, The Hague, and Eindhoven. A prepared folder helps you respond faster when a good place appears.

## Documents to prepare

Most landlords or agents will ask for proof of income, identification, employment details, and sometimes a landlord statement. Keep digital copies ready before you book viewings.

The market is competitive, but speed should not replace caution. Always confirm who you are paying and what is included in the contract.

## Red flags

- Requests to transfer money before a viewing
- No written contract
- Pressure to decide immediately without basic documents
- Rent that is far below comparable listings

**A good rental decision balances urgency with verification.** Save screenshots, keep messages, and ask what utilities, registration, and service costs are included.`
  },
  {
    title: "A Clear Guide to Dutch Birthday Circles",
    slug: "dutch-birthday-circles-guide",
    category: "dutch-culture",
    coverImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=85",
    seoTitle: "Dutch Birthday Circles Explained",
    metaDescription: "A friendly guide to the Dutch birthday circle tradition, including what to expect, what to bring, and how to join in comfortably.",
    pinterestDescription: "Dutch birthday circles explained for newcomers: what to expect, what to say, and how to feel comfortable.",
    featured: false,
    published: true,
    content: `The Dutch birthday circle is exactly what it sounds like: guests sitting in a circle, drinking coffee, eating cake, and congratulating not only the birthday person but often the family too.

## What to expect

You may hear people say congratulations to parents, partners, and siblings. It can feel unusual at first, but it is meant as a warm social ritual.

Bring a modest gift, arrive on time, and take the offered coffee or tea if you want to blend in.

## Easy etiquette

- Congratulate the birthday person first
- A small card or flowers is enough
- Do not expect a big party every time

**The circle is less formal than it looks.** Once you understand the pattern, it becomes a simple way to join Dutch home life.`
  },
  {
    title: "Where to Stay in Rotterdam for a Design-Focused Weekend",
    slug: "where-to-stay-rotterdam-design-weekend",
    category: "where-to-stay",
    coverImage: "https://images.unsplash.com/photo-1572862905000-c5b6244027a5?auto=format&fit=crop&w=1600&q=85",
    seoTitle: "Where to Stay in Rotterdam for Design Lovers",
    metaDescription: "The best Rotterdam areas to stay in for architecture, design, food, and easy weekend exploring.",
    pinterestDescription: "Rotterdam neighbourhood guide for a stylish design-focused weekend in the Netherlands.",
    featured: false,
    published: true,
    content: `Rotterdam is a strong choice for travellers who want modern architecture, bold hotels, good food, and a different Dutch city rhythm from Amsterdam.

## Best areas

Centrum keeps you close to museums, shopping, food halls, and central transport. Kop van Zuid gives you water views and architecture. Noord is better for independent food and a more local feel.

Choose the area based on how you want to move through the city, not only the hotel room.

## Quick picks

- Centrum for first visits
- Kop van Zuid for views
- Noord for cafes and neighbourhood energy

**Rotterdam works best when your hotel becomes part of the design experience.** Prioritise location, transit, and walking routes over chasing a bargain far outside the centre.`
  }
];

const markdownArticles = [
  readMarkdownArticle("article-1-updated.md", {
    title: "Moving to the Netherlands: Complete Expat Checklist 2025",
    slug: "moving-to-the-netherlands-expat-checklist",
    category: "expat-life",
    seoTitle: "Moving to the Netherlands: Complete Expat Checklist 2025",
    metaDescription:
      "A practical Netherlands relocation checklist for expats, covering housing, gemeente registration, BSN, banking, health insurance, DigiD, transport, and the first three months.",
    pinterestDescription:
      "Save this complete moving to the Netherlands checklist for expats covering BSN, gemeente registration, banking, health insurance, housing, and first-month setup."
  }),
  readMarkdownArticle("article-2-updated.md", {
    title: "How to Get Your BSN Number in the Netherlands (2025 Guide)",
    slug: "how-to-get-bsn-number-netherlands",
    category: "expat-life",
    seoTitle: "How to Get Your BSN Number in the Netherlands: 2025 Guide",
    metaDescription:
      "A clear 2025 guide to getting your BSN number in the Netherlands, including who needs one, gemeente appointments, required documents, timelines, RNI registration, and common problems.",
    pinterestDescription:
      "Save this BSN number guide for the Netherlands with the documents, appointment steps, timeline, RNI option, and common expat problems explained."
  }),
  readMarkdownArticle("article-3-dutch-desserts.md", {
    title: "15 Best Dutch Desserts You Need to Try",
    slug: "best-dutch-desserts",
    category: "dutch-culture",
    seoTitle: "15 Best Dutch Desserts to Try in the Netherlands",
    metaDescription:
      "A guide to the best Dutch desserts to try, from stroopwafels, poffertjes and appeltaart to tompouce, oliebollen, bossche bol, vlaai, hagelslag and more.",
    pinterestDescription:
      "Save this guide to 15 Dutch desserts to try in the Netherlands, including stroopwafels, poffertjes, appeltaart, tompouce, oliebollen, vlaai and more."
  })
].filter((article): article is NonNullable<typeof article> => Boolean(article));

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const article of [...articles, ...markdownArticles]) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
