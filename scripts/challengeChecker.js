import pool from "@/lib/db/postgresDB";

async function checkChallenge() {
  const client = await pool.connect();
  const today = new Date();
  const localDate = today.toLocaleDateString();

  const result = await client.query(
    `
    UPDATE tasks
    SET status = 'in_progress'
    WHERE status = 'future' AND start_date <= $1
    RETURNING id, user_id, title
  `,
    [localDate]
  );

  for (const task of result.rows) {
    await client.query(
      `
      INSERT INTO notifications (user_id, title, message)
      VALUES ($1, 'Task active', $2)
    `,
      [task.user_id, `Task "${task.title}" has started.`]
    );
  }

  client.release();
}

checkTasks().then(() => console.log("Task checked"));
