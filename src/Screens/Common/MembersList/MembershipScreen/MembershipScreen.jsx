import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
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
  GreenButton,
  GrayButton,
  Badge,
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

const MEMBERS_DATA = [
  {
    id: '1',
    membershipDate: '-',
    uniqueId: 'OR2890',
    fullName: 'Syed Haider Naqvi',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '2',
    membershipDate: '-',
    uniqueId: 'OR8042',
    fullName: 'Syed Raza Husain Zaidi',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '3',
    membershipDate: '-',
    uniqueId: 'OR2630',
    fullName: 'Nawab Syed Mohd Sadiq Safvi',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '4',
    membershipDate: '-',
    uniqueId: 'OR1713',
    fullName: 'Late Syed Zawwar Ali',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '5',
    membershipDate: '-',
    uniqueId: 'OR3655',
    fullName: 'Late Haji Syedul Abidin',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '6',
    membershipDate: '-',
    uniqueId: 'OR1874',
    fullName: 'Late Wakaf Ghulam Husain',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '7',
    membershipDate: '-',
    uniqueId: 'OR5950',
    fullName: 'Syed Ghayoor Husain Bilgrami',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '8',
    membershipDate: '-',
    uniqueId: 'OR7775',
    fullName: 'Late Syed Mujtaba Husain',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '9',
    membershipDate: '-',
    uniqueId: 'OR2866',
    fullName: 'Late Maulana Syed Ibney Hasan',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
  {
    id: '10',
    membershipDate: '-',
    uniqueId: 'OR4047',
    fullName: 'Late Ahmad Ismail Jafri',
    memberType: 'Ordinary Member',
    introducedBy: '-',
    status: 'Active',
  },
];

const STATS_CARDS = [
  {
    title: 'Ordinary Member',
    total: '1,805',
    active: '1,805',
    suspended: '0',
    expired: '0',
  },
  {
    title: 'Life Member',
    total: '3,998',
    active: '3,998',
    suspended: '0',
    expired: '0',
  },
  {
    title: 'Dawami Member',
    total: '3,351',
    active: '3,351',
    suspended: '0',
    expired: '0',
  },
  {
    title: 'Sarparast Member',
    total: '7',
    active: '0',
    suspended: '0',
    expired: '0',
  },
  {
    title: 'Mohsine member',
    total: '155',
    active: '155',
    suspended: '0',
    expired: '0',
  },
];

const MembershipScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    memberType: 'All Types',
    status: 'All Status',
  });

  // Draft Filters in Modal
  const [draftType, setDraftType] = useState('All Types');
  const [draftStatus, setDraftStatus] = useState('All Status');

  const openFilter = () => {
    setDraftType(applied.memberType);
    setDraftStatus(applied.status);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      memberType: draftType,
      status: draftStatus,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftType('All Types');
    setDraftStatus('All Status');
    setSearch('');
    setApplied({
      search: '',
      memberType: 'All Types',
      status: 'All Status',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return MEMBERS_DATA.filter(item => {
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
        !item.introducedBy.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [applied]);

  const renderMemberItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.srNo}>{index + 1}</Text>
        <Text style={styles.uniqueIdText}>ID: {item.uniqueId}</Text>
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
          <Text style={styles.labelKey}>Introduced By</Text>
          <Text style={styles.valText}>{item.introducedBy}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Membership Date</Text>
          <Text style={styles.valText}>{item.membershipDate}</Text>
        </View>
      </View>

      {/* <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <Icon
          name="eye-outline"
          size={16}
          color={colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.actionBtnText}>View Details / Action</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Membership"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            <FlatList
              data={filteredData}
              keyExtractor={item => item.id}
              renderItem={renderMemberItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <View>
                  {/* Horizontal Stats / Category Cards */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.statsScroll}
                    contentContainerStyle={styles.statsContent}
                  >
                    {STATS_CARDS.map((stat, idx) => (
                      <View key={idx} style={styles.statCard}>
                        <Text style={styles.statCardTitle}>{stat.title}</Text>
                        <View style={styles.statRowMain}>
                          <Text style={styles.statTotalLabel}>Total</Text>
                          <Text style={styles.statTotalVal}>{stat.total}</Text>
                        </View>
                        <View style={styles.statSubRow}>
                          <Text style={styles.statSubText}>
                            Active: {stat.active}
                          </Text>
                          <Text style={styles.statSubText}>
                            Susp: {stat.suspended}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>

                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search member name, ID..."
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

                  <Text style={styles.sectionHeading}>Recent Memberships</Text>
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

            {/* Bottom Button Bar */}
            <View style={styles.bottomBar}>
              <GreenButton
                title="+ New Member"
                icon="account-plus-outline"
                onPress={() =>
                  navigation.navigate('AddMembershipApplicationScreen')
                }
                style={styles.newMemberButtonBar}
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
                <Text style={styles.filterTitle}>Filter Members</Text>
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

  // Bottom Button Bar Styles
  bottomBar: {
    paddingHorizontal: wp('4%'),
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  newMemberButtonBar: {
    height: 48,
    width: '100%',
  },

  // Stats Horizontal Scroll
  statsScroll: {
    maxHeight: 90,
    marginTop: 10,
    marginBottom: 12,
  },
  statsContent: {
    gap: 8,
  },
  statCard: {
    marginTop: 15,
    width: 140,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'space-between',
  },
  statCardTitle: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  statRowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTotalLabel: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },
  statTotalVal: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },
  statSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statSubText: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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

  sectionHeading: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginBottom: 10,
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
  uniqueIdText: {
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
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
  },
  valText: {
    fontSize: FontSize.sm,
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

export default MembershipScreen;
