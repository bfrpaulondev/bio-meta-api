const mongoose = require("mongoose");

const dashboardWidgetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["weight_chart", "goal_progress", "next_workout", "calories", "daily_tip", "shopping_alert", "measurements", "achievements", "streak", "quick_actions"],
    required: true 
  },
  title: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  isVisible: { type: Boolean, default: true },
  settings: { type: mongoose.Schema.Types.Mixed }
});

const dashboardLayoutSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  widgets: [dashboardWidgetSchema],
  theme: String,
  lastUsed: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const dashboardStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  
  currentWeight: Number,
  weightChange: Number,
  weeklyWeightChange: Number,
  monthlyWeightChange: Number,
  
  workoutsToday: { type: Number, default: 0 },
  workoutTimeToday: { type: Number, default: 0 },
  weeklyWorkouts: { type: Number, default: 0 },
  weeklyWorkoutTime: { type: Number, default: 0 },
  monthlyWorkouts: { type: Number, default: 0 },
  monthlyWorkoutTime: { type: Number, default: 0 },
  
  activeGoals: { type: Number, default: 0 },
  completedGoalsToday: { type: Number, default: 0 },
  completedGoalsWeek: { type: Number, default: 0 },
  completedGoalsMonth: { type: Number, default: 0 },
  overallGoalProgress: { type: Number, default: 0 },
  
  caloriesConsumed: Number,
  caloriesBurned: Number,
  caloriesNet: Number,
  dailyCalorieGoal: Number,
  
  latestMeasurements:[{
    type: String,
    value: Number,
    unit: String,
    date: Date
  }],
  
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  newAchievements: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  
  monthlySpending: Number,
  budgetRemaining: Number,
  averageItemPrice: Number,
  
  nextWorkout: {
    id: String,
    name: String,
    scheduledTime: Date,
    estimatedDuration: Number
  },
  upcomingGoalDeadlines: [{
    id: String,
    title: String,
    deadline: Date,
    progress: Number
  }],
  
  alerts: [{
    type: { 
      type: String, 
      enum: ["goal_deadline", "workout_reminder", "measurement_due", "shopping_item", "achievement"],
      required: true 
    },
    message: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    actionRequired: { type: Boolean, default: false },
    relatedId: String
  }]
}, {
  timestamps: true
});

const quickActionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  action: { 
    type: String, 
    enum: ["start_workout", "add_measurement", "log_meal", "add_shopping_item", "view_progress", "custom"],
    required: true 
  },
  customUrl: String,
  isVisible: { type: Boolean, default: true },
  order: { type: Number, required: true }
});

const dashboardPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  defaultLayout: String,
  quickActions: [quickActionSchema],
  
  widgetSettings: {
    weightChart: {
      period: { type: String, enum: ["week", "month", "quarter", "year"], default: "month" },
      showTrendLine: { type: Boolean, default: true },
      showGoalLine: { type: Boolean, default: true }
    },
    goalProgress: {
      showOnlyActive: { type: Boolean, default: true },
      sortBy: { type: String, enum: ["priority", "deadline", "progress"], default: "priority" },
      maxItems: { type: Number, default: 5 }
    },
    calorieTracker: {
      showNet: { type: Boolean, default: true },
      showBreakdown: { type: Boolean, default: false },
      includeExercise: { type: Boolean, default: true }
    },
    nextWorkout: {
      showDetails: { type: Boolean, default: true },
      autoStart: { type: Boolean, default: false }
    }
  },
  
  notifications: {
    showGoalDeadlines: { type: Boolean, default: true },
    showWorkoutReminders: { type: Boolean, default: true },
    showAchievements: { type: Boolean, default: true },
    showWeightChanges: { type: Boolean, default: true },
    showShoppingAlerts: { type: Boolean, default: true }
  },
  
  appearance: {
    compactMode: { type: Boolean, default: false },
    showAnimations: { type: Boolean, default: true },
    cardStyle: { type: String, enum: ["flat", "elevated", "outlined"], default: "elevated" },
    colorScheme: { type: String, enum: ["auto", "light", "dark"], default: "auto" }
  },
  
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

dashboardLayoutSchema.pre("save", async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

dashboardLayoutSchema.index({ userId: 1, isDefault: 1 });
dashboardLayoutSchema.index({ userId: 1, lastUsed: -1 });

dashboardStatsSchema.index({ userId: 1, date: -1 });

const DashboardLayoutModel = mongoose.model("DashboardLayout", dashboardLayoutSchema);
const DashboardStatsModel = mongoose.model("DashboardStats", dashboardStatsSchema);
const DashboardPreferencesModel = mongoose.model("DashboardPreferences", dashboardPreferencesSchema);

module.exports = { DashboardLayoutModel, DashboardStatsModel, DashboardPreferencesModel };


