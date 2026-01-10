import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const stories = await getSheetData("Stories");
    
    // Filter to only published stories and sort by order
    const publishedStories = stories
      .filter((story: any) => story.published === "TRUE" || story.published === "true")
      .sort((a: any, b: any) => {
        const orderA = parseInt(a.order) || 999;
        const orderB = parseInt(b.order) || 999;
        return orderA - orderB;
      })
      .map((story: any) => ({
        slug: story.slug,
        title: story.title,
        subtitle: story.subtitle || "",
        category: story.category || "Essay",
        heroImage: convertDriveUrl(story.hero_image || ""),
        excerpt: story.excerpt || "",
        readTime: story.read_time || "5 min",
        featured: story.featured || "",
      }));

    return NextResponse.json(publishedStories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json([], { status: 500 });
  }
}
