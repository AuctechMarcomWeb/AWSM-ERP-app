import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
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
  TextField,
  Dropdown,
  DateField,
  GreenButton,
  GrayButton,
  formatDate,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// ---------------------------------------------------------------
// Config
// ---------------------------------------------------------------
const STATUSES = ['Draft', 'Submitted'];

const FUND_TYPES = [
  'Ordinary Member',
  'Life Member',
  'Dawami Member',
  'Sarparast Member',
  'Mohsine Member',
  'Return of Qarze Hasna',
  'Sahme-Imam (Khums)',
  'Sahme-Sadat (Khums)',
  'General Donation',
  'Namzad Fund',
  'Corpus Fund',
  'Calendar Hadiya',
  'Magazine Hadiya',
  'Calendar Ad Hadiya',
  'Magazine Ad Hadiya',
  'Scholarship Pay',
];

// Entries table columns (horizontal scroll)
const COLS = [
  { key: 'sr', label: 'Sr.\nNo.', width: 52 },
  { key: 'date', label: 'Date *', width: 140 },
  { key: 'receiptNo', label: 'Receipt\nNo', width: 96 },
  { key: 'regNo', label: 'Reg.\nNo', width: 86 },
  { key: 'tallyNo', label: 'Tally\nNo', width: 86 },
  { key: 'memberCode', label: 'Member\nCode', width: 96 },
  { key: 'name', label: 'Name *', width: 160 },
  { key: 'city', label: 'City', width: 110 },
  { key: 'del', label: '', width: 44 },
];

const newEntry = () => ({
  id: String(Date.now() + Math.random()),
  date: null,
  receiptNo: '',
  regNo: '',
  tallyNo: '',
  memberCode: '',
  name: '',
  city: '',
});

const emptyAmounts = () =>
  FUND_TYPES.reduce((acc, f) => ({ ...acc, [f]: '' }), {});

