export interface BaseDocument {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserOwnedDocument extends BaseDocument {
    userId: string;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    code?: string;
}
export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    size: number;
    url: string;
    path: string;
}
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: Coordinates;
}
export declare enum NotificationType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    SUCCESS = "success"
}
export interface Notification {
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}
export declare enum ActivityLevel {
    SEDENTARY = "sedentary",
    LIGHTLY_ACTIVE = "lightly_active",
    MODERATELY_ACTIVE = "moderately_active",
    VERY_ACTIVE = "very_active",
    EXTREMELY_ACTIVE = "extremely_active"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum MeasurementUnit {
    METRIC = "metric",
    IMPERIAL = "imperial"
}
export interface HealthMetrics {
    weight?: number;
    height?: number;
    bodyFat?: number;
    muscleMass?: number;
    bmi?: number;
    bmr?: number;
}
//# sourceMappingURL=common.d.ts.map