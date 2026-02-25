export interface RetellWebhookEvent {
    event: 'call.started' | 'call.ended' | 'call.transcript' | 'call.updated';
    call_id: string;
    call_details?: {
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
    };
}
declare const router: import("express-serve-static-core").Router;
export { router as webhookRouter };
//# sourceMappingURL=webhook.d.ts.map