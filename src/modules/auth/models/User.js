const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
  },
  password: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: [6, "Senha deve ter pelo menos 6 caracteres"],
    select: false // Por padrão, não incluir a senha nas consultas
  },
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true,
    maxlength: [100, "Nome deve ter no máximo 100 caracteres"]
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Middleware para hash da senha antes de salvar
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Erro ao comparar senhas");
  }
};

// Método para retornar perfil público do usuário
userSchema.methods.toProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Middleware para garantir que senhas modificadas sejam hasheadas
userSchema.pre("findOneAndUpdate", async function(next) {
  const update = this.getUpdate();
  
  if (update && update.password) {
    try {
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = { User };


