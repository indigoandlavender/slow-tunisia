import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPlace(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/places/${slug}`, {
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
  const place = await getPlace(params.slug);
  if (!place) return { title: "Place Not Found" };
  
  return {
    title: place.name,
    description: place.excerpt,
    openGraph: {
      title: place.name,
      description: place.excerpt,
      images: place.heroImage ? [place.heroImage] : [],
    },
  };
}

export default async function PlacePage({
  params,
}: {
  params: { slug: string };
}) {
  const place = await getPlace(params.slug);
  
  if (!place) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Image */}
      {place.heroImage && (
        <section className="relative h-[70vh] w-full">
          <Image
            src={place.heroImage}
            alt={place.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        </section>
      )}

      {/* Place Header */}
      <section className={`relative ${place.heroImage ? '-mt-40' : 'pt-32'} pb-12 px-6`}>
        <div className="max-w-3xl mx-auto">
          {/* Region */}
          <div className="mb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-white/50">
              {place.region}
            </span>
          </div>

          {/* Name */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/90 mb-6 leading-tight">
            {place.name}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-white/60 leading-relaxed">
            {place.excerpt}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-white/10 mb-12" />
      </div>

      {/* Body Content */}
      {place.body && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none">
              {place.body.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-lg text-white/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {place.highlights && place.highlights.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-6">
              Highlights
            </h2>
            <ul className="space-y-3">
              {place.highlights.map((highlight: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-white/30 mt-1">·</span>
                  <span className="text-white/70">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Best Time to Visit */}
      {place.bestTime && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-4">
              Best Time to Visit
            </h2>
            <p className="text-white/70">{place.bestTime}</p>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="border-t border-white/10 pt-8">
            <Link 
              href="/places" 
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 12L6 8L10 4" />
              </svg>
              All Places
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
