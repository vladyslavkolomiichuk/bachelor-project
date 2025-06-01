import { getColorsFromImage } from "@/lib/color-finder";

export async function POST(req) {
  const { bookImage } = await req.json();

  if (!bookImage) {
    return Response.json({ error: "Missing bookImage" }, { status: 400 });
  }

  const colors = await getColorsFromImage(bookImage);

  return Response.json({
    dominantColor: colors[3],
  });
}
