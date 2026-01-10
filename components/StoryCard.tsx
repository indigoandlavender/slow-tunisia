import Link from "next/link";
import Image from "next/image";

interface StoryCardProps {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  category: string;
  readTime?: string;
}

export default function StoryCard({ 
  slug, 
  title, 
  excerpt, 
  heroImage, 
  category,
  readTime 
}: StoryCardProps) {
  return (
    <Link href={`/story/${slug}`} className="group block">
      <article className="h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-white/5">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          {/* Category & Read Time */}
          <div className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-white/50">
            <span>{category}</span>
            {readTime && (
              <>
                <span className="text-white/30">·</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-serif text-xl text-white/90 group-hover:text-white transition-colors leading-snug">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
