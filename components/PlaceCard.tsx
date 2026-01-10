import Link from "next/link";
import Image from "next/image";

interface PlaceCardProps {
  slug: string;
  name: string;
  region: string;
  excerpt: string;
  heroImage: string;
}

export default function PlaceCard({ 
  slug, 
  name, 
  region, 
  excerpt, 
  heroImage 
}: PlaceCardProps) {
  return (
    <Link href={`/places/${slug}`} className="group block">
      <article className="h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-white/5">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          {/* Region */}
          <div className="text-xs tracking-[0.15em] uppercase text-white/50">
            {region}
          </div>
          
          {/* Name */}
          <h3 className="font-serif text-xl text-white/90 group-hover:text-white transition-colors leading-snug">
            {name}
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
