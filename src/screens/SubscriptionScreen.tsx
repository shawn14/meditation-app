import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

export default function SubscriptionScreen({ navigation }: any) {
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$14.99',
      period: 'per month',
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '$69.99',
      period: 'per year',
      savings: 'Save 60%',
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$399.99',
      period: 'one time',
      savings: 'Best Value',
    },
  ];

  const features = [
    { icon: 'infinite-outline', text: 'Unlimited access to all content' },
    { icon: 'moon-outline', text: '100+ sleep stories & soundscapes' },
    { icon: 'leaf-outline', text: '500+ guided meditations' },
    { icon: 'download-outline', text: 'Download for offline listening' },
    { icon: 'people-outline', text: 'Up to 6 family members' },
    { icon: 'mic-outline', text: 'Celebrity narrated content' },
    { icon: 'musical-notes-outline', text: 'Exclusive music tracks' },
    { icon: 'sparkles-outline', text: 'New content added weekly' },
  ];

  const handleSubscribe = () => {
    Alert.alert(
      'Subscribe to Premium',
      `You selected the ${plans.find(p => p.id === selectedPlan)?.name} plan`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Subscribe', 
          onPress: () => {
            Alert.alert('Success', 'Premium features unlocked!');
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6B4EFF', '#9B59B6']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.crown}>
            <Ionicons name="star" size={48} color="#FFD700" />
          </View>
          <Text style={styles.headerTitle}>Unlock Premium</Text>
          <Text style={styles.headerSubtitle}>
            Get unlimited access to all meditation and sleep content
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.testimonial}>
        <Text style={styles.testimonialText}>
          "This app changed my life. I sleep better and feel more centered."
        </Text>
        <View style={styles.testimonialAuthor}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={16} color="#FFD700" />
            ))}
          </View>
          <Text style={styles.authorName}>Sarah M.</Text>
        </View>
      </View>

      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlan,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.planContent}>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radio,
                  selectedPlan === plan.id && styles.radioSelected,
                ]}>
                  {selectedPlan === plan.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}> {plan.period}</Text>
                </View>
                {plan.savings && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Everything Included</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name={feature.icon as any} size={24} color="#6B4EFF" />
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <LinearGradient
          colors={['#6B4EFF', '#9B59B6']}
          style={styles.subscribeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.subscribeText}>Start Free Trial</Text>
          <Text style={styles.trialText}>7 days free, then {plans.find(p => p.id === selectedPlan)?.price}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Cancel anytime. Recurring billing. Terms apply.
        </Text>
        <TouchableOpacity>
          <Text style={styles.restoreLink}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  crown: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  testimonial: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
  },
  testimonialText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  testimonialAuthor: {
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  authorName: {
    fontSize: 14,
    color: '#8E8E93',
  },
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#6B4EFF',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioContainer: {
    marginRight: 15,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8E8E93',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#6B4EFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6B4EFF',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B4EFF',
  },
  planPeriod: {
    fontSize: 14,
    color: '#8E8E93',
  },
  savingsBadge: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  subscribeButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  subscribeGradient: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trialText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 10,
  },
  restoreLink: {
    fontSize: 14,
    color: '#6B4EFF',
    fontWeight: '600',
  },
});