import PlaceCard from "@/components/PlaceCard";
import TunisiaMapWrapper from "@/components/TunisiaMapWrapper";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

async function getPlaces() {
  try {
    const places = await getSheetData("Places");
    return places
      .filter((place: any) => place.published === "TRUE")
      .map((place: any) => ({
        ...place,
        heroImage: convertDriveUrl(place.heroImage),
      }))
      .sort((a: any, b: any) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

export default async function PlacesPage() {
  const places = await getPlaces();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white/90 mb-6">
              Places
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Tunisia stretches from Mediterranean cliffs to Saharan dunes, with 
              three thousand years of civilization layered between. Roman ruins 
              rise from wheat fields. Berber villages cling to mountain slopes. 
              Blue doors open onto worlds you didn't know existed.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {places.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-6">
              Explore by Location
            </p>
            <TunisiaMapWrapper
              stories={places.map((p: any) => ({
                slug: p.slug,
                title: p.name,
                region: p.region
              }))}
            />
          </div>
        </section>
      )}

      {/* Places Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place: any) => (
              <PlaceCard
                key={place.slug}
                slug={place.slug}
                name={place.name}
                region={place.region}
                excerpt={place.excerpt}
                heroImage={place.heroImage}
              />
            ))}
          </div>
          
          {places.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50">Places coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
