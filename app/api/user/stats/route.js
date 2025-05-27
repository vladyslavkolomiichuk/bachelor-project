import { NextResponse } from "next/server";

export async function GET() {
  // У реальному проекті це має бути запит до БД
  const data = {
    readingTests: [
      {
        date: "2025-05-01",
        wpm: 230,
        comprehension: 80,
      },
      {
        date: "2025-05-03",
        wpm: 245,
        comprehension: 85,
      },
      {
        date: "2025-05-06",
        wpm: 255,
        comprehension: 87,
      },
      {
        date: "2025-05-08",
        wpm: 265,
        comprehension: 90,
      },
    ],
    testsCount: 4,
    readingSessions: [
      {
        date: "2025-05-01",
        pages: 12,
      },
      {
        date: "2025-05-03",
        pages: 8,
      },
      {
        date: "2025-05-06",
        pages: 15,
      },
      {
        date: "2025-05-08",
        pages: 5,
      },
    ],
    noteSessionsCount: 4,
    noteBooksCount: 3,
    notesCount: 7,
    topNotes: [
      {
        title: "Note on Motivation",
        length: 320,
      },
      {
        title: "Analysis of Chapter 3",
        length: 270,
      },
      {
        title: "Summary: AI vs Humans",
        length: 250,
      },
      {
        title: "Creative Writing Ideas",
        length: 210,
      },
      {
        title: "Important Quotes",
        length: 190,
      },
    ],
    notesTimeline: [
      {
        date: "2025-05-01",
        notes: 2,
      },
      {
        date: "2025-05-03",
        notes: 1,
      },
      {
        date: "2025-05-05",
        notes: 3,
      },
      {
        date: "2025-05-08",
        notes: 1,
      },
    ],
    challengeTimeline: [
      {
        date: "2025-05-01",
        count: 1,
      },
      {
        date: "2025-05-02",
        count: 1,
      },
      {
        date: "2025-05-04",
        count: 2,
      },
      {
        date: "2025-05-06",
        count: 1,
      },
    ],
    libraryStats: {
      bookCount: 6,
      activity: [
        {
          date: "2025-05-01",
          books: 1,
        },
        {
          date: "2025-05-04",
          books: 2,
        },
        {
          date: "2025-05-06",
          books: 1,
        },
        {
          date: "2025-05-07",
          books: 2,
        },
      ],
      genres: [
        {
          genre: "Science Fiction",
          count: 2,
        },
        {
          genre: "Fantasy",
          count: 1,
        },
        {
          genre: "Non-fiction",
          count: 2,
        },
        {
          genre: "Biography",
          count: 1,
        },
      ],
    },
    dictionaryTimeline: [
      {
        date: "2025-05-01",
        words: 3,
      },
      {
        date: "2025-05-03",
        words: 2,
      },
      {
        date: "2025-05-04",
        words: 1,
      },
      {
        date: "2025-05-06",
        words: 4,
      },
    ],
    firstVisit: "2025-04-15",
    flameScore: 83,
  };

  return NextResponse.json(data);
}
