"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_js_1 = require("./utils/config.js");
const logger_js_1 = require("./utils/logger.js");
const webhook_js_1 = require("./retell/webhook.js");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Mount webhook routes
app.use('/', webhook_js_1.webhookRouter);
// Start server
app.listen(config_js_1.config.PORT, () => {
    logger_js_1.logger.info({ port: config_js_1.config.PORT }, 'AI Voice Outbound server started');
});
exports.default = app;
//# sourceMappingURL=index.js.map