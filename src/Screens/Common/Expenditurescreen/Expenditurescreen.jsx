import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import BottomNav from '../../../components/BottomNav/BottomNav';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';

// ---------------------------------------------------------------
// Dummy data — replace with your API response
// ---------------------------------------------------------------
const NAV_TABS = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'home-outline' },
  { key: 'Collection', label: 'Collection', icon: 'file-document-outline' },
  { key: 'Expenditure', label: 'Expenditure', icon: 'currency-inr' },
  { key: 'Wazifadar', label: 'Wazifadar', icon: 'account-group-outline' },
  { key: 'More', label: 'More', icon: 'dots-horizontal' },
];

const MODES = ['All', 'Cash', 'UPI', 'Cheque'];
const EXPENSE_TYPES = [
  'All',
  'Wazifa',
  'Contingency',
  'Stationary etc.',
  'Commission',
  'Postage',
];

const EXPENSES = [
  { id: '1', title: 'Wazifa', date: '20 Aug 2026', amount: 2500, mode: 'Cash' },
  {
    id: '2',
    title: 'Contingency',
    date: '20 Aug 2026',
    amount: 2000,
    mode: 'Cash',
  },
  {
    id: '3',
    title: 'Stationary etc.',
    date: '19 Aug 2026',
    amount: 500,
    mode: 'Cash',
  },
  {
    id: '4',
    title: 'Commission',
    date: '19 Aug 2026',
    amount: 5000,
    mode: 'UPI',
  },
  {
    id: '5',
    title: 'Postage',
    date: '19 Aug 2026',
    amount: 5000,
    mode: 'Cheque',
  },
];

const ICONS = {
  Wazifa: 'flash',
  Contingency: 'layers',
  'Stationary etc.': 'square-edit-outline',
  Commission: 'account-group',
  Postage: 'email',
};

const MODE_TONES = {
  Cash: { bg: '#DCEBFA', text: '#1D6FD6' },
  UPI: { bg: '#EBDDFB', text: '#7C3AED' },
  Cheque: { bg: '#D7EAFB', text: '#1D6FD6' },
};

