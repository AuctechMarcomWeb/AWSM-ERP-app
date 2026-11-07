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

const MEMBER_TYPES = [
  'All Types',
  'Ordinary Member',
  'Life Member',
  'Dawami Member',
  'Sarparast Member',
  'Mohsine Member',
];

const MEMBER_STATUSES = ['All Status', 'Active', 'Suspended', 'Expired'];
const CITIZENSHIP_LIST = ['All', 'Indian', 'Other'];
const PAYMENT_MODES = ['All Modes', 'Bank Transfer', 'UPI', 'Cash'];

const DEFAULT_FROM = new Date(2024, 0, 1);
const DEFAULT_TO = new Date(2026, 11, 31);

const MEMBERSHIP_LIST_DATA = [
  {
    id: '1',
    wmrn: '-',
    memberId: '827',
    uniqueId: 'OR2630',
    fullName: 'Nawab Syed Mohd Sadiq Safvi',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Shamsabad, Farrukhabad',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '2',
    wmrn: '-',
    memberId: '695',
    uniqueId: 'OR8042',
    fullName: 'Syed Raza Husain Zaidi',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Meer Gharana Dariba Jaunpur',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '3',
    wmrn: '-',
    memberId: '686',
    uniqueId: 'OR1713',
    fullName: 'Late Syed Zawwar Ali',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Kallan Ki Lath, Aminabad, Lucknow',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '4',
    wmrn: '202608148497',
    memberId: '641',
    uniqueId: 'OR2890',
    fullName: 'Syed Haider Naqvi',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: '-',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '5',
    wmrn: '-',
    memberId: '293',
    uniqueId: 'OR3655',
    fullName: 'Late Haji Syedul Abidin',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Shah Ganj, Agra',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '6',
    wmrn: '-',
    memberId: '179',
    uniqueId: 'OR2866',
    fullName: 'Late Maulana Syed Ibney Hasan',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Katra Abu Turab Khan, Lucknow',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '7',
    wmrn: '-',
    memberId: '5',
    uniqueId: 'OR1874',
    fullName: 'Late Wakaf Ghulam Husain',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Kairana, Muzaffar Nagar',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '8',
    wmrn: '-',
    memberId: '533',
    uniqueId: 'OR5985',
    fullName: 'Late Abid Raza',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Takiya Peer Jaleel Gola Ganj, Lucknow',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '9',
    wmrn: '-',
    memberId: '637',
    uniqueId: 'OR6473',
    fullName: 'Late Syed Akbar Husain Rizvi',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Collection Ameen, Sitapur',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '10',
    wmrn: '-',
    memberId: '971',
    uniqueId: 'OR7653',
    fullName: 'Late Syed Mohd Shabbir Rizvi',
    memberType: 'Ordinary Member',
    membershipDate: '-',
    renewDate: '-',
    mobile: '-',
    email: '-',
    address: 'Moh Qaziyra, Sitapur',
    postalCode: '-',
    introducedBy: '-',
    status: 'Active',
  },
];

const MembershipListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    memberType: 'All Types',
    status: 'All Status',
    citizenship: 'All',
    paymentMode: 'All Modes',
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });

  // Draft Filters in Modal
  const [draftType, setDraftType] = useState('All Types');
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftCitizenship, setDraftCitizenship] = useState('All');
  const [draftMode, setDraftMode] = useState('All Modes');
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(DEFAULT_TO);

  const openFilter = () => {
    setDraftType(applied.memberType);
    setDraftStatus(applied.status);
    setDraftCitizenship(applied.citizenship);
    setDraftMode(applied.paymentMode);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      memberType: draftType,
      status: draftStatus,
      citizenship: draftCitizenship,
      paymentMode: draftMode,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftType('All Types');
    setDraftStatus('All Status');
    setDraftCitizenship('All');
    setDraftMode('All Modes');
    setDraftFrom(DEFAULT_FROM);
    setDraftTo(DEFAULT_TO);
    setSearch('');
    setApplied({
      search: '',
      memberType: 'All Types',
      status: 'All Status',
      citizenship: 'All',
      paymentMode: 'All Modes',
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return MEMBERSHIP_LIST_DATA.filter(item => {
      if (
        applied.memberType !== 'All Types' &&
        item.memberType !== applied.memberType
      )
        return false;
      if (applied.status !== 'All Status' && item.status !== applied.status)
        return false;

      if (
        q &&
        !item.fullName.toLowerCase().includes(q) &&
        !item.uniqueId.toLowerCase().includes(q) &&
        !item.memberId.toLowerCase().includes(q) &&
        !item.address.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [applied]);

  const handleGenerateAccount = item => {
    Alert.alert(
      'Generate Account',
      `Generate account number for ${item.fullName} (${item.uniqueId})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () =>
            Alert.alert('Success', 'Account number generated successfully!'),
        },
      ],
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.srNo}>#{index + 1}</Text>
        <Text style={styles.idText}>
          ID: {item.uniqueId} (M-ID: {item.memberId})
        </Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Full Name</Text>
          <Text style={styles.valTextBold}>{item.fullName}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Member Type</Text>
          <Text style={styles.valTextPrimary}>{item.memberType}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>WMRN</Text>
          <Text style={styles.valText}>{item.wmrn}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Mobile No.</Text>
          <Text style={styles.valText}>{item.mobile}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Address</Text>
          <Text style={styles.valText} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Membership / Renew Date</Text>
          <Text style={styles.valText}>
            {item.membershipDate} / {item.renewDate}
          </Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Introduced By</Text>
          <Text style={styles.valText}>{item.introducedBy}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Membership List"
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
                  <Text style={styles.screenDesc}>
                    Manage membership list applications
                  </Text>

                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search member, ID, address..."
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
                  <Icon
                    name="account-search-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyTitle}>No members found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
                </View>
              }
            />

            {/* Bottom Button Bar with Two Buttons */}
            <View style={styles.bottomBar}>
              <GreenButton
                title="Generate A/C"
                icon="account-cog-outline"
                onPress={() =>
                  Alert.alert(
                    'Success',
                    'Account numbers generated successfully!',
                  )
                }
                style={styles.genButtonBar}
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
                <Text style={styles.filterTitle}>Filter Membership List</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Member Type" />
              <Dropdown
                value={draftType}
                options={MEMBER_TYPES}
                onSelect={setDraftType}
                style={styles.modalGap}
              />

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={MEMBER_STATUSES}
                onSelect={setDraftStatus}
                style={styles.modalGap}
              />

              <View style={[shared.row, styles.modalDateRow]}>
                <View style={shared.colL}>
                  <Label text="Citizenship" />
                  <Dropdown
                    value={draftCitizenship}
                    options={CITIZENSHIP_LIST}
                    onSelect={setDraftCitizenship}
                  />
                </View>
                <View style={shared.col}>
                  <Label text="Payment Mode" />
                  <Dropdown
                    value={draftMode}
                    options={PAYMENT_MODES}
                    onSelect={setDraftMode}
                  />
                </View>
              </View>

              <View
                style={[shared.row, styles.modalDateRow, { marginTop: 12 }]}
              >
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
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  idText: {
    fontSize: FontSize.xs,
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
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
  },
  valText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.TitleColor,
  },

  // Bottom Button Bar Styles
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    gap: 10,
  },
  exportButtonBar: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  exportButtonText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: '#DC2626',
  },
  genButtonBar: {
    flex: 1.2,
    height: 48,
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
  modalGap: {
    marginBottom: 12,
  },
  modalDateRow: {
    marginBottom: 0,
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

export default MembershipListScreen;
