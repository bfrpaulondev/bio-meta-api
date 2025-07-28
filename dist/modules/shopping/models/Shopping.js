"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetModel = exports.StoreModel = exports.ShoppingListModel = exports.ShoppingItemModel = exports.ItemStatus = exports.ItemPriority = exports.ItemCategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ItemCategory;
(function (ItemCategory) {
    ItemCategory["PROTEIN"] = "protein";
    ItemCategory["CARBOHYDRATES"] = "carbohydrates";
    ItemCategory["VEGETABLES"] = "vegetables";
    ItemCategory["FRUITS"] = "fruits";
    ItemCategory["DAIRY"] = "dairy";
    ItemCategory["SUPPLEMENTS"] = "supplements";
    ItemCategory["BEVERAGES"] = "beverages";
    ItemCategory["SNACKS"] = "snacks";
    ItemCategory["CONDIMENTS"] = "condiments";
    ItemCategory["OTHER"] = "other";
})(ItemCategory || (exports.ItemCategory = ItemCategory = {}));
var ItemPriority;
(function (ItemPriority) {
    ItemPriority["LOW"] = "low";
    ItemPriority["MEDIUM"] = "medium";
    ItemPriority["HIGH"] = "high";
    ItemPriority["CRITICAL"] = "critical";
})(ItemPriority || (exports.ItemPriority = ItemPriority = {}));
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["PENDING"] = "pending";
    ItemStatus["PURCHASED"] = "purchased";
    ItemStatus["OUT_OF_STOCK"] = "out_of_stock";
    ItemStatus["CANCELLED"] = "cancelled";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
const nutritionalInfoSchema = new mongoose_1.Schema({
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
});
const priceHistorySchema = new mongoose_1.Schema({
    price: { type: Number, required: true },
    store: { type: String, required: true },
    date: { type: Date, default: Date.now },
    onSale: Boolean,
    discount: Number
});
const shoppingItemSchema = new mongoose_1.Schema({
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
const shoppingListSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: String,
    items: [{ type: String }],
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
const storeSchema = new mongoose_1.Schema({
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
const budgetSchema = new mongoose_1.Schema({
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
shoppingItemSchema.index({ userId: 1, category: 1 });
shoppingItemSchema.index({ userId: 1, status: 1 });
shoppingItemSchema.index({ userId: 1, priority: 1 });
shoppingItemSchema.index({ barcode: 1 });
shoppingItemSchema.index({ listId: 1 });
shoppingListSchema.index({ userId: 1, completed: 1 });
shoppingListSchema.index({ userId: 1, shoppingDate: -1 });
shoppingListSchema.index({ tags: 1 });
budgetSchema.index({ userId: 1, month: 1, year: 1 });
exports.ShoppingItemModel = mongoose_1.default.model('ShoppingItem', shoppingItemSchema);
exports.ShoppingListModel = mongoose_1.default.model('ShoppingList', shoppingListSchema);
exports.StoreModel = mongoose_1.default.model('Store', storeSchema);
exports.BudgetModel = mongoose_1.default.model('Budget', budgetSchema);
//# sourceMappingURL=Shopping.js.map