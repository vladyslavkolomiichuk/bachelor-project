import { verifyAuth } from "@/lib/auth";
import { addNotificationForUser } from "@/lib/db/notification";
import {
  createReviewVote,
  getReviewById,
  getReviewVote,
  updateReviewRating,
  updateUserReviewVote,
} from "@/lib/db/review";
import { getUsername } from "@/lib/db/user";
import { sanitizeInputBack } from "@/lib/sanitize-text";

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

  if (action === "upvote") {
    const review = await getReviewById(reviewId);
    if (review) {
      const reviewAuthorId = review.user_id;
      const bookTitle = review.book_title;

      const username = await getUsername(userId);

      if (reviewAuthorId !== userId) {
        const safeUsername = sanitizeInputBack(username);
        const safeBookTitle = sanitizeInputBack(bookTitle);

        const title = "A new voice for the review";
        const message = `The user <span>${safeUsername}</span> liked your review of the book <span>"${safeBookTitle}"</span>.`;

        await addNotificationForUser(reviewAuthorId, title, message, "review");
      }
    }
  }

  return new Response(JSON.stringify({ rating: updated }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
