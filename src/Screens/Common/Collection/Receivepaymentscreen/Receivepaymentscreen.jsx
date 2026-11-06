import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';
import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  Section,
  TextField,
  Dropdown,
  DateField,
  GreenButton,
  GrayButton,
  shared,
} from '../../../../components/Formparts';

// ---------------------------------------------------------------
// Dummy options — replace with your API data
// ---------------------------------------------------------------
const COLLECTORS = ['Admin', 'Cashier', 'Secretary'];
const METHODS = ['Cash', 'UPI', 'Cheque', 'Bank Transfer'];
const FUNDS = [
  'Corpus Fund',
  'Reserve Fund',
  'Ordinary Member',
  'General Donation',
  'Life Member',
];
const COUNTRIES = ['India', 'UAE', 'Other'];
const MEMBERS = [
  '6 - Mr. Mohammad Ali Shamsi',
  '6383 - Harsh Gond',
  '0027 - Mr. Syed Mazhar Haider Zaidi',
  '0035 - Maulana Syed Zahid Husain',
];

const newFund = () => ({
  id: String(Date.now() + Math.random()),
  type: '',
  amount: '',
});

const ReceivePaymentScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [regNo, setRegNo] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [tallyNo, setTallyNo] = useState('');
  const [collectedBy, setCollectedBy] = useState('');
  const [method, setMethod] = useState('');
  const [funds, setFunds] = useState([newFund()]);

  const [anonymous, setAnonymous] = useState(false);
  const [member, setMember] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  const updateFund = (id, patch) =>
    setFunds(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));

  const removeFund = id =>
    setFunds(prev => (prev.length > 1 ? prev.filter(f => f.id !== id) : prev));

  const handleReset = () => {
    setDate(new Date());
    setRegNo('');
    setReceiptNo('');
    setTallyNo('');
    setCollectedBy('');
    setMethod('');
    setFunds([newFund()]);
    setAnonymous(false);
    setMember('');
    setAddress('');
    setCity('');
    setCountry('India');
    setRemarks('');
  };

  const handleSave = async () => {
    if (!date) return Alert.alert('Required', 'Please select date');
    if (!collectedBy) return Alert.alert('Required', 'Please select collector');
    if (!method) return Alert.alert('Required', 'Please select payment method');

    const validFunds = funds.filter(f => f.type && Number(f.amount) > 0);
    if (validFunds.length === 0) {
      return Alert.alert(
        'Required',
        'Please add at least one fund with amount',
      );
    }

    if (!anonymous && !member)
      return Alert.alert('Required', 'Please select a member');

    setSaving(true);

    try {
      // Connect your save-payment API here.
      console.log('Save payment:', {
        date: date.toISOString(),
        regNo,
        receiptNo,
        tallyNo,
        collectedBy,
        method,
        funds: validFunds,
        anonymous,
        member,
        address,
        city,
        country,
        remarks,
      });

      navigation && navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Received Payment"
          onBack={() => navigation && navigation.goBack()}
      
        />

        <View style={styles.body}>
          <Body>
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={shared.scroll}
              >
                {/* Transaction Details */}
                <Section title="Transaction Details">
                  <View style={shared.row}>
                    <View style={shared.colL}>
                      <Label text="Date" required />
                      <DateField value={date} onChange={setDate} />
                    </View>

                    <View style={shared.col}>
                      <Label text="Reg No. (Wasool No)" />
                      <TextField
                        placeholder="Enter Reg / Wasool No"
                        value={regNo}
                        onChangeText={setRegNo}
                      />
                    </View>
                  </View>

                  <Label text="Receipt No." />
                  <TextField
                    placeholder="Enter Receipt No"
                    value={receiptNo}
                    onChangeText={setReceiptNo}
                    style={styles.gap}
                  />

                  <Label text="Tally No." />
                  <TextField
                    placeholder="Enter Tally No"
                    value={tallyNo}
                    onChangeText={setTallyNo}
                    style={styles.gap}
                  />

                  <Label text="Collected By" required />
                  <Dropdown
                    value={collectedBy}
                    placeholder="Select Collector"
                    options={COLLECTORS}
                    onSelect={setCollectedBy}
                    style={styles.gap}
                  />

                  <Label text="Payment Method" required />
                  <Dropdown
                    value={method}
                    placeholder="Select Payment Method"
                    options={METHODS}
                    onSelect={setMethod}
                  />
                </Section>

                {/* Amount Details */}
                <Section title="Amount Details">
                  <View style={styles.tableHead}>
                    <Text style={[styles.headText, styles.hashCol]}>#</Text>
                    <Text style={[styles.headText, styles.typeCol]}>
                      Fund Type
                    </Text>
                    <Text style={[styles.headText, styles.amountCol]}>
                      Amount (Rs.)
                    </Text>
                    <View style={styles.deleteCol} />
                  </View>

                  {funds.map((f, index) => (
                    <View key={f.id} style={styles.fundRow}>
                      <Text style={[styles.hashText, styles.hashCol]}>
                        {index + 1}
                      </Text>

                      <View style={styles.typeCol}>
                        <Dropdown
                          value={f.type}
                          placeholder="Select Fund Type"
                          options={FUNDS}
                          onSelect={v => updateFund(f.id, { type: v })}
                          style={styles.smallField}
                        />
                      </View>

                      <View style={styles.amountCol}>
                        <TextField
                          placeholder="Enter Amount"
                          value={f.amount}
                          onChangeText={v =>
                            updateFund(f.id, {
                              amount: v.replace(/[^0-9.]/g, ''),
                            })
                          }
                          keyboardType="numeric"
                          style={styles.smallField}
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.deleteCol}
                        onPress={() => removeFund(f.id)}
                        disabled={funds.length === 1}
                      >
                        <Icon
                          name="trash-can-outline"
                          size={22}
                          color={funds.length === 1 ? '#F3B1B1' : '#E53935'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <GreenButton
                    title="Add Fund"
                    icon="plus"
                    onPress={() => setFunds(prev => [...prev, newFund()])}
                    style={styles.addFund}
                  />
                </Section>

                {/* Donor Details */}
                <Section
                  title="Donor Details"
                  right={
                    <TouchableOpacity
                      style={styles.anonRow}
                      activeOpacity={0.8}
                      onPress={() => setAnonymous(!anonymous)}
                    >
                      <View style={styles.anonBox}>
                        {anonymous && (
                          <Icon name="check" size={14} color="#2E7D32" />
                        )}
                      </View>
                      <Text style={styles.anonText}>Anonymous</Text>
                    </TouchableOpacity>
                  }
                >
                  <View style={styles.memberHead}>
                    <Label text="Member" style={styles.noMargin} />

                    <TouchableOpacity
                      style={styles.addMember}
                      onPress={() =>
                        navigation && navigation.navigate('AddMember')
                      }
                    >
                      <Icon
                        name="account-plus-outline"
                        size={18}
                        color="#2E8B3E"
                      />
                      <Text style={styles.addMemberText}>Add Member</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={anonymous && styles.dim}
                    pointerEvents={anonymous ? 'none' : 'auto'}
                  >
                    <Dropdown
                      value={member}
                      placeholder="Search by Member ID or Name..."
                      options={MEMBERS}
                      onSelect={setMember}
                      searchable
                      style={styles.gap}
                    />
                  </View>

                  <Label text="Address" />
                  <TextField
                    placeholder="Enter Address"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.gap}
                  />

                  <Label text="City" />
                  <TextField
                    placeholder="Enter City"
                    value={city}
                    onChangeText={setCity}
                    style={styles.gap}
                  />

                  <Label text="Country" />
                  <Dropdown
                    value={country}
                    options={COUNTRIES}
                    onSelect={setCountry}
                  />
                </Section>

                {/* Other Details */}
                <Section title="Other Details">
                  <Label text="Remarks" />
                  <TextField
                    placeholder="Optional notes..."
                    value={remarks}
                    onChangeText={setRemarks}
                    multiline
                    textAlignVertical="top"
                    style={styles.area}
                    inputStyle={styles.areaInput}
                  />
                </Section>
              </ScrollView>

              <View style={shared.footer}>
                <GrayButton
                  title="Reset"
                  onPress={handleReset}
                  disabled={saving}
                  style={styles.resetButton}
                />

                <GreenButton
                  title={saving ? 'Saving...' : 'Save Payment'}
                  icon="content-save-outline"
                  onPress={handleSave}
                  disabled={saving}
                  style={styles.saveButton}
                />
              </View>
            </KeyboardAvoidingView>
          </Body>
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
    marginTop: 15,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },

  flex: {
    flex: 1,
  },

  gap: {
    marginBottom: 12,
  },

  noMargin: {
    marginBottom: 0,
  },

  dim: {
    opacity: 0.45,
  },

  // Amount table
  tableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3F0',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 8,
  },

  headText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#374151',
  },

  fundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  hashCol: {
    width: 26,
    paddingLeft: 4,
  },

  hashText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#111827',
  },

  typeCol: {
    flex: 1.3,
    marginRight: 6,
  },

  amountCol: {
    flex: 1,
    marginRight: 4,
  },

  deleteCol: {
    width: 32,
    alignItems: 'center',
  },

  smallField: {
    height: 42,
    paddingHorizontal: 8,
  },

  addFund: {
    alignSelf: 'flex-end',
    height: 40,
    marginTop: 4,
  },

  // Donor
  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  anonBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  anonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#334155',
  },

  memberHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  addMember: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addMemberText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: '#2E8B3E',
    marginLeft: 4,
  },

  area: {
    height: 90,
    alignItems: 'flex-start',
    paddingTop: 10,
  },

  areaInput: {
    height: '100%',
  },

  resetButton: {
    flex: 1,
    marginRight: 12,
  },

  saveButton: {
    flex: 1.6,
  },
});

export default ReceivePaymentScreen;
