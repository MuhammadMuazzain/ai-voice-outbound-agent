"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retellClient = exports.RetellClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_js_1 = require("../utils/config.js");
const logger_js_1 = require("../utils/logger.js");
const RETELL_API_BASE = 'https://api.retell.ai';
class RetellClient {
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: RETELL_API_BASE,
            headers: {
                Authorization: `Bearer ${config_js_1.config.RETELL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Create a new call session
     */
    async createCallSession(params) {
        try {
            const response = await this.client.post('/create-call', {
                agent_id: params.agentId,
                to_number: params.phoneNumber,
                from_number: params.fromNumber,
                metadata: params.metadata,
            });
            logger_js_1.logger.info({ callId: response.data.call_id }, 'Call session created');
            return {
                callId: response.data.call_id,
                status: 'queued',
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_js_1.logger.error({ error: error.response?.data }, 'Failed to create call session');
                throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get call details
     */
    async getCallDetails(callId) {
        try {
            const response = await this.client.get(`/get-call/${callId}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_js_1.logger.error({ error: error.response?.data }, 'Failed to get call details');
                throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    /**
     * End an active call
     */
    async endCall(callId) {
        try {
            await this.client.post('/end-call', { call_id: callId });
            logger_js_1.logger.info({ callId }, 'Call ended');
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_js_1.logger.error({ error: error.response?.data }, 'Failed to end call');
                throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get available phone numbers
     */
    async getAvailablePhoneNumbers(areaCode) {
        try {
            const response = await this.client.get('/get-available-phone-numbers', {
                params: { area_code: areaCode },
            });
            return response.data.phone_numbers || [];
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_js_1.logger.error({ error: error.response?.data }, 'Failed to get available phone numbers');
                throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
}
exports.RetellClient = RetellClient;
exports.retellClient = new RetellClient();
//# sourceMappingURL=client.js.map