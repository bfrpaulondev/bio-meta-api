import mongoose from 'mongoose';
import { config } from '@config/environment';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database já está conectado');
      return;
    }

    try {
      const uri = config.server.nodeEnv === 'test' 
        ? config.database.testUri || config.database.uri
        : config.database.uri;

      await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      console.log('✅ Conectado ao MongoDB com sucesso');

      // Event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ Erro na conexão com MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Desconectado do MongoDB');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 Reconectado ao MongoDB');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('❌ Erro ao conectar com MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Desconectado do MongoDB com sucesso');
    } catch (error) {
      console.error('❌ Erro ao desconectar do MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      if (!this.isConnected) {
        return { status: 'error', message: 'Database não está conectado' };
      }

      // Testa a conexão fazendo um ping
      await mongoose.connection.db.admin().ping();
      
      return { 
        status: 'healthy', 
        message: 'Database está funcionando corretamente' 
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: `Erro no health check: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      };
    }
  }
}

export const database = DatabaseConnection.getInstance();

