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
  toDateObj,
  startOfDay,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const PAYMENT_MODES = ['All Modes', 'Bank Transfer', 'UPI', 'Cash'];

const DEFAULT_FROM = new Date(2026, 5, 1);
const DEFAULT_TO = new Date(2026, 11, 31);

const TRANSACTIONS_DATA = [
  {
    id: '1',
    date: '10 Jul 2026',
    isoDate: '2026-07-10',
    wazifa: '000002 - Imran Hussain',
    address: 'DU Campus Boys Hostel, Delhi - 110007',
    fundType: 'Scholaship Pay',
    collectedBy: '-',
    amount: 'Rs 0 (Debit)',
    type: 'Debit',
    paymentMode: 'Bank Transfer',
  },
  {
    id: '2',
    date: '10 Jul 2026',
    isoDate: '2026-07-10',
    wazifa: '000007 - Mohammad Arif Khan895',
    address: 'AMU Campus Hostel, Block C, Aligarh',
    fundType: 'Scholaship Pay',
    collectedBy: '-',
    amount: 'Rs 9,000 (Debit)',
    type: 'Debit',
    paymentMode: 'Bank Transfer',
  },
  {
    id: '3',
    date: '10 Jul 2026',
    isoDate: '2026-07-10',
    wazifa: '000004 - Aarav Sharma',
    address: 'Area',
    fundType: 'Scholaship Pay',
    collectedBy: '-',
    amount: 'Rs 30,000 (Debit)',
    type: 'Debit',
    paymentMode: 'Bank Transfer',
  },
  {
    id: '4',
    date: '17 Jun 2026',
    isoDate: '2026-06-17',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 650 (Credit)',
    type: 'Credit',
    paymentMode: 'UPI',
  },
  {
    id: '5',
    date: '17 Jun 2026',
    isoDate: '2026-06-17',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 200 (Credit)',
    type: 'Credit',
    paymentMode: 'UPI',
  },
  {
    id: '6',
    date: '17 Jun 2026',
    isoDate: '2026-06-17',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 199 (Credit)',
    type: 'Credit',
    paymentMode: 'UPI',
  },
  {
    id: '7',
    date: '17 Jun 2026',
    isoDate: '2026-06-17',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 500 (Credit)',
    type: 'Credit',
    paymentMode: 'UPI',
  },
  {
    id: '8',
    date: '17 Jun 2026',
    isoDate: '2026-06-17',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 500 (Credit)',
    type: 'Credit',
    paymentMode: 'Cash',
  },
  {
    id: '9',
    date: '17 Jun 2026',
    isoDate: '2026-06-17',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 232 (Credit)',
    type: 'Credit',
    paymentMode: 'Cash',
  },
  {
    id: '10',
    date: '15 Jun 2026',
    isoDate: '2026-06-15',
    wazifa: '000003 - Ram singh',
    address: '-',
    fundType: 'Return of Qarze Hasna',
    collectedBy: 'Head Office',
    amount: 'Rs 5,000 (Credit)',
    type: 'Credit',
    paymentMode: 'Cash',
  },
];

const RecentTransactionsScreen = ({ navigation }) => {
  const [searchMember, setSearchMember] = useState('');
  const [searchWazifa, setSearchWazifa] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    member: '',
    wazifa: '',
    paymentMode: 'All Modes',
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });

  // Draft Filters Inside Modal
  const [draftMember, setDraftMember] = useState('');
  const [draftWazifa, setDraftWazifa] = useState('');
  const [draftMode, setDraftMode] = useState('All Modes');
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(DEFAULT_TO);

  const openFilter = () => {
    setDraftMember(applied.member);
    setDraftWazifa(applied.wazifa);
    setDraftMode(applied.paymentMode);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      member: draftMember,
      wazifa: draftWazifa,
      paymentMode: draftMode,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftMember('');
    setDraftWazifa('');
    setDraftMode('All Modes');
    setDraftFrom(DEFAULT_FROM);
    setDraftTo(DEFAULT_TO);
    setSearchMember('');
    setSearchWazifa('');
    setApplied({
      member: '',
      wazifa: '',
      paymentMode: 'All Modes',
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
    });
  };

  const filteredData = useMemo(() => {
    const memQ = applied.member.trim().toLowerCase();
    const wazQ = applied.wazifa.trim().toLowerCase();

    return TRANSACTIONS_DATA.filter(item => {
      if (
        applied.paymentMode !== 'All Modes' &&
        item.paymentMode !== applied.paymentMode
      ) {
        return false;
      }
      if (applied.from && toDateObj(item.isoDate) < startOfDay(applied.from)) {
        return false;
      }
      if (applied.to && toDateObj(item.isoDate) > startOfDay(applied.to)) {
        return false;
      }

      if (memQ && !item.collectedBy.toLowerCase().includes(memQ)) {
        return false;
      }
      if (
        wazQ &&
        !item.wazifa.toLowerCase().includes(wazQ) &&
        !item.address.toLowerCase().includes(wazQ)
      ) {
        return false;
      }

      return false || true; // standard pass-through if matches
    });
  }, [applied]);

  const renderItem = ({ item, index }) => {
    const isCredit = item.type === 'Credit';

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.srNo}>{index + 1}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
          <View
            style={[
              styles.modeBadge,
              { backgroundColor: isCredit ? '#DCFCE7' : '#FEF3C7' },
            ]}
          >
            <Text
              style={[
                styles.modeBadgeText,
                { color: isCredit ? '#15803D' : '#B45309' },
              ]}
            >
              {item.paymentMode}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.labelKey}>Wazifa / Member</Text>
            <Text style={styles.valTextBold}>{item.wazifa}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.labelKey}>Address</Text>
            <Text style={styles.valText}>{item.address}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.labelKey}>Fund Type</Text>
            <Text style={styles.valTextPrimary}>{item.fundType}</Text>
          </View>
          <View style={styles.infoColRight}>
            <Text style={styles.labelKey}>Collected By</Text>
            <Text style={styles.valText}>{item.collectedBy}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.labelKey}>Amount</Text>
          <Text
            style={[
              styles.amountText,
              { color: isCredit ? '#15803D' : '#DC2626' },
            ]}
          >
            {item.amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Recent Transactions"
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
                  {/* Search Fields & Filter Icon */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search wazifa..."
                        value={searchWazifa}
                        onChangeText={text => {
                          setSearchWazifa(text);
                          setApplied(prev => ({ ...prev, wazifa: text }));
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
                  <Icon name="receipt" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No transactions found</Text>
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
                <Text style={styles.filterTitle}>Filter Transactions</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Search Member" />
              <SearchField
                placeholder="Search member..."
                value={draftMember}
                onChangeText={setDraftMember}
                style={styles.modalGap}
              />

              <Label text="Payment Mode" />
              <Dropdown
                value={draftMode}
                options={PAYMENT_MODES}
                onSelect={setDraftMode}
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

  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  dateText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingTop: 8,
    marginTop: 4,
  },
  amountText: {
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

export default RecentTransactionsScreen;
