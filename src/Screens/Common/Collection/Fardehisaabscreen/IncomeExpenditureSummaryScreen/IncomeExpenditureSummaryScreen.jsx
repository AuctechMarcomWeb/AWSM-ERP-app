import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
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
  SearchField,
  Dropdown,
  DateField,
  GreenButton,
  GrayButton,
  Badge,
  formatRs,
  toDateObj,
  startOfDay,
  shared,
  PillTabs,
} from '../../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const STATUSES = ['All Status', 'Approved', 'Pending', 'Rejected'];
const TABS = ['Farde Hisaab', 'Summary (Income & Exp.)'];

const DEFAULT_FROM = new Date(2025, 0, 6);
const DEFAULT_TO = new Date(2026, 10, 6);

const STATEMENTS = []; // Data nathi tyare empty state batavva mate

const IncomeExpenditureSummaryScreen = ({ navigation }) => {
  const [tab, setTab] = useState('Summary (Income & Exp.)');
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied filters state
  const [applied, setApplied] = useState({
    search: '',
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    status: 'All Status',
  });

  // Draft filter states inside modal
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(DEFAULT_TO);
  const [draftStatus, setDraftStatus] = useState('All Status');

  const openFilter = () => {
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setDraftStatus(applied.status);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      from: draftFrom,
      to: draftTo,
      status: draftStatus,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftFrom(DEFAULT_FROM);
    setDraftTo(DEFAULT_TO);
    setDraftStatus('All Status');
    setSearch('');
    setApplied({
      search: '',
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      status: 'All Status',
    });
  };

  const handleTabChange = selectedTab => {
    setTab(selectedTab);
    if (selectedTab === 'Farde Hisaab') {
      if (navigation) {
        navigation.navigate('FardeHisaab');
      }
    }
  };

  const data = useMemo(() => {
    return STATEMENTS.filter(item => {
      if (applied.status !== 'All Status' && item.status !== applied.status) {
        return false;
      }
      return true;
    });
  }, [applied]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>{/* Statement Card UI */}</View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Income & Expenditure Summary"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            {/* Pill Tabs */}
            <View style={styles.tabContainer}>
              <PillTabs tabs={TABS} active={tab} onChange={handleTabChange} />
            </View>

            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <View style={styles.searchFilterContainer}>
                  <View style={styles.searchFlex}>
                    <SearchField
                      placeholder="Search summary..."
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
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconBox}>
                    <Icon
                      name="file-document-outline"
                      size={38}
                      color="#9CA3AF"
                    />
                    <View style={styles.emptyBadge}>
                      <Icon name="dots-horizontal" size={12} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.emptyTitle}>No statements found</Text>
                  <Text style={styles.emptySubtitle}>
                    Add a new income & expenditure{'\n'}summary to get started.
                  </Text>
                </View>
              }
            />

            {/* Bottom Add Button */}
            <View style={styles.bottom}>
              <GreenButton
                title="Add Summary"
                icon="plus"
                onPress={() =>
                  navigation &&
                  navigation.navigate('AddIncomeExpenditureSummary')
                }
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
                <Text style={styles.filterTitle}>Filter Summary</Text>
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

              <View style={styles.actionRow}>
                <GreenButton
                  title="Apply"
                  onPress={applyFilter}
                  style={styles.applyBtn}
                />
                <GrayButton
                  title="Reset"
                  onPress={handleReset}
                  style={styles.resetBtn}
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
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  tabContainer: {
    paddingHorizontal: wp('4%'),
    marginTop: 14,
    marginBottom: 4,
  },
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: 20,
  },

  // Search & Filter Row
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#9CA3AF',
    borderRadius: 8,
    padding: 2,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: '#1F2937',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottom: {
    paddingHorizontal: wp('4%'),
    paddingTop: 8,
    paddingBottom: 18,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  addButton: {
    height: 50,
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
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  applyBtn: {
    flex: 1,
    marginRight: 8,
    height: 48,
  },
  resetBtn: {
    flex: 1,
    height: 48,
  },
});

export default IncomeExpenditureSummaryScreen;
