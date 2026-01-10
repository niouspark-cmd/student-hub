import RadarBase from 'radar-sdk-js';

const Radar = (RadarBase as any).default || RadarBase;

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    console.warn('Radar Publishable Key is missing! Location features will not work.');
}

/**
 * Initialize Radar SDK with the project's publishable key.
 * Should be called once at app startup (e.g., in a Context Provider).
 */
export const initializeRadar = () => {
    if (typeof window !== 'undefined' && PUBLISHABLE_KEY) {
        Radar.initialize(PUBLISHABLE_KEY);
    }
};

/**
 * Set the user ID for tracking.
 */
export const setUserId = (userId: string) => {
    if (typeof window !== 'undefined' && Radar) {
        Radar.setUserId(userId);
    }
};

/**
 * Set metadata for the user.
 */
export const setMetadata = (metadata: Record<string, any>) => {
    if (typeof window !== 'undefined' && Radar) {
        Radar.setMetadata(metadata);
    }
};

// Tracking state for Web SDK simulation
let trackingInterval: NodeJS.Timeout | null = null;

// Intervals in milliseconds
const INTERVAL_RESPONSIVE = 10000; // 10 seconds (Runners)
const INTERVAL_EFFICIENT = 300000; // 5 minutes (Students)

/**
 * Request location permissions and start tracking via periodic trackOnce calls.
 * Web SDK does not support background presets, so we simulate them with intervals.
 * @param mode 'RESPONSIVE' (Runners - high frequency) or 'EFFICIENT' (Students - low frequency)
 * @param backgroundRequest Ignored on web, kept for signature compatibility.
 */
export const startTracking = async (mode: 'RESPONSIVE' | 'EFFICIENT' = 'EFFICIENT', backgroundRequest: boolean = false) => {
    if (!PUBLISHABLE_KEY) return;

    try {
        // Clear any existing tracking to avoid duplicates
        if (trackingInterval) {
            clearInterval(trackingInterval);
            trackingInterval = null;
        }

        console.log(`Radar tracking initializing in ${mode} mode...`);

        // 1. Initial Track (Checks permissions)
        await trackOnce();

        // 2. Set up interval for continuous tracking
        const intervalMs = mode === 'RESPONSIVE' ? INTERVAL_RESPONSIVE : INTERVAL_EFFICIENT;

        trackingInterval = setInterval(async () => {
            // console.log(`Radar tracking update (${mode})...`);
            try {
                await trackOnce();
            } catch (e) {
                console.error("Tracking update failed", e);
            }
        }, intervalMs);

    } catch (error) {
        console.error('Error starting Radar tracking:', error);
    }
};

/**
 * Stop tracking location.
 */
export const stopTracking = async () => {
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
        console.log('Radar tracking stopped (interval cleared).');
    }
};

let lastTrackTime = 0;

/**
 * Manually update the user's location (one-off).
 * Includes a simple 2-second throttle to prevent Rate Limit errors during React Strict Mode or rapid updates.
 */
export const trackOnce = async () => {
    if (!PUBLISHABLE_KEY) return;

    // Throttle: Prevent calling more than once every 2 seconds
    const now = Date.now();
    if (now - lastTrackTime < 2000) {
        // console.log('Skipping Radar.trackOnce (Throttled)');
        return null;
    }

    try {
        lastTrackTime = now;
        // trackOnce() automatically handles permission prompt if needed
        const result = await Radar.trackOnce();
        return result;
    } catch (error: any) {
        // Gracefully handle Rate Limits
        if (error?.code === 'RATE_LIMIT' || error?.message?.includes('Rate limit')) {
            console.warn('Radar Rate Limit hit. Ignoring.');
            return null;
        }
        console.error('Error tracking once:', error);
        throw error;
    }
};
