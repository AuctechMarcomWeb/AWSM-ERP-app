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

const AddModeOfPaymentScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    mode: '',
    status: 'Active',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.mode.trim()) {
      Alert.alert('Validation Error', 'Please enter mode of payment.');
      return;
    }

    Alert.alert('Success', 'Payment mode added successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Mode Of Payment"
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
                {/* Mode Of Payment */}
                <Label text="Mode Of Payment *" />
                <TextField
                  placeholder="Enter mode of payment..."
                  value={form.mode}
                  onChangeText={t => updateField('mode', t)}
                  style={styles.mb}
                />

                {/* Status */}
                <Label text="Status" />
                <Dropdown
                  value={form.status}
                  options={STATUS_OPTIONS}
                  onSelect={val => updateField('status', val)}
                  style={styles.mb}
                />

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title="Save Mode Of Payment"
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

export default AddModeOfPaymentScreen;