const AddFardeHisaabScreen = ({ navigation }) => {
  const [collectedBy, setCollectedBy] = useState('');
  const [memberId, setMemberId] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('Draft');
  const [remarks, setRemarks] = useState('');
  const [entries, setEntries] = useState([newEntry()]);
  const [amounts, setAmounts] = useState(emptyAmounts());
  const [saving, setSaving] = useState(false);

  const updateEntry = (id, patch) =>
    setEntries(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));

  const removeEntry = id =>
    setEntries(prev =>
      prev.length > 1 ? prev.filter(e => e.id !== id) : prev,
    );

  const setAmount = (key, value) =>
    setAmounts(prev => ({ ...prev, [key]: value.replace(/[^0-9.]/g, '') }));

  const total = FUND_TYPES.reduce((s, f) => s + (Number(amounts[f]) || 0), 0);

  const handleSave = async () => {
    if (!collectedBy.trim())
      return Alert.alert('Required', 'Please enter collected by');
    if (!fromDate) return Alert.alert('Required', 'Please select from date');
    if (!toDate) return Alert.alert('Required', 'Please select to date');
    if (fromDate > toDate)
      return Alert.alert('Invalid dates', 'From date cannot be after To date');

    const filled = entries.filter(
      e =>
        e.date ||
        e.receiptNo ||
        e.regNo ||
        e.tallyNo ||
        e.memberCode ||
        e.name ||
        e.city,
    );

    if (filled.length === 0) {
      return Alert.alert('Required', 'Please add at least one entry');
    }

    if (filled.some(e => !e.date || !e.name.trim())) {
      return Alert.alert('Required', 'Each entry needs a date and name');
    }

    setSaving(true);

    try {
      console.log('Save farde hisaab:', {
        collectedBy,
        memberId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        city,
        state,
        status,
        remarks,
        entries: filled,
        amounts,
        total,
      });

      navigation && navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Farde Hisaab Report"
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
                contentContainerStyle={styles.scrollContent}
              >
                {/* Organisation */}
                {/* <View style={styles.org}>
                  <View style={styles.orgRow}>
                    <Image
                      source={require('../../../../assets/awsm-logo-transparent.png')}
                      style={styles.orgLogo}
                      resizeMode="contain"
                    />

                    <View style={styles.orgTextBox}>
                      <Text style={styles.orgUrdu}>
                        انجمن وظیفہ سادات و مومنین
                      </Text>
                      <Text style={styles.orgEnglish}>
                        ANJUMAN WAZIFA-E-SADAT WA MOMINEEN
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.orgAddress}>
                    Wazifa Manzil, Ahmad Nagar, Aligarh-202002 (U.P.) ESTD. 1917
                  </Text>
                </View> */}

                {/* Details */}
                <View style={shared.row}>
                  <View style={shared.colL}>
                    <Label text="Collected By" required />
                    <TextField
                      icon="account-outline"
                      placeholder="Search or enter name"
                      value={collectedBy}
                      onChangeText={setCollectedBy}
                    />
                  </View>

                  <View style={shared.col}>
                    <Label text="City" />
                    <TextField
                      icon="office-building-outline"
                      placeholder="Enter city"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                </View>

                <View style={shared.row}>
                  <View style={shared.colL}>
                    <Label text="Member ID" />
                    <TextField
                      icon="card-account-details-outline"
                      placeholder="Enter member ID"
                      value={memberId}
                      onChangeText={setMemberId}
                    />
                  </View>

                  <View style={shared.col}>
                    <Label text="State" />
                    <TextField
                      icon="map-marker-outline"
                      placeholder="Enter state"
                      value={state}
                      onChangeText={setState}
                    />
                  </View>
                </View>

                <View style={shared.row}>
                  <View style={shared.colL}>
                    <Label text="From Date" required />
                    <DateField
                      value={fromDate}
                      onChange={setFromDate}
                      leftIcon="calendar-month-outline"
                      hideRightIcon
                    />
                  </View>

                  <View style={shared.col}>
                    <Label text="Status" />
                    <Dropdown
                      value={status}
                      options={STATUSES}
                      onSelect={setStatus}
                    />
                  </View>
                </View>

                <View style={shared.row}>
                  <View style={shared.colL}>
                    <Label text="To Date" required />
                    <DateField
                      value={toDate}
                      onChange={setToDate}
                      leftIcon="calendar-month-outline"
                      hideRightIcon
                    />
                  </View>

                  <View style={shared.col} />
                </View>

                <Label text="Remarks" />
                <TextField
                  icon="note-edit-outline"
                  placeholder="Enter remarks..."
                  value={remarks}
                  onChangeText={setRemarks}
                  multiline
                  textAlignVertical="top"
                  style={styles.area}
                  inputStyle={styles.areaInput}
                />

                {/* Entries */}
                <View style={styles.entriesWrap}>
                  <View style={styles.entriesBar}>
                    <Text style={styles.entriesTitle}>
                      Farde Hisaab Entries
                    </Text>

                    <TouchableOpacity
                      style={styles.addRow}
                      activeOpacity={0.8}
                      onPress={() => setEntries(prev => [...prev, newEntry()])}
                    >
                      <Icon name="plus" size={18} color={colors.white} />
                      <Text style={styles.addRowText}>Add Row</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      {/* Header */}
                      <View style={styles.tHead}>
                        {COLS.map(c => (
                          <View
                            key={c.key}
                            style={[styles.tHeadCell, { width: c.width }]}
                          >
                            <Text style={styles.tHeadText}>{c.label}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Rows */}
                      {entries.map((e, index) => (
                        <View key={e.id} style={styles.tRow}>
                          <View
                            style={[styles.srCell, { width: COLS[0].width }]}
                          >
                            <Text style={styles.srText}>{index + 1}</Text>
                          </View>

                          <View style={[styles.cell, { width: COLS[1].width }]}>
                            <DateField
                              value={e.date}
                              onChange={d => updateEntry(e.id, { date: d })}
                              style={styles.cellField}
                            />
                          </View>

                          {[
                            ['receiptNo', 2, ''],
                            ['regNo', 3, ''],
                            ['tallyNo', 4, ''],
                            ['memberCode', 5, 'Code'],
                            ['name', 6, 'Enter name'],
                            ['city', 7, ''],
                          ].map(([key, ci, ph]) => (
                            <View
                              key={key}
                              style={[styles.cell, { width: COLS[ci].width }]}
                            >
                              <TextInput
                                style={styles.cellInput}
                                placeholder={ph}
                                placeholderTextColor={colors.placeHolderColor}
                                value={e[key]}
                                onChangeText={v =>
                                  updateEntry(e.id, { [key]: v })
                                }
                              />
                            </View>
                          ))}

                          <TouchableOpacity
                            style={[
                              styles.cell,
                              styles.delCell,
                              { width: COLS[8].width },
                            ]}
                            onPress={() => removeEntry(e.id)}
                            disabled={entries.length === 1}
                          >
                            <Icon
                              name="trash-can-outline"
                              size={20}
                              color={
                                entries.length === 1 ? '#F3B1B1' : '#E53935'
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Fund types */}
                <View style={styles.fundWrap}>
                  <View style={styles.fundBar}>
                    <Text style={styles.fundTitle}>
                      Membership / Fund Type (Amount ₹)
                    </Text>
                  </View>

                  <View style={styles.fundGrid}>
                    {FUND_TYPES.map(f => (
                      <View key={f} style={styles.fundCell}>
                        <Text style={styles.fundLabel} numberOfLines={1}>
                          {f}
                        </Text>
                        <TextInput
                          style={styles.fundInput}
                          placeholder="0"
                          placeholderTextColor={colors.placeHolderColor}
                          value={amounts[f]}
                          onChangeText={v => setAmount(f, v)}
                          keyboardType="numeric"
                          textAlign="center"
                        />
                      </View>
                    ))}
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹ {total}</Text>
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={shared.footer}>
                <GrayButton
                  title="Cancel"
                  onPress={() => navigation && navigation.goBack()}
                  disabled={saving}
                  style={styles.cancel}
                />

                <GreenButton
                  title={saving ? 'Saving...' : 'Save & Close'}
                  icon="content-save-outline"
                  onPress={handleSave}
                  disabled={saving}
                  style={styles.save}
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
    backgroundColor: colors.backgroundDark,
  },
  body: {
    flex: 1,
    marginTop: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
      marginTop: 24,
    paddingHorizontal: wp('4%'),
    paddingTop: 14,
    paddingBottom: 24,
  },

  // Organisation
  org: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
  },

  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  orgLogo: {
    width: 46,
    height: 46,
    marginRight: 10,
  },

  orgTextBox: {
    flexShrink: 1,
  },

  orgUrdu: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    textAlign: 'center',
  },

  orgEnglish: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
    textAlign: 'center',
  },

  orgAddress: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },

  // Remarks
  area: {
    height: 84,
    alignItems: 'flex-start',
    paddingTop: 12,
    marginBottom: 16,
  },

  areaInput: {
    height: '100%',
    paddingTop: 0,
  },

  // Entries
  entriesWrap: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.cardColorLight,
  },

  entriesBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  entriesTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addRowText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.white,
    marginLeft: 2,
  },

  tHead: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F3',
  },

  tHeadCell: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.neutral.border,
  },

  tHeadText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    textAlign: 'center',
  },

  tRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardColorLight,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },

  srCell: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },

  srText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
  },

  cell: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  cellField: {
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  cellInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.TitleColor,
    paddingVertical: 0,
    backgroundColor: colors.white,
  },

  delCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Fund types
  fundWrap: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.cardColorLight,
    marginBottom: 12,
  },

  fundBar: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  fundTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },

  fundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 6,
  },

  fundCell: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  fundLabel: {
    flex: 1,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: colors.TitleColor,
    marginRight: 6,
  },

  fundInput: {
    width: 64,
    height: 38,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.TitleColor,
    paddingVertical: 0,
    paddingHorizontal: 4,
    backgroundColor: colors.white,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F7FAF8',
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },

  totalLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },

  totalValue: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: colors.success,
  },

  cancel: {
    flex: 1,
    marginRight: 12,
  },

  save: {
    flex: 1.6,
  },
});

export default AddFardeHisaabScreen;
