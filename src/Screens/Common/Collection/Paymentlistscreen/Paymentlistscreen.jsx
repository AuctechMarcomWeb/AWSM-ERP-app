import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
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
  Badge,
  formatRs,
  longDate,
  toDateObj,
  startOfDay,
  shared,
} from '../../../../components/Formparts';

// ---------------------------------------------------------------
// Filters & Data with All Fields
// ---------------------------------------------------------------
const STATUSES = ['All Status', 'paid', 'pending', 'failed'];
const GATEWAYS = ['All Gateways', 'payu', 'razorpay'];

const PAYMENTS = [
  {
    id: '1',
    sr: '1',
    date: '2026-10-31',
    name: 'kapil Thakur',
    email: 'kapilthakur4666@gmail.com',
    phone: '9520076803',
    morhumeen: '-',
    amount: 1,
    fund: 'Dawami Member',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'pending',
  },
  {
    id: '2',
    sr: '2',
    date: '2026-10-31',
    name: 'kapil Thakur',
    email: 'kapilthakur4666@gmail.com',
    phone: '9520076803',
    morhumeen: '-',
    amount: 2000,
    fund: 'Dawami Member',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'pending',
  },
  {
    id: '3',
    sr: '3',
    date: '2026-10-18',
    name: 'Ghulam Akbar',
    email: 'ghulamakbar789025@gmail.com',
    phone: '9259655076',
    morhumeen: '-',
    amount: 20000,
    fund: 'Sahme-Imam(Khums)',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'paid',
  },
  {
    id: '4',
    sr: '4',
    date: '2026-10-16',
    name: 'Mir Afnaan Ali',
    email: 'mirafnaanali07@gmail.com',
    phone: '7760945492',
    morhumeen: '-',
    amount: 500,
    fund: 'Sahme-Imam(Khums)',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'pending',
  },
  {
    id: '5',
    sr: '5',
    date: '2026-10-13',
    name: 'Faiz',
    email: 'abbasabidi31@gmail.com',
    phone: '8953624606',
    morhumeen: '-',
    amount: 100,
    fund: 'Life Member',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'pending',
  },
  {
    id: '6',
    sr: '6',
    date: '2026-10-09',
    name: 'Mohd sunny',
    email: 'Sunnycps141@gmail.com',
    phone: '7454839137',
    morhumeen: '-',
    amount: 500,
    fund: 'Ordinary Member',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'paid',
  },
  {
    id: '7',
    sr: '7',
    date: '2026-10-03',
    name: 'Mahmood Zamon Sadequian',
    email: 'zamonmahmood71@gmail.com',
    phone: '9321449607',
    morhumeen: '-',
    amount: 2000,
    fund: 'Sahme-Sadat(khums)',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'paid',
  },
  {
    id: '8',
    sr: '8',
    date: '2026-10-03',
    name: 'Mahmood Zamon Sadequian',
    email: 'zamonmahmood71@gmail.com',
    phone: '9321449607',
    morhumeen: '-',
    amount: 2000,
    fund: 'Sahme-Imam(Khums)',
    gateway: 'payu',
    mode: 'Online',
    contributeType: 'Monthly',
    status: 'paid',
  },
];

const PaymentListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  // Applied filters state
  const [applied, setApplied] = useState({
    search: '',
    status: 'All Status',
    gateway: 'All Gateways',
    from: null,
    to: null,
  });

  // Modal open/close state
  const [filterOpen, setFilterOpen] = useState(false);

  // Draft filter states inside modal
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftGateway, setDraftGateway] = useState('All Gateways');
  const [draftFrom, setDraftFrom] = useState(null);
  const [draftTo, setDraftTo] = useState(null);

  const openFilter = () => {
    setDraftStatus(applied.status);
    setDraftGateway(applied.gateway);
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      status: draftStatus,
      gateway: draftGateway,
      from: draftFrom,
      to: draftTo,
    }));
    setFilterOpen(false);
  };

  const data = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    return PAYMENTS.filter(p => {
      if (applied.status !== 'All Status' && p.status !== applied.status)
        return false;
      if (applied.gateway !== 'All Gateways' && p.gateway !== applied.gateway)
        return false;

      const d = toDateObj(p.date);
      if (applied.from && d < startOfDay(applied.from)) return false;
      if (applied.to && d > startOfDay(applied.to)) return false;

      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.receipt.toLowerCase().includes(q) &&
        !p.fund.toLowerCase().includes(q) &&
        !p.phone.includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [applied]);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <View style={styles.cardHeader}>
        <View style={styles.srBadge}>
          <Text style={styles.srText}>#{item.sr || index + 1}</Text>
        </View>
        <Text style={styles.date}>{longDate(item.date)}</Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Receipt No:</Text>
          <Text style={styles.fieldValBold}>{item.receipt}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name & Email:</Text>
          <Text style={styles.fieldVal} numberOfLines={2}>
            {item.name} {'\n'}
            {item.email}
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Phone:</Text>
          <Text style={styles.fieldVal}>{item.phone}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Morhumeen Name:</Text>
          <Text style={styles.fieldVal}>{item.morhumeen}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Fund Type:</Text>
          <Text style={styles.fundTypeTag}>{item.fund}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Gateway / Mode:</Text>
          <Text style={styles.fieldVal}>
            {item.gateway.toUpperCase()} / {item.mode}
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Contribute Type:</Text>
          <Text style={styles.fieldVal}>{item.contributeType}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountLabel}>Amount Paid:</Text>
        <Text style={styles.amount}>{formatRs(item.amount)}</Text>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Payment List"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={shared.scroll}
              ListHeaderComponent={
                <View style={styles.searchFilterContainer}>
                  <View style={styles.searchFlex}>
                    <SearchField
                      placeholder="Search name, phone, receipt..."
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
              }
              ListEmptyComponent={
                <View style={shared.empty}>
                  <Icon
                    name="credit-card-off-outline"
                    size={46}
                    color={colors.placeHolderColor}
                  />
                  <Text style={shared.emptyText}>No payments found</Text>
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
              <Text style={styles.filterTitle}>Filter Payments</Text>

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={STATUSES}
                onSelect={setDraftStatus}
                style={styles.modalGap}
              />

              <Label text="Gateway" />
              <Dropdown
                value={draftGateway}
                options={GATEWAYS}
                onSelect={setDraftGateway}
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

  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 14,
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

  row: {
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    paddingBottom: 8,
    marginBottom: 8,
  },

  srBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  srText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },

  date: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  cardBody: {
    gap: 6,
  },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
    flex: 1,
  },

  fieldVal: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
    flex: 1.5,
    textAlign: 'right',
  },

  fieldValBold: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    flex: 1.5,
    textAlign: 'right',
  },

  fundTypeTag: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'right',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingTop: 8,
    marginTop: 8,
  },

  amountLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  amount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.success,
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

export default PaymentListScreen;
