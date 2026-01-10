import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const places = await getSheetData("Places");
    const regions = await getSheetData("Regions");
    
    // Create region lookup
    const regionMap: Record<string, string> = {};
    regions.forEach((r: any) => {
      regionMap[r.region_id] = r.name;
    });
    
    // Filter to only published places and sort by order
    const publishedPlaces = places
      .filter((place: any) => place.published === "TRUE" || place.published === "true")
      .sort((a: any, b: any) => {
        const orderA = parseInt(a.order) || 999;
        const orderB = parseInt(b.order) || 999;
        return orderA - orderB;
      })
      .map((place: any) => ({
        slug: place.slug,
        name: place.name,
        region: regionMap[place.region_id] || place.region_id || "",
        heroImage: convertDriveUrl(place.hero_image || ""),
        excerpt: place.excerpt || "",
      }));

    return NextResponse.json(publishedPlaces);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json([], { status: 500 });
  }
}
