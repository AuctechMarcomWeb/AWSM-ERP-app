import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
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
  SearchField,
  GreenButton,
  shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DUE_REPORT_DATA = [
  {
    id: '1',
    wazifaNo: '000114',
    name: 'AAHIL HUSAIN',
    fathersName: 'AQEEL HUSAIN',
    address: '380/34, NOORBADI, SAADATGANJ, LUCKNOW',
    mobile: '9335830162',
    year: 'Class X',
    course: 'Class X',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '2',
    wazifaNo: '000295',
    name: 'AAHIL HUSAIN',
    fathersName: 'LATE AQEEL HUSAIN',
    address: '380/34, NOORBADI, SADATGANJ, LUCKNOW',
    mobile: '7052864953',
    year: 'Class X',
    course: 'Class X',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '3',
    wazifaNo: '000170',
    name: 'AALE FATEMA KAZMI',
    fathersName: 'LATE ALI ZAFAR',
    address: 'Balmiki purana kalsiya road, saharanpur, UP',
    mobile: '9675147226',
    year: 'Class XII',
    course: 'Class XII',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '4',
    wazifaNo: '001301',
    name: 'AALE ZAHRA',
    fathersName: 'NASIM ABBAS',
    address: '1147/2 GTB NAGAR KARELI PRAYAGRAJ',
    mobile: '9214764421',
    year: 'DIPLOMA IN ENGINEERING GIRL',
    course: 'OTHERS',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '5',
    wazifaNo: '000446',
    name: 'AALIYA RIZVI',
    fathersName: 'JAVED HAIDAR',
    address: '258 ST LUCKNOW CHOWK',
    mobile: '7905932040',
    year: 'Class XI',
    course: 'Class XI',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '6',
    wazifaNo: '000006',
    name: 'AARIZ NAWAL',
    fathersName: 'ABUL KALAM',
    address: 'PATHAN TOLA , MAUNATH BHANJAN , MAU',
    mobile: '9278198822',
    year: 'Bsc 2nd year',
    course: 'BSC',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '7',
    wazifaNo: '000512',
    name: 'AARZEEN JAHRA',
    fathersName: 'CHAND BABU',
    address: 'DEVRA',
    mobile: '8115147463',
    year: 'Class X',
    course: 'Class X',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
  {
    id: '8',
    wazifaNo: '000789',
    name: 'AARZU BANO',
    fathersName: 'RAMZAN ALI',
    address:
      'H N0 525 VILLAGE MATLOOBPUR POST NAGPUR JALALPUR DISTT AMBEDKAR NAGAR',
    mobile: '7880334718',
    year: 'B.A.',
    course: 'BA/BCOM',
    tAmt: 'Rs 0',
    totalPaid: 'Rs 0',
    balance: 'Rs 0',
    remarks: '-',
  },
];

const WazifaDueReportScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DUE_REPORT_DATA.filter(item => {
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.wazifaNo.toLowerCase().includes(q) &&
        !item.mobile.toLowerCase().includes(q) &&
        !item.address.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [search]);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.srNo}>#{index + 1}</Text>
        <Text style={styles.wazifaBadgeText}>Wazifa No: {item.wazifaNo}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Student Name</Text>
          <Text style={styles.valTextBold}>{item.name}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Father's Name</Text>
          <Text style={styles.valText}>{item.fathersName}</Text>
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
          <Text style={styles.labelKey}>Mobile No.</Text>
          <Text style={styles.valTextPrimary}>{item.mobile}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Year / Course</Text>
          <Text style={styles.valText}>
            {item.year} ({item.course})
          </Text>
        </View>
      </View>

      <View style={styles.amountBoxRow}>
        <View style={styles.amountItem}>
          <Text style={styles.labelKey}>T-AMT</Text>
          <Text style={styles.valAmt}>{item.tAmt}</Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={styles.labelKey}>Total Paid</Text>
          <Text style={[styles.valAmt, { color: '#15803D' }]}>
            {item.totalPaid}
          </Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={styles.labelKey}>Balance</Text>
          <Text style={[styles.valAmt, { color: '#DC2626' }]}>
            {item.balance}
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
          title="Wazifa Due Report"
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
               

                  <View style={styles.searchContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search name, Wazifa No, mobile..."
                        value={search}
                        onChangeText={setSearch}
                      />
                    </View>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="file-search-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No records found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search criteria.
                  </Text>
                </View>
              }
            />
          </Body>
        </View>
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
    fontSize: FontSize.xs,
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
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: '#DC2626',
    marginLeft: 4,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
       marginTop: 25,
  },
  searchFlex: {
    flex: 1,
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
  wazifaBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
  amountBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  valAmt: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginTop: 2,
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
});

export default WazifaDueReportScreen;
