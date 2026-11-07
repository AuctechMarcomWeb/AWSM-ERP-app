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
  GreenButton,
  GrayButton,
  Badge,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const MEMBER_TYPES = [
  'All Types',
  'Elected Member',
  'Nominated Member',
  'Life Member',
];

const MEMBER_STATUSES = ['All Status', 'Active', 'Suspended', 'Expired'];
const SORT_OPTIONS = ['Recent', 'Oldest', 'Name (A-Z)'];

const EXECUTIVE_MEMBERS_DATA = [
  {
    id: '1',
    memberId: '0001',
    name: 'Haji Dr S Mohd. Abbas Zaidi',
    memberType: 'Elected Member',
    mobile: '9818244361',
    age: '-',
    city: 'New Delhi',
    state: 'New Delhi',
    address: 'Kothi No. 11, Noor Nagar Extension, Jamia Nagar, New Delhi -25',
    status: 'Active',
  },
  {
    id: '2',
    memberId: '0002',
    name: 'Sanaul Hasan Zaidi',
    memberType: 'Elected Member',
    mobile: '9650241333',
    age: '61 year',
    city: 'Aligarh',
    state: 'U.P',
    address: 'A 102, Ishaq Residency, Sir Syed Nagar, Aligarh 202002',
    status: 'Active',
  },
  {
    id: '3',
    memberId: '0003',
    name: 'Mirza Ali Abbas',
    memberType: 'Elected Member',
    mobile: '8318585254',
    age: '-',
    city: 'Gorakhpur',
    state: 'U.P',
    address:
      'S/o Late Mirza Ishrat Husain, Khadim Kada, Sheikhpura opp Panjatan Sports Geeta Press Gorakhpur, U.P-273005',
    status: 'Active',
  },
  {
    id: '4',
    memberId: '0004',
    name: 'Dr. Shujahat Husain',
    memberType: 'Elected Member',
    mobile: '7060888223',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: '4/771, Friends Colony, Aligarh',
    status: 'Active',
  },
  {
    id: '5',
    memberId: '0005',
    name: 'S. M. Ahmad Rizvi (Gulrez)',
    memberType: 'Elected Member',
    mobile: '8349700786',
    age: '-',
    city: 'Bhopal',
    state: 'M.P.',
    address: 'Bhopal, Madhya Pradesh',
    status: 'Active',
  },
];

const ExecutiveMembersScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    memberType: 'All Types',
    status: 'All Status',
    sortBy: 'Recent',
  });

  // Draft Filters in Modal
  const [draftType, setDraftType] = useState('All Types');
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftSort, setDraftSort] = useState('Recent');

  const openFilter = () => {
    setDraftType(applied.memberType);
    setDraftStatus(applied.status);
    setDraftSort(applied.sortBy);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      memberType: draftType,
      status: draftStatus,
      sortBy: draftSort,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftType('All Types');
    setDraftStatus('All Status');
    setDraftSort('Recent');
    setSearch('');
    setApplied({
      search: '',
      memberType: 'All Types',
      status: 'All Status',
      sortBy: 'Recent',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return EXECUTIVE_MEMBERS_DATA.filter(item => {
      if (
        applied.memberType !== 'All Types' &&
        item.memberType !== applied.memberType
      )
        return false;
      if (applied.status !== 'All Status' && item.status !== applied.status)
        return false;

      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.memberId.toLowerCase().includes(q) &&
        !item.city.toLowerCase().includes(q) &&
        !item.mobile.toLowerCase().includes(q)
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
        <Text style={styles.idText}>ID: {item.memberId}</Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Name</Text>
          <Text style={styles.valTextBold}>{item.name}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Member Type</Text>
          <Text style={styles.valTextPrimary}>{item.memberType}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Mobile No.</Text>
          <Text style={styles.valText}>{item.mobile}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Age</Text>
          <Text style={styles.valText}>{item.age}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Location</Text>
          <Text style={styles.valText}>
            {item.city}, {item.state}
          </Text>
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
          title="Executive Members"
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
                  {/* Top Bar: Export Button */}
                  {/* <View style={styles.topHeaderRow}>
                    <Text style={styles.screenDesc}>
                      Manage Executive Members
                    </Text>

                    <TouchableOpacity
                      style={styles.exportBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        Alert.alert(
                          'Export',
                          'Exporting executive members list...',
                        )
                      }
                    >
                      <Icon name="file-pdf-box" size={16} color="#DC2626" />
                      <Text style={styles.exportText}>Export</Text>
                    </TouchableOpacity>
                  </View> */}

                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search member name, ID, city..."
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
                    name="account-group-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyTitle}>
                    No executive members found
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
                </View>
              }
            />

            {/* Bottom Button Bar for Adding New Member */}
            <View style={styles.bottomBar}>
              <GreenButton
                title="+ Add Member"
                icon="account-plus-outline"
                onPress={() =>
                  navigation.navigate('AddMembershipApplicationScreen')
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
                <Text style={styles.filterTitle}>Filter Executive Members</Text>
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

              <Label text="Sort By" />
              <Dropdown
                value={draftSort}
                options={SORT_OPTIONS}
                onSelect={setDraftSort}
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
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: '#DC2626',
    marginLeft: 4,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
        marginTop: 24,
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
  idText: {
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

  // Bottom Button Bar
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

export default ExecutiveMembersScreen;
