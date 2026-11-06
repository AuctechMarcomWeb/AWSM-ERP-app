import React, { useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import { useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { widthPercentageToDP as hp } from 'react-native-responsive-screen';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import BottomNav from '../../../components/BottomNav/BottomNav';

// ─────────────────────────────────────────
// Profile Screen
// ─────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const { loginData, profile, associateDetails } = useSelector(
    state => state.user,
  );

  const [imageError, setImageError] = useState(false);


    const handleTabPress = key => {
    if (key === 'Profile') return;
    navigation?.navigate(key);
  };
  // ─────────────────────────────────────
  // User Information
  // ─────────────────────────────────────

  const fullName =
    profile?.FullName ||
    associateDetails?.FullName ||
    loginData?.Name ||
    'Member';

  const email =
    profile?.Email ||
    associateDetails?.Email ||
    loginData?.Email ||
    'Not Available';

  const phone =
    profile?.MobileNo ||
    profile?.Phone ||
    associateDetails?.MobileNo ||
    loginData?.MobileNo ||
    loginData?.Phone ||
    'Not Available';

  const designation =
    associateDetails?.Designation ||
    profile?.Designation ||
    loginData?.Designation ||
    ' Member';

  const memberId =
    associateDetails?.MemberId ||
    profile?.MemberId ||
    loginData?.MemberId ||
    'Not Available';

  const address =
    profile?.Address ||
    associateDetails?.Address ||
    loginData?.Address ||
    'Not Available';

  // ─────────────────────────────────────
  // Profile Photo
  // ─────────────────────────────────────

  const profilePhoto =
    associateDetails?.ProfilePhoto ||
    profile?.ProfilePhoto ||
    loginData?.ProfilePhoto ||
    null;

  let photo = null;

  if (profilePhoto) {
    if (
      profilePhoto.startsWith('data:image') ||
      profilePhoto.startsWith('http')
    ) {
      photo = profilePhoto;
    } else {
      photo = `https://crm.spstates.com/${profilePhoto
        .replace(/^(\.\.\/)+/, '')
        .replace(/^\/+/, '')
        .split(' ')
        .join('%20')}`;
    }
  }

  // ─────────────────────────────────────
  // Information Row
  // ─────────────────────────────────────

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <MaterialCommunityIcons name={icon} size={21} color={Colors.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value || 'Not Available'}</Text>
      </View>
    </View>
  );

  // ─────────────────────────────────────
  // Menu Row
  // ─────────────────────────────────────

  const MenuRow = ({ icon, title, onPress, danger = false }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.menuRow}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, danger && styles.dangerIcon]}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={danger ? Colors.danger : Colors.primary}
        />
      </View>

      <Text style={[styles.menuTitle, danger && styles.dangerText]}>
        {title}
      </Text>

      <MaterialCommunityIcons
        name="chevron-right"
        size={23}
        color={Colors.placeHolderColor}
      />
    </TouchableOpacity>
  );

  // ─────────────────────────────────────
  // Render
  // ─────────────────────────────────────

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader navigation={navigation} title="Settings" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}

          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              {photo && !imageError ? (
                <Image
                  source={{ uri: photo }}
                  style={styles.profileImage}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account"
                  size={55}
                  color={Colors.primary}
                />
              )}

              <View style={styles.onlineIndicator} />
            </View>

            <Text style={styles.profileName}>{fullName}</Text>

            <Text style={styles.designation}>{designation}</Text>

            <View style={styles.memberBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={15}
                color={Colors.primary}
              />

              <Text style={styles.memberBadgeText}>Member</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.editButton}
              onPress={() => navigation?.navigate('EditProfileScreen')}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={17}
                color={Colors.white}
              />

              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information */}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={21}
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

            <InfoRow
              icon="map-marker-outline"
              label="Address"
              value={address}
            />
          </View>

          {/* Membership Information */}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={21}
                  color={Colors.primary}
                />

                <Text style={styles.sectionTitle}>Membership Details</Text>
              </View>
            </View>

            <InfoRow icon="identifier" label="Member ID" value={memberId} />

            <View style={styles.rowDivider} />

            <InfoRow
              icon="badge-account-outline"
              label="Designation"
              value={designation}
            />
          </View>

          {/* Account Settings */}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={21}
                  color={Colors.primary}
                />

                <Text style={styles.sectionTitle}>Account Settings</Text>
              </View>
            </View>

          

            <View style={styles.rowDivider} />

            <MenuRow
              icon="lock-outline"
              title="Change Password"
              onPress={() => navigation?.navigate('ChangePassword')}
            />

            <View style={styles.rowDivider} />

            <MenuRow
              icon="cog-outline"
              title="Settings"
              onPress={() => navigation?.navigate('SettingScreen')}
            />

            <View style={styles.rowDivider} />

       
          </View>

          {/* Logout */}

        </ScrollView>
      </View>
                  <BottomNav active="Profile" onPress={handleTabPress} />

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

  // Header

  header: {
    height: hp('7%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: wp('4%'),

    backgroundColor: Colors.white,

    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },

  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.TitleColor,
    marginLeft: wp('2%'),
  },

  headerAction: {
    width: wp('10%'),
    height: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll

  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
  },

  // Profile Card

  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),

    alignItems: 'center',

    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4%'),

    marginBottom: hp('2%'),
  },

  avatarWrapper: {
    width: wp('25%'),
    height: wp('25%'),

    borderRadius: wp('12.5%'),

    backgroundColor: Colors.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 3,
    borderColor: Colors.primaryLight,

    overflow: 'visible',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('12.5%'),
  },

  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 2,

    width: wp('4.5%'),
    height: wp('4.5%'),

    borderRadius: wp('2.25%'),

    backgroundColor: Colors.success,

    borderWidth: 2,
    borderColor: Colors.white,
  },

  profileName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.TitleColor,

    marginTop: hp('1.5%'),
  },

  designation: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.secondary,

    marginTop: hp('0.4%'),
  },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.primaryBg,

    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),

    borderRadius: wp('5%'),

    marginTop: hp('1%'),
    gap: wp('1.5%'),
  },

  memberBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: Colors.primary,

    paddingHorizontal: wp('7%'),
    paddingVertical: hp('1.2%'),

    borderRadius: wp('2.5%'),

    marginTop: hp('2%'),

    gap: wp('2%'),
  },

  editButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },

  // Section Card

  sectionCard: {
    backgroundColor: Colors.white,

    borderRadius: wp('4%'),

    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),

    marginBottom: hp('1.8%'),
  },

  sectionHeader: {
    paddingBottom: hp('1.5%'),
  },

  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },

  sectionTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: Colors.TitleColor,
  },

  // Info Rows

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: hp('1.2%'),
  },

  infoIcon: {
    width: wp('10%'),
    height: wp('10%'),

    borderRadius: wp('2.5%'),

    backgroundColor: Colors.primaryBg,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: wp('3%'),
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },

  infoValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,

    marginTop: hp('0.3%'),
  },

  rowDivider: {
    height: 1,
    backgroundColor: Colors.neutral.border,
    marginLeft: wp('13%'),
  },

  // Menu Rows

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',

    minHeight: hp('6.5%'),
  },

  menuIcon: {
    width: wp('10%'),
    height: wp('10%'),

    borderRadius: wp('2.5%'),

    backgroundColor: Colors.primaryBg,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: wp('3%'),
  },

  menuTitle: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },

  dangerIcon: {
    backgroundColor: Colors.dangerBg,
  },

  dangerText: {
    color: Colors.danger,
  },

  // Version

  versionText: {
    textAlign: 'center',

    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,

    color: Colors.textMuted,

    marginTop: hp('0.5%'),
    marginBottom: hp('2%'),
  },
});
