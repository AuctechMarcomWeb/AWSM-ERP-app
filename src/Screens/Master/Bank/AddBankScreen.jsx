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

const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddBankScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    bankName: '',
    ifsc: '',
    accountNumber: '',
    branchAddress: '',
    description: '',
    status: 'Active',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.bankName.trim()) {
      Alert.alert('Validation Error', 'Please enter Bank Name.');
      return;
    }
    if (!form.ifsc.trim()) {
      Alert.alert('Validation Error', 'Please enter IFSC Number.');
      return;
    }
    if (!form.accountNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter Account Number.');
      return;
    }
    if (!form.branchAddress.trim()) {
      Alert.alert('Validation Error', 'Please enter Branch Address.');
      return;
    }

    Alert.alert('Success', 'Bank added successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Bank"
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
                {/* Bank Name */}
                <Label text="Bank Name *" />
                <TextField
                  placeholder="e.g. State Bank of India (SBI)"
                  value={form.bankName}
                  onChangeText={t => updateField('bankName', t)}
                  style={styles.mb}
                />

                {/* IFSC Number & Account Number */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="IFSC Number *" />
                    <TextField
                      placeholder="e.g. SBIN0001234"
                      autoCapitalize="characters"
                      value={form.ifsc}
                      onChangeText={t => updateField('ifsc', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Account Number *" />
                    <TextField
                      placeholder="e.g. 1234567890"
                      keyboardType="number-pad"
                      value={form.accountNumber}
                      onChangeText={t => updateField('accountNumber', t)}
                    />
                  </View>
                </View>

                {/* Branch Address */}
                <Label text="Branch Address *" />
                <TextField
                  placeholder="e.g. Main Branch, Connaught Place, New Delhi"
                  value={form.branchAddress}
                  onChangeText={t => updateField('branchAddress', t)}
                  style={styles.mb}
                  multiline
                />

                {/* Description & Status */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Description" />
                    <TextField
                      placeholder="e.g. Primary account for collections"
                      value={form.description}
                      onChangeText={t => updateField('description', t)}
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

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title="Save Bank"
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

export default AddBankScreen;
