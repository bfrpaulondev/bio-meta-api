"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.DatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("@config/environment");
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    async connect() {
        if (this.isConnected) {
            console.log('Database já está conectado');
            return;
        }
        try {
            const uri = environment_1.config.server.nodeEnv === 'test'
                ? environment_1.config.database.testUri || environment_1.config.database.uri
                : environment_1.config.database.uri;
            await mongoose_1.default.connect(uri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            this.isConnected = true;
            console.log('✅ Conectado ao MongoDB com sucesso');
            mongoose_1.default.connection.on('error', (error) => {
                console.error('❌ Erro na conexão com MongoDB:', error);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('⚠️ Desconectado do MongoDB');
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('reconnected', () => {
                console.log('🔄 Reconectado ao MongoDB');
                this.isConnected = true;
            });
        }
        catch (error) {
            console.error('❌ Erro ao conectar com MongoDB:', error);
            this.isConnected = false;
            throw error;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('✅ Desconectado do MongoDB com sucesso');
        }
        catch (error) {
            console.error('❌ Erro ao desconectar do MongoDB:', error);
            throw error;
        }
    }
    getConnectionStatus() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
    async healthCheck() {
        try {
            if (!this.isConnected) {
                return { status: 'error', message: 'Database não está conectado' };
            }
            await mongoose_1.default.connection.db.admin().ping();
            return {
                status: 'healthy',
                message: 'Database está funcionando corretamente'
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `Erro no health check: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            };
        }
    }
}
exports.DatabaseConnection = DatabaseConnection;
exports.database = DatabaseConnection.getInstance();
//# sourceMappingURL=connection.js.map