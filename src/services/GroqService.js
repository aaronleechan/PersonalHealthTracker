// src/services/GroqService.js
// Simple Groq API integration for Expo
// src/services/GroqService.js
import Constants from 'expo-constants';


const GROQ_API_KEY = Constants.expoConfig.extra.groqApiKey;
const GROQ_API_URL = Constants.expoConfig.extra.groqApiUrl;
export class GroqService {



    // Add this function to your GroqService.js
    // Generate comprehensive health analysis with real user data
    static async generateComprehensiveHealthAnalysis(db, userCode) {
    try {
        console.log('🔍 Starting comprehensive health analysis...');

        
        // Validate API key first
        if (!this.validateConfig()) {
        console.log('⚠️ API key not configured, using fallback analysis');
        return {
            success: false,
            error: 'API key not configured',
            fallbackAnalysis: await this.generateFallbackAnalysis(db, userCode)
        };
        }

        // Get user health data from database
        const healthData = await this.getUserHealthData(db, userCode);
        const { user, latestWeight, latestBP, weightHistory, bpHistory } = healthData;
        
        if (!latestWeight || !latestBP) {
        return {
            success: false,
            error: 'Insufficient health data - need both weight and blood pressure records',
            fallbackAnalysis: 'Please record both weight and blood pressure measurements before generating analysis.'
        };
        }
        
        // Calculate BMI and trends
        const heightInMeters = user.height / 100;
        const weightInKg = latestWeight.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        
        // Calculate trends
        let weightTrend = 'stable';
        if (weightHistory.length >= 2) {
        const oldestWeight = weightHistory[0].weight;
        const currentWeight = latestWeight.weight;
        const weightChange = currentWeight - oldestWeight;
        
        if (weightChange > 5) weightTrend = 'increasing';
        else if (weightChange < -5) weightTrend = 'decreasing';
        }
        
        let bpTrend = 'stable';
        if (bpHistory.length >= 2) {
        const oldestBP = bpHistory[0];
        const currentBP = latestBP;
        const systolicChange = currentBP.systolic - oldestBP.systolic;
        
        if (systolicChange > 10) bpTrend = 'increasing';
        else if (systolicChange < -10) bpTrend = 'improving';
        }
        
        console.log(`🤖 Generating AI analysis - BMI: ${bmi.toFixed(1)}, Weight trend: ${weightTrend}, BP trend: ${bpTrend}`);
        
        // Create prompt for AI
        const prompt = `You are a medical AI assistant. Analyze this health data and provide specific recommendations:

        PATIENT DATA:
        - Age: ${user.age || 'Not specified'}
        - Height: ${user.height}cm
        - Current Weight: ${latestWeight.weight}lbs (BMI: ${bmi.toFixed(1)})
        - Blood Pressure: ${latestBP.systolic}/${latestBP.diastolic} mmHg
        - Pulse: ${latestBP.pulse} bpm
        - Weight Trend: ${weightTrend} (${weightHistory.length} records)
        - BP Trend: ${bpTrend} (${bpHistory.length} records)

        Provide analysis with:
        1. Current health status assessment
        2. Key risk factors (cardiovascular, metabolic)
        3. Specific 1-year improvement plan for weight and blood pressure
        4. Monthly checkpoints with measurable goals
        5. Lifestyle and medical recommendations

        Focus on practical, actionable advice. Keep response under 500 words.`;

        const startTime = Date.now();
        
        const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.3
        })
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const analysisText = data.choices[0]?.message?.content;
        
        console.log(`✅ Analysis generated in ${responseTime}ms using ${data.usage?.total_tokens || 'N/A'} tokens`);
        
