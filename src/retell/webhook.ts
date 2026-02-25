import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { updateContactWithCallOutcome } from '../ghl/calendar.js';

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

const router = Router();

/**
 * Webhook endpoint for Retell AI events
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const event: RetellWebhookEvent = req.body;

  logger.info({ event: event.event, callId: event.call_id }, 'Webhook received');

  try {
    // Acknowledge receipt immediately
    res.status(200).json({ received: true });

    // Process the event asynchronously
    await processWebhookEvent(event);
  } catch (error) {
    logger.error({ error, event }, 'Error processing webhook');
    // Still return 200 to prevent retries for non-critical errors
    res.status(200).json({ received: true, error: 'Processing error' });
  }
});

/**
 * Process different webhook event types
 */
async function processWebhookEvent(event: RetellWebhookEvent): Promise<void> {
  switch (event.event) {
    case 'call.started':
      await handleCallStarted(event);
      break;

    case 'call.ended':
      await handleCallEnded(event);
      break;

    case 'call.transcript':
      await handleCallTranscript(event);
      break;

    case 'call.updated':
      await handleCallUpdated(event);
      break;

    default:
      logger.warn({ event: event.event }, 'Unknown webhook event type');
  }
}

/**
 * Handle call.started event
 */
async function handleCallStarted(event: RetellWebhookEvent): Promise<void> {
  logger.info({ callId: event.call_id }, 'Call started');

  // Log the call start - could add to database or CRM
  const metadata = event.call_details?.metadata;
  if (metadata) {
    logger.info(
      {
        businessName: metadata.business_name,
        contactName: metadata.contact_name,
        purpose: metadata.call_purpose,
      },
      'Outbound call initiated'
    );
  }
}

/**
 * Handle call.ended event
 */
async function handleCallEnded(event: RetellWebhookEvent): Promise<void> {
  logger.info({ callId: event.call_id }, 'Call ended');

  const details = event.call_details;
  if (!details) return;

  // Determine call outcome
  const status = mapCallStatus(details.status);
  const transcript = details.transcript
    ? details.transcript.map((t) => `${t.role}: ${t.content}`).join('\n')
    : '';

  logger.info(
    {
      callId: event.call_id,
      status,
      duration: details.end_timestamp && details.start_timestamp
        ? Math.round((details.end_timestamp - details.start_timestamp) / 1000)
        : undefined,
    },
    'Call completed'
  );

  // Update GHL contact with call outcome if we have contact info
  const metadata = details.metadata;
  if (metadata?.contact_id) {
    await updateContactWithCallOutcome(metadata.contact_id, {
      callId: event.call_id,
      status,
      transcript,
      notes: `Call with ${metadata.business_name || 'unknown business'}`,
    });
  }
}

/**
 * Handle call.transcript event (real-time transcript updates)
 */
async function handleCallTranscript(event: RetellWebhookEvent): Promise<void> {
  const transcript = event.call_details?.transcript;
  if (transcript && transcript.length > 0) {
    const lastEntry = transcript[transcript.length - 1];
    logger.debug(
      { callId: event.call_id, role: lastEntry.role },
      `Transcript: ${lastEntry.content.substring(0, 50)}...`
    );
  }
}

/**
 * Handle call.updated event
 */
async function handleCallUpdated(event: RetellWebhookEvent): Promise<void> {
  logger.info({ callId: event.call_id, status: event.call_details?.status }, 'Call updated');
}

/**
 * Map Retell status to our internal status
 */
function mapCallStatus(retellStatus: string): 'completed' | 'no-answer' | 'failed' {
  switch (retellStatus) {
    case 'completed':
      return 'completed';
    case 'no-answer':
    case 'busy':
      return 'no-answer';
    default:
      return 'failed';
  }
}

export { router as webhookRouter };
