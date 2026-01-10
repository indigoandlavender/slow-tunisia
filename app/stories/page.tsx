import StoryCard from "@/components/StoryCard";

async function getStories() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/stories`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function StoriesPage() {
  const stories = await getStories();
  
  // Separate featured and regular stories
  const featuredStories = stories.filter((s: any) => s.featured);
  const regularStories = stories.filter((s: any) => !s.featured);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white/90 mb-6">
              Stories
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Tunisia beyond the postcard. The blue that isn't Greek. The doors that ward off djinn. 
              The olive trees that were ancient when Rome was young. The underground houses where 
              Luke Skywalker grew up.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-8">
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredStories.map((story: any) => (
                <StoryCard
                  key={story.slug}
                  slug={story.slug}
                  title={story.title}
                  category={story.category}
                  heroImage={story.heroImage}
                  excerpt={story.excerpt}
                  readTime={story.readTime}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Stories Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {featuredStories.length > 0 && (
            <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-8">
              All Stories
            </h2>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularStories.map((story: any) => (
              <StoryCard
                key={story.slug}
                slug={story.slug}
                title={story.title}
                category={story.category}
                heroImage={story.heroImage}
                excerpt={story.excerpt}
                readTime={story.readTime}
              />
            ))}
          </div>
          
          {stories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50">Stories coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
