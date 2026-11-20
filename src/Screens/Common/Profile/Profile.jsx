import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { getProfile } from '../../../api/auth';
import { setUser } from '../../../redux/slice/userSlice';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import BottomNav from '../../../components/BottomNav/BottomNav';

// ─────────────────────────────────────────
// Info Row Component
// ─────────────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <MaterialCommunityIcons name={icon} size={20} color={Colors.primary} />
    </View>

    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Not Available'}</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────
// Profile Screen
// ─────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loginData, profile, role } = useSelector(state => state.user);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        try {
          const result = await getProfile();
          if (result?.success && result?.user) {
            dispatch(setUser(result.user));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();
    }, [dispatch]),
  );

  const handleTabPress = key => {
    if (key === 'Profile') return;
    navigation?.navigate(key);
  };

  // ─────────────────────────────────────
  // User Information
  // ─────────────────────────────────────

  const fullName = profile?.name || loginData?.Name || 'Member';
  const email = profile?.email || loginData?.Email || 'Not Available';
  const phone = profile?.phone || loginData?.Phone || 'Not Available';
  const userRole = profile?.role || role || loginData?.role || 'Not Available';
  const gender = profile?.gender || loginData?.gender || 'Not Available';

  // ─────────────────────────────────────
  // Render
  // ─────────────────────────────────────

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Profile"
          onBack={() => navigation && navigation.goBack()}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Information */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
            </View>

            <InfoRow
              icon="account-outline"
              label="Full Name"
              value={fullName}
            />

            <View style={styles.rowDivider} />

            <InfoRow icon="email-outline" label="Email Address" value={email} />

            <View style={styles.rowDivider} />

            <InfoRow icon="phone-outline" label="Mobile Number" value={phone} />

            <View style={styles.rowDivider} />

            <InfoRow icon="gender-male-female" label="Gender" value={gender} />
          </View>

          {/* Role Information */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <MaterialCommunityIcons
                  name="badge-account-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.sectionTitle}>Role Information</Text>
              </View>
            </View>

            <InfoRow
              icon="shield-account-outline"
              label="Role"
              value={userRole}
            />
          </View>
        </ScrollView>

        <BottomNav active="Profile" onPress={handleTabPress} />
      </View>
    </AppLayout>
  );
};

export default ProfileScreen;

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F1F6F3',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.6%'),
    marginBottom: hp('1.8%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: hp('1.2%'),
    marginBottom: hp('0.6%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },

  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.TitleColor,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.25%'),
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight || Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: FontSize.sm || FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary || Colors.textMuted,
  },

  infoValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.TitleColor,
    marginTop: 2,
  },

  rowDivider: {
    height: 1,
    backgroundColor: Colors.neutral.border,
    marginLeft: 38 + wp('3%'),
  },
});
