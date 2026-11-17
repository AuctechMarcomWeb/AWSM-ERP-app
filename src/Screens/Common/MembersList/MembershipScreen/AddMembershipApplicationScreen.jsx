import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import colors from '../../../../themes/colors';
import { FontFamily } from '../../../../themes/typography';

import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  TextField as InputField,
  Dropdown,
  DateField,
  GreenButton,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { createMember } from '../../../../api/member';

const MEMBER_TYPES = [
  'Ordinary Member',
  'Life Member',
  'Dawami Member',
  'Sarparast Member',
  'Mohsine Member',
];

const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddMembershipApplicationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    wmrn: 'AUTO-GEN-2026-001',
    accountNo: '',
    membershipDate: new Date(),
    renewDate: null,
    fullName: '',
    fatherName: '',
    memberType: 'Ordinary Member',
    mobile: '',
    whatsapp: '',
    isSameWhatsapp: true,
    email: '',
    citizenship: 'Indian',
    state: '',
    city: '',
    postOffice: '',
    postalCode: '',
    address: '',
    status: 'Active',
    introducedBy: '',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter Full Name.');
      return;
    }
    if (!form.mobile.trim() || form.mobile.length < 10) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }

    try {
      setLoading(true);

      const memberData = {
        acountNo: form.accountNo || '',
        membershipDate: form.membershipDate,
        renewDate: form.renewDate,
        fullName: form.fullName,
        fatherName: form.fatherName || '',
        memberType: form.memberType,
        mobileNumber: form.mobile,
        whatsappNumber: form.whatsapp,
        email: form.email || '',
        citizenship: form.citizenship || 'Indian',
        state: form.state || '',
        city: form.city || '',
        postOffice: form.postOffice || '',
        postalCode: form.postalCode || '',
        residentialAddress: form.address || '',
        status: form.status,
        introducedBy: form.introducedBy || '',
      };

      const result = await createMember(memberData);

      if (result.success) {
        Alert.alert('Success', 'Membership application added successfully!', [
          { text: 'OK', onPress: () => navigation && navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to create membership');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving membership');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Membership Application"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Body>
                {/* WMRN & Account Number */}
                <View style={[shared.row, styles.gapRow]}>
                  {' '}
                  <View style={shared.colL}>
                    <Label text="WMRN Number" />
                    <InputField
                      value={form.wmrn}
                      editable={false}
                      style={styles.disabledInput}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Account Number" />
                    <InputField
                      placeholder="Enter account no"
                      value={form.accountNo}
                      onChangeText={t => updateField('accountNo', t)}
                    />
                  </View>
                </View>

                {/* Dates */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Membership Date" />
                    <DateField
                      value={form.membershipDate}
                      onChange={d => updateField('membershipDate', d)}
                      leftIcon="calendar-month-outline"
                      hideRightIcon
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Renew Date" />
                    <DateField
                      value={form.renewDate}
                      onChange={d => updateField('renewDate', d)}
                      leftIcon="calendar-month-outline"
                      hideRightIcon
                    />
                  </View>
                </View>

                {/* Full Name */}
                <Label text="Full Name *" />
                <InputField
                  placeholder="Type or select member name"
                  value={form.fullName}
                  onChangeText={t => updateField('fullName', t)}
                  style={styles.mb}
                />

                {/* Father / Husband Name */}
                <Label text="Father / Husband Name" />
                <InputField
                  placeholder="Enter name"
                  value={form.fatherName}
                  onChangeText={t => updateField('fatherName', t)}
                  style={styles.mb}
                />

                {/* Member Type */}
                <Label text="Member Type *" />
                <Dropdown
                  value={form.memberType}
                  options={MEMBER_TYPES}
                  onSelect={val => updateField('memberType', val)}
                  style={styles.mb}
                />

                {/* Mobile & WhatsApp Number */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Mobile Number *" />
                    <InputField
                      placeholder="10-digit mobile"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={form.mobile}
                      onChangeText={t => {
                        updateField('mobile', t);
                        if (form.isSameWhatsapp) {
                          updateField('whatsapp', t);
                        }
                      }}
                    />
                  </View>
                  <View style={shared.col}>
                    <View style={styles.whatsappLabelRow}>
                      <Label text="WhatsApp Number" />
                      <TouchableOpacity
                        onPress={() => {
                          const newVal = !form.isSameWhatsapp;
                          setForm(prev => ({
                            ...prev,
                            isSameWhatsapp: newVal,
                            whatsapp: newVal ? prev.mobile : '',
                          }));
                        }}
                      >
                        <Text style={styles.sameToggleText}>
                          {form.isSameWhatsapp
                            ? '✓ Same as mobile'
                            : 'Make same'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <InputField
                      placeholder="WhatsApp number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={form.whatsapp}
                      editable={!form.isSameWhatsapp}
                      onChangeText={t => updateField('whatsapp', t)}
                    />
                  </View>
                </View>

                {/* Email */}
                <Label text="Email" />
                <InputField
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  value={form.email}
                  onChangeText={t => updateField('email', t)}
                  style={styles.mb}
                />

                {/* Citizenship & State */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Citizenship" />
                    <InputField
                      placeholder="Indian"
                      value={form.citizenship}
                      onChangeText={t => updateField('citizenship', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="State" />
                    <InputField
                      placeholder="Enter state"
                      value={form.state}
                      onChangeText={t => updateField('state', t)}
                    />
                  </View>
                </View>

                {/* City & Post Office */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="City" />
                    <InputField
                      placeholder="Enter city"
                      value={form.city}
                      onChangeText={t => updateField('city', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Post Office" />
                    <InputField
                      placeholder="Enter post office"
                      value={form.postOffice}
                      onChangeText={t => updateField('postOffice', t)}
                    />
                  </View>
                </View>

                {/* Postal Code */}
                <Label text="Postal Code" />
                <InputField
                  placeholder="Enter postal code"
                  keyboardType="numeric"
                  maxLength={6}
                  value={form.postalCode}
                  onChangeText={t => updateField('postalCode', t)}
                  style={styles.mb}
                />

                {/* Residential Address */}
                <Label text="Residential Address" />
                <InputField
                  placeholder="Enter complete residential address"
                  multiline
                  numberOfLines={3}
                  value={form.address}
                  onChangeText={t => updateField('address', t)}
                  style={[styles.mb, styles.addressInput]}
                />

                {/* Status & Introduced By */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Status" />
                    <Dropdown
                      value={form.status}
                      options={STATUS_OPTIONS}
                      onSelect={val => updateField('status', val)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Introduced By" />
                    <InputField
                      placeholder="Select introducer"
                      value={form.introducedBy}
                      onChangeText={t => updateField('introducedBy', t)}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title={loading ? 'Saving...' : 'Save Membership Application'}
                    icon={loading ? undefined : 'check'}
                    onPress={handleSave}
                    disabled={loading}
                    style={styles.submitBtn}
                  />
                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary}
                      style={styles.loadingSpinner}
                    />
                  )}
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    marginTop: 20,
    paddingHorizontal: wp('4%'),
    paddingVertical: 16,
    paddingBottom: 30,
  },
  gapRow: {
    marginBottom: 12,
  },
  accountRow: {
    paddingHorizontal: 4,
  },
  mb: {
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  whatsappLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sameToggleText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  addressInput: {
    height: 75,
    textAlignVertical: 'top',
  },
  btnContainer: {
    marginTop: 20,
  },
  submitBtn: {
    height: 50,
  },
  loadingSpinner: {
    marginTop: 12,
  },
});

export default AddMembershipApplicationScreen;
