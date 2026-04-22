/**
 * Utility to calculate job match score deterministically
 * In the future, this will use real trait comparisons.
 * For now, it uses a hash of jobId and userId to ensure consistency.
 */
export const calculateJobMatch = (jobId: string, userId: string | undefined, hasTest: boolean = false): number => {
  if (!userId || !hasTest) return 0;
  
  // Simple deterministic hash based on IDs
  const combined = jobId + userId;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Map hash to a range between 65 and 98 for a "premium" feel
  const score = 65 + (Math.abs(hash) % 33);
  return score;
};
