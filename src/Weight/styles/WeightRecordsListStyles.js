// styles/WeightRecordsListStyles.js
import { StyleSheet } from 'react-native';

export const weightRecordsListStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  listContainer: {
    height: 240,
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  recordInfo: {
    flex: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dateText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  bmiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  bmiValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});