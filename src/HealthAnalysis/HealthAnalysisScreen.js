// HealthAnalysisScreen.js - Enhanced UI version
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../App';
import GroqService from '../services/GroqService';

const HealthAnalysisScreen = ({ onBack }) => {
  const { userCode } = useScreen();
  const db = useSQLiteContext();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateAnalysis = async () => {
    if (!userCode) {
      Alert.alert('Error', 'User not found. Please restart the app.');
      return;
    }

    setLoading(true);
    try {
      const result = await GroqService.generateComprehensiveHealthAnalysis(db, userCode);
      setAnalysis(result);
      
      if (result.success) {
        Alert.alert('✅ Success!', 'Your health analysis is ready!');
      } else {
        Alert.alert('⚠️ Notice', 'Generated using offline mode.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to generate analysis: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (title, children, icon = null) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {icon && <Text style={styles.cardIcon}>{icon}</Text>}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const renderHealthSummary = (summary) => renderCard('Health Summary', (
    <>
      <Text style={styles.summaryText}>{summary.currentStatus}</Text>
      
      <View style={styles.riskContainer}>
        <View style={[styles.riskBadge, { 
          backgroundColor: summary.riskLevel === 'Low' ? '#d4edda' : 
                         summary.riskLevel === 'Moderate' ? '#fff3cd' : '#f8d7da' 
        }]}>
          <Text style={[styles.riskValue, { 
            color: summary.riskLevel === 'Low' ? '#155724' : 
                  summary.riskLevel === 'Moderate' ? '#856404' : '#721c24' 
          }]}>
            {summary.riskLevel} Risk
          </Text>
        </View>
      </View>
      
      <View style={styles.concernsContainer}>
        <Text style={styles.subTitle}>Primary Concerns</Text>
        {summary.primaryConcerns.map((concern, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{concern}</Text>
          </View>
        ))}
      </View>
    </>
  ), '🩺');

  const renderKeyRisks = (risks) => renderCard('Key Health Risks', (
    <>
      <View style={styles.riskSection}>
        <Text style={styles.riskTypeTitle}>🫀 Cardiovascular</Text>
        {risks.cardiovascularRisks.map((risk, index) => (
          <View key={index} style={styles.riskItem}>
            <Text style={styles.riskText}>{risk}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.riskSection}>
        <Text style={styles.riskTypeTitle}>⚡ Metabolic</Text>
        {risks.metabolicRisks.map((risk, index) => (
          <View key={index} style={styles.riskItem}>
            <Text style={styles.riskText}>{risk}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.actionSection}>
        <Text style={styles.actionTitle}>🚨 Immediate Actions Required</Text>
        {risks.immediateActions.map((action, index) => (
          <View key={index} style={styles.actionItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </View>
    </>
  ), '⚠️');

  const renderPlanSection = (title, plan, icon) => renderCard(title, (
    <>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Current Status</Text>
        <Text style={styles.statusText}>{plan.currentStatus}</Text>
      </View>
      
      <View style={styles.targetContainer}>
        <Text style={styles.targetIcon}>🎯</Text>
        <Text style={styles.targetText}>{plan.targetGoal}</Text>
      </View>
      
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>12-Month Timeline</Text>
        {Object.entries(plan.quarterlyMilestones).map(([quarter, milestone]) => (
          <View key={quarter} style={styles.milestoneItem}>
            <View style={styles.timelineDot} />
            <View style={styles.milestoneContent}>
              <Text style={styles.quarterLabel}>{quarter}</Text>
              <Text style={styles.milestoneText}>{milestone}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>Action Steps</Text>
        {plan.specificActions.map((action, index) => (
          <View key={index} style={styles.actionStep}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{action}</Text>
          </View>
        ))}
      </View>
    </>
  ), icon);

  const renderCheckpoints = (checkpoints) => renderCard('Monthly Progress Checkpoints', (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {checkpoints.map((checkpoint, index) => (
        <View key={index} style={styles.checkpointCard}>
          <View style={styles.checkpointHeader}>
            <Text style={styles.checkpointMonth}>Month {checkpoint.month}</Text>
          </View>
          <Text style={styles.checkpointFocus}>{checkpoint.focusArea}</Text>
          <View style={styles.checkpointDetails}>
            <Text style={styles.checkpointLabel}>Track:</Text>
            <Text style={styles.checkpointValue}>{checkpoint.measurements.join(', ')}</Text>
          </View>
          <View style={styles.checkpointDetails}>
            <Text style={styles.checkpointLabel}>Target:</Text>
            <Text style={styles.checkpointValue}>{checkpoint.targetMetrics}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  ), '📊');

  const renderRecommendations = (recs) => renderCard('Personalized Recommendations', (
    <>
      <View style={styles.recSection}>
        <View style={styles.recHeader}>
          <Text style={styles.recIcon}>🌟</Text>
          <Text style={styles.recTitle}>Lifestyle Changes</Text>
        </View>
        {recs.lifestyle.map((rec, index) => (
          <Text key={index} style={styles.recText}>{rec}</Text>
        ))}
      </View>
      
      <View style={styles.recSection}>
        <View style={styles.recHeader}>
          <Text style={styles.recIcon}>🏥</Text>
          <Text style={styles.recTitle}>Medical Consultations</Text>
        </View>
        {recs.medical.map((rec, index) => (
          <Text key={index} style={styles.recText}>{rec}</Text>
        ))}
      </View>
      
      <View style={styles.recSection}>
        <View style={styles.recHeader}>
          <Text style={styles.recIcon}>📋</Text>
          <Text style={styles.recTitle}>Monitoring Plan</Text>
        </View>
        {recs.monitoring.map((rec, index) => (
          <Text key={index} style={styles.recText}>{rec}</Text>
        ))}
      </View>
    </>
  ), '💡');

  const renderCurrentMetrics = (data) => renderCard('Your Current Health Metrics', (
    <>
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, styles.metricWeight]}>
          <Text style={styles.metricEmoji}>⚖️</Text>
          <Text style={styles.metricValue}>{data.currentMetrics.weight}</Text>
          <Text style={styles.metricUnit}>lbs</Text>
          <Text style={styles.metricLabel}>Weight</Text>
        </View>
        
        <View style={[styles.metricCard, styles.metricBMI]}>
          <Text style={styles.metricEmoji}>📊</Text>
          <Text style={styles.metricValue}>{data.currentMetrics.bmi}</Text>
          <Text style={styles.metricUnit}>BMI</Text>
          <Text style={styles.metricLabel}>Body Mass</Text>
        </View>
        
        <View style={[styles.metricCard, styles.metricBP]}>
          <Text style={styles.metricEmoji}>🫀</Text>
          <Text style={styles.metricValue}>{data.currentMetrics.systolic}/{data.currentMetrics.diastolic}</Text>
          <Text style={styles.metricUnit}>mmHg</Text>
          <Text style={styles.metricLabel}>Blood Pressure</Text>
        </View>
        
        <View style={[styles.metricCard, styles.metricPulse]}>
          <Text style={styles.metricEmoji}>💓</Text>
          <Text style={styles.metricValue}>{data.currentMetrics.pulse}</Text>
          <Text style={styles.metricUnit}>bpm</Text>
          <Text style={styles.metricLabel}>Heart Rate</Text>
        </View>
      </View>
      
      <View style={styles.trendsContainer}>
        <Text style={styles.trendsTitle}>6-Month Trends</Text>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Weight:</Text>
          <Text style={[styles.trendValue, 
            data.trends.weightTrend.includes('increase') ? styles.trendUp : styles.trendDown
          ]}>{data.trends.weightTrend}</Text>
        </View>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Blood Pressure:</Text>
          <Text style={[styles.trendValue,
            data.trends.bpTrend.includes('increase') ? styles.trendUp : styles.trendDown
          ]}>{data.trends.bpTrend}</Text>
        </View>
      </View>
    </>
  ), '📊');

  const renderAnalysisContent = () => {
    if (!analysis) return null;

    const { success, analysis: analysisData, healthData, fallbackAnalysis } = analysis;

    return (
      <View style={styles.analysisContainer}>
        {/* Current Metrics */}
        {healthData && renderCurrentMetrics(healthData)}
        
        {/* AI Analysis Results */}
        {success && analysisData ? (
          <>
            {analysisData.healthSummary && renderHealthSummary(analysisData.healthSummary)}
            {analysisData.keyRisks && renderKeyRisks(analysisData.keyRisks)}
            
            {/* 1-Year Plans */}
            {analysisData.oneYearPlan && (
              <>
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>📅 Your 1-Year Health Transformation Plan</Text>
                  <Text style={styles.planSubtitle}>Personalized roadmap to better health</Text>
                </View>
                
                {analysisData.oneYearPlan.weightManagement && 
                  renderPlanSection('Weight Management Plan', analysisData.oneYearPlan.weightManagement, '⚖️')}
                
                {analysisData.oneYearPlan.bloodPressureManagement && 
                  renderPlanSection('Blood Pressure Control', analysisData.oneYearPlan.bloodPressureManagement, '🫀')}
                
                {analysisData.oneYearPlan.monthlyCheckpoints && 
                  renderCheckpoints(analysisData.oneYearPlan.monthlyCheckpoints)}
              </>
            )}
            
            {analysisData.recommendations && renderRecommendations(analysisData.recommendations)}
          </>
        ) : (
          /* Fallback Analysis */
          fallbackAnalysis && renderCard('Health Assessment (Offline Mode)', (
            <Text style={styles.fallbackText}>{fallbackAnalysis}</Text>
          ), '📋')
        )}

        {/* Generation Info */}
        {analysis.metadata && (
          <View style={styles.metadataCard}>
            <Text style={styles.metadataTitle}>Analysis Details</Text>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>AI Model:</Text>
              <Text style={styles.metadataValue}>{analysis.metadata.model}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Generated:</Text>
              <Text style={styles.metadataValue}>{new Date(analysis.metadata.generatedAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Processing Time:</Text>
              <Text style={styles.metadataValue}>{analysis.metadata.responseTime}ms</Text>
            </View>
          </View>
        )}

        {/* Regenerate Button */}
        <TouchableOpacity style={styles.regenerateButton} onPress={generateAnalysis} disabled={loading}>
          <Text style={styles.regenerateIcon}>🔄</Text>
          <Text style={styles.regenerateText}>Regenerate Analysis</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Fixed Header with proper padding */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Health Analysis</Text>
        <View style={styles.headerSpacer} />
      </View>
      

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🤖</Text>
          <Text style={styles.heroTitle}>AI-Powered Health Insights</Text>
          <Text style={styles.heroSubtitle}>
            Get personalized recommendations based on your health data and trends
          </Text>
        </View>

        {/* Generate Button */}
        {!analysis && (
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonLoading]}
            onPress={generateAnalysis}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="white" style={styles.loadingIcon} />
                <Text style={styles.generateButtonText}>Analyzing your health data...</Text>
              </>
            ) : (
              <>
                <Text style={styles.generateIcon}>📊</Text>
                <Text style={styles.generateButtonText}>Generate Analysis</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Analysis Results */}
        {renderAnalysisContent()}
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#4a90e2',
    marginRight: 4,
  },
  backText: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  heroEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginBottom: 30,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonLoading: {
    backgroundColor: '#6b7280',
  },
  generateIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loadingIcon: {
    marginRight: 10,
  },
  analysisContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  cardContent: {
    padding: 20,
    paddingTop: 15,
  },
  summaryText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 20,
  },
  riskContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  concernsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    flex: 1,
  },
  riskSection: {
    marginBottom: 20,
  },
  riskTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  riskItem: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  riskText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  actionSection: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f1d1d',
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checkIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 10,
    marginTop: 1,
  },
  actionText: {
    fontSize: 14,
    color: '#991b1b',
    lineHeight: 20,
    flex: 1,
  },
  statusContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  targetIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  targetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    flex: 1,
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4a90e2',
    marginTop: 5,
    marginRight: 15,
  },
  milestoneContent: {
    flex: 1,
  },
  quarterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 4,
  },
  milestoneText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  actionsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionStep: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4a90e2',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    flex: 1,
  },
  checkpointCard: {
    width: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
  },
  checkpointHeader: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  checkpointMonth: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkpointFocus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  checkpointDetails: {
    marginBottom: 8,
  },
  checkpointLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  checkpointValue: {
    fontSize: 13,
    color: '#374151',
  },
  recSection: {
    marginBottom: 20,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  recText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 28,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    margin: '1%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  metricWeight: {
    backgroundColor: '#fef3c7',
  },
  metricBMI: {
    backgroundColor: '#dbeafe',
  },
  metricBP: {
    backgroundColor: '#fee2e2',
  },
  metricPulse: {
    backgroundColor: '#d1fae5',
  },
  metricEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  metricUnit: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  trendsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
  },
  trendsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendUp: {
    color: '#ef4444',
  },
  trendDown: {
    color: '#10b981',
  },
  fallbackText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  planHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  planSubtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  metadataCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  metadataValue: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  regenerateButton: {
    flexDirection: 'row',
    backgroundColor: '#6b7280',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  regenerateIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  regenerateText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default HealthAnalysisScreen;