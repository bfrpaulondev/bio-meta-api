import mongoose from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';
export declare enum ItemCategory {
    PROTEIN = "protein",
    CARBOHYDRATES = "carbohydrates",
    VEGETABLES = "vegetables",
    FRUITS = "fruits",
    DAIRY = "dairy",
    SUPPLEMENTS = "supplements",
    BEVERAGES = "beverages",
    SNACKS = "snacks",
    CONDIMENTS = "condiments",
    OTHER = "other"
}
export declare enum ItemPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum ItemStatus {
    PENDING = "pending",
    PURCHASED = "purchased",
    OUT_OF_STOCK = "out_of_stock",
    CANCELLED = "cancelled"
}
export interface NutritionalInfo {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
}
export interface PriceHistory {
    price: number;
    store: string;
    date: Date;
    onSale?: boolean;
    discount?: number;
}
export interface ShoppingItem extends UserOwnedDocument {
    name: string;
    description?: string;
    category: ItemCategory;
    quantity: number;
    unit: string;
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
    listId?: string;
}
export interface ShoppingList extends UserOwnedDocument {
    name: string;
    description?: string;
    items: string[];
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
    priceLevel?: 'low' | 'medium' | 'high';
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
    month: number;
    year: number;
    alerts: {
        percentage: number;
        enabled: boolean;
    };
}
export declare const ShoppingItemModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, ShoppingItem & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const ShoppingListModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, ShoppingList & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const StoreModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Store & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const BudgetModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Budget & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Shopping.d.ts.map