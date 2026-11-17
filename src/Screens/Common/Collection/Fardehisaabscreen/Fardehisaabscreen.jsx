import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';

import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  SearchField,
  Dropdown,
  DateField,
  GreenButton,
  GrayButton,
  Badge,
  formatRs,
  shared,
  PillTabs,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { fetchCollectionReportData } from '../../../../api/collection';

// ---------------------------------------------------------------
// Dummy data & Options
// ---------------------------------------------------------------
const STATUSES = ['All Status', 'Draft', 'Submitted'];
const TABS = ['Farde Hisaab', 'Summary (Income & Exp)'];

const MEMBERS_LIST = [
  'All Members',
  'ankita (001)',
  'Haji Dr S Mohd. Abbas Zaidi (0001)',
  'Mirza Ali Abbas (0003)',
  'Sanaul Hasan Zaidi (0002)',
  'Rahul Kumar (MEM001)',
];

const DEFAULT_FROM = new Date(2026, 5, 1);
const DEFAULT_TO = new Date(2026, 10, 30);

// '2026-08-21' -> '21/08/2026'
const dmy = iso => iso.split('-').reverse().join('/');

const FardeHisaabScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Applied filters state
  const [applied, setApplied] = useState({
    search: '',
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    status: 'All Status',
    selectedMember: 'All Members',
  });

  // Modal open/close state
  const [filterOpen, setFilterOpen] = useState(false);
  const [tab, setTab] = useState('Farde Hisaab');

  // Draft filter states inside modal
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(DEFAULT_TO);
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftMember, setDraftMember] = useState('All Members');

  // Load reports from API
  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCollectionReportData({
        page: 1,
        limit: 50,
        fromDate: applied.from.toISOString(),
        toDate: applied.to.toISOString(),
        collectedBy: applied.selectedMember !== 'All Members' ? applied.selectedMember : '',
        search: applied.search,
      });
      
      if (result.success && result.docs) {
        // Transform docs to match our card display format
        const transformedReports = result.docs.map((doc, idx) => ({
          id: doc._id || idx.toString(),
          from: doc.date || new Date().toISOString().split('T')[0],
          to: doc.date || new Date().toISOString().split('T')[0],
          collector: doc.collectedBy || 'Unknown',
          code: doc.collectedByMemberId || 'N/A',
          city: doc.collectedByCity || 'N/A',
          state: doc.collectedByState || 'N/A',
          amount: doc.amount || 0,
          transactions: doc.transactions || 1,
          status: doc.status || 'Draft',
        }));
        setReports(transformedReports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }, [applied]);

  useEffect(() => {
    if (tab === 'Farde Hisaab') {
      loadReports();
    }
  }, [loadReports, tab]);

  const openFilter = () => {
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setDraftStatus(applied.status);
    setDraftMember(applied.selectedMember);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      from: draftFrom,
      to: draftTo,
      status: draftStatus,
      selectedMember: draftMember,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    const defaultState = {
      search: '',
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      status: 'All Status',
      selectedMember: 'All Members',
    };
    setDraftFrom(DEFAULT_FROM);
    setDraftTo(DEFAULT_TO);
    setDraftStatus('All Status');
    setDraftMember('All Members');
    setSearch('');
    setApplied(defaultState);
  };

  const handleTabChange = selectedTab => {
    setTab(selectedTab);
  };

  const data = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    // Only filter if on Farde Hisaab tab
    if (tab === 'Farde Hisaab') {
      return reports.filter(r => {
        if (applied.status !== 'All Status' && r.status !== applied.status)
          return false;

        if (
          applied.selectedMember !== 'All Members' &&
          !applied.selectedMember.toLowerCase().includes(r.collector.toLowerCase()) &&
          !applied.selectedMember.includes(r.code)
        ) {
          return false;
        }

        if (
          q &&
          !r.collector.toLowerCase().includes(q) &&
          !r.city.toLowerCase().includes(q) &&
          !r.code.toLowerCase().includes(q)
        ) {
          return false;
        }

        return true;
      });
    }

    // For Summary tab, return empty (will show different UI)
    return [];
  }, [reports, applied, tab]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation && navigation.navigate('FardeHisaabDetail', { report: item })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.srBadge}>
          <Text style={styles.srText}>#{index + 1}</Text>
        </View>
        <Text style={styles.dateRangeText}>
          {dmy(item.from)} - {dmy(item.to)}
        </Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Collected By:</Text>
          <Text style={styles.fieldValBold} numberOfLines={1}>
            {item.collector} <Text style={styles.codeText}>({item.code})</Text>
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>City / State:</Text>
          <Text style={styles.fieldVal}>
            {item.city}, {item.state}
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Transactions:</Text>
          <Text style={styles.fieldVal}>{item.transactions} Items</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountLabel}>Grand Total:</Text>
        <Text style={styles.amount}>{formatRs(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Farde Hisaab"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <PillTabs tabs={TABS} active={tab} onChange={handleTabChange} />
            </View>

            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                tab === 'Farde Hisaab' ? (
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search collector, city, code..."
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
                ) : (
                  <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Income & Expenditure Summary</Text>
                    <Text style={styles.summaryText}>View your financial summaries here</Text>
                  </View>
                )
              }
              ListEmptyComponent={
                loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading reports...</Text>
                  </View>
                ) : (
                  <View style={shared.empty}>
                    <Icon
                      name="file-document-outline"
                      size={46}
                      color={colors.placeHolderColor}
                    />
                    <Text style={shared.emptyText}>
                      {tab === 'Farde Hisaab' ? 'No reports found' : 'No summaries found'}
                    </Text>
                  </View>
                )
              }
            />

            {/* Add button */}
            <View style={styles.bottom}>
              <GreenButton
                title={tab === 'Farde Hisaab' ? 'Add Farde Hisaab Report' : 'Add Summary'}
                icon="plus"
                onPress={() => {
                  if (tab === 'Farde Hisaab') {
                    navigation && navigation.navigate('AddFardeHisaab');
                  } else {
                    navigation && navigation.navigate('AddIncomeExpenditure');
                  }
                }}
                style={styles.addButton}
              />
            </View>
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
              <View style={styles.modalHeaderRow}>
                <Text style={styles.filterTitle}>Filter Farde Hisaab</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={[shared.row, styles.modalDateRow]}>
                <View style={shared.colL}>
                  <Label text="From Date" />
                  <DateField
                    value={draftFrom}
                    onChange={setDraftFrom}
                    leftIcon="calendar-month-outline"
                    hideRightIcon
                  />
                </View>

                <View style={shared.col}>
                  <Label text="To Date" />
                  <DateField
                    value={draftTo}
                    onChange={setDraftTo}
                    leftIcon="calendar-month-outline"
                    hideRightIcon
                  />
                </View>
              </View>

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={STATUSES}
                onSelect={setDraftStatus}
                style={styles.modalGap}
              />

              <Label text="Member / Collector" />
              <Dropdown
                value={draftMember}
                options={MEMBERS_LIST}
                onSelect={setDraftMember}
                searchable
                placeholder="Select or Search Member..."
                style={styles.modalGap}
              />

              <View style={styles.actionRow}>
                <GreenButton
                  title="Apply"
                  onPress={applyFilter}
                  style={styles.apply}
                />
                <GrayButton
                  title="Reset"
                  onPress={handleReset}
                  style={styles.reset}
                />
              </View>
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

  tabContainer: {
    paddingHorizontal: wp('4%'),
    marginTop: 14,
    marginBottom: 4,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 12,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  // Search & Filter Row
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    marginTop: 10,
    marginBottom: 10,
  },

  searchFlex: {
    flex: 1,
    marginRight: 8,
  },

  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },

  // Filters & Action Row inside Modal
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  apply: {
    flex: 1,
    marginRight: 8,
    height: 48,
  },

  reset: {
    flex: 1,
    height: 48,
  },

  // Card
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: 16,
  },

  summaryContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: 20,
    alignItems: 'center',
  },

  summaryTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginBottom: 8,
  },

  summaryText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    paddingBottom: 8,
    marginBottom: 8,
  },

  srBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  srText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },

  dateRangeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  cardBody: {
    gap: 6,
  },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  fieldVal: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },

  fieldValBold: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    flexShrink: 1,
    marginLeft: 8,
    textAlign: 'right',
  },

  codeText: {
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingTop: 8,
    marginTop: 8,
  },

  amountLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  amount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.success,
  },

  bottom: {
    paddingHorizontal: wp('4%'),
    paddingTop: 8,
    paddingBottom: 18,
    backgroundColor: colors.white,
  },

  addButton: {
    height: 52,
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

  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  filterTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },

  modalDateRow: {
    marginBottom: 4,
  },

  modalGap: {
    marginBottom: 12,
  },
});

export default FardeHisaabScreen;
