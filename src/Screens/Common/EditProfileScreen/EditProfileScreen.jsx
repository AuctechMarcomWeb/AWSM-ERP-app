import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';
import BottomNav from '../../../components/BottomNav/BottomNav';

import { updateUserById, updatePassword, getProfile } from '../../../api/auth';
import { setUser } from '../../../redux/slice/userSlice';

const EditProfileScreen = ({ navigation, onSave }) => {
  const { loginData, profile, associateDetails, _id } = useSelector(
    state => state.user,
  );
  const dispatch = useDispatch();

  const handleTabPress = key => {
    if (key === 'Posts') return;
    navigation?.navigate(key);
  };
  const [loading, setLoading] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [form, setForm] = useState({
    FullName: '',
    Email: '',
    MobileNo: '',
    Address: '',
    Designation: '',
  });

  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Fetch latest profile data on screen load
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setFetchingProfile(true);
        const result = await getProfile();

        if (result.success && result.user) {
          const userData = result.user;
          setForm({
            FullName: userData.FullName || userData.name || '',
            Email: userData.Email || userData.email || '',
            MobileNo:
              userData.MobileNo || userData.Phone || userData.phone || '',
            Address: userData.Address || userData.address || '',
            Designation: userData.Designation || userData.designation || '',
          });

          // Also update Redux store with fresh data
          dispatch(setUser(userData));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to Redux data if API fails
        setForm({
          FullName:
            profile?.FullName ||
            associateDetails?.FullName ||
            loginData?.Name ||
            '',

          Email:
            profile?.Email || associateDetails?.Email || loginData?.Email || '',

          MobileNo:
            profile?.MobileNo ||
            profile?.Phone ||
            associateDetails?.MobileNo ||
            loginData?.MobileNo ||
            loginData?.Phone ||
            '',

          Address:
            profile?.Address ||
            associateDetails?.Address ||
            loginData?.Address ||
            '',

          Designation:
            associateDetails?.Designation ||
            profile?.Designation ||
            loginData?.Designation ||
            '',
        });
      } finally {
        setFetchingProfile(false);
      }
    };

    loadProfileData();
  }, []);

  // Fallback: Update from Redux if Redux data changes
  useEffect(() => {
    if (!fetchingProfile && profile) {
      setForm(prev => ({
        FullName: prev.FullName || profile?.FullName || '',
        Email: prev.Email || profile?.Email || '',
        MobileNo: prev.MobileNo || profile?.MobileNo || '',
        Address: prev.Address || profile?.Address || '',
        Designation: prev.Designation || profile?.Designation || '',
      }));
    }
  }, [profile, fetchingProfile]);

  const updateField = (key, value) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  // Form Validation
  const validateForm = () => {
    if (!form.FullName.trim()) {
      Alert.alert('Validation', 'Please enter your full name.');
      return false;
    }

    if (!form.Email.trim()) {
      Alert.alert('Validation', 'Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.Email.trim())) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return false;
    }

    if (form.MobileNo && !/^\d{10}$/.test(form.MobileNo.trim())) {
      Alert.alert('Validation', 'Mobile number must be exactly 10 digits.');
      return false;
    }

    return true;
  };

  // Save Profile
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const userData = {
        FullName: form.FullName.trim(),
        Email: form.Email.trim(),
        MobileNo: form.MobileNo.trim(),
        Address: form.Address.trim(),
        Designation: form.Designation.trim(),
      };

      const result = await updateUserById(_id, userData);

      if (result.success) {
        // Update Redux store with new user data
        dispatch(
          setUser({
            ...profile,
            ...userData,
          }),
        );

        Alert.alert('Success', 'Your profile has been updated successfully.', [
          {
            text: 'OK',
            onPress: () => navigation?.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Unable to update your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFromDate('');
    setToDate('');
    setStatusFilter('All Status');
    setAppliedFromDate('');
    setAppliedToDate('');
    setAppliedStatus('All Status');
    setFilterModalOpen(false);
  };

  // Password Change Handler
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword.trim()) {
      Alert.alert('Validation', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Validation', 'Please enter your new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Validation',
        'New password and confirm password do not match',
      );
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await updatePassword(_id, currentPassword, newPassword);

      if (result.success) {
        Alert.alert('Success', 'Password changed successfully', [
          {
            text: 'OK',
            onPress: () => {
              setChangePasswordModal(false);
              setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to change password');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Reusable Input Field
  const FormField = ({
    label,
    icon,
    value,
    field,
    placeholder,
    keyboardType = 'default',
    multiline = false,
    editable = true,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          !editable && styles.disabledInput,
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={Colors.primary}
          style={styles.inputIcon}
        />

        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={text => updateField(field, text)}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeHolderColor}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
          autoCapitalize={field === 'Email' ? 'none' : 'words'}
        />

        {!editable && (
          <MaterialCommunityIcons
            name="lock-outline"
            size={18}
            color={Colors.placeHolderColor}
          />
        )}
      </View>
    </View>
  );

  const profilePhoto =
    associateDetails?.ProfilePhoto ||
    profile?.ProfilePhoto ||
    loginData?.ProfilePhoto;

  let photo = null;

  if (typeof profilePhoto === 'string' && profilePhoto) {
    photo =
      profilePhoto.startsWith('http') || profilePhoto.startsWith('data:image')
        ? profilePhoto
        : `https://crm.spstates.com/${profilePhoto
            .replace(/^(\.\.\/)+/, '')
            .replace(/^\/+/, '')
            .split(' ')
            .join('%20')}`;
  }

  const [imageError, setImageError] = useState(false);

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader navigation={navigation} title="Edit Profile" />

        {/* Loading Indicator */}
        {fetchingProfile && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <MaterialCommunityIcons
                name="loading"
                size={40}
                color={Colors.primary}
                style={styles.loadingIcon}
              />
              <Text style={styles.loadingText}>Loading your profile...</Text>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Profile Photo */}
          <View style={styles.photoCard}>
            <View style={styles.avatarWrapper}>
              {photo && !imageError ? (
                <Image
                  source={{ uri: photo }}
                  style={styles.avatar}
                  onError={() => setImageError(true)}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account"
                  size={wp('16%')}
                  color={Colors.primary}
                />
              )}

              <View style={styles.cameraButton}>
                <MaterialCommunityIcons
                  name="camera"
                  size={17}
                  color={Colors.white}
                />
              </View>
            </View>

            <Text style={styles.photoTitle}>Personal Information</Text>

            <Text style={styles.photoSubtitle}>
              Update your profile details below
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeading}>
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={22}
                color={Colors.primary}
              />

              <Text style={styles.sectionTitle}>Basic Details</Text>
            </View>

            <FormField
              label="Full Name"
              icon="account-outline"
              field="FullName"
              value={form.FullName}
              placeholder="Enter your full name"
            />

            <FormField
              label="Email Address"
              icon="email-outline"
              field="Email"
              value={form.Email}
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <FormField
              label="Mobile Number"
              icon="phone-outline"
              field="MobileNo"
              value={form.MobileNo}
              placeholder="Enter 10 digit mobile number"
              keyboardType="phone-pad"
            />

            <FormField
              label="Designation"
              icon="badge-account-outline"
              field="Designation"
              value={form.Designation}
              placeholder="Enter designation"
            />

            <FormField
              label="Address"
              icon="map-marker-outline"
              field="Address"
              value={form.Address}
              placeholder="Enter your complete address"
              multiline
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name="content-save-outline"
              size={21}
              color={Colors.white}
            />

            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          {/* Change Password Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.changePasswordButton]}
            onPress={() => setChangePasswordModal(true)}
          >
            <MaterialCommunityIcons
              name="lock-reset"
              size={21}
              color={Colors.white}
            />

            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.cancelButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.footer}></View>
        </ScrollView>

        {/* Change Password Modal */}
        <Modal
          visible={changePasswordModal}
          transparent
          animationType="slide"
          onRequestClose={() => setChangePasswordModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setChangePasswordModal(false)}
          >
            <View
              style={styles.passwordModalContent}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.passwordModalHeader}>
                <Text style={styles.passwordModalTitle}>Change Password</Text>
                <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordFormCard}>
                {/* Current Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Current Password</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={21}
                      color={Colors.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={passwordForm.currentPassword}
                      onChangeText={text =>
                        setPasswordForm(prev => ({
                          ...prev,
                          currentPassword: text,
                        }))
                      }
                      placeholder="Enter current password"
                      placeholderTextColor={Colors.placeHolderColor}
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* New Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={21}
                      color={Colors.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={passwordForm.newPassword}
                      onChangeText={text =>
                        setPasswordForm(prev => ({
                          ...prev,
                          newPassword: text,
                        }))
                      }
                      placeholder="Enter new password"
                      placeholderTextColor={Colors.placeHolderColor}
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={21}
                      color={Colors.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={passwordForm.confirmPassword}
                      onChangeText={text =>
                        setPasswordForm(prev => ({
                          ...prev,
                          confirmPassword: text,
                        }))
                      }
                      placeholder="Confirm new password"
                      placeholderTextColor={Colors.placeHolderColor}
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.passwordModalActions}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.passwordUpdateButton,
                      passwordLoading && styles.disabledButton,
                    ]}
                    onPress={handleChangePassword}
                    disabled={passwordLoading}
                  >
                    <Text style={styles.passwordUpdateButtonText}>
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.passwordCancelButton}
                    onPress={() => setChangePasswordModal(false)}
                  >
                    <Text style={styles.passwordCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <BottomNav active="Posts" onPress={handleTabPress} />
    </AppLayout>
  );
};

export default EditProfileScreen;

// Styles
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
    flexGrow: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
  },

  // Profile Photo
  photoCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.cardColor,
    paddingVertical: hp('2.5%'),
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: wp('12.5%'),
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.cardColor,
  },

  photoTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.TitleColor,
    marginTop: hp('1.5%'),
  },

  photoSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: hp('0.4%'),
  },

  // Form Card
  formCard: {
    width: '100%',
    backgroundColor: Colors.cardColor,
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 1,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.035,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.2%'),
    gap: wp('2%'),
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.TitleColor,
  },

  // Input Fields
  inputGroup: {
    marginBottom: hp('2%'),
  },

  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.TitleColor,
    marginBottom: hp('0.8%'),
  },

  inputWrapper: {
    width: '100%',
    minHeight: hp('6.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
  },

  inputIcon: {
    marginRight: wp('2.5%'),
  },

  input: {
    flex: 1,
    minHeight: hp('6.2%'),
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textPrimary,
    paddingVertical: hp('1%'),
  },

  multilineWrapper: {
    minHeight: hp('13%'),
    alignItems: 'flex-start',
    paddingTop: hp('1.2%'),
  },

  multilineInput: {
    minHeight: hp('10%'),
  },

  disabledInput: {
    opacity: 0.65,
  },

  // Buttons
  saveButton: {
    width: '100%',
    minHeight: hp('6.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: wp('3%'),
    gap: wp('2%'),
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  saveButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },

  changePasswordButton: {
    width: '100%',
    minHeight: hp('6.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: wp('3%'),
    gap: wp('2%'),
    marginTop: hp('1%'),
    elevation: 2,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  changePasswordButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },

  disabledButton: {
    opacity: 0.6,
  },

  cancelButton: {
    width: '100%',
    minHeight: hp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },

  cancelButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.secondary,
  },

  footer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },

  footerText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  passwordModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
    maxHeight: '80%',
  },

  passwordModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },

  passwordModalTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.TitleColor,
  },

  passwordFormCard: {
    backgroundColor: Colors.primaryBg,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },

  passwordModalActions: {
    marginTop: hp('2%'),
    gap: wp('2%'),
  },

  passwordUpdateButton: {
    width: '100%',
    minHeight: hp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    borderRadius: wp('3%'),
    elevation: 2,
    shadowColor: Colors.success,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  passwordUpdateButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },

  passwordCancelButton: {
    width: '100%',
    minHeight: hp('5.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },

  passwordCancelButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.secondary,
  },

  // Loading Overlay Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  loadingCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  loadingIcon: {
    marginBottom: hp('1.5%'),
  },

  loadingText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
