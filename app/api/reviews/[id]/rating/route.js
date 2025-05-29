import { verifyAuth } from "@/lib/auth";
import {
  createReviewVote,
  getReviewVote,
  updateReviewRating,
  updateUserReviewVote,
} from "@/lib/db/review";

export async function PATCH(req, { params }) {
  const result = await verifyAuth();
  const userId = result.user.id;
  const { id: reviewId } = await params;
  const { action } = await req.json();

  if (!["upvote", "downvote"].includes(action)) {
    return new Response("Invalid action", { status: 400 });
  }

  const existing = await getReviewVote(userId, reviewId);

  let ratingChange = 0;

  if (existing.rows.length <= 0) {
    await createReviewVote(userId, reviewId, action);

    ratingChange = action === "upvote" ? 1 : -1;
  } else if (existing.vote_type === action) {
    return new Response("Already voted", { status: 409 });
  } else {
    await updateUserReviewVote(userId, reviewId, action);

    ratingChange = action === "upvote" ? 2 : -2;
  }

  const updated = await updateReviewRating(ratingChange, reviewId);

  return Response.json({ rating: updated });
}
