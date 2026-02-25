import axios, { AxiosInstance } from 'axios';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const RETELL_API_BASE = 'https://api.retell.ai';

export class RetellClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: RETELL_API_BASE,
      headers: {
        Authorization: `Bearer ${config.RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create a new call session
   */
  async createCallSession(params: {
    agentId: string;
    phoneNumber: string;
    fromNumber?: string;
    metadata?: Record<string, string>;
  }): Promise<CallSession> {
    try {
      const response = await this.client.post('/create-call', {
        agent_id: params.agentId,
        to_number: params.phoneNumber,
        from_number: params.fromNumber,
        metadata: params.metadata,
      });

      logger.info({ callId: response.data.call_id }, 'Call session created');
      return {
        callId: response.data.call_id,
        status: 'queued',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error({ error: error.response?.data }, 'Failed to create call session');
        throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get call details
   */
  async getCallDetails(callId: string): Promise<CallDetails> {
    try {
      const response = await this.client.get(`/get-call/${callId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error({ error: error.response?.data }, 'Failed to get call details');
        throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * End an active call
   */
  async endCall(callId: string): Promise<void> {
    try {
      await this.client.post('/end-call', { call_id: callId });
      logger.info({ callId }, 'Call ended');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error({ error: error.response?.data }, 'Failed to end call');
        throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get available phone numbers
   */
  async getAvailablePhoneNumbers(areaCode?: string): Promise<string[]> {
    try {
      const response = await this.client.get('/get-available-phone-numbers', {
        params: { area_code: areaCode },
      });
      return response.data.phone_numbers || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error({ error: error.response?.data }, 'Failed to get available phone numbers');
        throw new Error(`Retell API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}

export interface CallSession {
  callId: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
}

export interface CallDetails {
  call_id: string;
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
}

export const retellClient = new RetellClient();
