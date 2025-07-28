import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';

export enum ItemCategory {
  PROTEIN = 'protein',
  CARBOHYDRATES = 'carbohydrates',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  DAIRY = 'dairy',
  SUPPLEMENTS = 'supplements',
  BEVERAGES = 'beverages',
  SNACKS = 'snacks',
  CONDIMENTS = 'condiments',
  OTHER = 'other'
}

export enum ItemPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ItemStatus {
  PENDING = 'pending',
  PURCHASED = 'purchased',
  OUT_OF_STOCK = 'out_of_stock',
  CANCELLED = 'cancelled'
}

export interface NutritionalInfo {
  calories?: number; // por 100g
  protein?: number; // em gramas
  carbs?: number; // em gramas
  fat?: number; // em gramas
  fiber?: number; // em gramas
  sugar?: number; // em gramas
  sodium?: number; // em mg
}

export interface PriceHistory {
  price: number;
  store: string;
  date: Date;
  onSale?: boolean;
  discount?: number; // percentual
}

export interface ShoppingItem extends UserOwnedDocument {
  name: string;
  description?: string;
  category: ItemCategory;
  quantity: number;
  unit: string; // kg, g, L, ml, unidades, etc.
  estimatedPrice?: number;
  actualPrice?: number;
  store?: string;
  brand?: string;
  priority: ItemPriority;
  status: ItemStatus;
  nutritionalInfo?: NutritionalInfo;
  priceHistory: PriceHistory[];
  notes?: string;
  imageUrl?: string;
  barcode?: string;
  expirationDate?: Date;
  purchasedAt?: Date;
  listId?: string; // referência para lista de compras
}

export interface ShoppingList extends UserOwnedDocument {
  name: string;
  description?: string;
  items: string[]; // IDs dos itens
  totalEstimatedCost: number;
  totalActualCost: number;
  store?: string;
  shoppingDate?: Date;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  tags?: string[];
}

export interface Store {
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  averageRating?: number;
  priceLevel?: 'low' | 'medium' | 'high'; // nível de preços
}

export interface Budget extends UserOwnedDocument {
  name: string;
  monthlyLimit: number;
  currentSpent: number;
  categories: {
    category: ItemCategory;
    limit: number;
    spent: number;
  }[];
  month: number; // 1-12
  year: number;
  alerts: {
    percentage: number; // 80% = alerta quando atingir 80% do orçamento
    enabled: boolean;
  };
}

const nutritionalInfoSchema = new Schema<NutritionalInfo>({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  sugar: Number,
  sodium: Number
});

const priceHistorySchema = new Schema<PriceHistory>({
  price: { type: Number, required: true },
  store: { type: String, required: true },
  date: { type: Date, default: Date.now },
  onSale: Boolean,
  discount: Number
});

const shoppingItemSchema = new Schema<ShoppingItem>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  category: { type: String, enum: Object.values(ItemCategory), required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  estimatedPrice: Number,
  actualPrice: Number,
  store: String,
  brand: String,
  priority: { type: String, enum: Object.values(ItemPriority), default: ItemPriority.MEDIUM },
  status: { type: String, enum: Object.values(ItemStatus), default: ItemStatus.PENDING },
  nutritionalInfo: nutritionalInfoSchema,
  priceHistory: [priceHistorySchema],
  notes: String,
  imageUrl: String,
  barcode: String,
  expirationDate: Date,
  purchasedAt: Date,
  listId: String
}, {
  timestamps: true
});

const shoppingListSchema = new Schema<ShoppingList>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  items: [{ type: String }], // IDs dos itens
  totalEstimatedCost: { type: Number, default: 0 },
  totalActualCost: { type: Number, default: 0 },
  store: String,
  shoppingDate: Date,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

const storeSchema = new Schema<Store>({
  name: { type: String, required: true },
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  phone: String,
  website: String,
  averageRating: { type: Number, min: 1, max: 5 },
  priceLevel: { type: String, enum: ['low', 'medium', 'high'] }
});

const budgetSchema = new Schema<Budget>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  monthlyLimit: { type: Number, required: true, min: 0 },
  currentSpent: { type: Number, default: 0 },
  categories: [{
    category: { type: String, enum: Object.values(ItemCategory) },
    limit: { type: Number, min: 0 },
    spent: { type: Number, default: 0 }
  }],
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  alerts: {
    percentage: { type: Number, default: 80, min: 1, max: 100 },
    enabled: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Índices
shoppingItemSchema.index({ userId: 1, category: 1 });
shoppingItemSchema.index({ userId: 1, status: 1 });
shoppingItemSchema.index({ userId: 1, priority: 1 });
shoppingItemSchema.index({ barcode: 1 });
shoppingItemSchema.index({ listId: 1 });

shoppingListSchema.index({ userId: 1, completed: 1 });
shoppingListSchema.index({ userId: 1, shoppingDate: -1 });
shoppingListSchema.index({ tags: 1 });

budgetSchema.index({ userId: 1, month: 1, year: 1 });

export const ShoppingItemModel = mongoose.model<ShoppingItem & Document>('ShoppingItem', shoppingItemSchema);
export const ShoppingListModel = mongoose.model<ShoppingList & Document>('ShoppingList', shoppingListSchema);
export const StoreModel = mongoose.model<Store & Document>('Store', storeSchema);
export const BudgetModel = mongoose.model<Budget & Document>('Budget', budgetSchema);

