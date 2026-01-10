import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoryBody from "@/components/StoryBody";

async function getStory(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/stories/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = await getStory(params.slug);
  if (!story) return { title: "Story Not Found" };
  
  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: story.heroImage ? [story.heroImage] : [],
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const story = await getStory(params.slug);
  
  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Image */}
      {story.heroImage && (
        <section className="relative h-[70vh] w-full">
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        </section>
      )}

      {/* Article Header */}
      <section className={`relative ${story.heroImage ? '-mt-40' : 'pt-32'} pb-12 px-6`}>
        <div className="max-w-3xl mx-auto">
          {/* Category & Read Time */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-white/50">
              {story.category}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-xs tracking-[0.15em] uppercase text-white/50">
              {story.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/90 mb-4 leading-tight">
            {story.title}
          </h1>

          {/* Subtitle */}
          {story.subtitle && (
            <p className="text-xl text-white/60 leading-relaxed">
              {story.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-white/10 mb-12" />
      </div>

      {/* Article Body */}
      <article className="pb-20">
        <StoryBody content={story.body} />
      </article>

      {/* Sources */}
      {story.sources && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-4">
                Sources
              </h3>
              <p className="text-sm text-white/40 leading-relaxed whitespace-pre-line">
                {story.sources}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Author */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="border-t border-white/10 pt-8">
            <p className="text-sm text-white/40">
              Text — {story.author}
            </p>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/stories" 
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8L10 4" />
            </svg>
            All Stories
          </Link>
        </div>
      </section>
    </main>
  );
}
