/**
 * Lex System: Web Haptics Engine
 * Objective: Enhance perceived mobile responsiveness by firing tactile vibrations on critical interactions.
 */

// Helper to safely trigger vibration if the browser supports it
const triggerVibration = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
            window.navigator.vibrate(pattern);
        } catch (e) {
            // Silently fail on unsupported browsers or strict security policies
            console.warn("Haptics muted or unsupported.");
        }
    }
};

export const haptics = {
    // Light, quick tap for general navigation or button clicks (e.g., Opening a modal)
    lightTap: () => triggerVibration(10),

    // Medium tap for primary actions (e.g., 'Authenticate', 'Get Started')
    mediumTap: () => triggerVibration(30),

    // Heavy tap for destructive or major state changes (e.g., 'Sign Out')
    heavyTap: () => triggerVibration(50),

    // Success pattern: two quick bursts
    success: () => triggerVibration([20, 50, 20]),

    // Error/Deny pattern: strong, jarring shake (B.L.A.S.T UX Rule 2)
    error: () => triggerVibration([50, 50, 50, 50, 100])
};
