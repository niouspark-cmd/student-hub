'use client';

import ProtocolGuard from './ProtocolGuard';

/**
 * MaintenanceGuard
 * 
 * Enforces the System-Wide Quarantine Protocol.
 * Maps directly to the established ProtocolGuard logic which checks
 * the central SystemSettings for active/inactive features.
 */
export default function MaintenanceGuard(props: any) {
    return <ProtocolGuard {...props} />;
}
