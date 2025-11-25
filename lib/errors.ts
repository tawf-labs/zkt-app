/**
 * Blockchain Error Handling Utilities
 * Provides consistent error messages and handling for wallet/transaction errors
 */

export type WalletError = 
  | "not-connected"
  | "wrong-network"
  | "insufficient-balance"
  | "user-rejected"
  | "rpc-error"
  | "unknown";

export interface ErrorHandlerOptions {
  title?: string;
  description?: string;
  retry?: () => void;
  retryLabel?: string;
  toast?: any; // Toast function from useToast hook
}

/**
 * Handle wallet connection errors
 */
export function handleWalletError(error: unknown, options?: ErrorHandlerOptions) {
  const errorType = categorizeError(error);
  const toastFn = options?.toast || console.error;
  
  if (typeof toastFn !== 'function') {
    console.error('Invalid toast function provided');
    return;
  }
  
  switch (errorType) {
    case "not-connected":
      toastFn({
        variant: "destructive",
        title: options?.title || "Wallet Not Connected",
        description: options?.description || "Please connect your wallet to continue",
      });
      break;
      
    case "wrong-network":
      toastFn({
        variant: "destructive",
        title: options?.title || "Wrong Network",
        description: options?.description || "Please switch to Base Sepolia network",
      });
      break;
      
    case "insufficient-balance":
      const requiredAmount = extractRequiredAmount(error);
      toastFn({
        variant: "destructive",
        title: options?.title || "Insufficient Balance",
        description: requiredAmount 
          ? `You need at least ${requiredAmount} IDRX to complete this transaction`
          : options?.description || "Your wallet doesn't have enough funds",
      });
      break;
      
    case "user-rejected":
      // Silent dismiss for user-rejected transactions
      console.log("Transaction rejected by user");
      break;
      
    case "rpc-error":
      toastFn({
        variant: "destructive",
        title: options?.title || "Network Error",
        description: options?.description || "Unable to connect to blockchain. Please try again.",
      });
      break;
      
    default:
      toastFn({
        variant: "destructive",
        title: options?.title || "Transaction Failed",
        description: options?.description || "An unexpected error occurred. Please try again.",
      });
  }
}

/**
 * Handle transaction errors with retry logic
 */
export function handleTransactionError(error: unknown, options?: ErrorHandlerOptions & { action?: string }) {
  const toastFn = options?.toast || console.error;
  
  if (typeof toastFn !== 'function') {
    console.error('Invalid toast function provided');
    return;
  }
  
  const errorType = categorizeError(error);
  const action = options?.action || "transaction";
  
  switch (errorType) {
    case "user-rejected":
      console.log(`User rejected ${action}`);
      break;
      
    case "insufficient-balance":
      toastFn({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `You don't have enough tokens to complete this ${action}`,
      });
      break;
      
    case "rpc-error":
      toastFn({
        variant: "destructive",
        title: "Network Error",
        description: `Failed to ${action}. Please check your connection and try again.`,
      });
      break;
      
    default:
      toastFn({
        variant: "destructive",
        title: "Transaction Failed",
        description: `Failed to ${action}. ${formatErrorMessage(error)}`,
      });
  }
}

/**
 * Handle RPC errors with exponential backoff retry
 */
export async function handleRPCError<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (isRPCError(error) && attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Categorize error type
 */
function categorizeError(error: unknown): WalletError {
  if (!error) return "unknown";
  
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  if (errorMessage.includes("user rejected") || errorMessage.includes("user denied")) {
    return "user-rejected";
  }
  
  if (errorMessage.includes("insufficient") || errorMessage.includes("balance")) {
    return "insufficient-balance";
  }
  
  if (errorMessage.includes("network") || errorMessage.includes("chain")) {
    return "wrong-network";
  }
  
  if (errorMessage.includes("rpc") || errorMessage.includes("fetch") || errorMessage.includes("timeout")) {
    return "rpc-error";
  }
  
  if (errorMessage.includes("connect") || errorMessage.includes("wallet")) {
    return "not-connected";
  }
  
  return "unknown";
}

/**
 * Check if error is RPC-related
 */
function isRPCError(error: unknown): boolean {
  if (!error) return false;
  const errorMessage = String(error).toLowerCase();
  return errorMessage.includes("rpc") || errorMessage.includes("fetch") || errorMessage.includes("network");
}

/**
 * Extract required amount from error message
 */
function extractRequiredAmount(error: unknown): string | null {
  if (!error) return null;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  const match = errorMessage.match(/(\d+(\.\d+)?)\s*(IDRX|wei|ether)/i);
  
  return match ? match[1] : null;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred";
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
}
