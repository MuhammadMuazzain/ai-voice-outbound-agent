"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOutboundCall = makeOutboundCall;
exports.getCallStatus = getCallStatus;
exports.waitForCallCompletion = waitForCallCompletion;
const client_js_1 = require("./client.js");
const config_js_1 = require("../utils/config.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * Initiate an outbound call to a business
 */
async function makeOutboundCall(options) {
    logger_js_1.logger.info({
        phoneNumber: options.phoneNumber,
        businessName: options.businessName,
        purpose: options.purpose,
    }, 'Initiating outbound call');
    try {
        const callSession = await client_js_1.retellClient.createCallSession({
            agentId: config_js_1.config.RETELL_AGENT_ID,
            phoneNumber: options.phoneNumber,
            metadata: {
                business_name: options.businessName,
                contact_name: options.contactName || 'Unknown',
                call_purpose: options.purpose || 'partnership_discussion',
                custom_message: options.customMessage || '',
            },
        });
        logger_js_1.logger.info({ callId: callSession.callId, status: callSession.status }, 'Call initiated successfully');
        return callSession;
    }
    catch (error) {
        logger_js_1.logger.error({ error, phoneNumber: options.phoneNumber }, 'Failed to initiate call');
        throw error;
    }
}
/**
 * Check the status of a call
 */
async function getCallStatus(callId) {
    try {
        const details = await client_js_1.retellClient.getCallDetails(callId);
        return details.status;
    }
    catch (error) {
        logger_js_1.logger.error({ error, callId }, 'Failed to get call status');
        throw error;
    }
}
/**
 * Wait for call to complete (polling)
 */
async function waitForCallCompletion(callId, maxWaitTimeMs = 10 * 60 * 1000, pollIntervalMs = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitTimeMs) {
        const status = await getCallStatus(callId);
        logger_js_1.logger.info({ callId, status }, 'Call status update');
        if (['completed', 'failed', 'no-answer'].includes(status)) {
            return status;
        }
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
    throw new Error(`Call ${callId} did not complete within ${maxWaitTimeMs}ms`);
}
//# sourceMappingURL=call-handler.js.map