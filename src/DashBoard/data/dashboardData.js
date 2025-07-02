// data/dashboardData.js
export const dashboardItems = [
  {
    id: 'weight',
    title: 'Weight',
    icon: '⚖️',
    color: '#3498db',
    description: 'Track your weight',
    screen: 'WeightScreen'
  },
  {
    id: 'activity',
    title: 'Activity',
    icon: '🏃‍♂️',
    color: '#e74c3c',
    description: 'Log your workouts',
    screen: 'ActivityScreen'
  },
  {
    id: 'calories',
    title: 'Calories',
    icon: '🍎',
    color: '#f39c12',
    description: 'Monitor calorie intake',
    screen: 'CaloriesScreen'
  },
  {
    id: 'bloodpressure',
    title: 'Blood Pressure',
    icon: '❤️',
    color: '#27ae60',
    description: 'Check blood pressure',
    screen: 'BloodPressureScreen'
  }
];

// Function to create dashboard items with dynamic data
export const createDashboardItems = (latestWeight = null) => {
  return [
    {
      id: 'weight',
      title: 'Weight',
      icon: '⚖️',
      color: '#3498db',
      description: latestWeight ? `${latestWeight} lbs` : 'Track your weight',
      screen: 'WeightScreen',
      isActive: true
    },
    {
      id: 'activity',
      title: 'Activity',
      icon: '🏃‍♂️',
      color: '#e74c3c',
      description: 'Log your workouts',
      screen: 'ActivityScreen',
      isActive: false // Coming soon
    },
    {
      id: 'calories',
      title: 'Calories',
      icon: '🍎',
      color: '#f39c12',
      description: 'Monitor calorie intake',
      screen: 'CaloriesScreen',
      isActive: false // Coming soon
    },
    {
      id: 'bloodpressure',
      title: 'Blood Pressure',
      icon: '❤️',
      color: '#27ae60',
      description: 'Check blood pressure',
      screen: 'BloodPressureScreen',
      isActive: false // Coming soon
    }
  ];
};

// Card configuration constants
export const CARD_TYPES = {
  WEIGHT: 'weight',
  ACTIVITY: 'activity',
  CALORIES: 'calories',
  BLOOD_PRESSURE: 'bloodpressure'
};

// Color constants for consistency
export const CARD_COLORS = {
  BLUE: '#3498db',
  RED: '#e74c3c',
  ORANGE: '#f39c12',
  GREEN: '#27ae60'
};