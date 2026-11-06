import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';

import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Label,
  Dropdown,
  DateField,
  GreenButton,
  shared,
} from '../../../../components/Formparts';

// ---------------------------------------------------------------
// Dummy Data & Options
// ---------------------------------------------------------------
const MODES = ['All Modes', 'Cash', 'UPI', 'Cheque'];

const MEMBERS_LIST = [
  'All Members',
  '6 - Mr. Mohammad Ali Shamsi',
  '6383 - Harsh Gond',
  '3418 - Rocky Smith',
  '70837 - Mrs. Zarina Aftab',
];

const LEDGER_MEMBERS = [
  {
    id: '1',
    memberNo: '6',
    name: 'Mr. Mohammad Ali Shamsi',
    type: 'Life Member',
    mobile: '+91 9936072442',
    balance: 1200,
    status: 'Active',
    mode: 'Cash',
  },
  {
    id: '2',
    memberNo: '6383',
    name: 'Harsh Gond',
    type: 'Ordinary Member',
    mobile: '+91 9876543210',
    balance: 4500,
    status: 'Active',
    mode: 'UPI',
  },
  {
    id: '3',
    memberNo: '3418',
    name: 'Rocky Smith',
    type: 'Sarparsat Member',
    mobile: '+91 9123456789',
    balance: 850,
    status: 'Pending',
    mode: 'Cheque',
  },
  {
    id: '4',
    memberNo: '70837',
    name: 'Mrs. Zarina Aftab',
    type: 'Ordinary Member',
    mobile: '+91 9988776655',
    balance: 3100,
    status: 'Active',
    mode: 'Cash',
  },
];

const formatNumber = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const LedgerScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  // Applied filters state
  const [applied, setApplied] = useState({
    search: '',
    selectedMember: 'All Members',
    mode: 'All Modes',
    from: null,
    to: null,
  });

  // Modal open/close state
  const [filterOpen, setFilterOpen] = useState(false);

  // Draft filter states inside modal
  const [draftMember, setDraftMember] = useState('All Members');
  const [draftMode, setDraftMode] = useState('All Modes');
  const [draftFrom, setDraftFrom] = useState(null);
  const [draftTo, setDraftTo] = useState(null);

  const openFilter = () => {
    setDraftMember(applied.selectedMember);
    setDraftMode(applied.mode);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      selectedMember: draftMember,
      mode: draftMode,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const data = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    return LEDGER_MEMBERS.filter(item => {
      if (applied.mode !== 'All Modes' && item.mode !== applied.mode) {
        return false;
      }
      if (
        applied.selectedMember !== 'All Members' &&
        !applied.selectedMember.includes(item.name) &&
        !applied.selectedMember.includes(item.memberNo)
      ) {
        return false;
      }
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.memberNo.toLowerCase().includes(q) &&
        !item.mobile.includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [applied]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
        // Handle ledger detail navigation if needed
      }}
    >
      <View style={styles.cardTop}>
        <View style={styles.avatarBox}>
          <Icon name="account-outline" size={22} color={colors.primary} />
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.memberName} numberOfLines={1}>
              {index + 1}. {item.name}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'Active'
                      ? colors.successBg
                      : colors.warningBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === 'Active'
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
          <Text style={styles.memberMeta}>
            Member No: <Text style={styles.boldText}>{item.memberNo}</Text> |{' '}
            {item.type}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.mobileRow}>
          <Icon name="phone-outline" size={14} color="#6B7280" />
          <Text style={styles.mobileText}>{item.mobile}</Text>
        </View>

        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Balance:</Text>
          <Text style={styles.balanceValue}>
            ₹ {formatNumber(item.balance)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Ledger Members"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <View style={styles.contentContainer}>
            {/* Search & Filter Row */}
            <View style={styles.searchFilterContainer}>
              <View style={styles.searchFlex}>
                <View style={styles.searchBox}>
                  <Icon name="magnify" size={22} color="#4B5563" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search member..."
                    placeholderTextColor={colors.placeHolderColor}
                    value={search}
                    onChangeText={text => {
                      setSearch(text);
                      setApplied(prev => ({ ...prev, search: text }));
                    }}
                    autoCorrect={false}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.filterButton}
                activeOpacity={0.8}
                onPress={openFilter}
              >
                <Icon name="filter-variant" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Icon name="book-open-variant" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No ledger members found</Text>
                  <Text style={styles.emptySubtext}>
                    Try searching with another keyword or filter
                  </Text>
                </View>
              }
            />
          </View>
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
              <Text style={styles.filterTitle}>Filter Ledger Members</Text>

              <Label text="Member" />
              <Dropdown
                value={draftMember}
                options={MEMBERS_LIST}
                onSelect={setDraftMember}
                searchable
                style={styles.modalGap}
                placeholder="Select or Search Member..."
              />

              <Label text="Payment Mode" />
              <Dropdown
                value={draftMode}
                options={MODES}
                onSelect={setDraftMode}
                style={styles.modalGap}
              />

              <View style={[shared.row, styles.modalDateRow]}>
                <View style={shared.colL}>
                  <Label text="From Date" />
                  <DateField value={draftFrom} onChange={setDraftFrom} />
                </View>

                <View style={shared.col}>
                  <Label text="To Date" />
                  <DateField value={draftTo} onChange={setDraftTo} />
                </View>
              </View>

              <GreenButton
                title="Apply"
                onPress={applyFilter}
                style={styles.applyButton}
              />
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: 14,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchFlex: {
    flex: 1,
    marginRight: 8,
  },
  searchBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.SecondTitleColor,
    paddingVertical: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    flex: 1,
    marginRight: 6,
  },
  memberMeta: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingTop: 8,
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
    marginRight: 4,
  },
  balanceValue: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.success,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: '#1F2937',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
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
  filterTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginBottom: 14,
  },
  modalDateRow: {
    marginBottom: 4,
  },
  modalGap: {
    marginBottom: 12,
  },
  applyButton: {
    height: 48,
    marginTop: 14,
  },
});

export default LedgerScreen;
