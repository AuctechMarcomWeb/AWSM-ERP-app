import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';

import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  TextField,
  Dropdown,
  GreenButton,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DESIGNATIONS = [
  'President',
  'Vice President',
  'General Secretary',
  'Joint Secretary',
  'Sec. Organization',
  'Sec. Media / Publicity',
  'Sec. Legal Cell',
  'Sec. Digital Media',
  'Sec. Counselling and Guidance',
  'Sec. Scholarship',
  'Editor Wazifa Monthly',
  'Internal Auditor',
  'Asst Secretary',
  'Asst. Secretary',
];

const TENURES = ['2025-2026', '2024-2025', '2026-2027'];
const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddOfficeBearerScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    designation: 'President',
    tenure: '2025-2026',
    city: '',
    mobile: '',
    landline: '',
    status: 'Active',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation Error', 'Please enter Office Bearer Name.');
      return;
    }
    if (!form.mobile.trim() || form.mobile.length < 10) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }

    Alert.alert('Success', 'Office Bearer added successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Office Bearer"
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
                {/* Name */}
                <Label text="Name *" />
                <TextField
                  placeholder="Enter name"
                  value={form.name}
                  onChangeText={t => updateField('name', t)}
                  style={styles.mb}
                />

                {/* Designation */}
                <Label text="Designation *" />
                <Dropdown
                  value={form.designation}
                  options={DESIGNATIONS}
                  onSelect={val => updateField('designation', val)}
                  style={styles.mb}
                />

                {/* Appointed Tenure */}
                <Label text="Appointed Tenure *" />
                <Dropdown
                  value={form.tenure}
                  options={TENURES}
                  onSelect={val => updateField('tenure', val)}
                  style={styles.mb}
                />

                {/* City & Status Row */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="City" />
                    <TextField
                      placeholder="Enter city"
                      value={form.city}
                      onChangeText={t => updateField('city', t)}
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

                {/* Mobile Number & Landline Number Row */}
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
                    <Label text="Landline Number" />
                    <TextField
                      placeholder="Enter landline no"
                      keyboardType="phone-pad"
                      value={form.landline}
                      onChangeText={t => updateField('landline', t)}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title="Save Office Bearer"
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
    backgroundColor: colors.primary,
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
    marginTop: 26,
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

export default AddOfficeBearerScreen;
