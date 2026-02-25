export declare class GHLClient {
    private client;
    constructor();
    /**
     * Generic GET request
     */
    get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T>;
    /**
     * Generic POST request
     */
    post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T>;
    /**
     * Generic PUT request
     */
    put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T>;
    /**
     * Generic DELETE request
     */
    delete<T>(endpoint: string): Promise<T>;
}
export declare const ghlClient: GHLClient;
//# sourceMappingURL=client.d.ts.map