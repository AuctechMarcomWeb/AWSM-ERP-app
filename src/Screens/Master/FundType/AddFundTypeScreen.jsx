import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import colors from '../../../themes/colors';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import { Body, Label, TextField, Dropdown, GreenButton } from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { createFundType, updateFundType } from '../../../api/masters';

const AddFundTypeScreen = ({ navigation, route }) => {
  const { fundTypeData } = route?.params || {};
  const isEdit = !!fundTypeData;
  const [form, setForm] = useState({ name: fundTypeData?.name || '', isActive: fundTypeData?.isActive ?? true });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter name');
      return;
    }
    setLoading(true);
    try {
      const result = isEdit ? await updateFundType(fundTypeData._id, form) : await createFundType(form);
      if (result?.success || result?.statusCode === 200) {
        Alert.alert('Success', isEdit ? 'Updated!' : 'Created!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('Error', result?.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader navigation={navigation} title={isEdit ? 'Edit' : 'Add'} onBack={() => navigation.goBack()} />
        <View style={styles.body}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <Body>
                <Label text="Fund Type Name *" />
                <TextField placeholder="e.g. Scholarship Fund" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} style={styles.mb} icon="cash" />
                <Label text="Status" />
                <Dropdown value={form.isActive ? 'Active' : 'Inactive'} options={['Active', 'Inactive']} onSelect={(val) => setForm({ ...form, isActive: val === 'Active' })} style={styles.mb} />
                <GreenButton title={loading ? 'Saving...' : isEdit ? 'Update' : 'Save'} onPress={handleSave} disabled={loading} style={styles.submitBtn} />
                {loading && <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>}
              </Body>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F6F3' },
  body: { flex: 1, backgroundColor: colors.white },
  scrollContent: { paddingHorizontal: wp('4%'), paddingTop: 16, paddingBottom: 30, marginTop: 25 },
  mb: { marginBottom: 16 },
  submitBtn: { height: 50, marginTop: 24 },
  loadingContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
});

export default AddFundTypeScreen;
