import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  SearchField,
  Dropdown,
  GreenButton,
  GrayButton,
  Badge,
  shared,
} from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const SESSIONS = ['All Sessions', '2026-2027', '2025-2026', '2024-2025'];
const COURSE_TYPES = ['All', 'Senior', 'Junior'];
const STATUS_OPTIONS = ['All Status', 'Active', 'Suspended', 'Expired'];

const SCHOLARSHIP_RATES_DATA = [
  {
    id: '1',
    courseType: 'Senior',
    className: 'OTHERS',
    ratePerMonth: '0',
    amountPerYear: '0',
    session: '2026-2027',
    status: 'Active',
  },
  {
    id: '2',
    courseType: 'Junior',
    className: 'Not Eligible',
    ratePerMonth: '0',
    amountPerYear: '0',
    session: '2026-2027',
    status: 'Active',
  },
  {
    id: '3',
    courseType: 'Senior',
    className: 'FIRE & SAFETY ENGINEERING',
    ratePerMonth: '0',
    amountPerYear: '0',
    session: '2026-2027',
    status: 'Active',
  },
  {
    id: '4',
    courseType: 'Junior',
    className: 'class IX',
    ratePerMonth: '375',
    amountPerYear: '4500',
    session: '2026-2027',
    status: 'Active',
  },
  {
    id: '5',
    courseType: 'Junior',
    className: 'Class X',
    ratePerMonth: '375',
    amountPerYear: '4500',
    session: '2026-2027',
    status: 'Active',
  },
  {
    id: '6',
    courseType: 'Junior',
    className: 'Class XI',
    ratePerMonth: '375',
    amountPerYear: '4500',
    session: '2026-2027',
    status: 'Active',
  },
];

const RateOfScholarshipMasterScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    session: 'All Sessions',
    courseType: 'All',
    status: 'Active',
  });

  // Draft Filters in Modal
  const [draftSession, setDraftSession] = useState('All Sessions');
  const [draftCourseType, setDraftCourseType] = useState('All');
  const [draftStatus, setDraftStatus] = useState('Active');

  const openFilter = () => {
    setDraftSession(applied.session);
    setDraftCourseType(applied.courseType);
    setDraftStatus(applied.status);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      session: draftSession,
      courseType: draftCourseType,
      status: draftStatus,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftSession('All Sessions');
    setDraftCourseType('All');
    setDraftStatus('Active');
    setSearch('');
    setApplied({
      search: '',
      session: 'All Sessions',
      courseType: 'All',
      status: 'Active',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return SCHOLARSHIP_RATES_DATA.filter(item => {
      if (
        applied.session !== 'All Sessions' &&
        item.session !== applied.session
      )
        return false;
      if (
        applied.courseType !== 'All' &&
        item.courseType !== applied.courseType
      )
        return false;
      if (applied.status !== 'All Status' && item.status !== applied.status)
        return false;

      if (q && !item.className.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [applied]);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.srNo}>#{index + 1}</Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Name of Class</Text>
          <Text style={styles.valTextBold}>{item.className}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Course Type</Text>
          <Text style={styles.valTextPrimary}>{item.courseType}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Rate Per Month</Text>
          <Text style={styles.valText}>₹ {item.ratePerMonth}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Amount Per Year</Text>
          <Text
            style={[
              styles.valText,
              { fontFamily: FontFamily.bold, color: '#15803D' },
            ]}
          >
            ₹ {item.amountPerYear}
          </Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Session</Text>
          <Text style={styles.valText}>{item.session}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert('Action', `Manage rate for ${item.className}`)
        }
      >
        <Icon
          name="pencil-outline"
          size={16}
          color={colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.actionBtnText}>Edit / Manage Rate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Rate of Scholarship Master"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            <FlatList
              data={filteredData}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <View>
                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search class name..."
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
                <View style={styles.emptyContainer}>
                  <Icon name="cash-register" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>
                    No scholarship rates found
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
                </View>
              }
            />

            {/* Bottom Button Bar for Adding New Rate */}
            <View style={styles.bottomBar}>
              <GreenButton
                title="+ Add Rate"
                icon="plus"
                onPress={() =>
                  navigation.navigate('AddRateOfScholarshipScreen')
                }
                style={styles.addButtonBar}
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
                <Text style={styles.filterTitle}>Filter Scholarship Rates</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Session" />
              <Dropdown
                value={draftSession}
                options={SESSIONS}
                onSelect={setDraftSession}
                style={styles.modalGap}
              />

              <Label text="Course Type" />
              <Dropdown
                value={draftCourseType}
                options={COURSE_TYPES}
                onSelect={setDraftCourseType}
                style={styles.modalGap}
              />

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={STATUS_OPTIONS}
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

  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  screenDesc: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  topActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#DC2626',
    marginLeft: 3,
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  orderText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: colors.primary,
    marginLeft: 3,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
         marginTop: 25,
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

  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  srNo: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral.border,
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoCol: {
    flex: 1,
  },
  infoColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  labelKey: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },
  valTextBold: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },
  valTextPrimary: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
  },
  valText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.TitleColor,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  actionBtnText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },

  bottomBar: {
    paddingHorizontal: wp('4%'),
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  addButtonBar: {
    height: 48,
    width: '100%',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: '#1F2937',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    textAlign: 'center',
  },

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
  modalGap: {
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
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

export default RateOfScholarshipMasterScreen;
