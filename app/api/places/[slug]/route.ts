import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Get place data
    const places = await getSheetData("Places");
    const place = places.find((p: any) => p.slug === slug);
    
    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }
    
    // Get region name
    const regions = await getSheetData("Regions");
    const region = regions.find((r: any) => r.region_id === place.region_id);
    
    // Get destinations in this place
    const destinations = await getSheetData("Destinations");
    const placeDestinations = destinations
      .filter((d: any) => d.place_slug === slug)
      .map((d: any) => ({
        name: d.name,
        type: d.type || "",
        description: d.description || "",
      }));

    return NextResponse.json({
      slug: place.slug,
      name: place.name,
      region: region?.name || place.region_id || "",
      regionId: place.region_id,
      heroImage: place.hero_image || "",
      excerpt: place.excerpt || "",
      body: place.body || "",
      highlights: place.highlights ? place.highlights.split("|").map((h: string) => h.trim()) : [],
      bestTime: place.best_time || "",
      destinations: placeDestinations,
    });
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json({ error: "Failed to fetch place" }, { status: 500 });
  }
}
