import Rating from "@/components/GeneralComponents/Rating/rating";
import styles from "./rating-section.module.css";

// const calculateAverageRating = (ratingCounts) => {
//   let totalVotes = 0;
//   let totalScore = 0;

//   for (const rating in ratingCounts) {
//     const count = ratingCounts[rating];
//     const ratingNum = parseInt(rating);

//     totalVotes += count;
//     totalScore += ratingNum * count;
//   }

//   const averageRating = totalVotes === 0 ? 0 : totalScore / totalVotes;

//   return {
//     averageRating: parseFloat(averageRating.toFixed(2)),
//     totalVotes,
//   };
// };

// function calculateRatingPercentages(ratingCounts) {
//   const result = {};
//   let totalVotes = 0;

//   for (const rating in ratingCounts) {
//     totalVotes += ratingCounts[rating];
//   }

//   for (const rating in ratingCounts) {
//     const votes = ratingCounts[rating];
//     const percentage =
//       totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
//     result[rating] = percentage;
//   }

//   return result;
// }

export default function RatingSection({ ratingCounts }) {
  // const { averageRating, totalVotes } = calculateAverageRating(ratingCounts);
  // const percentages = calculateRatingPercentages(ratingCounts);
  const {
    averageRating = 0,
    totalVotes = 0,
    percentages = {},
  } = ratingCounts || {};

  return (
    <div className={styles.ratingSection}>
      <div className={styles.averageRating}>
        <p>{averageRating}</p>
        <div className={styles.starRatingContainer}>
          <Rating rating={averageRating} starColor="#efc44d" />
          <span className={styles.totalReviews}>{totalVotes} ratings</span>
        </div>
      </div>
      <div className={styles.detailedRating}>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className={styles.ratingRow}>
            <p className={styles.ratingRowNum}>{rating}</p>
            <div className={styles.ratingBar}>
              <div
                className={styles.filledBar}
                style={{ width: `${percentages[rating] || 0}%` }}
              />
            </div>
            <p className={styles.percentage}>{percentages[rating] || 0}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
