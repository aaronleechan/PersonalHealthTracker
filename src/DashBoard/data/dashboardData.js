// dashboardData.js
export const CARD_TYPES = {
  WEIGHT: 'weight',
  ACTIVITY: 'activity', 
  CALORIES: 'calories',
  BLOOD_PRESSURE: 'blood_pressure',
  HEALTH_ANALYSIS: 'health_analysis'
};

export const createDashboardItems = (latestWeight, latestBloodPressure) => {
  return [
    {
      id: CARD_TYPES.WEIGHT,
      title: 'Weight',
      icon: '⚖️',
      value: latestWeight ? `${latestWeight} lbs` : 'No data',
      subtitle: latestWeight ? 'Latest weight' : 'Track your weight',
      color: '#3498db',
      screen: 'weight'
    },
    {
      id: CARD_TYPES.BLOOD_PRESSURE,
      title: 'Blood Pressure',
      icon: '🫀',
      value: latestBloodPressure 
        ? `${latestBloodPressure.systolic}/${latestBloodPressure.diastolic}`
        : 'No data',
      subtitle: latestBloodPressure 
        ? `${latestBloodPressure.category.shortName} • ${latestBloodPressure.pulse} bpm`
        : 'Track your BP',
      color: latestBloodPressure?.category?.color || '#e74c3c',
      screen: 'bloodpressure',
      // Additional data for styling
      category: latestBloodPressure?.category || null,
      hasData: !!latestBloodPressure
    },
    {
      id: CARD_TYPES.HEALTH_ANALYSIS,
      title: 'Health Analysis',
      icon: '🤖',
      value: (latestWeight && latestBloodPressure) ? 'Ready' : 'Need Data',
      subtitle: (latestWeight && latestBloodPressure) ? 'Generate insights' : 'Add health data first',
      color: (latestWeight && latestBloodPressure) ? '#9b59b6' : '#95a5a6',
      screen: 'health_analysis',
      hasData: (latestWeight && latestBloodPressure)
    }
    // ,
    // {
    //   id: CARD_TYPES.ACTIVITY,
    //   title: 'Activity',
    //   icon: '🏃‍♂️',
    //   value: '0 steps',
    //   subtitle: 'Today\'s activity',
    //   color: '#f39c12',
    //   screen: 'activity'
    // },
    // {
    //   id: CARD_TYPES.CALORIES,
    //   title: 'Calories',
    //   icon: '🔥',
    //   value: '0 kcal',
    //   subtitle: 'Today\'s intake',
    //   color: '#e67e22',
    //   screen: 'calories'
    // }
  ];
};