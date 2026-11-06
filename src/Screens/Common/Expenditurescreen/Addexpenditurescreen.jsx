import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import BottomNav from '../../../components/BottomNav/BottomNav';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';

const EXPENSE_TYPES = [
  'Wazifa',
  'Contingency',
  'Stationary etc.',
  'Commission',
  'Postage',
  'Other',
];
const PAYMENT_MODES = ['Cash', 'UPI', 'Cheque', 'Bank Transfer'];

const formatDate = d =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}/${d.getFullYear()}`;

// ---------------------------------------------------------------
// Small reusable pieces
// ---------------------------------------------------------------
const Label = ({ text, required }) => (
  <Text style={styles.label}>
    {text}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
);

const Dropdown = ({ icon, value, placeholder, options, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
      >
        <Icon name={icon} size={22} color="#1F2937" />
        <Text
          style={[styles.fieldText, !value && styles.placeholderText]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color="#1F2937" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.sheet}>
            {options.map(o => (
              <TouchableOpacity
                key={o}
                style={[
                  styles.sheetItem,
                  o === value && styles.sheetItemActive,
                ]}
                onPress={() => {
                  onSelect(o);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sheetText,
                    o === value && styles.sheetTextActive,
                  ]}
                >
                  {o}
                </Text>
                {o === value && (
                  <Icon name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const InputField = ({ icon, ...props }) => (
  <View style={styles.field}>
    <Icon name={icon} size={22} color="#1F2937" />
    <TextInput
      style={styles.fieldInput}
      placeholderTextColor={colors.placeHolderColor}
      {...props}
    />
  </View>
);

// ---------------------------------------------------------------
// Screen
// ---------------------------------------------------------------
const AddExpenditureScreen = ({ navigation }) => {
  const [expenseType, setExpenseType] = useState('');
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billImage, setBillImage] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDateChange = (event, selected) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'dismissed' || !selected) return;
    }

    if (selected) setDate(selected);
  };

  const handleUpload = async () => {
    // Plug in your picker here, e.g. react-native-image-picker:
    // const res = await launchImageLibrary({ mediaType: 'photo' });
    // setBillImage(res.assets[0].fileName);
    Alert.alert('Upload', 'Connect your image picker in handleUpload().');
  };

  const handleSave = async () => {
    if (!expenseType)
      return Alert.alert('Required', 'Please select expense type');
    if (!date) return Alert.alert('Required', 'Please select date');
    if (!amount.trim()) return Alert.alert('Required', 'Please enter amount');
    if (!paymentMode)
      return Alert.alert('Required', 'Please select payment mode');
    if (!paidTo.trim())
      return Alert.alert('Required', 'Please enter payee name');

    setSaving(true);

    try {
      // Connect your save-expenditure API here.
      console.log('Save expenditure:', {
        expenseType,
        date: date.toISOString(),
        amount,
        paymentMode,
        paidTo,
        transactionId,
        billNo,
        billImage,
        description,
        remarks,
      });

      navigation && navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save expenditure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Expenditure"
          onBack={() => navigation && navigation.goBack()}
        />

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Expense Type & Date */}
            <View style={styles.row}>
              <View style={styles.colLeft}>
                <Label text="Expense Type" required />
                <Dropdown
                  icon="layers-outline"
                  value={expenseType}
                  placeholder="Select Expense Type"
                  options={EXPENSE_TYPES}
                  onSelect={setExpenseType}
                />
              </View>

              <View style={styles.colRight}>
                <Label text="Date" required />
                <TouchableOpacity
                  style={styles.field}
                  activeOpacity={0.8}
                  onPress={() => setShowPicker(true)}
                >
                  <Icon
                    name="calendar-month-outline"
                    size={22}
                    color="#1F2937"
                  />
                  <Text
                    style={[styles.fieldText, !date && styles.placeholderText]}
                  >
                    {date ? formatDate(date) : 'dd/mm/yyyy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount & Payment Mode */}
            <View style={styles.row}>
              <View style={styles.colLeft}>
                <Label text="Amount (₹)" required />
                <InputField
                  icon="currency-inr"
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  editable={!saving}
                />
              </View>

              <View style={styles.colRight}>
                <Label text="Payment Mode" required />
                <Dropdown
                  icon="credit-card-outline"
                  value={paymentMode}
                  placeholder="Select Payment Mode"
                  options={PAYMENT_MODES}
                  onSelect={setPaymentMode}
                />
              </View>
            </View>

            {/* Paid To & Transaction ID */}
            <View style={styles.row}>
              <View style={styles.colLeft}>
                <Label text="Paid To" required />
                <InputField
                  icon="account-outline"
                  placeholder="Enter payee name"
                  value={paidTo}
                  onChangeText={setPaidTo}
                  editable={!saving}
                />
              </View>

              <View style={styles.colRight}>
                <Label text="Transaction ID" />
                <InputField
                  icon="swap-horizontal"
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChangeText={setTransactionId}
                  autoCapitalize="characters"
                  editable={!saving}
                />
              </View>
            </View>

            {/* Bill No & Bill Image */}
            <View style={styles.row}>
              <View style={styles.colLeft}>
                <Label text="Bill No." />
                <InputField
                  icon="pound"
                  placeholder="Enter bill number"
                  value={billNo}
                  onChangeText={setBillNo}
                  editable={!saving}
                />
              </View>

              <View style={styles.colRight}>
                <Label text="Bill Image" />
                <TouchableOpacity
                  style={styles.upload}
                  activeOpacity={0.8}
                  onPress={handleUpload}
                >
                  <Icon name="cloud-upload-outline" size={34} color="#2E8B3E" />
                  <Text style={styles.uploadText} numberOfLines={2}>
                    {billImage || 'Click to upload bill image'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.block}>
              <Label text="Description" />
              <View style={[styles.field, styles.areaField]}>
                <Icon
                  name="text-box-outline"
                  size={22}
                  color="#1F2937"
                  style={styles.areaIcon}
                />
                <TextInput
                  style={[styles.fieldInput, styles.areaInput]}
                  placeholder="Enter description"
                  placeholderTextColor={colors.placeHolderColor}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  editable={!saving}
                />
              </View>
            </View>

            {/* Remarks */}
            <View style={styles.block}>
              <Label text="Remarks" />
              <View style={[styles.field, styles.areaField]}>
                <Icon
                  name="comment-outline"
                  size={22}
                  color="#1F2937"
                  style={styles.areaIcon}
                />
                <TextInput
                  style={[styles.fieldInput, styles.areaInput]}
                  placeholder="Enter remarks"
                  placeholderTextColor={colors.placeHolderColor}
                  value={remarks}
                  onChangeText={setRemarks}
                  multiline
                  textAlignVertical="top"
                  editable={!saving}
                />
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={() => navigation && navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={saving}
            >
              <Icon
                name="content-save-outline"
                size={24}
                color={colors.white}
              />
              <Text style={styles.saveText}>
                {saving ? 'Saving...' : 'Save Expenditure'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Date Picker */}
        {showPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showPicker && Platform.OS === 'ios' && (
          <Modal
            transparent
            animationType="slide"
            onRequestClose={() => setShowPicker(false)}
          >
            <View style={styles.iosOverlay}>
              <View style={styles.iosSheet}>
                <TouchableOpacity
                  style={styles.iosDone}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>

                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              </View>
            </View>
          </Modal>
        )}
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
    paddingHorizontal: wp('4.5%'),
    paddingTop: 22,
    paddingBottom: 16,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  colLeft: {
    flex: 1,
    marginRight: 10,
  },

  colRight: {
    flex: 1,
  },

  block: {
    marginBottom: 14,
  },

  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#123B28',
    marginBottom: 7,
  },

  required: {
    color: colors.requiredColor,
  },

  // Fields
  field: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  fieldText: {
    flex: 1,
    marginLeft: 10,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#111827',
  },

  placeholderText: {
    color: '#6B7280',
  },

  fieldInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#111827',
    paddingVertical: 0,
  },

  areaField: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
  },

  areaIcon: {
    marginTop: 1,
  },

  areaInput: {
    height: '100%',
    paddingTop: 0,
  },

  // Upload
  upload: {
    height: 88,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5DBB6E',
    borderRadius: 12,
    backgroundColor: '#F2FBF5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  uploadText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#2E8B3E',
    textAlign: 'center',
    marginTop: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp('4.5%'),
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF1EF',
    backgroundColor: colors.white,
  },

  cancelButton: {
    flex: 0.8,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#EEF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cancelText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  saveButton: {
    flex: 1.5,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#2E8B3E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  saveText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.white,
    marginLeft: 8,
  },

  // Dropdown modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sheet: {
    width: wp('70%'),
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 8,
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  sheetItemActive: {
    backgroundColor: colors.primaryLight,
  },

  sheetText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: colors.SecondTitleColor,
  },

  sheetTextActive: {
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },

  // iOS date picker
  iosOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  iosSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },

  iosDone: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  iosDoneText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
});

export default AddExpenditureScreen;
