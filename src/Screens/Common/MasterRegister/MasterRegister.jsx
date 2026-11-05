import React, { useState, useMemo } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader';
import BottomNav from '../../../components/BottomNav/BottomNav';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';

// ---------------------------------------------------------------
// Dummy data — replace with your API response
// ---------------------------------------------------------------
const TYPES = [
  'All Types',
  'Wazifadar',
  'Life Member',
  'Ordinary Member',
  'Dawami Member',
  'Sarparast Member',
  'Mohsine Member',
];

const MEMBERS = [
  {
    id: '001527',
    name: 'Ali Raza',
    wmrn: '202610174685',
    type: 'Wazifadar',
    date: '2026-10-17',
  },
  {
    id: '001526',
    name: 'Adeeba mansoor',
    wmrn: '202610132596',
    type: 'Wazifadar',
    date: '2026-10-13',
  },
  {
    id: '001525',
    name: 'Areeba Fatima',
    wmrn: '202610136018',
    type: 'Wazifadar',
    date: '2026-10-13',
  },
  {
    id: '001524',
    name: 'SYED KAZIM ABBAS',
    wmrn: '202610131619',
    type: 'Wazifadar',
    date: '2026-10-13',
  },
  {
    id: '001523',
    name: 'Taib ali',
    wmrn: '202610135553',
    type: 'Wazifadar',
    date: '2026-10-13',
  },
  {
    id: '001522',
    name: 'Mehzabi',
    wmrn: '202610138000',
    type: 'Wazifadar',
    date: '2026-10-13',
  },
];

