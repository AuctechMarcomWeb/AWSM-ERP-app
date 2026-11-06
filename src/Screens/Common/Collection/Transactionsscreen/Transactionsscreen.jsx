import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';

import {
  Body,
  Label,
  SearchField,
  Dropdown,
  DateField,
  GreenButton,
  Badge,
  formatRs,
  toDateObj,
  monthShort,
  startOfDay,
  shared,
} from '../../../../components/Formparts';
import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';

// ---------------------------------------------------------------
// Dummy data — replace with your API response
// ---------------------------------------------------------------
const MODES = ['All Modes', 'Cash', 'UPI', 'Cheque'];
const FUND_TYPES = [
  'All Fund Types',
  'Corpus Fund',
  'Ordinary Member',
  'General Donation',
  'Life Member',
];

const TRANSACTIONS = [
  {
    id: '1',
    name: 'Mr. Mohammad Ali Shamsi',
    fund: 'Corpus Fund',
    amount: 500,
    mode: 'Cash',
    date: '2026-08-20',
  },
  {
    id: '2',
    name: 'Anonymous',
    fund: 'Ordinary Member',
    amount: 1500,
    mode: 'UPI',
    date: '2026-08-20',
  },
  {
    id: '3',
    name: 'Mr. Mohammad Ali Shamsi',
    fund: 'General Donation',
    amount: 200,
    mode: 'Cash',
    date: '2026-08-20',
  },
  {
    id: '4',
    name: 'Mr. Mohammad Ali Shamsi',
    fund: 'Life Member',
    amount: 200,
    mode: 'Cash',
    date: '2026-08-20',
  },
];

const TransactionsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  // Applied filters state used for filtering list
  const [applied, setApplied] = useState({
    search: '',
    mode: 'All Modes',
    fund: 'All Fund Types',
    from: null,
    to: null,
  });

  // Modal open/close state
  const [filterOpen, setFilterOpen] = useState(false);

  // Draft filter states inside modal
  const [draftMode, setDraftMode] = useState('All Modes');
  const [draftFund, setDraftFund] = useState('All Fund Types');
  const [draftFrom, setDraftFrom] = useState(null);
  const [draftTo, setDraftTo] = useState(null);

  const openFilter = () => {
    setDraftMode(applied.mode);
    setDraftFund(applied.fund);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      mode: draftMode,
      fund: draftFund,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const data = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    return TRANSACTIONS.filter(t => {
      if (applied.mode !== 'All Modes' && t.mode !== applied.mode) return false;
      if (applied.fund !== 'All Fund Types' && t.fund !== applied.fund)
        return false;

      const d = toDateObj(t.date);
      if (applied.from && d < startOfDay(applied.from)) return false;
      if (applied.to && d > startOfDay(applied.to)) return false;

      if (q && !t.name.toLowerCase().includes(q)) return false;

      return true;
    });
  }, [applied]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.dateBox}>
        <Text style={styles.day}>{toDateObj(item.date).getDate()}</Text>
        <Text style={styles.month}>{monthShort(item.date)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.fund}>{item.fund}</Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.amount}>{formatRs(item.amount)}</Text>
        <Badge text={item.mode} />
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Transactions"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={shared.scroll}
              ListHeaderComponent={
                <View style={styles.filters}>
                  <Label text="Search" />
                  <View style={styles.searchFilterRow}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search member..."
                        value={search}
                        onChangeText={text => {
                          setSearch(text);
                          setApplied(prev => ({ ...prev, search: text }));
                        }}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.filterButton}
                      activeOpacity={0.8}
                      onPress={openFilter}
                    >
                      <Icon
                        name="filter-variant"
                        size={22}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={shared.empty}>
                  <Icon name="swap-horizontal" size={46} color="#9CA3AF" />
                  <Text style={shared.emptyText}>No transactions found</Text>
                </View>
              }
            />
          </Body>
        </View>

        {/* Filter Modal */}
        <Modal
          visible={filterOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterOpen(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setFilterOpen(false)}
          >
            <View
              style={styles.filterSheet}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.filterTitle}>Filter Transactions</Text>

              <Label text="Payment Mode" />
              <Dropdown
                value={draftMode}
                options={MODES}
                onSelect={setDraftMode}
                style={styles.modalGap}
              />

              <View style={shared.row}>
                <View style={shared.colL}>
                  <Label text="From Date" />
                  <DateField value={draftFrom} onChange={setDraftFrom} />
                </View>

                <View style={shared.col}>
                  <Label text="To Date" />
                  <DateField value={draftTo} onChange={setDraftTo} />
                </View>
              </View>

              <Label text="Fund Type" />
              <Dropdown
                value={draftFund}
                options={FUND_TYPES}
                onSelect={setDraftFund}
                style={styles.modalGap}
              />

              <GreenButton
                title="Apply"
                onPress={applyFilter}
                style={styles.applyButton}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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

  filters: {
    marginTop: 15,
    marginBottom: 6,
  },

  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchFlex: {
    flex: 1,
    marginRight: 8,
  },

  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2E8B3E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2, // aligns nicely with search input
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E9EEEB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },

  dateBox: {
    width: 46,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#EEF3F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  day: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: '#111827',
    lineHeight: 22,
  },

  month: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: '#374151',
  },

  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },

  name: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  fund: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },

  meta: {
    alignItems: 'flex-end',
  },

  amount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: '#111827',
    marginBottom: 4,
  },

  // Filter modal styles
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  filterSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
  },

  filterTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: '#123B28',
    marginBottom: 14,
  },

  modalGap: {
    marginBottom: 12,
  },

  applyButton: {
    height: 48,
    marginTop: 14,
  },
});

export default TransactionsScreen;
