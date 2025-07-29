const mongoose = require("mongoose");
const { config } = require("@config/environment");

class DatabaseConnection {
  static instance;
  isConnected = false;

  constructor() {}

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect() {
    if (this.isConnected) {
      console.log("Database já está conectado");
      return;
    }

    try {
      const uri = config.server.nodeEnv === "test" 
        ? config.database.testUri || config.database.uri
        : config.database.uri;

      await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      console.log("✅ Conectado ao MongoDB com sucesso");

      // Event listeners
      mongoose.connection.on("error", (error) => {
        console.error("❌ Erro na conexão com MongoDB:", error);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("⚠️ Desconectado do MongoDB");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        console.log("🔄 Reconectado ao MongoDB");
        this.isConnected = true;
      });

    } catch (error) {
      console.error("❌ Erro ao conectar com MongoDB:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("✅ Desconectado do MongoDB com sucesso");
    } catch (error) {
      console.error("❌ Erro ao desconectar do MongoDB:", error);
      throw error;
    }
  }

  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: "error", message: "Database não está conectado" };
      }

      // Testa a conexão fazendo um ping
      if (!mongoose.connection.db) {
        return { status: "error", message: "Database connection object is undefined" };
      }
      await mongoose.connection.db.admin().ping();
      
      return { 
        status: "healthy", 
        message: "Database está funcionando corretamente" 
      };
    } catch (error) {
      return { 
        status: "error", 
        message: `Erro no health check: ${error instanceof Error ? error.message : "Erro desconhecido"}` 
      };
    }
  }
}

const database = DatabaseConnection.getInstance();

module.exports = { database };


