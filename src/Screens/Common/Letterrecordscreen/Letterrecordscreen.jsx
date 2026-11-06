import React, { useState, useMemo } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import BottomNav from '../../../components/BottomNav/BottomNav';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';

// ---------------------------------------------------------------
// Dummy data — replace with your API response
// ---------------------------------------------------------------
const TABS = ['Inbound', 'Outbound', 'Draft'];
const SEND_OPTIONS = [
  'All',
  'Office Bearer',
  'Executive Member',
  'Local Secretary',
];

const LETTERS = [
  {
    id: '1',
    box: 'Inbound',
    from: 'ab-rec',
    to: 'ob ex',
    date: '18 Jun 2026',
    tagged: ['0027 - Mr. Syed Mazhar Haider Zaidi, Aligarh (Executive Member)'],
    note: 'dssd',
  },
  {
    id: '2',
    box: 'Inbound',
    from: 'ghfghftf',
    to: 'gffgh',
    date: '17 Jun 2026',
    tagged: [
      'President - Mr. Ehsaan Imam Abidi, Lucknow (Office Bearer)',
      '0035 - Maulana Syed Zahid Husain, Aligarh (Executive Member)',
      '0027 - Mr. Imran Raza Abidi, Basti (Local Secretary)',
    ],
    note: 'gfhgfhg',
  },
  {
    id: '3',
    box: 'Outbound',
    from: 'admin',
    to: 'all office bearer',
    date: '12 Jun 2026',
    tagged: ['President - Mr. Ehsaan Imam Abidi, Lucknow (Office Bearer)'],
    note: 'Meeting notice',
  },
  {
    id: '4',
    box: 'Draft',
    from: 'admin',
    to: 'executive members',
    date: '10 Jun 2026',
    tagged: ['0035 - Maulana Syed Zahid Husain, Aligarh (Executive Member)'],
    note: 'Draft letter',
  },
];

// ---------------------------------------------------------------
// Screen
// ---------------------------------------------------------------
const LetterRecordScreen = ({ navigation }) => {
  const [tab, setTab] = useState('Inbound');
  const [send, setSend] = useState('All');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState({ send: 'All', search: '' });
  const [sendOpen, setSendOpen] = useState(false);

  const data = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    return LETTERS.filter(l => {
      if (l.box !== tab) return false;

      if (
        applied.send !== 'All' &&
        !l.tagged.some(t => t.includes(applied.send))
      ) {
        return false;
      }

      if (
        q &&
        !l.from.toLowerCase().includes(q) &&
        !l.to.toLowerCase().includes(q) &&
        !l.note.toLowerCase().includes(q) &&
        !l.tagged.some(t => t.toLowerCase().includes(q))
      ) {
        return false;
      }

      return true;
    });
  }, [tab, applied]);

  const handleApply = () => setApplied({ send, search });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation && navigation.navigate('LetterDetail', { letter: item })
      }
    >
      <View style={styles.cardIcon}>
        <Icon name="email-outline" size={24} color={colors.primary} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.fromTo}>
          <Text style={styles.fromToText}>From: {item.from}</Text>
          <Icon
            name="arrow-right"
            size={16}
            color="#374151"
            style={styles.arrow}
          />
          <Text style={styles.fromToText}>To: {item.to}</Text>
        </View>

        <View style={styles.dateRow}>
          <Icon name="calendar-month-outline" size={17} color="#6B7280" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <Text style={styles.taggedLabel}>Tagged:</Text>

        {item.tagged.map(t => (
          <View key={t} style={styles.chip}>
            <Text style={styles.chipText}>{t}</Text>
          </View>
        ))}

        <Text style={styles.note}>{item.note}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Letter Record"
          onBack={() => navigation && navigation.goBack()}
          //   rightIcon="plus"
          //   rightVariant="solid"
          //   onRightPress={() =>
          //     navigation && navigation.navigate('ComposeLetter')
          //   }
        />

        <View style={styles.body}>
          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map(t => {
              const active = t === tab;

              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, active && styles.tabActive]}
                  activeOpacity={0.85}
                  onPress={() => setTab(t)}
                >
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filters */}
          <View style={styles.filterRow}>
            <View style={styles.sendCol}>
              <Text style={styles.filterLabel}>Send</Text>
              <TouchableOpacity
                style={styles.select}
                activeOpacity={0.8}
                onPress={() => setSendOpen(true)}
              >
                <Text style={styles.selectText} numberOfLines={1}>
                  {send}
                </Text>
                <Icon name="chevron-down" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchCol}>
              <Text style={styles.filterLabel}>Search</Text>
              <View style={styles.searchBox}>
                <Icon name="magnify" size={22} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={colors.placeHolderColor}
                  value={search}
                  onChangeText={setSearch}
                  autoCorrect={false}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            activeOpacity={0.85}
            onPress={handleApply}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>

          {/* List */}
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Icon name="email-off-outline" size={46} color="#9CA3AF" />
                <Text style={styles.emptyText}>No letters found</Text>
              </View>
            }
          />
        </View>

        {/* Send Picker */}
        <Modal
          visible={sendOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setSendOpen(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setSendOpen(false)}
          >
            <View style={styles.sheet}>
              {SEND_OPTIONS.map(o => (
                <TouchableOpacity
                  key={o}
                  style={[
                    styles.sheetItem,
                    o === send && styles.sheetItemActive,
                  ]}
                  onPress={() => {
                    setSend(o);
                    setSendOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sheetText,
                      o === send && styles.sheetTextActive,
                    ]}
                  >
                    {o}
                  </Text>
                  {o === send && (
                    <Icon name="check" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
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

  // Tabs
  tabs: {
    flexDirection: 'row',
    marginHorizontal: wp('4%'),
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#E8EEEA',
    borderRadius: 14,
    marginTop: 5,
    padding: 4,
  },

  tab: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#3B9B47',
  },

  tabText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
  },

  tabTextActive: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: wp('4%'),
    marginTop: 16,
  },

  sendCol: {
    flex: 0.8,
    marginRight: 12,
  },

  searchCol: {
    flex: 1.2,
  },

  filterLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
    marginBottom: 6,
  },

  select: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  selectText: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
    textAlign: 'center',
  },

  searchBox: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFB',
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

  applyButton: {
    height: 48,
    marginHorizontal: wp('4%'),
    marginTop: 14,
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
    paddingHorizontal: wp('4%'),
    paddingTop: 18,
    paddingBottom: 24,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#ECF0ED',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E1F3E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBody: {
    flex: 1,
    marginLeft: 12,
  },

  fromTo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  fromToText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  arrow: {
    marginHorizontal: 8,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  dateText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#4B5563',
    marginLeft: 6,
  },

  taggedLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
    marginTop: 14,
    marginBottom: 6,
  },

  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#DDF1E4',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  chipText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#2E7D32',
  },

  note: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
    marginTop: 6,
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

  // Picker
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
});

export default LetterRecordScreen;
