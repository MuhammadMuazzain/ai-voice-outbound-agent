import { CallSession } from './client.js';
export interface CallOptions {
    phoneNumber: string;
    businessName: string;
    contactName?: string;
    purpose?: 'partnership_discussion' | 'service_inquiry' | 'follow_up' | 'custom';
    customMessage?: string;
}
/**
 * Initiate an outbound call to a business
 */
export declare function makeOutboundCall(options: CallOptions): Promise<CallSession>;
/**
 * Check the status of a call
 */
export declare function getCallStatus(callId: string): Promise<string>;
/**
 * Wait for call to complete (polling)
 */
export declare function waitForCallCompletion(callId: string, maxWaitTimeMs?: number, pollIntervalMs?: number): Promise<string>;
//# sourceMappingURL=call-handler.d.ts.map