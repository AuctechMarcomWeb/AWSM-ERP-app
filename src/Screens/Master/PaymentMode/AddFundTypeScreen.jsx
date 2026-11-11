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

const CONTRIBUTE_TYPES = ['Yearly', 'One-time', 'Monthly', 'Quarterly'];
const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddFundTypeScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    title: '',
    commission: '',
    amount: '',
    contributeType: 'Yearly',
    status: 'Active',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      Alert.alert('Validation Error', 'Please enter Fund Type Title.');
      return;
    }
    if (!form.amount.trim()) {
      Alert.alert('Validation Error', 'Please enter Amount.');
      return;
    }

    Alert.alert('Success', 'Fund Type added successfully!', [
      { text: 'OK', onPress: () => navigation && navigation.goBack() },
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Fund Type"
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
                {/* Title */}
                <Label text="Title *" />
                <TextField
                  placeholder="e.g. Zakat Fund"
                  value={form.title}
                  onChangeText={t => updateField('title', t)}
                  style={styles.mb}
                />

                {/* Commission Value & Amount */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Commission Value" />
                    <TextField
                      placeholder="e.g. 100 or 10%"
                      value={form.commission}
                      onChangeText={t => updateField('commission', t)}
                    />
                  </View>
                  <View style={shared.col}>
                    <Label text="Amount *" />
                    <TextField
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      value={form.amount}
                      onChangeText={t => updateField('amount', t)}
                    />
                  </View>
                </View>

                {/* Contribute Type & Status */}
                <View style={[shared.row, styles.gapRow]}>
                  <View style={shared.colL}>
                    <Label text="Contribute Type" />
                    <Dropdown
                      value={form.contributeType}
                      options={CONTRIBUTE_TYPES}
                      onSelect={val => updateField('contributeType', val)}
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
                    title="Save Fund Type"
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

export default AddFundTypeScreen;
