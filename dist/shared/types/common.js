"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementUnit = exports.Gender = exports.ActivityLevel = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["INFO"] = "info";
    NotificationType["WARNING"] = "warning";
    NotificationType["ERROR"] = "error";
    NotificationType["SUCCESS"] = "success";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ActivityLevel;
(function (ActivityLevel) {
    ActivityLevel["SEDENTARY"] = "sedentary";
    ActivityLevel["LIGHTLY_ACTIVE"] = "lightly_active";
    ActivityLevel["MODERATELY_ACTIVE"] = "moderately_active";
    ActivityLevel["VERY_ACTIVE"] = "very_active";
    ActivityLevel["EXTREMELY_ACTIVE"] = "extremely_active";
})(ActivityLevel || (exports.ActivityLevel = ActivityLevel = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var MeasurementUnit;
(function (MeasurementUnit) {
    MeasurementUnit["METRIC"] = "metric";
    MeasurementUnit["IMPERIAL"] = "imperial";
})(MeasurementUnit || (exports.MeasurementUnit = MeasurementUnit = {}));
//# sourceMappingURL=common.js.map