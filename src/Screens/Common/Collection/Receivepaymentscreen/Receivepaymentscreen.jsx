import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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

import {
  getCollectors,
  getPaymentModes,
  getFundTypes,
  createPaymentEntry,
  preparePaymentPayload,
  formatCollectorsForDisplay,
  formatFundTypesForDisplay,
} from '../../../../api/collection';

const newFund = () => ({
  id: String(Date.now() + Math.random()),
  type: '',
  amount: '',
});

// Wraps an input/dropdown and shows a loader inside the box (right side) while loading
const FieldLoader = ({ loading, height = 48, style, children }) => (
  <View style={style}>
    {children}
    {loading && (
      <View pointerEvents="none" style={[styles.fieldLoader, { height }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )}
  </View>
);

const ReceivePaymentScreen = ({ navigation }) => {
  // Form states
  const [date, setDate] = useState(new Date());
  const [regNo, setRegNo] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [tallyNo, setTallyNo] = useState('');
  const [collectedBy, setCollectedBy] = useState('');
  const [collectedByMemberId, setCollectedByMemberId] = useState('');
  const [method, setMethod] = useState('');
  const [funds, setFunds] = useState([newFund()]);

  const [anonymous, setAnonymous] = useState(false);
  const [member, setMember] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberType, setMemberType] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  // API data states
  const [collectors, setCollectors] = useState([]);
  const [collectorsList, setCollectorsList] = useState([]); // Full list with _id
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [fundTypes, setFundTypes] = useState([]);
  const [fundTypesList, setFundTypesList] = useState([]); // Full list with _id

  // Individual loading states for dropdowns only
  const [loadingStates, setLoadingStates] = useState({
    collectors: true,
    paymentModes: true,
    fundTypes: true,
  });

  // Load API data on mount
  useEffect(() => {
    loadFormData();
  }, []);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Receive Payment screen focused - refreshing data');
      loadFormData();
    }, []),
  );

  const loadFormData = async () => {
    try {
      // Don't show full screen loader, only set individual dropdown loaders
      setLoadingStates({
        collectors: true,
        paymentModes: true,
        fundTypes: true,
      });

      // Parallel load all APIs
      const [collectorsRes, modesRes, fundsRes] = await Promise.all([
        getCollectors(),
        getPaymentModes(),
        getFundTypes(),
      ]);

      if (collectorsRes.success && collectorsRes.collectors) {
        setCollectorsList(collectorsRes.collectors);
        const formatted = formatCollectorsForDisplay(collectorsRes.collectors);
        setCollectors(formatted.map(c => c.displayName));
        console.log('✅ Collectors loaded:', collectorsRes.collectors.length);
      }
      setLoadingStates(p => ({ ...p, collectors: false }));

      if (modesRes.success && modesRes.paymentModes) {
        setPaymentMethods(modesRes.paymentModes);
        console.log('✅ Payment modes loaded:', modesRes.paymentModes.length);
      }
      setLoadingStates(p => ({ ...p, paymentModes: false }));

      if (fundsRes.success && fundsRes.fundTypes) {
        setFundTypesList(fundsRes.fundTypes);
        const formatted = formatFundTypesForDisplay(fundsRes.fundTypes);
        setFundTypes(formatted.map(f => f.displayName));
        console.log('✅ Fund types loaded:', fundsRes.fundTypes.length);
      }
      setLoadingStates(p => ({ ...p, fundTypes: false }));
    } catch (error) {
      console.error('❌ Error loading form data:', error);
      Alert.alert('Error', 'Failed to load form data');
      // Set all loading states to false on error
      setLoadingStates({
        collectors: false,
        paymentModes: false,
        fundTypes: false,
      });
    } finally {
      // Screen is ready immediately, no need for full screen loader
    }
  };

  // Called by SelectMember screen when a member is picked
  const handleMemberSelected = selectedMember => {
    if (!selectedMember) return;
    const code = selectedMember.memberId || selectedMember.uniqueId || 'N/A';
    const name = selectedMember.fullName || selectedMember.memberName || '';
    setMember(`${code} - ${name}`);
    setMemberCode(selectedMember.memberId || selectedMember.uniqueId);
    setMemberName(name);
    setMemberType(selectedMember.memberType || '');
    setCity(selectedMember.city || '');
    setAddress(
      selectedMember.residentialAddress || selectedMember.address || '',
    );
  };

  const openSelectMember = () => {
    navigation &&
      navigation.navigate('SelectMemberScreen', {
        onSelect: handleMemberSelected,
        selectedId: memberCode,
      });
  };

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
      // Format date as YYYY-MM-DD
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const payload = preparePaymentPayload({
        date: dateString,
        regNo,
        receiptNo,
        tallyNo,
        collectedBy,
        collectedByMemberId,
        paymentMode: method,
        funds: validFunds.map(f => ({
          type: f.type,
          amount: f.amount,
        })),
        isAnonymous: anonymous,
        memberCode,
        memberName,
        memberType,
        address,
        city,
        country,
        remarks,
      });

      console.log('💾 Saving payment...');
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      const result = await createPaymentEntry(payload);

      if (result.success) {
        console.log('✅ Payment saved successfully!');
        Alert.alert('Success', 'Payment recorded successfully!', [
          {
            text: 'OK',
            onPress: () => {
              handleReset();
              navigation && navigation.navigate('Transactions');
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to save payment');
      }
    } catch (error) {
      console.error('❌ Error saving:', error);
      Alert.alert('Error', error.message || 'Failed to save payment');
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
                  <FieldLoader
                    loading={loadingStates.collectors}
                    style={styles.gap}
                  >
                    <Dropdown
                      value={collectedBy}
                      placeholder="Search collector by name..."
                      options={collectors}
                      onSelect={displayName => {
                        // Find the collector from full list by display name
                        const formatted =
                          formatCollectorsForDisplay(collectorsList);
                        const collector = formatted.find(
                          c => c.displayName === displayName,
                        );
                        setCollectedBy(displayName);
                        setCollectedByMemberId(collector?._id || '');
                        console.log(
                          '✅ Selected collector:',
                          displayName,
                          collector?._id,
                        );
                      }}
                      searchable
                    />
                  </FieldLoader>

                  <Label text="Payment Method" required />
                  <FieldLoader loading={loadingStates.paymentModes}>
                    <Dropdown
                      value={method}
                      placeholder="Select Payment Method"
                      options={paymentMethods.map(m => m.name)}
                      onSelect={setMethod}
                    />
                  </FieldLoader>
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
                        <FieldLoader
                          loading={loadingStates.fundTypes}
                          height={42}
                        >
                          <Dropdown
                            value={f.type}
                            placeholder="Search fund type..."
                            options={fundTypes}
                            onSelect={displayName => {
                              // Find fund type _id
                              const formatted =
                                formatFundTypesForDisplay(fundTypesList);
                              const fund = formatted.find(
                                ft => ft.displayName === displayName,
                              );
                              updateFund(f.id, {
                                type: fund?._id || displayName,
                                typeName: displayName,
                              });
                            }}
                            searchable
                            style={styles.smallField}
                          />
                        </FieldLoader>
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

                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                  </View>

                  <View
                    style={anonymous && styles.dim}
                    pointerEvents={anonymous ? 'none' : 'auto'}
                  >
                    <TouchableOpacity
                      style={[styles.memberField, styles.gap]}
                      activeOpacity={0.8}
                      onPress={openSelectMember}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.memberFieldText,
                          !member && styles.memberFieldPlaceholder,
                        ]}
                      >
                        {member || 'Search by Member ID or Name...'}
                      </Text>
                      <Icon name="chevron-down" size={22} color="#6B7280" />
                    </TouchableOpacity>
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
                    options={['India', 'UAE', 'Other']}
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

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
  },

  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  loaderText: {
    marginTop: 12,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
  },

  // Loader shown inside the input box (right side, left of the dropdown arrow)
  fieldLoader: {
    position: 'absolute',
    top: 0,
    right: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  disabledField: {
    opacity: 0.5,
  },

  memberLoaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 12,
  },

  memberLoaderInline: {
    marginRight: 8,
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

  memberField: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: colors.white,
  },

  memberFieldText: {
    flex: 1,
    marginRight: 8,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#111827',
  },

  memberFieldPlaceholder: {
    color: '#9CA3AF',
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
