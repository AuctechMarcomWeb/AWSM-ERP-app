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

const TENURES = ['All Appointed Tenure', '2025-2026', '2024-2025'];
const STATUSES = ['All Status', 'Active', 'Suspended', 'Expired'];
const SORT_OPTIONS = ['Recent', 'Oldest', 'Name (A-Z)'];

const LOCAL_SECRETARIES_DATA = [
  {
    id: '1',
    memberId: '0002',
    name: 'Mr. S. Hashim Raza Rizvi',
    appointedYear: '2025-2026',
    mobile: '9897316422',
    age: '-',
    city: 'Agra',
    state: 'U.P',
    address: '14/109, Aza Khana, Shahganj, Agra',
    status: 'Active',
  },
  {
    id: '2',
    memberId: '0003',
    name: 'Prof. Mohd. Mohsin',
    appointedYear: '2025-2026',
    mobile: '9870955551',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'Street No. 1, Near Markati Masjid, Dhorra Mafi, Aligarh',
    status: 'Active',
  },
  {
    id: '3',
    memberId: '0004',
    name: 'Maulana Syed Zahid Husain',
    appointedYear: '2025-2026',
    mobile: '9412673478',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'B 203 Husaini complex Zohrabagh Aligarh',
    status: 'Active',
  },
  {
    id: '4',
    memberId: '0005',
    name: 'Prof. Syed Ali Amir',
    appointedYear: '2025-2026',
    mobile: '9368758755',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'Suroor Apartments, Sir Syed Nagar, Aligarh',
    status: 'Active',
  },
  {
    id: '5',
    memberId: '0006',
    name: 'Mr. Syed Firdos Ali Zaidi',
    appointedYear: '2025-2026',
    mobile: '9319799772',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'Near Husaini Masjid, Zohra Bagh, Civil Line, Aligarh',
    status: 'Active',
  },
  {
    id: '6',
    memberId: '0007',
    name: 'Mr. Syed Mustafa Ali Bilgrami',
    appointedYear: '2025-2026',
    mobile: '9368558795',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'Fatima Manzil,Lal Diggi Road',
    status: 'Active',
  },
  {
    id: '7',
    memberId: '0008',
    name: 'Mr. Syed Mazhar Haider Zaidi',
    appointedYear: '2025-2026',
    mobile: '9415275801',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: '4/334, Amir Nishan, Aligarh-202002',
    status: 'Active',
  },
  {
    id: '8',
    memberId: '0009',
    name: 'Mr. Syed Mohd Ashfaq Husain',
    appointedYear: '2025-2026',
    mobile: '9897809993',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address:
      'Behind Gali No-06 Near Alika Community Centre Mohd Nagar Mallah ka Nagla -202002',
    status: 'Active',
  },
  {
    id: '9',
    memberId: '0010',
    name: 'Maulana Dr. Abbas Raza',
    appointedYear: '2025-2026',
    mobile: '9412272058',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'M.U. College, Dhorra Mafi Aligarh-202002',
    status: 'Active',
  },
  {
    id: '10',
    memberId: '0011',
    name: 'Mrs. Mumtaz Bilgrami',
    appointedYear: '2025-2026',
    mobile: '9837111865',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address:
      'Fatima Manzil , Anwarul Huda Compound , Lal Dippi, Aligarh-202001',
    status: 'Active',
  },
  {
    id: '11',
    memberId: '0012',
    name: 'Mr. Syed Mohammad Zahid Hasan (Gullu)',
    appointedYear: '2025-2026',
    mobile: '9412345440',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: 'Kothi Rani Dulhan, Mahmood Manzil , Doddhpur , Aligarh',
    status: 'Active',
  },
  {
    id: '12',
    memberId: '0013',
    name: 'Prof. Abid Ali Khan',
    appointedYear: '2025-2026',
    mobile: '7398211864',
    age: '-',
    city: 'Aligarh',
    state: 'U.P',
    address: '4/334, Amir Nishan, Aligarh-202002',
    status: 'Active',
  },
  {
    id: '13',
    memberId: '0014',
    name: 'Mr. Syed Mohammad Iqbal Hasan',
    appointedYear: '2025-2026',
    mobile: '7985852324',
    age: '-',
    city: 'Allahabad',
    state: 'U.P',
    address: 'D895, GTB Nagar, Kareli Colony Allahabad -211016 U.P',
    status: 'Active',
  },
  {
    id: '14',
    memberId: '0015',
    name: 'Maulana Dilshad Abbas',
    appointedYear: '2025-2026',
    mobile: '9935049419',
    age: '-',
    city: 'Allahabad',
    state: 'U.P',
    address: 'Dandupur Distt-Allahabad Dandupur - 2008 U.P.',
    status: 'Active',
  },
  {
    id: '15',
    memberId: '0016',
    name: 'Mr. Zaheer Haider',
    appointedYear: '2025-2026',
    mobile: '8400842404',
    age: '-',
    city: 'Allahabad',
    state: 'U.P',
    address: '428/7 Block-A GTB Nagar, Kareli Allahabad-211001',
    status: 'Active',
  },
  {
    id: '16',
    memberId: '0017',
    name: 'Maulana Syed Mohd Abbas',
    appointedYear: '2025-2026',
    mobile: '8400842404',
    age: '-',
    city: 'Ambedkar Nagar',
    state: 'U.P',
    address:
      'Meeran Pur , Faizabad Road, Akbarpur , Ambedkar Nagar -224122, U.P',
    status: 'Active',
  },
  {
    id: '17',
    memberId: '0018',
    name: 'Mr. Mohd Faheem',
    appointedYear: '2025-2026',
    mobile: '9028236862',
    age: '-',
    city: 'Amedkarnagar',
    state: 'U.P',
    address: 'Mohalla Usmanpur Jalalpur Amedkarnagar U.P-224181',
    status: 'Active',
  },
  {
    id: '18',
    memberId: '0019',
    name: 'Mr. Syed Farhan Ali Zaidi',
    appointedYear: '2025-2026',
    mobile: '8279892851',
    age: '-',
    city: 'Amroha',
    state: 'U.P',
    address:
      'Behind Sidhi Vinayak Apptt. Sanklap Colony Yankayapura Camp, Amravati Maharashtra -444602',
    status: 'Active',
  },
  {
    id: '19',
    memberId: '0020',
    name: 'Er. Suhail Murtaza',
    appointedYear: '2025-2026',
    mobile: '9412596645',
    age: '-',
    city: 'Amroha',
    state: 'U.P',
    address: '110-A, Guzri Street Amroha-244221 U.P',
    status: 'Active',
  },
  {
    id: '20',
    memberId: '0021',
    name: 'Mr. Syed Mohd. Askari Zaidi',
    appointedYear: '2025-2026',
    mobile: '7378671110',
    age: '-',
    city: 'Amroha',
    state: 'U.P',
    address: 'Mohalla Darbar Meerakhan, Amroha',
    status: 'Active',
  },
  {
    id: '21',
    memberId: '0022',
    name: 'Dr. Syed Mohd Jafar Baqri',
    appointedYear: '2025-2026',
    mobile: '9838075490',
    age: '-',
    city: 'Augangabad',
    state: 'U.P',
    address: 'Vill. & Post-Said Nagli, Tehsil-Hasanpur, Amroha',
    status: 'Active',
  },
  {
    id: '22',
    memberId: '0023',
    name: 'Mrs Sara Raza Abedi',
    appointedYear: '2025-2026',
    mobile: '7483308202',
    age: '-',
    city: 'Azamgarh',
    state: 'U.P',
    address:
      'House No-2-3-100 A, Mahada colony Champa Chowk Aurangabad-MS-431001',
    status: 'Active',
  },
  {
    id: '23',
    memberId: '0024',
    name: 'Mohammad Ali (Shamsi)',
    appointedYear: '2025-2026',
    mobile: '9906483333',
    age: '-',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'Hamzapur rani ki Sarai Azamgarh-276001',
    status: 'Active',
  },
  {
    id: '24',
    memberId: '0026',
    name: 'Mr. Mohmmad Yousuf Dar',
    appointedYear: '2025-2026',
    mobile: '8005023186',
    age: '-',
    city: 'Baramulla',
    state: 'J&K',
    address: 'KP Bala Singhoora Pathan,Distict Baramulla Kashmir-193121',
    status: 'Active',
  },
  {
    id: '25',
    memberId: '0025',
    name: 'Mr. Sajid Abbas',
    appointedYear: '2025-2026',
    mobile: '9690617592',
    age: '-',
    city: 'Local',
    state: 'U.P.',
    address: 'Local Secretary Address, U.P.',
    status: 'Active',
  },
];

const LocalSecretariesScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Applied Filters
  const [applied, setApplied] = useState({
    search: '',
    tenure: 'All Appointed Tenure',
    status: 'All Status',
    sortBy: 'Recent',
  });

  // Draft Filters in Modal
  const [draftTenure, setDraftTenure] = useState('All Appointed Tenure');
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftSort, setDraftSort] = useState('Recent');

  const openFilter = () => {
    setDraftTenure(applied.tenure);
    setDraftStatus(applied.status);
    setDraftSort(applied.sortBy);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      tenure: draftTenure,
      status: draftStatus,
      sortBy: draftSort,
    }));
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraftTenure('All Appointed Tenure');
    setDraftStatus('All Status');
    setDraftSort('Recent');
    setSearch('');
    setApplied({
      search: '',
      tenure: 'All Appointed Tenure',
      status: 'All Status',
      sortBy: 'Recent',
    });
  };

  const filteredData = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return LOCAL_SECRETARIES_DATA.filter(item => {
      if (
        applied.tenure !== 'All Appointed Tenure' &&
        item.appointedYear !== applied.tenure
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
          <Text style={styles.labelKey}>Appointed Year</Text>
          <Text style={styles.valTextPrimary}>{item.appointedYear}</Text>
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
          title="Local Secretaries"
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
                      Manage Local Secretaries
                    </Text>

                    <TouchableOpacity
                      style={styles.exportBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        Alert.alert(
                          'Export',
                          'Exporting local secretaries list...',
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
                        placeholder="Search local secretary name, ID..."
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
                  <Text style={styles.emptyTitle}>
                    No local secretaries found
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or filters.
                  </Text>
                </View>
              }
            />

            {/* Bottom Button Bar for Adding New Local Secretary */}
            <View style={styles.bottomBar}>
              <GreenButton
                title="+ Add Local Secretary"
                icon="account-plus-outline"
                onPress={() => navigation.navigate('AddLocalSecretaryScreen')}
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
                <Text style={styles.filterTitle}>Filter Local Secretaries</Text>
                <TouchableOpacity onPress={() => setFilterOpen(false)}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

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

export default LocalSecretariesScreen;
