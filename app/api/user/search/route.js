import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return new Response(JSON.stringify([]), { status: 200 });

  const client = await pool.connect();

  const res = await client.query(
    `SELECT id, username FROM users
     WHERE username ILIKE $1
     LIMIT 10`,
    [`%${query}%`]
  );

  client.release();
  return new Response(JSON.stringify(res.rows), { status: 200 });
}
