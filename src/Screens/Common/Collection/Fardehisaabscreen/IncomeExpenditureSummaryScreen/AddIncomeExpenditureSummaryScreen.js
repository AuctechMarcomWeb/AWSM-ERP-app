import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../../themes/typography';

import AppLayout from '../../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  DateField,
  Dropdown,
  GreenButton,
  GrayButton,
  shared,
} from '../../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const STATUSES = ['Select', 'Approved', 'Pending', 'Rejected'];

const AddIncomeExpenditureSummaryScreen = ({ navigation }) => {
  const [fromDate, setFromDate] = useState(new Date(2026, 10, 1));
  const [toDate, setToDate] = useState(new Date(2026, 10, 30));
  const [totalIncome, setTotalIncome] = useState('0');
  const [totalExpenditure, setTotalExpenditure] = useState('0');

  // Items table fields
  const [lastBalance, setLastBalance] = useState('0');
  const [presentIncome, setPresentIncome] = useState('0');
  const [expenditure, setExpenditure] = useState('0');
  const [sentToHeadOffice, setSentToHeadOffice] = useState('0');
  const [depositedBank, setDepositedBank] = useState('0');

  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Select');

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Income & Expenditure Summary Form"
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
                contentContainerStyle={styles.scrollContent}
              >
                {/* Date Selection Row */}
                <View style={[shared.row, styles.dateRow]}>
                  <View style={shared.colL}>
                    <Label text="From Date *" />
                    <DateField
                      value={fromDate}
                      onChange={setFromDate}
                      leftIcon="calendar-month-outline"
                      hideRightIcon
                    />
                  </View>

                  <View style={shared.col}>
                    <Label text="To Date *" />
                    <DateField
                      value={toDate}
                      onChange={setToDate}
                      leftIcon="calendar-month-outline"
                      hideRightIcon
                    />
                  </View>
                </View>

                {/* INCOME Section */}
                <View style={styles.tableCard}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>INCOME</Text>
                    <Text style={styles.headerText}>AMOUNT</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>Total Income</Text>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <TextInput
                        style={styles.tableInput}
                        value={totalIncome}
                        onChangeText={setTotalIncome}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* EXPENDITURE Section */}
                <View style={styles.tableCard}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>EXPENDITURE</Text>
                    <Text style={styles.headerText}>AMOUNT</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>Total Expenditure</Text>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <TextInput
                        style={styles.tableInput}
                        value={totalExpenditure}
                        onChangeText={setTotalExpenditure}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* ITEMS Section */}
                <View style={styles.tableCard}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>ITEMS</Text>
                    <Text style={styles.headerText}>AMOUNT</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>Last Balance</Text>
                    <TextInput
                      style={styles.simpleInput}
                      value={lastBalance}
                      onChangeText={setLastBalance}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>Present Income</Text>
                    <TextInput
                      style={styles.simpleInput}
                      value={presentIncome}
                      onChangeText={setPresentIncome}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>

                  <View style={[styles.tableRow, styles.subtotalRow]}>
                    <Text style={styles.rowLabelBold}>TOTAL</Text>
                    <Text style={styles.subtotalValue}>0</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>Expenditure</Text>
                    <TextInput
                      style={styles.simpleInput}
                      value={expenditure}
                      onChangeText={setExpenditure}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>Sent To Head Office</Text>
                    <TextInput
                      style={styles.simpleInput}
                      value={sentToHeadOffice}
                      onChangeText={setSentToHeadOffice}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.rowLabel}>
                      Deposited in Local Bank/G.W
                    </Text>
                    <TextInput
                      style={styles.simpleInput}
                      value={depositedBank}
                      onChangeText={setDepositedBank}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                  </View>

                  <View style={[styles.tableRow, styles.subtotalRow]}>
                    <Text style={styles.rowLabelBold}>TOTAL</Text>
                    <Text style={styles.subtotalValue}>0</Text>
                  </View>

                  <View style={[styles.tableRow, styles.finalRow]}>
                    <Text style={styles.rowLabelBold}>PRESENT BALANCE</Text>
                    <Text style={styles.subtotalValue}>0</Text>
                  </View>
                </View>

                {/* NOTE Section */}
                <Label text="NOTE :" />
                <TextInput
                  style={styles.noteInput}
                  placeholder="Enter notes here..."
                  placeholderTextColor={colors.placeHolderColor}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                />

                {/* Signatures Grid */}
                <View style={styles.signCard}>
                  <View style={styles.signCol}>
                    <Text style={styles.signTitle}>Name & Sign:</Text>
                    <View style={styles.signBox}>
                      <Text style={styles.signNameText}>Name</Text>
                    </View>
                    <Text style={styles.signRole}>Local Secretary</Text>
                  </View>

                  <View style={styles.signCol}>
                    <Text style={styles.signTitle}>Name & Sign:</Text>
                    <View style={styles.signBox}>
                      <Text style={styles.signNameText}>Name</Text>
                    </View>
                    <Text style={styles.signRole}>Office Assistant</Text>
                  </View>

                  <View style={styles.signCol}>
                    <Text style={styles.signTitle}>Name & Sign:</Text>
                    <View style={styles.signBox}>
                      <Text style={styles.signNameText}>Name</Text>
                    </View>
                    <Text style={styles.signRole}>Office Superintende</Text>
                  </View>
                </View>

                {/* Status Dropdown */}
                <Label text="Status:" />
                <Dropdown
                  value={status}
                  options={STATUSES}
                  onSelect={setStatus}
                  style={styles.statusGap}
                />
              </ScrollView>

              {/* Footer Buttons */}
              <View style={shared.footer}>
                <GrayButton
                  title="Cancel"
                  onPress={() => navigation && navigation.goBack()}
                  style={styles.cancelBtn}
                />

                <GreenButton
                  title="Submit"
                  onPress={() => navigation && navigation.goBack()}
                  style={styles.submitBtn}
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
  dateRow: {
    marginBottom: 4,
  },
  tableCard: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: colors.white,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  subtotalRow: {
    backgroundColor: '#F7FAF8',
  },
  finalRow: {
    backgroundColor: '#F7FAF8',
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.TitleColor,
  },
  rowLabelBold: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
    marginRight: 4,
  },
  tableInput: {
    width: 90,
    height: 32,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.TitleColor,
    textAlign: 'right',
    backgroundColor: colors.white,
    paddingVertical: 0,
  },
  simpleInput: {
    width: 90,
    height: 32,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.TitleColor,
    backgroundColor: colors.white,
    paddingVertical: 0,
  },
  subtotalValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    paddingHorizontal: 12,
  },
  noteInput: {
    height: 76,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.TitleColor,
    backgroundColor: colors.white,
    marginBottom: 14,
  },
  signCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 14,
  },
  signCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  signTitle: {
    fontSize: 9,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  signBox: {
    width: '100%',
    height: 34,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 6,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  signNameText: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: colors.placeHolderColor,
  },
  signRole: {
    fontSize: 9,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
    textAlign: 'center',
  },
  statusGap: {
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
  },
  submitBtn: {
    flex: 1.5,
  },
});

export default AddIncomeExpenditureSummaryScreen;
