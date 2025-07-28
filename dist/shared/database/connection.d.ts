export declare class DatabaseConnection {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): DatabaseConnection;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnectionStatus(): boolean;
    healthCheck(): Promise<{
        status: string;
        message: string;
    }>;
}
export declare const database: DatabaseConnection;
//# sourceMappingURL=connection.d.ts.map