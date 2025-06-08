import pool from "@/lib/db/postgresDB";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || 1;

  try {
    const client = await pool.connect();

    const [
      userInfo,
      wordsByDates,
      readingProgress,
      dailyReading,
      genres,
      dictionaryGrowth,
      tests,
      bookTimeScatter,
      reviewVotes,
      userStreak,
      notesPerBook,
      usedBooksStats,
      weeklyTime,
      bookRatings,
      wordCategories,
    ] = await Promise.all([
      //User info
      client.query(
        `SELECT date_of_first_visit, flame_score FROM users WHERE id = $1`,
        [userId]
      ),

      //Noting words by dates
      client.query(
        `SELECT date, SUM(words_count) AS words
        FROM note_sessions
        WHERE user_id = $1
        GROUP BY date
        ORDER BY date`,
        [userId]
      ),

      // Reading Progress - from note_sessions and books
      client.query(
        `
        SELECT 
            b.title, 
            MAX(ns.finish_page) - MIN(ns.start_page) AS pages
        FROM 
            note_sessions ns
        JOIN 
            books b ON ns.book_id = b.id
        WHERE 
            ns.user_id = $1 
            AND ns.finish_page IS NOT NULL 
            AND ns.start_page IS NOT NULL
        GROUP BY 
            b.title;
      `,
        [userId]
      ),

      // Daily Reading Progress
      client.query(
        `
        SELECT 
            to_char(date, 'YYYY-MM-DD') AS date,
            MAX(finish_page) - MIN(start_page) AS pages
        FROM 
            note_sessions
        WHERE 
            user_id = $1 
            AND finish_page IS NOT NULL 
            AND start_page IS NOT NULL
        GROUP BY 
            date
        ORDER BY 
            date;
      `,
        [userId]
      ),

      // Book Genres from books and used_books
      client.query(
        `
        SELECT subject AS name, COUNT(*) AS value
        FROM books b
        JOIN used_books ub ON b.id = ub.book_id,
        LATERAL unnest(subjects) AS subject
        WHERE ub.user_id = $1
        GROUP BY subject
      `,
        [userId]
      ),

      // Dictionary Growth by Week
      client.query(
        `
        SELECT to_char(date_trunc('week', date), 'YYYY-MM-DD') AS date, 
               COUNT(*) AS words
        FROM dictionary_words
        WHERE user_id = $1
        GROUP BY date_trunc('week', date)
        ORDER BY date_trunc('week', date)
      `,
        [userId]
      ),

      // Latest Reading Speed Test
      client.query(
        `
        SELECT id, wpm, comprehension, time, date
        FROM tests
        WHERE user_id = $1
        ORDER BY date DESC
        LIMIT 3;
      `,
        [userId]
      ),

      // Reading Time Progress
      client.query(
        `
        SELECT ROW_NUMBER() OVER (ORDER BY date) AS x, 
               time AS y
        FROM note_sessions
        WHERE user_id = $1
      `,
        [userId]
      ),

      // Review Votes Distribution
      client.query(
        `
        SELECT vote_type AS name, COUNT(*) AS value
        FROM review_votes
        WHERE user_id = $1
        GROUP BY vote_type
      `,
        [userId]
      ),

      // User Activity Streak (Last 7 days)
      client.query(
        `
        SELECT to_char(date, 'Dy') AS day, 1 AS active
        FROM note_sessions
        WHERE user_id = $1 
        AND date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY date
      `,
        [userId]
      ),

      // Notes Per Book
      client.query(
        `
        SELECT b.title, COUNT(DISTINCT ns.note_id) AS notes
        FROM note_sessions ns
        JOIN books b ON ns.book_id = b.id
        WHERE ns.user_id = $1 AND ns.note_id IS NOT NULL
        GROUP BY b.title
      `,
        [userId]
      ),

      // Books Reading Status
      client.query(
        `
        SELECT
          COALESCE(category, 'not categorized') AS category,
          COUNT(*) AS value
        FROM used_books
        WHERE user_id = $1
        GROUP BY COALESCE(category, 'not categorized');
      `,
        [userId]
      ),

      // Weekly Reading Time
      client.query(
        `
        SELECT 
          to_char(date, 'Dy') AS day, 
          ROUND(SUM(time) / 60.0, 2) AS time_minutes
        FROM note_sessions
        WHERE user_id = $1 
          AND date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY date
        ORDER BY date;
      `,
        [userId]
      ),

      // Book Ratings
      client.query(
        `
        SELECT b.title AS book, r.book_rating AS rating
        FROM reviews r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_id = $1
      `,
        [userId]
      ),

      // Dictionary Word Categories
      client.query(
        `
        SELECT category AS name, COUNT(*) AS value
        FROM dictionary_words
        WHERE user_id = $1 AND category IS NOT NULL
        GROUP BY category
      `,
        [userId]
      ),
    ]);

    client.release();

    const responseData = {
      userInfo: userInfo.rows[0],
      wordsByDates: wordsByDates.rows,
      readingProgress: readingProgress.rows,
      dailyReading: dailyReading.rows,
      genres: genres.rows,
      dictionaryGrowth: dictionaryGrowth.rows,
      tests: tests.rows,
      bookTimeScatter: bookTimeScatter.rows,
      reviewVotes: reviewVotes.rows,
      userStreak: userStreak.rows,
      notesPerBook: notesPerBook.rows,
      usedBooksStats: usedBooksStats.rows,
      weeklyTime: weeklyTime.rows,
      bookRatings: bookRatings.rows,
      wordCategories: wordCategories.rows,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
