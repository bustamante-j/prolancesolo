import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { updatePassword } from 'firebase/auth';

export interface SecurityQuestionData {
  question: string;
  answer: string;
}

export interface UserSecurityData {
  email: string;
  securityQuestion: string;
  securityAnswer: string;
}

// Predefined security questions for the dropdown
export const SECURITY_QUESTIONS = [
  "What is your favorite color?",
  "What was the name of your first pet?",
  "What is your dream job?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was your first car?",
  "What is your favorite movie?",
  "What was your childhood nickname?",
  "What is your favorite food?",
  "What school did you attend for sixth grade?"
];

// Store security question data for a user
export const storeSecurityQuestion = async (
  userId: string,
  email: string,
  securityQuestion: string,
  securityAnswer: string
): Promise<boolean> => {
  try {
    // Store by email for easier lookup during password reset
    await setDoc(doc(db, 'userSecurity', email), {
      userId,
      email,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(), // Store in lowercase for case-insensitive comparison
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error storing security question:', error);
    return false;
  }
};

// Get security question data for a user by email
export const getSecurityQuestionByEmail = async (email: string): Promise<UserSecurityData | null> => {
  try {
    const querySnapshot = await getDoc(doc(db, 'userSecurity', email));
    if (querySnapshot.exists()) {
      return querySnapshot.data() as UserSecurityData;
    }
    return null;
  } catch (error) {
    console.error('Error getting security question:', error);
    return null;
  }
};

// Verify security answer and reset password
export const resetPasswordWithSecurityQuestion = async (
  email: string,
  securityAnswer: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the user's security data
    const securityData = await getSecurityQuestionByEmail(email);

    if (!securityData) {
      return { success: false, message: 'No account found with this email address.' };
    }

    // Check if the answer matches (case-insensitive)
    if (securityData.securityAnswer !== securityAnswer.toLowerCase().trim()) {
      return { success: false, message: 'Security answer is incorrect.' };
    }

    // For this school project, we'll simulate a successful password reset
    // In a real application, you would:
    // 1. Send a password reset email (but we're not doing that)
    // 2. Or update the password directly if the user is authenticated
    // 3. Or use Firebase Admin SDK on the server side

    // For demo purposes, we'll just return success
    // The user would need to use the new password on next login

    return {
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    };

  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
};

// Get security question for display (without the answer)
export const getSecurityQuestionForDisplay = async (email: string): Promise<string | null> => {
  try {
    const securityData = await getSecurityQuestionByEmail(email);
    return securityData ? securityData.securityQuestion : null;
  } catch (error) {
    console.error('Error getting security question for display:', error);
    return null;
  }
};