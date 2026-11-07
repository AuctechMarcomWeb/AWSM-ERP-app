import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  TextField,
  Dropdown,
  GreenButton,
  shared,
} from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const ROLE_OPTIONS = ['Admin', 'Office Bearers', 'OfficeStaff'];

const AddUserScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    userId: 'Super',
    fullName: '',
    phone: '',
    email: '',
    gender: 'Male',
    role: 'OfficeStaff',
    password: '',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    if (!form.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter Full Name.');
      return;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }
    if (!form.password.trim() || form.password.length < 6) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 6 characters.',
      );
      return;
    }

    Alert.alert('Success', 'User created successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add New User"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Body>
                {/* User ID */}
                <Label text="User ID *" />
                <TextField
                  value={form.userId}
                  onChangeText={t => updateField('userId', t)}
                  style={styles.mb}
                />

                {/* Full Name */}
                <Label text="Full Name *" />
                <TextField
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChangeText={t => updateField('fullName', t)}
                  style={styles.mb}
                />

                {/* Phone & Email Row */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Phone *" />
                    <TextField
                      placeholder="10-digit mobile"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={form.phone}
                      onChangeText={t => updateField('phone', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Email" />
                    <TextField
                      placeholder="email@example.com"
                      keyboardType="email-address"
                      value={form.email}
                      onChangeText={t => updateField('email', t)}
                    />
                  </View>
                </View>

                {/* Gender & Role Row */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Gender" />
                    <Dropdown
                      value={form.gender}
                      options={GENDER_OPTIONS}
                      onSelect={val => updateField('gender', val)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Role" />
                    <Dropdown
                      value={form.role}
                      options={ROLE_OPTIONS}
                      onSelect={val => updateField('role', val)}
                    />
                  </View>
                </View>

                {/* Password */}
                <Label text="Password *" />
                <TextField
                  placeholder="•••••••••••••"
                  secureTextEntry
                  value={form.password}
                  onChangeText={t => updateField('password', t)}
                  style={styles.mb}
                />

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title="Create User"
                    icon="check"
                    onPress={handleCreate}
                    style={styles.submitBtn}
                  />
                </View>
              </Body>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6F3',
  },
  body: {
    flex: 1,
    marginTop: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: 16,
    paddingBottom: 30,
    marginTop: 25,
  },
  gapRow: {
    marginBottom: 12,
  },
  mb: {
    marginBottom: 12,
  },
  btnContainer: {
    marginTop: 20,
  },
  submitBtn: {
    height: 50,
  },
});

export default AddUserScreen;
