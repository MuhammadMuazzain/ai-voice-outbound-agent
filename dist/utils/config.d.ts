import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    RETELL_API_KEY: z.ZodString;
    RETELL_AGENT_ID: z.ZodString;
    GHL_API_KEY: z.ZodString;
    GHL_LOCATION_ID: z.ZodString;
    GHL_CALENDAR_ID: z.ZodString;
    PORT: z.ZodDefault<z.ZodString>;
    WEBHOOK_URL: z.ZodString;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
}, "strip", z.ZodTypeAny, {
    RETELL_API_KEY: string;
    RETELL_AGENT_ID: string;
    GHL_API_KEY: string;
    GHL_LOCATION_ID: string;
    GHL_CALENDAR_ID: string;
    PORT: string;
    WEBHOOK_URL: string;
    NODE_ENV: "development" | "production" | "test";
}, {
    RETELL_API_KEY: string;
    RETELL_AGENT_ID: string;
    GHL_API_KEY: string;
    GHL_LOCATION_ID: string;
    GHL_CALENDAR_ID: string;
    WEBHOOK_URL: string;
    PORT?: string | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
}>;
export type Config = z.infer<typeof configSchema>;
export declare const config: {
    RETELL_API_KEY: string;
    RETELL_AGENT_ID: string;
    GHL_API_KEY: string;
    GHL_LOCATION_ID: string;
    GHL_CALENDAR_ID: string;
    PORT: string;
    WEBHOOK_URL: string;
    NODE_ENV: "development" | "production" | "test";
};
export {};
//# sourceMappingURL=config.d.ts.map