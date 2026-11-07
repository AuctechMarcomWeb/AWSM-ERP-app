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
  GreenButton,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];
const CURRENT_OPTIONS = ['Yes', 'No'];

const AddTenureYearScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    tenure: '',
    status: 'Active',
    current: 'No',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.tenure.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter tenure year (e.g. 2025-2026).',
      );
      return;
    }

    Alert.alert('Success', 'Tenure year added successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Tenure Year"
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
                {/* Tenure Year */}
                <Label text="Tenure Year *" />
                <TextField
                  placeholder="e.g. 2025-2026"
                  value={form.tenure}
                  onChangeText={t => updateField('tenure', t)}
                  style={styles.mb}
                />

                {/* Status & Current Row */}
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
                    <Label text="Current Year" />
                    <Dropdown
                      value={form.current}
                      options={CURRENT_OPTIONS}
                      onSelect={val => updateField('current', val)}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title="Save Tenure Year"
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

export default AddTenureYearScreen;
