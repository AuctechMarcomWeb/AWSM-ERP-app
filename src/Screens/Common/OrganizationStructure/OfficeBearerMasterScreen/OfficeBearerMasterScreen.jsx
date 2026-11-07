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

const DESIGNATIONS = [
  'All Designations',
  'President',
  'Vice President',
  'General Secretary',
  'Joint Secretary',
  'Sec. Organization',
  'Sec. Media / Publicity',
  'Sec. Legal Cell',
  'Sec. Digital Media',
  'Sec. Counselling and Guidance',
  'Sec. Scholarship',
  'Editor Wazifa Monthly',
  'Internal Auditor',
  'Asst Secretary',
  'Asst. Secretary',
];

const TENURES = ['All Appointed Tenure', '2025-2026', '2024-2025'];
const STATUSES = ['Active', 'Suspended', 'Expired'];

const OFFICE_BEARERS_DATA = [
  {
    id: '1',
    name: 'Mr. Ehsaan Imam Abidi',
    designation: 'President',
    city: 'Lucknow',
    mobile: '9451904612',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mr. Syed Saghir abhid Rizvi (Advocate)',
    designation: 'Vice President',
    city: 'Barabanki',
    mobile: '9899029697',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Mr. Syed Mustafa Bilgrami',
    designation: 'General Secretary',
    city: 'Aligarh',
    mobile: '7417775521',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Mr. Mirza Ali Abbas',
    designation: 'Joint Secretary',
    city: 'Gorakhpur',
    mobile: '9413275801',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Mr. Zamanat Ali',
    designation: 'Sec. Organization',
    city: 'Lucknow',
    mobile: '9839024033',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Mr. Zamanat Ali',
    designation: 'Sec. Media / Publicity',
    city: 'Lucknow',
    mobile: '9839024033',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Mr. Syed Mohd. Iqbal Hasan (Advocate)',
    designation: 'Sec. Legal Cell',
    city: 'Allahabad',
    mobile: '9415615440',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '8',
    name: 'Mr. Syed Raza Haidar Abidi',
    designation: 'Sec. Digital Media',
    city: 'Noida',
    mobile: '9810085695',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '9',
    name: 'Mr. Mohammad Ali Shamsi',
    designation: 'Sec. Counselling and Guidance',
    city: 'Azamgarh',
    mobile: '6392771131',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '10',
    name: 'Er. Suhail Murtaza',
    designation: 'Sec. Scholarship',
    city: 'Amroha',
    mobile: '8279829851',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '11',
    name: 'Er. Suhail Murtaza',
    designation: 'Editor Wazifa Monthly',
    city: 'Amroha',
    mobile: '8279829851',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '12',
    name: 'Er. Siraj Nayyar',
    designation: 'Internal Auditor',
    city: 'Bahraech',
    mobile: '9415657995',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '13',
    name: 'Mr. Mohd Ahmad Rizvi(Gulerz)',
    designation: 'Asst Secretary',
    city: 'Bhopal',
    mobile: '8349700786',
    tenure: '2025-2026',
    status: 'Active',
  },
  {
    id: '14',
    name: 'Mr. Ashab Rizvi',
    designation: 'Asst. Secretary',
    city: 'Lucknow',
    mobile: '9559388786',
    tenure: '2025-2026',
    status: 'Active',
  },
];

const OfficeBearerMasterScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    designation: 'All Designations',
    tenure: 'All Appointed Tenure',
    status: 'Active',
  });

  // Draft Filters in Modal
  const [draftDesignation, setDraftDesignation] = useState('All Designations');
  const [draftTenure, setDraftTenure] = useState('All Appointed Tenure');
  const [draftStatus, setDraftStatus] = useState('Active');

  const openFilter = () => {
    setDraftDesignation(applied.designation);
    setDraftTenure(applied.tenure);
    setDraftStatus(applied.status);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      designation: draftDesignation,
      tenure: draftTenure,
      status: draftStatus,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftDesignation('All Designations');
    setDraftTenure('All Appointed Tenure');
    setDraftStatus('Active');
    setSearch('');
    setApplied({
      search: '',
      designation: 'All Designations',
      tenure: 'All Appointed Tenure',
      status: 'Active',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return OFFICE_BEARERS_DATA.filter(item => {
      if (
        applied.designation !== 'All Designations' &&
        item.designation !== applied.designation
      )
        return false;
      if (
        applied.tenure !== 'All Appointed Tenure' &&
        item.tenure !== applied.tenure
      )
        return false;
      if (item.status !== applied.status) return false;

      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.city.toLowerCase().includes(q) &&
        !item.mobile.toLowerCase().includes(q) &&
        !item.designation.toLowerCase().includes(q)
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
        <Text style={styles.tenureText}>Tenure: {item.tenure}</Text>
        <Badge text={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>Name</Text>
          <Text style={styles.valTextBold}>{item.name}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Designation</Text>
          <Text style={styles.valTextPrimary}>{item.designation}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.labelKey}>City</Text>
          <Text style={styles.valText}>{item.city}</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.labelKey}>Mobile No.</Text>
          <Text style={styles.valText}>{item.mobile}</Text>
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
          title="Office Bearer Master"
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
                  {/* Top Header Row with Actions */}
                  {/* <View style={styles.topHeaderRow}>
                    <Text style={styles.screenDesc}>Manage Office Bearers</Text>

                    <View style={styles.topActionBtns}>
                      <TouchableOpacity
                        style={styles.exportBtn}
                        activeOpacity={0.8}
                        onPress={() =>
                          Alert.alert(
                            'Export',
                            'Exporting office bearers list...',
                          )
                        }
                      >
                        <Icon name="file-pdf-box" size={16} color="#DC2626" />
                        <Text style={styles.exportText}>Export</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.orderBtn}
                        activeOpacity={0.8}
                        onPress={() =>
                          Alert.alert('Success', 'Order saved successfully!')
                        }
                      >
                        <Icon name="sort" size={16} color={colors.primary} />
                        <Text style={styles.orderText}>Save Order</Text>
                      </TouchableOpacity>
                    </View>
                  </View> */}

                  {/* Search Field & Filter Icon Row */}
                  <View style={styles.searchFilterContainer}>
                    <View style={styles.searchFlex}>
                      <SearchField
                        placeholder="Search office bearer name, city..."
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
                  <Icon name="account-tie-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No office bearers found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
                </View>
              }
            />

            {/* Bottom Button Bar for Adding New Office Bearer */}
            <View style={styles.bottomBar}>
              <GreenButton
                title="+ Add Office Bearer"
                icon="account-plus-outline"
              onPress={() =>
                  navigation.navigate('AddOfficeBearerScreen')
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
                <Text style={styles.filterTitle}>Filter Office Bearers</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Label text="Designation" />
              <Dropdown
                value={draftDesignation}
                options={DESIGNATIONS}
                onSelect={setDraftDesignation}
                style={styles.modalGap}
              />

              <Label text="Appointed Tenure" />
              <Dropdown
                value={draftTenure}
                options={TENURES}
                onSelect={setDraftTenure}
                style={styles.modalGap}
              />

              <Label text="Status" />
              <Dropdown
                value={draftStatus}
                options={STATUSES}
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
    marginTop:0,
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
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
     
  },
  topActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#DC2626',
    marginLeft: 3,
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  orderText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: colors.primary,
    marginLeft: 3,
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
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  tenureText: {
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
    fontSize: FontSize.xs,
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

export default OfficeBearerMasterScreen;
