export declare const config: {
    database: {
        uri: string;
        testUri: string | undefined;
    };
    server: {
        port: number;
        host: string;
        nodeEnv: "development" | "production" | "test";
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    openai: {
        apiKey: string;
        baseUrl: string;
        model: string;
        maxTokens: number;
    };
    redis: {
        url: string | undefined;
    };
    upload: {
        maxFileSize: number;
        allowedFileTypes: string[];
    };
    externalApis: {
        edamam: {
            appId: string | undefined;
            appKey: string | undefined;
        };
        oneSignal: {
            appId: string | undefined;
            restApiKey: string | undefined;
        };
        cloudinary: {
            cloudName: string | undefined;
            apiKey: string | undefined;
            apiSecret: string | undefined;
        };
    };
    rateLimit: {
        max: number;
        window: number;
    };
    logging: {
        level: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
        file: string;
    };
};
export default config;
//# sourceMappingURL=environment.d.ts.map