const formatNumber = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ---------------------------------------------------------------
// Screen
// ---------------------------------------------------------------
const ExpenditureScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('All');
  const [expenseType, setExpenseType] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [filterOpen, setFilterOpen] = useState(false);

  // Draft filter states for modal
  const [draftMode, setDraftMode] = useState('All');
  const [draftType, setDraftType] = useState('All');
  const [draftFromDate, setDraftFromDate] = useState('');
  const [draftToDate, setDraftToDate] = useState('');

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();

    return EXPENSES.filter(e => {
      if (mode !== 'All' && e.mode !== mode) return false;
      if (expenseType !== 'All' && e.title !== expenseType) return false;
      if (
        q &&
        !e.title.toLowerCase().includes(q) &&
        !e.date.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [search, mode, expenseType]);

  const total = useMemo(
    () => data.reduce((sum, e) => sum + e.amount, 0),
    [data],
  );

  const handleTabPress = key => {
    if (key === 'Expenditure') return;
    navigation && navigation.navigate(key);
  };

  const openFilter = () => {
    setDraftMode(mode);
    setDraftType(expenseType);
    setDraftFromDate(fromDate);
    setDraftToDate(toDate);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setMode(draftMode);
    setExpenseType(draftType);
    setFromDate(draftFromDate);
    setToDate(draftToDate);
    setFilterOpen(false);
  };

  const renderItem = ({ item }) => {
    const tone = MODE_TONES[item.mode] || MODE_TONES.Cash;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.row}
        onPress={() =>
          navigation && navigation.navigate('ExpenditureDetail', { item })
        }
      >
        <View style={styles.rowIcon}>
          <Icon
            name={ICONS[item.title] || 'cash'}
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.dateRow}>
            <Icon name="calendar-month-outline" size={16} color="#4B5563" />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.rowMeta}>
          <Text style={styles.amount}>₹ {formatNumber(item.amount)}</Text>

          <View style={[styles.badge, { backgroundColor: tone.bg }]}>
            <Text style={[styles.badgeText, { color: tone.text }]}>
              {item.mode}
            </Text>
          </View>
        </View>

        <Icon name="chevron-right" size={26} color="#111827" />
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Expenditure"
          onBack={() => navigation && navigation.goBack()}
          rightIcon="plus"
          rightVariant="solid"
          onRightPress={() =>
            navigation && navigation.navigate('AddExpenditure')
          }
        />

        <View style={styles.body}>
          {/* Search and Filter Row */}
          <View style={styles.searchFilterRow}>
            <View style={styles.searchBox}>
              <Icon name="magnify" size={22} color="#4B5563" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by paid to, bill no..."
                placeholderTextColor={colors.placeHolderColor}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.8}
              onPress={openFilter}
            >
              <Icon name="filter-variant" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Icon name="wallet-outline" size={46} color="#9CA3AF" />
                <Text style={styles.emptyText}>No expenditure found</Text>
              </View>
            }
          />
        </View>

        <BottomNav
          active="Expenditure"
          tabs={NAV_TABS}
          onPress={handleTabPress}
        />

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
              <Text style={styles.filterTitle}>Filter Expenditure</Text>

              {/* Payment Mode Filter */}
              <Text style={styles.filterSubtitle}>Payment Mode</Text>
              <View style={styles.chipRow}>
                {MODES.map(m => {
                  const active = m === draftMode;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setDraftMode(m)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Expense Type Filter */}
              <Text style={[styles.filterSubtitle, { marginTop: 8 }]}>
                Expense Type
              </Text>
              <View style={styles.chipRow}>
                {EXPENSE_TYPES.map(t => {
                  const active = t === draftType;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setDraftType(t)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Date Filters */}
              <View style={styles.dateFilterRow}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.filterSubtitle}>From Date</Text>
                  <View style={styles.dateBox}>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor="#9CA3AF"
                      value={draftFromDate}
                      onChangeText={setDraftFromDate}
                    />
                    <Icon
                      name="calendar-blank-outline"
                      size={18}
                      color="#4B5563"
                    />
                  </View>
                </View>

                <View style={styles.dateInputContainer}>
                  <Text style={styles.filterSubtitle}>To Date</Text>
                  <View style={styles.dateBox}>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor="#9CA3AF"
                      value={draftToDate}
                      onChangeText={setDraftToDate}
                    />
                    <Icon
                      name="calendar-blank-outline"
                      size={18}
                      color="#4B5563"
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                activeOpacity={0.85}
                onPress={applyFilter}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
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

  // Search & Filter Row
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('4.5%'),
    marginTop: 14,
  },

  searchBox: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.SecondTitleColor,
    paddingVertical: 0,
  },

  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2E8B3E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // List
  listContent: {
    paddingHorizontal: wp('3.5%'),
    paddingTop: 14,
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E9EEEB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F4E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowInfo: {
    flex: 1,
    marginLeft: 12,
  },

  rowTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: '#111827',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  dateText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#374151',
    marginLeft: 6,
  },

  rowMeta: {
    alignItems: 'center',
    marginRight: 6,
  },

  amount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: '#0F5132',
  },

  badge: {
    minWidth: 62,
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
  },

  badgeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
    marginTop: 8,
  },

  // Filter modal
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
    marginBottom: 12,
  },

  filterSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#4B5563',
    marginBottom: 6,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE4DF',
    marginRight: 8,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor: '#2E8B3E',
    borderColor: '#2E8B3E',
  },

  chipText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
  },

  chipTextActive: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
  },

  dateFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 4,
  },

  dateInputContainer: {
    flex: 1,
    marginRight: 8,
  },

  dateBox: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  dateInput: {
    flex: 1,
    height: '100%',
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.SecondTitleColor,
    paddingVertical: 0,
  },

  applyButton: {
    height: 48,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#2E8B3E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  applyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },
});

export default ExpenditureScreen;
