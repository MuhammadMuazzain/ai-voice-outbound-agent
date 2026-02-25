import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

export class GHLClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: GHL_API_BASE,
      headers: {
        Authorization: `Bearer ${config.GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
    });

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        logger.error(
          {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          },
          'GHL API Error'
        );

        // Handle rate limiting
        if (error.response?.status === 429) {
          logger.warn('GHL rate limit hit, consider implementing retry logic');
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }
}

export const ghlClient = new GHLClient();
