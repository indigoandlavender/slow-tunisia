import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Get story data
    const stories = await getSheetData("Stories");
    const story = stories.find((s: any) => s.slug === slug);
    
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    
    // Get story images
    const allImages = await getSheetData("Story_Images");
    const storyImages = allImages
      .filter((img: any) => img.story_slug === slug)
      .sort((a: any, b: any) => parseInt(a.order || "0") - parseInt(b.order || "0"))
      .map((img: any) => ({
        url: convertDriveUrl(img.image_url || ""),
        caption: img.caption || "",
        alt: img.alt || story.title,
      }));

    return NextResponse.json({
      slug: story.slug,
      title: story.title,
      subtitle: story.subtitle || "",
      category: story.category || "Essay",
      heroImage: convertDriveUrl(story.hero_image || ""),
      heroCaption: story.hero_caption || "",
      excerpt: story.excerpt || "",
      body: story.body || "",
      readTime: story.read_time || "5 min",
      author: story.author || "Jacqueline Ng",
      sources: story.sources || "",
      images: storyImages,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}