        return {
        success: true,
        analysis: {
            rawText: analysisText,
            healthSummary: {
            currentStatus: analysisText,
            riskLevel: this.assessRiskLevel(latestBP.systolic, latestBP.diastolic, bmi),
            primaryConcerns: this.getPrimaryConcerns(bmi, latestBP.systolic, latestBP.diastolic)
            }
        },
        healthData: {
            user: {
            name: user.name,
            age: user.age,
            height: user.height,
            gender: user.gender
            },
            currentMetrics: {
            weight: latestWeight.weight,
            bmi: bmi.toFixed(1),
            systolic: latestBP.systolic,
            diastolic: latestBP.diastolic,
            pulse: latestBP.pulse
            },
            trends: {
            weightTrend,
            bpTrend,
            recordingPeriod: '6 months'
            }
        },
        metadata: {
            model: 'Llama 3 8B',
            responseTime: responseTime,
            tokensUsed: data.usage?.total_tokens || 'N/A',
            generatedAt: new Date().toISOString(),
            dataPoints: {
            weightRecords: weightHistory.length,
            bpRecords: bpHistory.length
            }
        }
        };
        
    } catch (error) {
        console.error('❌ Comprehensive health analysis failed:', error);
        return {
        success: false,
        error: error.message,
        fallbackAnalysis: await this.generateFallbackAnalysis(db, userCode)
        };
    }
    }

    // Helper function to get user health data
    static async getUserHealthData(db, userCode) {
    try {
        console.log('📊 Fetching user health data...');
        
        // Get user profile
        const user = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
        if (!user) throw new Error('User not found');
        
        // Get latest weight
        const latestWeight = await db.getFirstAsync(
        `SELECT weight, recordedAt FROM weight_records 
        WHERE userId = ? ORDER BY recordedAt DESC LIMIT 1`,
        [user.id]
        );
        
        // Get latest blood pressure
        const latestBP = await db.getFirstAsync(
        `SELECT systolic, diastolic, pulse, recordedAt 
        FROM blood_pressure_records 
        WHERE userId = ? ORDER BY recordedAt DESC LIMIT 1`,
        [user.id]
        );
        
        // Get weight history (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const weightHistory = await db.getAllAsync(
        `SELECT weight, recordedAt FROM weight_records 
        WHERE userId = ? AND recordedAt >= ? ORDER BY recordedAt ASC`,
        [user.id, sixMonthsAgo.toISOString()]
        );
        
        // Get BP history
        const bpHistory = await db.getAllAsync(
        `SELECT systolic, diastolic, pulse, recordedAt 
        FROM blood_pressure_records 
        WHERE userId = ? AND recordedAt >= ? ORDER BY recordedAt ASC`,
        [user.id, sixMonthsAgo.toISOString()]
        );
        
        console.log(`✅ Data retrieved: ${weightHistory.length} weight records, ${bpHistory.length} BP records`);
        
        return { user, latestWeight, latestBP, weightHistory, bpHistory };
        
    } catch (error) {
        console.error('❌ Error fetching health data:', error);
        throw error;
    }
    }

    // Helper function to assess risk level
    static assessRiskLevel(systolic, diastolic, bmi) {
    let riskFactors = 0;
    
    // BP risk factors
    if (systolic >= 140 || diastolic >= 90) riskFactors += 2;
    else if (systolic >= 130 || diastolic >= 80) riskFactors += 1;
    
    // BMI risk factors
    if (bmi >= 30) riskFactors += 2;
    else if (bmi >= 25) riskFactors += 1;
    
    if (riskFactors >= 3) return 'High';
    if (riskFactors >= 1) return 'Moderate';
    return 'Low';
    }

    // Helper function to get primary concerns
    static getPrimaryConcerns(bmi, systolic, diastolic) {
    const concerns = [];
    
    if (bmi >= 30) concerns.push('Obesity (BMI ≥30)');
    else if (bmi >= 25) concerns.push('Overweight (BMI ≥25)');
    
    if (systolic >= 140 || diastolic >= 90) concerns.push('High Blood Pressure Stage 2');
    else if (systolic >= 130 || diastolic >= 80) concerns.push('High Blood Pressure Stage 1');
    else if (systolic >= 120) concerns.push('Elevated Blood Pressure');
    
    if (concerns.length === 0) concerns.push('Continue healthy monitoring');
    
    return concerns;
    }

    // Fallback analysis when AI is not available
    static async generateFallbackAnalysis(db, userCode) {
    try {
        const healthData = await this.getUserHealthData(db, userCode);
        const { user, latestWeight, latestBP } = healthData;
        
        if (!latestWeight || !latestBP) {
        return "Please record both weight and blood pressure measurements to generate health analysis.";
        }
        
        const heightInMeters = user.height / 100;
        const weightInKg = latestWeight.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        
        const riskLevel = this.assessRiskLevel(latestBP.systolic, latestBP.diastolic, bmi);
        const concerns = this.getPrimaryConcerns(bmi, latestBP.systolic, latestBP.diastolic);
        
        return `HEALTH ANALYSIS (Offline Mode):

    Current Status: BMI ${bmi.toFixed(1)}, BP ${latestBP.systolic}/${latestBP.diastolic} mmHg
    Risk Level: ${riskLevel}

    Primary Concerns:
    ${concerns.map(c => `• ${c}`).join('\n')}

    Recommendations:
    • Monitor blood pressure weekly
    • Maintain healthy weight through diet and exercise
    • Follow up with healthcare provider regularly
    • Track measurements consistently in this app

    Note: This is a basic analysis. For comprehensive AI-powered insights, ensure internet connection is available.`;
        
    } catch (error) {
        return `Error generating analysis: ${error.message}`;
    }
    }
  
  // Validate API key configuration
  static validateConfig() {

    if (!GROQ_API_KEY) {
      console.warn('⚠️ Groq API key not set in GroqService.js');
      return false;
    }
    
    if (!GROQ_API_KEY.startsWith('gsk_')) {
      console.warn('⚠️ Invalid Groq API key format - should start with "gsk_"');
      return false;
    }
    
    console.log('✅ Groq API key is properly configured');
    return true;
  }
  
  // Simple test function to verify API is working
  static async testConnection() {
    try {
      console.log('🔄 Testing Groq API connection...');
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: 'Say "Hello from Groq!" and nothing else.'
            }
          ],
          max_tokens: 20,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content;
      
      console.log('✅ Groq API connected successfully!');
      console.log('📤 API Response:', message);
      
      return {
        success: true,
        message: message,
        model: data.model,
        usage: data.usage
      };
      
    } catch (error) {
      console.error('❌ Groq API connection failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate health analysis
  static async generateHealthAnalysis(userData) {
    try {
      // Validate API key first
      if (!GROQ_API_KEY) {
        throw new Error('Please set your Groq API key in GroqService.js');
      }

      const { weight, height, systolic, diastolic, pulse, age = 30, gender = 'Not specified' } = userData;
      
      // Calculate BMI
      const heightInMeters = height / 100;
      const weightInKg = weight * 0.453592;
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      
      console.log(`🤖 Generating health analysis for: Age ${age}, BMI ${bmi.toFixed(1)}, BP ${systolic}/${diastolic}`);
      
      const prompt = `You are a medical AI assistant. Analyze this health data and provide a brief health assessment:

Patient: ${age} year old ${gender}
Height: ${height}cm, Weight: ${weight}lbs (BMI: ${bmi.toFixed(1)})
Blood Pressure: ${systolic}/${diastolic} mmHg, Pulse: ${pulse} bpm

Please provide:
1. Overall health status (2-3 sentences)
2. Blood pressure category (Normal/Elevated/High Stage 1/High Stage 2/Crisis)
3. BMI category and recommendations
4. Top 3 health recommendations

Keep response under 200 words and include medical disclaimer.`;

      const startTime = Date.now();
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const analysis = data.choices[0]?.message?.content;
      
      console.log(`✅ Health analysis generated in ${responseTime}ms`);
      console.log(`📊 Tokens used: ${data.usage?.total_tokens || 'N/A'}`);
      
      return {
        success: true,
        analysis: analysis,
        metadata: {
          model: data.model || 'llama3-8b-8192',
          responseTime: responseTime,
          tokensUsed: data.usage?.total_tokens || 'N/A',
          generatedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Health analysis failed:', error);
      return {
        success: false,
        error: error.message,
        fallbackAnalysis: this.getFallbackAnalysis(userData)
      };
    }
  }

  // Simple fallback analysis when API fails
  static getFallbackAnalysis(userData) {
    const { weight, height, systolic, diastolic, pulse } = userData;
    const heightInMeters = height / 100;
    const weightInKg = weight * 0.453592;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    let bpCategory = 'Normal';
    if (systolic >= 180 || diastolic >= 120) bpCategory = 'Hypertensive Crisis';
    else if (systolic >= 140 || diastolic >= 90) bpCategory = 'High Blood Pressure Stage 2';
    else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) bpCategory = 'High Blood Pressure Stage 1';
    else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) bpCategory = 'Elevated';
    
    let bmiCategory = 'Normal';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obese';
    
    return `⚠️ MEDICAL DISCLAIMER: This is for educational purposes only. Consult your healthcare provider.

    HEALTH ANALYSIS:
    Your blood pressure (${systolic}/${diastolic}) falls in the ${bpCategory} category. Your BMI of ${bmi.toFixed(1)} indicates ${bmiCategory} weight status.

    RECOMMENDATIONS:
    1. Monitor blood pressure regularly
    2. Maintain a balanced diet with reduced sodium
    3. Exercise 150 minutes per week
    4. Schedule regular check-ups with your doctor

    Note: This offline analysis was generated when the AI service was unavailable.`;
  }
}

export default GroqService;