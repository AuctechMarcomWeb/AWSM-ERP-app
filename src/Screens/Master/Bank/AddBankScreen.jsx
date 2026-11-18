import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import { createBank, updateBank } from '../../../api/masters';

const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddBankScreen = ({ navigation, route }) => {
  const { bankData } = route?.params || {};
  const isEdit = !!bankData;

  const [form, setForm] = useState({
    name: bankData?.name || '',
    ifsc: bankData?.ifsc || '',
    accountNumber: bankData?.accountNumber || '',
    branchAddress: bankData?.branchAddress || '',
    description: bankData?.description || '',
    isActive: bankData?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Validation Error', 'Please enter Bank Name.');
      return;
    }

    setLoading(true);
    try {
      const result = isEdit
        ? await updateBank(bankData._id, form)
        : await createBank(form);

      if (result?.success || result?.statusCode === 200) {
        Alert.alert(
          'Success',
          isEdit ? 'Bank updated successfully!' : 'Bank added successfully!',
          [{ text: 'OK', onPress: () => navigation && navigation.goBack() }],
        );
      } else {
        Alert.alert('Error', result?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save bank');
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
          title={isEdit ? 'Edit Bank' : 'Add Bank'}
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
                  value={form.name}
                  onChangeText={t => updateField('name', t)}
                  style={styles.mb}
                  icon="bank"
                />

                {/* IFSC Number & Account Number */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="IFSC Number" />
                    <TextField
                      placeholder="e.g. SBIN0001234"
                      autoCapitalize="characters"
                      value={form.ifsc}
                      onChangeText={t => updateField('ifsc', t)}
                      icon="code-string"
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Account Number" />
                    <TextField
                      placeholder="e.g. 1234567890"
                      keyboardType="number-pad"
                      value={form.accountNumber}
                      onChangeText={t => updateField('accountNumber', t)}
                      icon="credit-card"
                    />
                  </View>
                </View>

                {/* Branch Address */}
                <Label text="Branch Address" />
                <TextField
                  placeholder="e.g. Main Branch, Connaught Place, New Delhi"
                  value={form.branchAddress}
                  onChangeText={t => updateField('branchAddress', t)}
                  style={styles.mb}
                  icon="map-marker"
                />

                {/* Description & Status */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Description" />
                    <TextField
                      placeholder="e.g. Primary account"
                      value={form.description}
                      onChangeText={t => updateField('description', t)}
                      icon="note-text"
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Status" />
                    <Dropdown
                      value={form.isActive ? 'Active' : 'Inactive'}
                      options={['Active', 'Inactive']}
                      onSelect={val =>
                        updateField('isActive', val === 'Active')
                      }
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title={
                      loading
                        ? 'Saving...'
                        : isEdit
                        ? 'Update Bank'
                        : 'Save Bank'
                    }
                    onPress={handleSave}
                    disabled={loading}
                    style={styles.submitBtn}
                  />
                </View>

                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
});

export default AddBankScreen;
