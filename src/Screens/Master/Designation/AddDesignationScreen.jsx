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
import { Body, Label, TextField, Dropdown, GreenButton, shared } from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { createDesignation, updateDesignation } from '../../../api/masters';

const STATUS_OPTIONS = ['Active', 'Inactive'];

const AddDesignationScreen = ({ navigation, route }) => {
  const { designationData } = route?.params || {};
  const isEdit = !!designationData;

  const [form, setForm] = useState({
    name: designationData?.name || '',
    isActive: designationData?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Validation Error', 'Please enter Designation name.');
      return;
    }

    setLoading(true);
    try {
      const result = isEdit 
        ? await updateDesignation(designationData._id, form)
        : await createDesignation(form);

      if (result?.success || result?.statusCode === 200) {
        Alert.alert('Success', isEdit ? 'Updated successfully!' : 'Created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', result?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save');
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
          title={isEdit ? 'Edit Designation' : 'Add Designation'}
          onBack={() => navigation.goBack()}
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
                {/* Designation Name */}
                <Label text="Designation Name *" />
                <TextField
                  placeholder="e.g. President, General Secretary"
                  value={form.name}
                  onChangeText={t => updateField('name', t)}
                  style={styles.mb}
                  icon="briefcase"
                />

                {/* Status */}
                <Label text="Status" />
                <Dropdown
                  value={form.isActive ? 'Active' : 'Inactive'}
                  options={STATUS_OPTIONS}
                  onSelect={val => updateField('isActive', val === 'Active')}
                  style={styles.mb}
                />

                {/* Submit Button */}
                <View style={styles.btnContainer}>
                  <GreenButton
                    title={loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
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
  mb: {
    marginBottom: 16,
  },
  btnContainer: {
    marginTop: 24,
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

export default AddDesignationScreen;
