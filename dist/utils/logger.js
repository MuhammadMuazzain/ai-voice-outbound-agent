"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const config_js_1 = require("./config.js");
const isDevelopment = config_js_1.config.NODE_ENV === 'development';
exports.logger = (0, pino_1.default)({
    level: 'info',
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
//# sourceMappingURL=logger.js.map