const AVATAR_TONES = [
  { bg: '#DCE7FF', text: '#2563EB' },
  { bg: '#E8DDFB', text: '#6D28D9' },
  { bg: '#CDEFE6', text: '#0F8F6E' },
  { bg: '#FCEFC4', text: '#D9971A' },
  { bg: '#FBDDE3', text: '#D6336C' },
  { bg: '#DCE9FA', text: '#2F6FD0' },
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatDate = d =>
  d
    ? `${String(d.getDate()).padStart(2, '0')} ${
        MONTHS[d.getMonth()]
      } ${d.getFullYear()}`
    : '';

const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// ---------------------------------------------------------------
// Screen
// ---------------------------------------------------------------
const MasterRegister = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All Types');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // applied filters (after pressing Apply)
  const [applied, setApplied] = useState({
    type: 'All Types',
    from: null,
    to: null,
  });

  const [typeOpen, setTypeOpen] = useState(false);
  const [picker, setPicker] = useState(null); // 'from' | 'to' | null
  const [selectedId, setSelectedId] = useState(MEMBERS[0].id);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();

    return MEMBERS.filter(m => {
      if (applied.type !== 'All Types' && m.type !== applied.type) return false;

      const d = startOfDay(new Date(m.date));
      if (applied.from && d < startOfDay(applied.from)) return false;
      if (applied.to && d > startOfDay(applied.to)) return false;

      if (q && !m.name.toLowerCase().includes(q) && !m.wmrn.includes(q))
        return false;

      return true;
    });
  }, [search, applied]);

  const handleApply = () => setApplied({ type, from: fromDate, to: toDate });

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      const field = picker;
      setPicker(null);
      if (event.type === 'dismissed' || !date) return;
      field === 'from' ? setFromDate(date) : setToDate(date);
      return;
    }

    if (date) picker === 'from' ? setFromDate(date) : setToDate(date);
  };

  const openMember = member => {
    setSelectedId(member.id);
    navigation && navigation.navigate('MemberProfile', { member });
  };

  const handleTabPress = key => {
    if (key === 'Members') return;
    navigation && navigation.navigate(key);
  };

  const renderItem = ({ item, index }) => {
    const tone = AVATAR_TONES[index % AVATAR_TONES.length];
    const selected = item.id === selectedId;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => openMember(item)}
        style={[styles.row, selected && styles.rowSelected]}
      >
        <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
          <Text style={[styles.avatarText, { color: tone.text }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.wmrnLabel}>
            WMRN: <Text style={styles.wmrnLink}>{item.wmrn}</Text>
          </Text>
        </View>

        <View style={styles.rowMeta}>
          <Text style={styles.metaType}>{item.type}</Text>
          <Text style={styles.metaId}>ID: {item.id}</Text>
        </View>

        <Icon name="chevron-right" size={26} color="#374151" />
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Header with Overlay */}
        <View style={styles.headerOverlay}>
          <BackHeader navigation={navigation} title="Master Register" />
        </View>

        <View style={styles.body}>
          {/* Filters */}
          <View style={styles.filters}>
            <View style={styles.searchBox}>
              <Icon name="magnify" size={24} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search name, WMRN..."
                placeholderTextColor={colors.placeHolderColor}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterBox, styles.typeBox]}
                activeOpacity={0.8}
                onPress={() => setTypeOpen(true)}
              >
                <Text style={styles.typeText} numberOfLines={1}>
                  {type}
                </Text>
                <Icon name="chevron-down" size={22} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBox, styles.dateBox]}
                activeOpacity={0.8}
                onPress={() => setPicker('from')}
              >
                <Text
                  style={fromDate ? styles.dateText : styles.datePlaceholder}
                  numberOfLines={1}
                >
                  {fromDate ? formatDate(fromDate) : 'From Date'}
                </Text>
                <Icon name="calendar-month-outline" size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBox, styles.dateBox]}
                activeOpacity={0.8}
                onPress={() => setPicker('to')}
              >
                <Text
                  style={toDate ? styles.dateText : styles.datePlaceholder}
                  numberOfLines={1}
                >
                  {toDate ? formatDate(toDate) : 'To Date'}
                </Text>
                <Icon name="calendar-month-outline" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              activeOpacity={0.85}
              onPress={handleApply}
            >
              <Text style={styles.applyText}>Apply</Text>
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
              <View style={styles.empty}>
                <Icon name="account-search-outline" size={46} color="#9CA3AF" />
                <Text style={styles.emptyText}>No members found</Text>
              </View>
            }
          />
        </View>

        <BottomNav active="Members" onPress={handleTabPress} />
      </View>

      {/* Type Picker */}
      <Modal
        visible={typeOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setTypeOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setTypeOpen(false)}
        >
          <View style={styles.sheet}>
            {TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.sheetItem, t === type && styles.sheetItemActive]}
                onPress={() => {
                  setType(t);
                  setTypeOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sheetText,
                    t === type && styles.sheetTextActive,
                  ]}
                >
                  {t}
                </Text>
                {t === type && (
                  <Icon name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker */}
      {picker && Platform.OS === 'android' && (
        <DateTimePicker
          value={(picker === 'from' ? fromDate : toDate) || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {picker && Platform.OS === 'ios' && (
        <Modal
          transparent
          animationType="slide"
          onRequestClose={() => setPicker(null)}
        >
          <View style={styles.iosOverlay}>
            <View style={styles.iosSheet}>
              <TouchableOpacity
                style={styles.iosDone}
                onPress={() => setPicker(null)}
              >
                <Text style={styles.iosDoneText}>Done</Text>
              </TouchableOpacity>

              <DateTimePicker
                value={(picker === 'from' ? fromDate : toDate) || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>
      )}
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6F3',
  },

  headerOverlay: {
    backgroundColor: colors.primary,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  body: {
    flex: 1,
    marginTop: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },

  // Filters
  filters: {
    paddingHorizontal: wp('4%'),
    paddingTop: 18,
    paddingBottom: 8,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.SecondTitleColor,
    paddingVertical: 0,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  filterBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  typeBox: {
    flex: 1.05,
    marginRight: 8,
  },

  dateBox: {
    flex: 1,
    marginRight: 8,
  },

  typeText: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
  },

  datePlaceholder: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },

  dateText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
  },

  applyButton: {
    height: 48,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#2E8B3E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  applyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: wp('3.5%'),
    paddingTop: 8,
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: '#ECF0ED',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  rowSelected: {
    backgroundColor: '#E9F6EE',
    borderColor: '#D3EBDB',
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
  },

  rowInfo: {
    flex: 1.5,
    marginLeft: 12,
  },

  name: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  wmrnLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#4B5563',
    marginTop: 2,
  },

  wmrnLink: {
    color: '#1D4ED8',
    textDecorationLine: 'underline',
  },

  rowMeta: {
    flex: 1,
    marginRight: 4,
  },

  metaType: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: '#1F2937',
  },

  metaId: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
    marginTop: 8,
  },

  // Type modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sheet: {
    width: wp('70%'),
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 8,
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  sheetItemActive: {
    backgroundColor: colors.primaryLight,
  },

  sheetText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: colors.SecondTitleColor,
  },

  sheetTextActive: {
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },

  // iOS date picker
  iosOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  iosSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },

  iosDone: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  iosDoneText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
});

export default MasterRegister;
