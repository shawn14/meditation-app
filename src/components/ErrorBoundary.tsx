import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <View style={styles.container}>
          <LinearGradient
            colors={['#1C1C1E', '#0A0A0C']}
            style={styles.gradient}
          >
            <ScrollView 
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
              </View>

              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.subtitle}>
                We're sorry for the inconvenience. The app encountered an unexpected error.
              </Text>

              <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                <LinearGradient
                  colors={['#6B4EFF', '#9B59B6']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="refresh" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>

              {__DEV__ && (
                <View style={styles.errorDetails}>
                  <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
                  <View style={styles.errorBox}>
                    <Text style={styles.errorMessage}>
                      {this.state.error?.toString()}
                    </Text>
                    {this.state.errorInfo && (
                      <Text style={styles.stackTrace}>
                        {this.state.errorInfo.componentStack}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <View style={styles.tips}>
                <Text style={styles.tipsTitle}>What you can try:</Text>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                  <Text style={styles.tipText}>Check your internet connection</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                  <Text style={styles.tipText}>Update the app to the latest version</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                  <Text style={styles.tipText}>Restart the app</Text>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    marginBottom: 40,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tips: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
    flex: 1,
  },
  errorDetails: {
    width: '100%',
    marginBottom: 30,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  errorBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: 'monospace',
  },
  stackTrace: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 10,
    fontFamily: 'monospace',
  },
});