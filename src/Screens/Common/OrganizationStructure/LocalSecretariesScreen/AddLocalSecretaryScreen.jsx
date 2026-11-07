import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import colors from '../../../../themes/colors';
import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  TextField,
  Dropdown,
  DateField,
  GreenButton,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const TENURES = ['2025-2026', '2024-2025', '2026-2027'];
const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddLocalSecretaryScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    memberId: '',
    name: '',
    dob: null,
    tenure: '2025-2026',
    mobile: '',
    city: '',
    state: '',
    address: '',
    status: 'Active',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation Error', 'Please enter full name.');
      return;
    }
    if (!form.mobile.trim() || form.mobile.length < 10) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }

    Alert.alert('Success', 'Local Secretary added successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Local Secretary"
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
                {/* Member ID */}
                <Label text="Member ID (optional)" />
                <TextField
                  placeholder="Auto-generated if left empty"
                  value={form.memberId}
                  onChangeText={t => updateField('memberId', t)}
                  style={styles.mb}
                />

                {/* Name */}
                <Label text="Name *" />
                <TextField
                  placeholder="Enter full name"
                  value={form.name}
                  onChangeText={t => updateField('name', t)}
                  style={styles.mb}
                />

                {/* Date of Birth & Appointed Tenure */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Date of Birth" />
                    <DateField
                      value={form.dob}
                      onChange={date => updateField('dob', date)}
                      placeholder="dd/mm/yyyy"
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Appointed Tenure *" />
                    <Dropdown
                      value={form.tenure}
                      options={TENURES}
                      onSelect={val => updateField('tenure', val)}
                    />
                  </View>
                </View>

                {/* Mobile Number & City */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Mobile Number *" />
                    <TextField
                      placeholder="10-digit mobile"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={form.mobile}
                      onChangeText={t => updateField('mobile', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="City" />
                    <TextField
                      placeholder="Enter city"
                      value={form.city}
                      onChangeText={t => updateField('city', t)}
                    />
                  </View>
                </View>

                {/* State & Status */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="State" />
                    <TextField
                      placeholder="Enter state"
                      value={form.state}
                      onChangeText={t => updateField('state', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Status" />
                    <Dropdown
                      value={form.status}
                      options={STATUS_OPTIONS}
                      onSelect={val => updateField('status', val)}
                    />
                  </View>
                </View>

                {/* Address */}
                <Label text="Address" />
                <TextField
                  placeholder="Enter address"
                  value={form.address}
                  onChangeText={t => updateField('address', t)}
                  style={styles.mb}
                  multiline
                />

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title="Save Local Secretary"
                    icon="check"
                    onPress={handleSave}
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
      marginTop: 25,
    paddingHorizontal: wp('4%'),
    paddingTop: 16,
    paddingBottom: 30,
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

export default AddLocalSecretaryScreen;
