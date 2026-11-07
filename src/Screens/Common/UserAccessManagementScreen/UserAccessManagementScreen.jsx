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

const ROLES = ['All', 'Admin', 'Office Bearers', 'OfficeStaff'];
const LOGIN_ACCESS_OPTIONS = ['All', 'Enabled', 'Disabled'];
const STATUS_OPTIONS = ['All', 'Active', 'Inactive', 'Suspended'];

const USERS_ACCESS_DATA = [
  {
    id: '1',
    initial: 'A',
    fullName: 'Admin2',
    userId: 'Admin2',
    role: 'Admin',
    contact: '2222222222',
    email: 'admin@wazifa.gmail.com',
    loginAccess: 'Active',
    status: 'Active',
    lastLogin: '05 Nov 2026, 04:04 pm',
  },
  {
    id: '2',
    initial: 'A',
    fullName: 'Admin1',
    userId: 'Admin1',
    role: 'Admin',
    contact: '1111111111',
    email: 'admin1@gmail.com',
    loginAccess: 'Active',
    status: 'Active',
    lastLogin: '04 Nov 2026, 04:08 pm',
  },
  {
    id: '3',
    initial: 'O',
    fullName: 'Office Bearers',
    userId: 'OfficeBearers',
    role: 'Office Bearers',
    contact: '9005680385',
    email: 'adityaauctech@gmail.com',
    loginAccess: 'Active',
    status: 'Active',
    lastLogin: '16 Oct 2026, 01:30 pm',
  },
  {
    id: '4',
    initial: 'O',
    fullName: 'Office staff',
    userId: 'OfficeStaff',
    role: 'OfficeStaff',
    contact: '9616171814',
    email: 'development@auctech.in',
    loginAccess: 'Active',
    status: 'Active',
    lastLogin: '-',
  },
];

const UserAccessManagementScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    role: 'All',
    loginAccess: 'All',
    status: 'All',
  });

  // Draft Filters in Modal
  const [draftRole, setDraftRole] = useState('All');
  const [draftLoginAccess, setDraftLoginAccess] = useState('All');
  const [draftStatus, setDraftStatus] = useState('All');

  const openFilter = () => {
    setDraftRole(applied.role);
    setDraftLoginAccess(applied.loginAccess);
    setDraftStatus(applied.status);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      role: draftRole,
      loginAccess: draftLoginAccess,
      status: draftStatus,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftRole('All');
    setDraftLoginAccess('All');
    setDraftStatus('All');
    setSearch('');
    setApplied({
      search: '',
      role: 'All',
      loginAccess: 'All',
      status: 'All',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return USERS_ACCESS_DATA.filter(item => {
      if (applied.role !== 'All' && item.role !== applied.role) return false;
      if (applied.status !== 'All' && item.status !== applied.status)
        return false;

      if (
        q &&
        !item.fullName.toLowerCase().includes(q) &&
        !item.userId.toLowerCase().includes(q) &&
        !item.contact.toLowerCase().includes(q) &&
        !item.email.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [applied]);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{item.initial}</Text>
          </View>
          <View>
            <Text style={styles.srNo}>{index + 1}</Text>
            <Text style={styles.valTextBold}>{item.fullName}</Text>
          </View>
        </View>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>User ID</Text>
          <Text style={styles.valText}>{item.userId}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Role</Text>
          <Text style={styles.valTextPrimary}>{item.role}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Contact No.</Text>
          <Text style={styles.valText}>{item.contact}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Login Access</Text>
          <Text
            style={[
              styles.valText,
              { color: '#15803D', fontFamily: FontFamily.bold },
            ]}
          >
            {item.loginAccess}
          </Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Email Address</Text>
          <Text style={styles.valText}>{item.email}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Last Login</Text>
          <Text style={styles.valText}>{item.lastLogin}</Text>
        </View>
      </View>

      {/* <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert(
            'Permissions',
            `Manage menu permissions for ${item.fullName}`,
          )
        }
      >
        <Icon
          name="shield-account-outline"
          size={16}
          color={colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.actionBtnText}>Manage Permissions / Access</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="User Access Management"
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
                  {/* Stats Grid */}
                  {/* <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Total Users</Text>
                      <Text style={styles.statVal}>4</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Active</Text>
                      <Text style={[styles.statVal, { color: '#15803D' }]}>
                        4
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Inactive</Text>
                      <Text style={[styles.statVal, { color: '#DC2626' }]}>
                        0
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Login Enabled</Text>
                      <Text style={[styles.statVal, { color: '#2563EB' }]}>
                        4
                      </Text>
                    </View>
                  </View> */}

                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search users..."
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

                  {/*            
                  <View style={styles.exportBar}>
                    <TouchableOpacity
                      style={styles.exportChip}
                      onPress={() =>
                        Alert.alert('Export', 'Exporting as Excel...')
                      }
                    >
                      <Icon
                        name="file-excel"
                        size={16}
                        color="#15803D"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.exportChipText}>Excel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.exportChip}
                      onPress={() =>
                        Alert.alert('Export', 'Exporting as CSV...')
                      }
                    >
                      <Icon
                        name="file-delimited"
                        size={16}
                        color="#2563EB"
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[styles.exportChipText, { color: '#2563EB' }]}
                      >
                        CSV
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.exportChip}
                      onPress={() => Alert.alert('Export', 'Printing list...')}
                    >
                      <Icon
                        name="printer"
                        size={16}
                        color="#D97706"
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[styles.exportChipText, { color: '#D97706' }]}
                      >
                        Print
                      </Text>
                    </TouchableOpacity>
                  </View> */}

                  <Text style={styles.sectionHeading}>All Users (4)</Text>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon
                    name="account-search-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyTitle}>No users found</Text>
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
                <Text style={styles.filterTitle}>Filter Users Access</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Role" />
              <Dropdown
                value={draftRole}
                options={ROLES}
                onSelect={setDraftRole}
                style={styles.modalGap}
              />

              <Label text="Login Access" />
              <Dropdown
                value={draftLoginAccess}
                options={LOGIN_ACCESS_OPTIONS}
                onSelect={setDraftLoginAccess}
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

  screenDesc: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 8,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 9,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statVal: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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

  exportBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  exportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exportChipText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },

  sectionHeading: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginBottom: 8,
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
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  srNo: {
    fontSize: 9,
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

export default UserAccessManagementScreen;
