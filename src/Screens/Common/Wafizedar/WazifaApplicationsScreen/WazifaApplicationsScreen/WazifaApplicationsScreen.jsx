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
  GreenButton,
  GrayButton,
  Badge,
  shared,
} from '../../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const STATUSES = ['All Status', 'Pending', 'Verified', 'Rejected'];
const FORM_TYPES = ['All Types', 'New', 'Renewal'];
const SESSIONS = ['All Sessions', '2026-2027', '2025-2026'];

const APPLICATIONS = [
  {
    id: '1',
    portalId: '202610174685',
    wazifaNo: '001527',
    name: 'Ali Raza',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'BA/BCOM',
    institution: 'shia pg college',
    annualFees: 'Rs 6,874',
    appliedOn: '17 Oct 2026',
    status: 'Pending',
  },
  {
    id: '2',
    portalId: '202610132596',
    wazifaNo: '001526',
    name: 'Adeeba mansoor',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'MCA/MBA/MFA/MSW',
    institution: 'Amu',
    annualFees: 'Rs 25,000',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '3',
    portalId: '202610136018',
    wazifaNo: '001525',
    name: 'Areeba Fatima',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'ITI. BPTPARA MEDICAL COURSES',
    institution: 'Era University, Sarfarazganj, Lucknow',
    annualFees: 'Rs 77,500',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '4',
    portalId: '202610131619',
    wazifaNo: '001524',
    name: 'SYED KAZIM ABBAS',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'BSC(BIOTECHNOLOGY)&TOURISM',
    institution: 'ERA UNIVERSITY, LUCKNOW',
    annualFees: 'Rs 1,00,000',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '5',
    portalId: '202610135553',
    wazifaNo: '001523',
    name: 'Taib ali',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'OTHERS',
    institution: 'Jamia millia islamia',
    annualFees: 'Rs 80,000',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '6',
    portalId: '202610138000',
    wazifaNo: '001522',
    name: 'Mehzabi',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'OTHERS',
    institution: 'AMU',
    annualFees: 'Rs 28,500',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '7',
    portalId: '202610133873',
    wazifaNo: '001521',
    name: 'Mohammad Ali Hasnain',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'BA/BCOM',
    institution: 'Jamia Millia Islamia, New Delhi',
    annualFees: 'Rs 76,750',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '8',
    portalId: '202610139944',
    wazifaNo: '001520',
    name: 'Mohd adil',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'IIT/B TECH/B E DEGREE COURSES',
    institution: 'AMU',
    annualFees: 'Rs 65,000',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '9',
    portalId: '202610131815',
    wazifaNo: '001519',
    name: 'Mohd zeeshan khan',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'IIT/B TECH/B E DEGREE COURSES',
    institution: 'AMU',
    annualFees: 'Rs 65,000',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
  {
    id: '10',
    portalId: '202610134889',
    wazifaNo: '001518',
    name: 'Salman Ahmad',
    formType: 'New',
    studentLevel: 'Senior',
    session: '2026-2027',
    course: 'OTHERS',
    institution: 'AMU',
    annualFees: 'Rs 45,000',
    appliedOn: '13 Oct 2026',
    status: 'Pending',
  },
];

const WazifaApplicationsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [applied, setApplied] = useState({
    search: '',
    status: 'All Status',
    formType: 'All Types',
    session: 'All Sessions',
  });

  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftFormType, setDraftFormType] = useState('All Types');
  const [draftSession, setDraftSession] = useState('All Sessions');

  const openFilter = () => {
    setDraftStatus(applied.status);
    setDraftFormType(applied.formType);
    setDraftSession(applied.session);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      status: draftStatus,
      formType: draftFormType,
      session: draftSession,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftStatus('All Status');
    setDraftFormType('All Types');
    setDraftSession('All Sessions');
    setSearch('');
    setApplied({
      search: '',
      status: 'All Status',
      formType: 'All Types',
      session: 'All Sessions',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return APPLICATIONS.filter(item => {
      if (applied.status !== 'All Status' && item.status !== applied.status)
        return false;
      if (
        applied.formType !== 'All Types' &&
        item.formType !== applied.formType
      )
        return false;
      if (
        applied.session !== 'All Sessions' &&
        item.session !== applied.session
      )
        return false;

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
    <View style={styles.appCard}>
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
          <Text style={styles.labelKey}>Course / Level</Text>
          <Text style={styles.valText}>
            {item.course} ({item.studentLevel})
          </Text>
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
          <Text style={styles.labelKey}>Session</Text>
          <Text style={styles.valText}>{item.session}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Applied On</Text>
          <Text style={styles.valText}>{item.appliedOn}</Text>
        </View>
      </View>

      {/* Update Status Button */}
      {/* <TouchableOpacity
        style={styles.updateStatusBtn}
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <Icon
          name="update"
          size={16}
          color={colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.updateStatusText}>Update Status</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Wazifa Applications"
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
                        placeholder="Search student, Portal ID, Wazifa No..."
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

                  {/* Stats Cards Row */}
                  <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                      <Icon
                        name="file-document-outline"
                        size={18}
                        color={colors.primary}
                      />
                      <Text style={styles.statVal}>1,248</Text>
                      <Text style={styles.statLbl}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Icon name="clock-outline" size={18} color="#D97706" />
                      <Text style={styles.statVal}>356</Text>
                      <Text style={styles.statLbl}>Pending</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Icon
                        name="check-circle-outline"
                        size={18}
                        color={colors.success}
                      />
                      <Text style={styles.statVal}>842</Text>
                      <Text style={styles.statLbl}>Verified</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Icon
                        name="close-circle-outline"
                        size={18}
                        color="#DC2626"
                      />
                      <Text style={styles.statVal}>50</Text>
                      <Text style={styles.statLbl}>Rejected</Text>
                    </View>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="file-search-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No applications found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
                </View>
              }
            />

            {/* Bottom Add Button */}
            <View style={styles.bottom}>
              <GreenButton
                title="+ New Application"
                icon="plus"
                onPress={() =>
                  navigation &&
                  navigation.navigate('AddWazifaApplicationScreen')
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
                <Text style={styles.filterTitle}>Filter Applications</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={STATUSES}
                onSelect={setDraftStatus}
                style={styles.modalGap}
              />

              <Label text="Form Type" />
              <Dropdown
                value={draftFormType}
                options={FORM_TYPES}
                onSelect={setDraftFormType}
                style={styles.modalGap}
              />

              <Label text="Session" />
              <Dropdown
                value={draftSession}
                options={SESSIONS}
                onSelect={setDraftSession}
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
    marginTop: 15,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12,
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

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 2,
  },
  statVal: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginTop: 2,
  },
  statLbl: {
    fontSize: 9,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: 20,
  },
  appCard: {
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
  updateStatusBtn: {
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
  updateStatusText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.primary,
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

export default WazifaApplicationsScreen;
