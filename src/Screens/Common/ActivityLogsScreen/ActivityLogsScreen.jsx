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
  DateField,
  GreenButton,
  GrayButton,
  Badge,
  toDateObj,
  startOfDay,
  shared,
} from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const USER_OPTIONS = ['All Users', 'Office Bearers', 'Admin2', 'Admin1'];
const MODULE_OPTIONS = ['All Modules', 'Auth', 'Wazifa', 'Membership', 'Users'];
const STATUS_OPTIONS = ['All Status', 'Successful', 'Failed'];

const DEFAULT_FROM = new Date(2026, 9, 1);
const DEFAULT_TO = new Date(2026, 10, 7);

const ACTIVITY_LOGS_DATA = [
  {
    id: '1',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:35:52 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '::1',
    details: '-',
  },
  {
    id: '2',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:35:52 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '::1',
    details: '-',
  },
  {
    id: '3',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:35:52 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '::1',
    details: '-',
  },
  {
    id: '4',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:35:52 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '::1',
    details: '-',
  },
  {
    id: '5',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:35:51 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '::1',
    details: '-',
  },
  {
    id: '6',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:33:17 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '2401:4900:1c3c:aa83:7575:825b:dab6:908f',
    details: '-',
  },
  {
    id: '7',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:33:16 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '2401:4900:1c3c:aa83:7575:825b:dab6:908f',
    details: '-',
  },
  {
    id: '8',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:33:15 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '2401:4900:1c3c:aa83:7575:825b:dab6:908f',
    details: '-',
  },
  {
    id: '9',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:30:55 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '2401:4900:1c3c:aa83:7575:825b:dab6:908f',
    details: '-',
  },
  {
    id: '10',
    initial: 'O',
    user: 'Office Bearers',
    userId: 'Office Bearers',
    dateTime: '16/10/2026\n1:30:54 pm',
    isoDate: '2026-10-16',
    action: 'VIEW',
    module: 'Auth',
    status: 'Successful',
    device: 'Desktop',
    ipAddress: '2401:4900:1c3c:aa83:7575:825b:dab6:908f',
    details: '-',
  },
];

const ActivityLogsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    user: 'All Users',
    module: 'All Modules',
    status: 'All Status',
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });

  // Draft Filters in Modal
  const [draftUser, setDraftUser] = useState('All Users');
  const [draftModule, setDraftModule] = useState('All Modules');
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(DEFAULT_TO);

  const openFilter = () => {
    setDraftUser(applied.user);
    setDraftModule(applied.module);
    setDraftStatus(applied.status);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      user: draftUser,
      module: draftModule,
      status: draftStatus,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftUser('All Users');
    setDraftModule('All Modules');
    setDraftStatus('All Status');
    setDraftFrom(DEFAULT_FROM);
    setDraftTo(DEFAULT_TO);
    setSearch('');
    setApplied({
      search: '',
      user: 'All Users',
      module: 'All Modules',
      status: 'All Status',
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return ACTIVITY_LOGS_DATA.filter(item => {
      if (applied.user !== 'All Users' && item.user !== applied.user)
        return false;
      if (applied.module !== 'All Modules' && item.module !== applied.module)
        return false;
      if (applied.status !== 'All Status' && item.status !== applied.status)
        return false;

      if (applied.from && toDateObj(item.isoDate) < startOfDay(applied.from))
        return false;
      if (applied.to && toDateObj(item.isoDate) > startOfDay(applied.to))
        return false;

      if (
        q &&
        !item.user.toLowerCase().includes(q) &&
        !item.ipAddress.toLowerCase().includes(q) &&
        !item.action.toLowerCase().includes(q)
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
            <Text style={styles.valTextBold}>{item.user}</Text>
          </View>
        </View>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Date & Time</Text>
          <Text style={styles.valText}>{item.dateTime}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Action / Module</Text>
          <Text style={styles.valTextPrimary}>
            {item.action} • {item.module}
          </Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Device & IP Address</Text>
          <Text style={styles.valText} numberOfLines={1}>
            {item.device} ({item.ipAddress})
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
          title="Activity Logs"
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
        
                  {/* Stats Row */}
                  {/* <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Total Activities</Text>
                      <Text style={styles.statVal}>647</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Successful</Text>
                      <Text style={[styles.statVal, { color: '#15803D' }]}>
                        647
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Failed</Text>
                      <Text style={[styles.statVal, { color: '#DC2626' }]}>
                        0
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statTitle}>Unique Users</Text>
                      <Text style={[styles.statVal, { color: '#2563EB' }]}>
                        1
                      </Text>
                    </View>
                  </View> */}

                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search by user, email, IP..."
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

          

                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.sectionHeading}>
                      Activity Records (647)
                    </Text>
                    <Text style={styles.paginationText}>
                      Page 1 of 33 (20 per page)
                    </Text>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="file-search-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No activity logs found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or date filters.
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
                <Text style={styles.filterTitle}>Filter Activity Logs</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="User" />
              <Dropdown
                value={draftUser}
                options={USER_OPTIONS}
                onSelect={setDraftUser}
                style={styles.modalGap}
              />

              <Label text="Module" />
              <Dropdown
                value={draftModule}
                options={MODULE_OPTIONS}
                onSelect={setDraftModule}
                style={styles.modalGap}
              />

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={STATUS_OPTIONS}
                onSelect={setDraftStatus}
                style={styles.modalGap}
              />

              <View style={[shared.row, styles.modalDateRow, { marginTop: 4 }]}>
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
    marginBottom: 10,
  },
  exportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
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

  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },
  paginationText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
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
    width: 34,
    height: 34,
    borderRadius: 17,
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

export default ActivityLogsScreen;
