'use client';

import MaintenanceLockdown from './MaintenanceLockdown';

interface FeatureDisabledProps {
    feature: string;
}

export default function FeatureDisabled({ feature }: FeatureDisabledProps) {
    const featureMessages: Record<string, string> = {
        'Marketplace': 'The digital marketplace is currently being optimized. New inventory algorithms are being deployed.',
        'Campus Pulse': 'Our social feed is getting a major upgrade. Expect enhanced storytelling features soon.',
        'Runner Mode': 'The delivery network is being recalibrated. Enhanced logistics coming online shortly.',
        'Vendor Terminal': 'Business tools are being enhanced. Advanced vendor features are being installed.',
        'Escrow': 'Payment protection systems are being upgraded for enhanced security.'
    };

    return (
        <MaintenanceLockdown
            title="Feature Offline"
            message={featureMessages[feature] || `The ${feature} feature is currently under maintenance. We're making it better for you.`}
            feature={feature}
        />
    );
}
