"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghlClient = exports.GHLClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_js_1 = require("../utils/config.js");
const logger_js_1 = require("../utils/logger.js");
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
class GHLClient {
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: GHL_API_BASE,
            headers: {
                Authorization: `Bearer ${config_js_1.config.GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28',
            },
        });
        // Response interceptor for logging and error handling
        this.client.interceptors.response.use((response) => response, (error) => {
            logger_js_1.logger.error({
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
            }, 'GHL API Error');
            // Handle rate limiting
            if (error.response?.status === 429) {
                logger_js_1.logger.warn('GHL rate limit hit, consider implementing retry logic');
            }
            return Promise.reject(error);
        });
    }
    /**
     * Generic GET request
     */
    async get(endpoint, params) {
        const response = await this.client.get(endpoint, { params });
        return response.data;
    }
    /**
     * Generic POST request
     */
    async post(endpoint, data) {
        const response = await this.client.post(endpoint, data);
        return response.data;
    }
    /**
     * Generic PUT request
     */
    async put(endpoint, data) {
        const response = await this.client.put(endpoint, data);
        return response.data;
    }
    /**
     * Generic DELETE request
     */
    async delete(endpoint) {
        const response = await this.client.delete(endpoint);
        return response.data;
    }
}
exports.GHLClient = GHLClient;
exports.ghlClient = new GHLClient();
//# sourceMappingURL=client.js.map