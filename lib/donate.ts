// Donation Utilities

/**
 * Parse donation amount from string to bigint
 * @param amount - Amount as string
 * @param decimals - Token decimals (default: 6 for USDC/IDRX)
 * @returns Amount as bigint
 */
export const parseDonationAmount = (amount: string, decimals: number = 6): bigint => {
  return BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)));
};

/**
 * Format donation amount from bigint to string
 * @param amount - Amount as bigint
 * @param decimals - Token decimals (default: 6 for USDC/IDRX)
 * @returns Formatted amount string
 */
export const formatDonationAmount = (amount: bigint, decimals: number = 6): string => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(2);
};
