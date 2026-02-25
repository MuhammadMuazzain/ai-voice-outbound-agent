export declare class RetellClient {
    private client;
    constructor();
    /**
     * Create a new call session
     */
    createCallSession(params: {
        agentId: string;
        phoneNumber: string;
        fromNumber?: string;
        metadata?: Record<string, string>;
    }): Promise<CallSession>;
    /**
     * Get call details
     */
    getCallDetails(callId: string): Promise<CallDetails>;
    /**
     * End an active call
     */
    endCall(callId: string): Promise<void>;
    /**
     * Get available phone numbers
     */
    getAvailablePhoneNumbers(areaCode?: string): Promise<string[]>;
}
export interface CallSession {
    callId: string;
    status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
}
export interface CallDetails {
    call_id: string;
    status: string;
    to_number: string;
    from_number: string;
    agent_id: string;
    start_timestamp?: number;
    end_timestamp?: number;
    transcript?: Array<{
        role: 'agent' | 'user';
        content: string;
        timestamp: number;
    }>;
    metadata?: Record<string, string>;
}
export declare const retellClient: RetellClient;
//# sourceMappingURL=client.d.ts.map