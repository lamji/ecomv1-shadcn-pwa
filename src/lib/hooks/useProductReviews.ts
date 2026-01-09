import { useMemo } from 'react';

export type Review = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string; // 💬 optional comment
  isVerified: boolean;
  createdAt: string | Date;
};

export type RatingOptions = {
  globalAverage?: number;
  minReviews?: number;
  verifiedWeight?: number;
  unverifiedWeight?: number;
  halfLifeDays?: number;
  minCommentLength?: number; // filter low-quality comments
};

export function useProductReviews(reviews: Review[], options: RatingOptions = {}) {
  return useMemo(() => {
    const {
      globalAverage = 4.2,
      minReviews = 20,
      verifiedWeight = 1,
      unverifiedWeight = 0.5,
      halfLifeDays = 180,
      minCommentLength = 5,
    } = options;

    const now = Date.now();
    const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1000;

    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    if (!reviews || reviews.length === 0) {
      return {
        rating: Number(globalAverage.toFixed(1)),
        rawAverage: globalAverage,
        count: 0,
        distribution,
        comments: [],
        latestComments: [],
      };
    }

    let weightedSum = 0;
    let totalWeight = 0;
    let rawSum = 0;

    const comments: Review[] = [];

    for (const review of reviews) {
      distribution[review.rating]++;
      rawSum += review.rating;

      const ageMs = now - new Date(review.createdAt).getTime();

      // ⏱ Time decay
      const timeWeight = Math.pow(0.5, ageMs / halfLifeMs);

      // 🛒 Verified weight
      const trustWeight = review.isVerified ? verifiedWeight : unverifiedWeight;

      const weight = timeWeight * trustWeight;

      weightedSum += review.rating * weight;
      totalWeight += weight;

      // 💬 Collect valid comments
      if (review.comment && review.comment.trim().length >= minCommentLength) {
        comments.push(review);
      }
    }

    const rawAverage = rawSum / reviews.length;
    const weightedAverage = totalWeight === 0 ? 0 : weightedSum / totalWeight;

    // ⭐ Bayesian rating
    const finalRating =
      (totalWeight / (totalWeight + minReviews)) * weightedAverage +
      (minReviews / (totalWeight + minReviews)) * globalAverage;

    // 🔥 Sort comments (newest + verified first)
    const sortedComments = comments.sort((a, b) => {
      if (a.isVerified !== b.isVerified) {
        return a.isVerified ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      rating: Number(finalRating.toFixed(1)),
      rawAverage: Number(rawAverage.toFixed(2)),
      count: reviews.length,
      distribution,

      // 💬 comment data
      comments: sortedComments,
      latestComments: sortedComments.slice(0, 5),
      commentCount: sortedComments.length,
    };
  }, [reviews, options]);
}

// const reviews = [
//   {
//     id: "r1",
//     rating: 5,
//     comment: "Very good quality! Fast delivery 👍",
//     isVerified: true,
//     createdAt: "2025-12-28T09:12:00Z"
//   },
//   {
//     id: "r2",
//     rating: 4,
//     comment: "Item is okay, packaging could be better.",
//     isVerified: true,
//     createdAt: "2025-12-20T14:45:00Z"
//   },
//   {
//     id: "r3",
//     rating: 5,
//     comment: "Highly recommended seller!",
//     isVerified: false, // unverified review
//     createdAt: "2025-11-02T08:30:00Z"
//   },
//   {
//     id: "r4",
//     rating: 3,
//     comment: "Average product. Works as expected.",
//     isVerified: true,
//     createdAt: "2025-08-15T16:20:00Z"
//   },
//   {
//     id: "r5",
//     rating: 1,
//     comment: "Received damaged item 😡",
//     isVerified: true,
//     createdAt: "2024-12-10T10:05:00Z"
//   },
//   {
//     id: "r6",
//     rating: 5,
//     // ❌ No comment – still counted in rating
//     isVerified: true,
//     createdAt: "2025-12-30T11:00:00Z"
//   },
//   {
//     id: "r7",
//     rating: 4,
//     comment: "Good for the price.",
//     isVerified: false,
//     createdAt: "2025-10-05T07:40:00Z"
//   }
// ];

// console.log(useProductReviews(reviews));
// const {
//   rating,
//   count,
//   distribution,
//   latestComments,
//   commentCount
// } = useProductReviews(reviews);

// return (
//   <>
//     <h2>⭐ {rating}</h2>
//     <p>{count} ratings · {commentCount} comments</p>

//     {latestComments.map(r => (
//       <div key={r.id}>
//         <strong>{r.rating}⭐</strong>
//         {r.isVerified && <span> ✔ Verified</span>}
//         <p>{r.comment}</p>
//       </div>
//     ))}
//   </>
// );
