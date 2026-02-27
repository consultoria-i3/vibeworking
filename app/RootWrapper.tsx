// Catches render errors so we never show a blank page
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../src/theme';

type Props = { children: React.ReactNode };

export class RootErrorBoundary extends React.Component<
  Props,
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.error,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
