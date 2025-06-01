import { GoogleGenAI } from "@google/genai";
import { getUserBookAuthors, getUserBookSubjects } from "@/lib/db/book";
import { verifyAuth } from "@/lib/auth";

const apiKey = process.env.AI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req) {
  const { title, authors, subjects } = await req.json();
  const result = await verifyAuth();
  const userId = result?.user?.id;

  const userAuthors = await getUserBookAuthors(userId);
  const userSubjects = await getUserBookSubjects(userId);

  const prompt = `
    You are an intelligent book assistant.

    Your task is to:
    1. Generate a compelling book description based on:
      - Book Title: ${title}
      - Authors: ${authors?.join(", ")}
      - Subjects / Themes: ${subjects?.join(", ")}

    2. Analyze whether this book is likely to be a good fit for the user, based on:
      - Authors of books in the user's library: ${userAuthors.join(", ")}
      - Subjects / Themes from the books in the user's library: ${userSubjects.join(
        ", "
      )}

    Instructions:
    - First, write a professional 100–150 word description of the book that sounds like it was written by a human editor. Avoid spoilers.
    - Then, in 2–3 sentences, assess how well this book matches the user’s existing library — based on author and subject similarities.
    - Your tone should be friendly, intelligent, and natural.
    - Do not mention the user’s exact library; infer preferences only from the author and subject lists.
    - Output only the final text (description + match analysis), no bullet points or labels.
    - Output the text as plain, simple text without any Markdown formatting, asterisks, or special characters. Just plain sentences.
  `;

  const aiStream = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of aiStream) {
        controller.enqueue(encoder.encode(chunk.text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
