"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const configSchema = zod_1.z.object({
    // Retell AI
    RETELL_API_KEY: zod_1.z.string().min(1, 'RETELL_API_KEY is required'),
    RETELL_AGENT_ID: zod_1.z.string().min(1, 'RETELL_AGENT_ID is required'),
    // GoHighLevel
    GHL_API_KEY: zod_1.z.string().min(1, 'GHL_API_KEY is required'),
    GHL_LOCATION_ID: zod_1.z.string().min(1, 'GHL_LOCATION_ID is required'),
    GHL_CALENDAR_ID: zod_1.z.string().min(1, 'GHL_CALENDAR_ID is required'),
    // Server
    PORT: zod_1.z.string().default('3000'),
    WEBHOOK_URL: zod_1.z.string().url(),
    // Optional
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
});
function loadConfig() {
    const result = configSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Configuration Error:');
        Object.entries(result.error.flatten().fieldErrors).forEach(([key, errors]) => {
            console.error(`  ${key}: ${errors.join(', ')}`);
        });
        console.error('\nPlease copy .env.example to .env and fill in your credentials.');
        process.exit(1);
    }
    return result.data;
}
exports.config = loadConfig();
//# sourceMappingURL=config.js.map