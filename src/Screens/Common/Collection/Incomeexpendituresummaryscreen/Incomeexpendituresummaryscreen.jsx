import React, { useState } from 'react';

import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';

import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';

import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';

import {
  Body,
  Label,
  DateField,
  GreenButton,
  GrayButton,
  formatNumber,
  shared,
} from '../../../../components/Formparts';

// ---------------------------------------------------------------
// Dummy data — replace with your API response
// ---------------------------------------------------------------
const SUMMARY = {
  income: [], // [{ label: 'Corpus Fund', amount: 500 }]
  expenditure: [], // [{ label: 'Postage', amount: 200 }]
  lastBalance: 0,
  presentIncome: 0,
};

// Section header bar (green) with a right-side label
const Bar = ({ left, right }) => (
  <View style={styles.bar}>
    <Text style={styles.barText}>{left}</Text>
    <Text style={styles.barText}>{right}</Text>
  </View>
);

const Line = ({ label, value, tone = 'light' }) => (
  <View
    style={[
      styles.line,
      tone === 'light' ? styles.lineLight : styles.lineWhite,
    ]}
  >
    <Text style={styles.lineLabel}>{label}</Text>
    <Text style={styles.lineValue}>{value}</Text>
  </View>
);

const IncomeExpenditureSummaryScreen = ({ navigation }) => {
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [saving, setSaving] = useState(false);

  const totalIncome = SUMMARY.income.reduce((s, r) => s + r.amount, 0);
  const totalExpenditure = SUMMARY.expenditure.reduce(
    (s, r) => s + r.amount,
    0,
  );

  const handleSave = async () => {
    if (from > to) {
      Alert.alert('Invalid dates', 'From date cannot be after To date');
      return;
    }

    setSaving(true);

    try {
      // Connect your save-summary API here.
      console.log('Save summary:', {
        from: from.toISOString(),
        to: to.toISOString(),
      });
      navigation && navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Income & Expenditure Summary"
          onBack={() => navigation && navigation.goBack()}
          rightIcon="plus"
          rightVariant="solid"
          onRightPress={() =>
            navigation && navigation.navigate('ComposeMessage')
          }
        />
        <Body>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={shared.scroll}
          >
            {/* Dates */}
            <View style={shared.row}>
              <View style={shared.colL}>
                <Label text="From Date" />
                <DateField value={from} onChange={setFrom} />
              </View>

              <View style={shared.col}>
                <Label text="To Date" />
                <DateField value={to} onChange={setTo} />
              </View>
            </View>

            {/* Income */}
            <View style={styles.block}>
              <Bar left="INCOME" right="AMOUNT" />

              {SUMMARY.income.map(r => (
                <Line
                  key={r.label}
                  label={r.label}
                  value={`₹ ${formatNumber(r.amount)}`}
                  tone="white"
                />
              ))}

              <Line
                label="TOTAL INCOME"
                value={`₹ ${formatNumber(totalIncome)}`}
              />
            </View>

            {/* Expenditure */}
            <View style={styles.block}>
              <Bar left="EXPENDITURE" right="AMOUNT" />

              {SUMMARY.expenditure.map(r => (
                <Line
                  key={r.label}
                  label={r.label}
                  value={`₹ ${formatNumber(r.amount)}`}
                  tone="white"
                />
              ))}

              <Line
                label="TOTAL EXPENDITURE"
                value={`₹ ${formatNumber(totalExpenditure)}`}
              />
            </View>

            {/* Items */}
            <View style={styles.block}>
              <Bar left="ITEMS" right="AMOUNT" />
              <Line
                label="Last Balance"
                value={formatNumber(SUMMARY.lastBalance)}
                tone="white"
              />
              <Line
                label="Present Income"
                value={formatNumber(SUMMARY.presentIncome)}
                tone="white"
              />
            </View>
          </ScrollView>

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
        </Body>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderColor: '#DDE6E0',
    marginBottom: 14,
  },

  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1F6F2E',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  barText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5ECE7',
  },

  lineLight: {
    backgroundColor: '#E6F2EA',
  },

  lineWhite: {
    backgroundColor: '#FFFFFF',
  },

  lineLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  lineValue: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  cancel: {
    flex: 1,
    marginRight: 12,
  },

  save: {
    flex: 1.5,
  },
});

export default IncomeExpenditureSummaryScreen;
