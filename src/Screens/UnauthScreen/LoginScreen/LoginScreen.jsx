import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../../components/AppLayout/AppLayout';
import { loginWithPassword, getProfile } from '../../../api/auth';
import { loginSuccess, loginError } from '../../../redux/slice/userSlice';
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDashboardScreenName = (role) => {
    // Map user roles to their dashboard screens
    const roleScreenMap = {
      'SuperAdmin': 'SuperAdminDashboard',
      'Admin': 'AdminDashboard',
      'ExecutiveMember': 'ExecutiveMemberDashboard',
      'OfficeBearer': 'OfficeBearerDashboard',
      'OfficeStaff': 'OfficeStaffDashboard',
      'LocalSecretary': 'LocalSecretaryDashboard',
      'Membership': 'MembershipDashboard',
      'WazifaUser': 'WazifaUserDashboard',
    };
    return roleScreenMap[role] || 'MembershipDashboard';
  };

  const handleLogin = async () => {
    setError('');

    if (!userId.trim()) {
      setError('Please enter User ID or Mobile Number');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      console.log('Login attempt:', { userId, rememberMe });

      // Call authentication API
      const loginResult = await loginWithPassword(userId, password);

      if (loginResult.success) {
        console.log('✅ Login successful:', loginResult.token);

        // Save token to AsyncStorage
        await AsyncStorage.setItem('authToken', loginResult.token);
        console.log('✅ Token saved to AsyncStorage');

        // Small delay to ensure token is cached
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch user profile with permissions
        console.log('📡 Fetching profile...');
        const profileResult = await getProfile();

        if (profileResult.success) {
          console.log('✅ Profile fetched:', profileResult);

          // Save full user data to AsyncStorage
          await AsyncStorage.setItem('userData', JSON.stringify(profileResult.user));

          // Dispatch Redux action with complete user data and permissions
          dispatch(
            loginSuccess({
              token: loginResult.token,
              user: {
                ...profileResult.user,
                permissions: profileResult.permissions,
                role: profileResult.role,
              },
            })
          );
        } else {
          console.error('❌ Profile fetch failed:', profileResult.message);
          setError(profileResult.message || 'Failed to fetch profile');
          dispatch(loginError(profileResult.message));
        }
      } else {
        console.error('❌ Login failed:', loginResult.message);
        setError(loginResult.message || 'Login failed. Please try again.');
        dispatch(loginError(loginResult.message));
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      dispatch(loginError(errorMsg));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <StatusBar backgroundColor="#005A32" barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Premium Green Header */}
          <LinearGradient
            colors={['#006B3B', '#00834A', '#004D28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            {/* Decorative Background Circles */}
            <View style={styles.circleOne} />
            <View style={styles.circleTwo} />

            <View style={styles.headerContent}>
              <View style={styles.logoCard}>
                <Image
                  source={require('../../../assets/awsm-logo-transparent.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.headerBadge}>
                <Icon name="shield-check" size={13} color="#F4D47B" />
                <Text style={styles.headerBadgeText}>
                  Education • Scholarship • Welfare
                </Text>
              </View>
            </View>

            <View style={styles.headerBottomCurve} />
          </LinearGradient>

          {/* Main Login Form Section */}
          <View style={styles.mainContent}>
            {/* Login Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View>
                  <Text style={styles.formTitle}>Welcome Back</Text>
                  <Text style={styles.formSubtitle}>
                    Sign in to access your account
                  </Text>
                </View>

                <View style={styles.lockIcon}>
                  <Icon name="lock-check" size={22} color="#007A43" />
                </View>
              </View>

              {/* Error Message */}
              {!!error && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle-outline" size={18} color="#D93636" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* User ID Field */}
              <Text style={styles.label}>User ID</Text>
              <View
                style={[
                  styles.inputContainer,
                  userId ? styles.inputActive : null,
                ]}
              >
                <View style={styles.inputIcon}>
                  <Icon name="account-outline" size={20} color="#007A43" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your User ID"
                  placeholderTextColor="#A0AAB0"
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              {/* Password Field */}
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  password ? styles.inputActive : null,
                ]}
              >
                <View style={styles.inputIcon}>
                  <Icon name="lock-outline" size={20} color="#007A43" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0AAB0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Icon
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#7B8794"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember & Forgot Password */}
              {/* <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}
                  >
                    {rememberMe && (
                      <Icon name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  disabled={loading}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View> */}

              {/* Login Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleLogin}
                disabled={loading}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={['#00834A', '#006B3B', '#004E27']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>
                        Login to Account
                      </Text>
                      <View style={styles.buttonArrow}>
                        <Icon name="arrow-right" size={18} color="#FFFFFF" />
                      </View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Security Tag */}
              <View style={styles.securityContainer}>
                <Icon name="shield-lock" size={14} color="#007A43" />
                <Text style={styles.securityText}>
                  Secure And Encrypted Login
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerDivider}>
                <View style={styles.footerLine} />
                <View style={styles.footerDiamond} />
                <View style={styles.footerLine} />
              </View>
              <Text style={styles.footerTitle}>
                Anjuman Wazifa-e-Sadat Wa Momineen
              </Text>
              <Text style={styles.copyright}>© AWSM | All Rights Reserved</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6F3',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('3%'),
  },
  header: {
    height: hp('32%'),
    minHeight: 230,
    maxHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    paddingTop: hp('1.5%'),
  },
  circleOne: {
    position: 'absolute',
    width: wp('70%'),
    height: wp('70%'),
    borderRadius: wp('35%'),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    top: -wp('30%'),
    right: -wp('15%'),
  },
  circleTwo: {
    position: 'absolute',
    width: wp('60%'),
    height: wp('60%'),
    borderRadius: wp('30%'),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    bottom: -wp('25%'),
    left: -wp('20%'),
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: wp('5%'),
  },
  logoCard: {
    width: wp('90%'),
    height: hp('11%'),
    minHeight: 75,
    maxHeight: 95,

    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: hp('1.2%'),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: hp('0.5%'),
  },
  headerBadgeText: {
    fontSize: wp('2.9%'),
    fontFamily: FontFamily.medium,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  headerBottomCurve: {
    position: 'absolute',
    bottom: -35,
    width: wp('100%'),
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 100,
  },
  mainContent: {
    paddingHorizontal: wp('5%'),
    marginTop: -hp('2.5%'),
    zIndex: 3,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: wp('5.5%'),
    borderWidth: 1,
    borderColor: '#E2ECE5',
    elevation: 6,
    shadowColor: '#0D3D24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2.2%'),
  },
  formTitle: {
    fontSize: wp('4.8%'),
    fontFamily: FontFamily.bold,
    color: '#123F2A',
  },
  formSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#7A8C82',
    marginTop: 3,
  },
  lockIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E6F4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFD7D7',
    padding: 11,
    borderRadius: 10,
    marginBottom: hp('1.8%'),
  },
  errorText: {
    flex: 1,
    color: '#D93636',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    marginLeft: 8,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#2B4237',
    marginBottom: hp('0.6%'),
  },
  inputContainer: {
    height: hp('6.8%'),
    minHeight: 50,
    maxHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: '#DCE5E0',
    borderRadius: 12,
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
  },
  inputActive: {
    borderColor: '#006B3B',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#E8F3EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: wp('2.5%'),
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#1F3329',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2.4%'),
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#A8BCB0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  checkboxActive: {
    backgroundColor: '#006B3B',
    borderColor: '#006B3B',
  },
  rememberText: {
    fontSize: FontSize.sm,
    color: '#5C6E63',
    fontFamily: FontFamily.medium,
  },
  forgotText: {
    fontSize: FontSize.sm,
    color: '#006B3B',
    fontFamily: FontFamily.semiBold,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#006B3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  loginButton: {
    height: hp('7%'),
    minHeight: 50,
    maxHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1.8%'),
  },
  securityText: {
    fontSize: FontSize.sm,
    color: '#758A7E',
    fontFamily: FontFamily.regular,
    marginLeft: 5,
  },
  footer: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  footerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('35%'),
    marginBottom: hp('1.2%'),
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9B65C',
  },
  footerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: '#D9B65C',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  footerTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#cad5ce',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#8C9E93',
    marginTop: 6,
  },
});

export default LoginScreen;
