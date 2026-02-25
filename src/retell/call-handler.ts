import { retellClient, CallSession } from './client.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

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
export async function makeOutboundCall(options: CallOptions): Promise<CallSession> {
  logger.info(
    {
      phoneNumber: options.phoneNumber,
      businessName: options.businessName,
      purpose: options.purpose,
    },
    'Initiating outbound call'
  );

  try {
    const callSession = await retellClient.createCallSession({
      agentId: config.RETELL_AGENT_ID,
      phoneNumber: options.phoneNumber,
      metadata: {
        business_name: options.businessName,
        contact_name: options.contactName || 'Unknown',
        call_purpose: options.purpose || 'partnership_discussion',
        custom_message: options.customMessage || '',
      },
    });

    logger.info(
      { callId: callSession.callId, status: callSession.status },
      'Call initiated successfully'
    );

    return callSession;
  } catch (error) {
    logger.error({ error, phoneNumber: options.phoneNumber }, 'Failed to initiate call');
    throw error;
  }
}

/**
 * Check the status of a call
 */
export async function getCallStatus(callId: string): Promise<string> {
  try {
    const details = await retellClient.getCallDetails(callId);
    return details.status;
  } catch (error) {
    logger.error({ error, callId }, 'Failed to get call status');
    throw error;
  }
}

/**
 * Wait for call to complete (polling)
 */
export async function waitForCallCompletion(
  callId: string,
  maxWaitTimeMs: number = 10 * 60 * 1000,
  pollIntervalMs: number = 5000
): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTimeMs) {
    const status = await getCallStatus(callId);

    logger.info({ callId, status }, 'Call status update');

    if (['completed', 'failed', 'no-answer'].includes(status)) {
      return status;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Call ${callId} did not complete within ${maxWaitTimeMs}ms`);
}
