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
  toDateObj,
  startOfDay,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DISBURSEMENT_STATUSES = ['All', 'Disbursed', 'Pending'];
const FORM_TYPES = ['All', 'New', 'Renewal'];

const DEFAULT_FROM = new Date(2025, 0, 1);
const DEFAULT_TO = new Date(2026, 11, 31);

const VERIFY_LIST = [
  {
    id: '1',
    portalId: '202610174685',
    wazifaNo: '001527',
    name: 'Ali Raza',
    formType: 'New',
    course: 'BA/BCOM',
    institution: 'Shia PG College',
    annualFees: 'Rs 6,874',
    appliedOn: '2026-10-17',
    status: 'Verified',
    disbursedStatus: 'Pending',
  },
  {
    id: '2',
    portalId: '202610132596',
    wazifaNo: '001526',
    name: 'Adeeba Mansoor',
    formType: 'New',
    course: 'MCA/MBA/MFA/MSW',
    institution: 'AMU',
    annualFees: 'Rs 25,000',
    appliedOn: '2026-10-13',
    status: 'Verified',
    disbursedStatus: 'Disbursed',
  },
  {
    id: '3',
    portalId: '202610136018',
    wazifaNo: '001525',
    name: 'Areeba Fatima',
    formType: 'New',
    course: 'ITI / Para Medical',
    institution: 'Era University, Lucknow',
    annualFees: 'Rs 77,500',
    appliedOn: '2026-10-13',
    status: 'Verified',
    disbursedStatus: 'Pending',
  },
  {
    id: '4',
    portalId: '202610131619',
    wazifaNo: '001524',
    name: 'Syed Kazim Abbas',
    formType: 'New',
    course: 'BSC (Biotechnology)',
    institution: 'Era University, Lucknow',
    annualFees: 'Rs 1,00,000',
    appliedOn: '2026-10-13',
    status: 'Verified',
    disbursedStatus: 'Disbursed',
  },
];

const dmy = iso => (iso ? iso.split('-').reverse().join('/') : '');

const VerifyWazifaListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    disbursementStatus: 'All',
    formType: 'All',
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });

  // Draft Filters inside Modal
  const [draftDisbursement, setDraftDisbursement] = useState('All');
  const [draftFormType, setDraftFormType] = useState('All');
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(DEFAULT_TO);

  const openFilter = () => {
    setDraftDisbursement(applied.disbursementStatus);
    setDraftFormType(applied.formType);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      disbursementStatus: draftDisbursement,
      formType: draftFormType,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftDisbursement('All');
    setDraftFormType('All');
    setDraftFrom(DEFAULT_FROM);
    setDraftTo(DEFAULT_TO);
    setSearch('');
    setApplied({
      search: '',
      disbursementStatus: 'All',
      formType: 'All',
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    return VERIFY_LIST.filter(item => {
      if (
        applied.disbursementStatus !== 'All' &&
        item.disbursedStatus !== applied.disbursementStatus
      ) {
        return false;
      }
      if (applied.formType !== 'All' && item.formType !== applied.formType) {
        return false;
      }
      if (
        applied.from &&
        toDateObj(item.appliedOn) < startOfDay(applied.from)
      ) {
        return false;
      }
      if (applied.to && toDateObj(item.appliedOn) > startOfDay(applied.to)) {
        return false;
      }

      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.wazifaNo.toLowerCase().includes(q) &&
        !item.portalId.toLowerCase().includes(q) &&
        !item.institution.toLowerCase().includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [applied]);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.srNo}>{index + 1}</Text>
        <Text style={styles.portalIdText}>Portal ID: {item.portalId}</Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Student Name</Text>
          <Text style={styles.valTextBold}>{item.name}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Wazifa No.</Text>
          <Text style={styles.valTextPrimary}>{item.wazifaNo}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Course</Text>
          <Text style={styles.valText}>{item.course}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Form Type</Text>
          <Text style={styles.valText}>{item.formType}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Institution</Text>
          <Text style={styles.valText}>{item.institution}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Annual Fees</Text>
          <Text style={styles.valFees}>{item.annualFees}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Applied On</Text>
          <Text style={styles.valText}>{dmy(item.appliedOn)}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Disbursed Status</Text>
          <Text
            style={[
              styles.disburseText,
              {
                color:
                  item.disbursedStatus === 'Disbursed' ? '#15803D' : '#D97706',
              },
            ]}
          >
            {item.disbursedStatus}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Verify Wazifa List"
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
                  {/* Subtitle description */}

                  {/* Search Bar & Filter Icon */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search student, Portal ID..."
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
                  <Icon name="file-search-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No records found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
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
              <View style={styles.modalHeaderRow}>
                <Text style={styles.filterTitle}>Filter Wazifa List</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Disbursement Status" />
              <Dropdown
                value={draftDisbursement}
                options={DISBURSEMENT_STATUSES}
                onSelect={setDraftDisbursement}
                style={styles.modalGap}
              />

              <Label text="Form Type" />
              <Dropdown
                value={draftFormType}
                options={FORM_TYPES}
                onSelect={setDraftFormType}
                style={styles.modalGap}
              />

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

  screenDesc: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 4,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  portalIdText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
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
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  valText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },
  valFees: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },
  disburseText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
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

  // Filter Modal Styles
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

export default VerifyWazifaListScreen;
