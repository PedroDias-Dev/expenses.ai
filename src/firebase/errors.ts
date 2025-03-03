/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Maps Firebase authentication error codes to user-friendly messages
 */
export const firebaseAuthErrorMessages: Record<string, string> = {
  // Email/password authentication errors
  "auth/email-already-in-use":
    "This email address is already being used by another account.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support for assistance.",
  "auth/user-not-found":
    "No account found with this email address. Please check your email or sign up.",
  "auth/wrong-password":
    "Incorrect password. Please try again or reset your password.",
  "auth/invalid-credential":
    "Invalid login credentials. Please check your email and password.",
  "auth/weak-password":
    "Your password is too weak. Please choose a stronger password (at least 6 characters).",
  "auth/too-many-requests":
    "Access temporarily blocked due to many failed login attempts. Please try again later or reset your password.",
  "auth/invalid-login-credentials":
    "Incorrect email or password. Please try again.",

  // Account linking/credential errors
  "auth/credential-already-in-use":
    "This account is already linked to another user.",
  "auth/operation-not-allowed":
    "This login method is not enabled. Please contact support.",
  "auth/provider-already-linked":
    "Your account is already linked with this provider.",
  "auth/invalid-verification-code":
    "Invalid verification code. Please try again with a new code.",
  "auth/invalid-verification-id":
    "Invalid verification ID. Please request a new verification code.",

  // Password reset errors
  "auth/expired-action-code":
    "This password reset link has expired. Please request a new one.",
  "auth/invalid-action-code":
    "This password reset link is invalid. It may have been used already or is malformed.",

  // General errors
  "auth/network-request-failed":
    "Network error. Please check your internet connection and try again.",
  "auth/internal-error": "An internal error occurred. Please try again later.",
  "auth/popup-closed-by-user":
    "Sign-in popup was closed before completing the process. Please try again.",
  "auth/timeout": "The operation has timed out. Please try again.",
  "auth/quota-exceeded": "Service quota exceeded. Please try again later.",
  "auth/requires-recent-login":
    "This action requires a recent login. Please log in again and retry.",
  "auth/user-token-expired": "Your session has expired. Please log in again.",

  // Multi-factor authentication errors
  "auth/second-factor-already-in-use":
    "This second factor is already associated with a different account.",
  "auth/maximum-second-factor-count-exceeded":
    "Maximum number of second factors already added to this account.",

  // Default error message
  default: "An error occurred during authentication. Please try again later.",
};

/**
 * Transforms Firebase authentication error messages into user-friendly messages
 *
 * @param error - Firebase auth error object or error code string
 * @returns User-friendly error message
 */
export function getReadableAuthError(error: any): string {
  // Handle different error input formats
  let errorCode: string;

  if (typeof error === "string") {
    // If error is directly a string code
    errorCode = error;
  } else if (error && typeof error === "object") {
    // Firebase errors might be in different formats
    errorCode =
      error.code ||
      (error.message && error.message.includes("auth/")
        ? `auth/${error.message.split("auth/")[1].split(")")[0]}`
        : "");
  } else {
    // Unknown error format
    errorCode = "";
  }

  // Return the mapped user-friendly message or default message
  return (
    firebaseAuthErrorMessages[errorCode] ||
    (errorCode.startsWith("auth/")
      ? `Authentication error: ${errorCode.replace("auth/", "")}`
      : firebaseAuthErrorMessages["default"])
  );
}

/**
 * Example usage with try/catch for handling Firebase auth operations
 */
export function handleAuthOperation(
  callback: () => Promise<any>
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await callback();
      resolve(result);
    } catch (error) {
      const friendlyMessage = getReadableAuthError(error);
      console.error("Auth error:", error);
      reject({
        originalError: error,
        message: friendlyMessage,
      });
    }
  });
}
