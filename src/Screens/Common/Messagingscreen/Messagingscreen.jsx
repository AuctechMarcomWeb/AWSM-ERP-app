import React, { useState, useMemo } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
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
const TABS = [
  { key: 'All', label: 'All', icon: 'format-list-bulleted' },
  { key: 'Inbound', label: 'Inbound', icon: 'email-outline' },
  { key: 'Outbound', label: 'Outbound', icon: 'send-outline' },
];

const MESSAGES = [
  {
    id: '1',
    box: 'Inbound',
    title: 'West and Fowler',
    preview: 'he main aim of data models is to support...',
    date: '07 Jul',
    priority: 'Normal',
  },
  {
    id: '2',
    box: 'Inbound',
    title: 'Re: hard disk drive',
    preview: 'Okay Sir, I will check this.',
    date: '07 Jul',
    priority: 'Normal',
  },
  {
    id: '3',
    box: 'Outbound',
    title: 'Re: admin',
    preview: 'drdsdsds',
    date: '07 Jul',
    priority: 'Normal',
  },
  {
    id: '4',
    box: 'Inbound',
    title: 'Re: Data model',
    preview: 'fhfghfghgtnff',
    date: '07 Jul',
    priority: 'Normal',
  },
  {
    id: '5',
    box: 'Outbound',
    title: 'Re: admin',
    preview: 'Okay Sir, I will check this.',
    date: '07 Jul',
    priority: 'Normal',
  },
  {
    id: '6',
    box: 'Inbound',
    title: 'admin',
    preview: 'he main aim of data models is to support...',
    date: '03 Jul',
    priority: 'Normal',
  },
  {
    id: '7',
    box: 'Outbound',
    title: 'Re: Normalization-selc multip all filed',
    preview: '',
    date: '30 Jun',
    priority: 'Urgent',
  },
];

const MessagingScreen = ({ navigation }) => {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();

    return MESSAGES.filter(m => {
      if (tab !== 'All' && m.box !== tab) return false;
      if (
        q &&
        !m.title.toLowerCase().includes(q) &&
        !m.preview.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [tab, search]);

  const renderItem = ({ item }) => {
    const urgent = item.priority === 'Urgent';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.row}
        onPress={() =>
          navigation && navigation.navigate('MessageDetail', { message: item })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.title.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {!!item.preview && (
            <Text style={styles.rowPreview} numberOfLines={2}>
              {item.preview}
            </Text>
          )}
        </View>

        <View style={styles.rowMeta}>
          <Text style={styles.rowDate}>{item.date}</Text>

          <View
            style={[
              styles.badge,
              urgent ? styles.badgeUrgent : styles.badgeNormal,
            ]}
          >
            <Text style={[styles.badgeText, urgent && styles.badgeTextUrgent]}>
              {item.priority}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Messaging"
          onBack={() => navigation && navigation.goBack()}
          rightIcon="plus"
          rightVariant="solid"
          onRightPress={() =>
            navigation && navigation.navigate('ComposeMessage')
          }
        />

        <View style={styles.body}>
          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map(t => {
              const active = t.key === tab;

              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.tab, active && styles.tabActive]}
                  activeOpacity={0.85}
                  onPress={() => setTab(t.key)}
                >
                  <Icon
                    name={t.icon}
                    size={20}
                    color={active ? colors.white : '#1F2937'}
                  />
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Icon name="magnify" size={24} color="#4B5563" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages..."
              placeholderTextColor={colors.placeHolderColor}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
          </View>

          <Text style={styles.countText}>
            {tab.toUpperCase()} — {data.length} MESSAGES
          </Text>

          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Icon name="message-off-outline" size={46} color="#9CA3AF" />
                <Text style={styles.emptyText}>No messages found</Text>
              </View>
            }
          />
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
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E8EEEA',
    borderRadius: 12,
    marginRight: 8,
  },

  tabActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  tabText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: '#1F2937',
    marginLeft: 6,
  },

  tabTextActive: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
  },

  // Search
  searchBox: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: wp('4%'),
    marginTop: 14,
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

  countText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: '#4B5563',
    letterSpacing: 0.4,
    marginHorizontal: wp('4%'),
    marginTop: 16,
    marginBottom: 4,
  },

  // List
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: 24,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  separator: {
    height: 1,
    backgroundColor: '#EEF1EF',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DDF1E4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  rowInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },

  rowTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#111827',
  },

  rowPreview: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },

  rowMeta: {
    alignItems: 'flex-end',
    minWidth: 72,
  },

  rowDate: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#4B5563',
    marginBottom: 6,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeNormal: {
    backgroundColor: '#2E8B3E',
  },

  badgeUrgent: {
    backgroundColor: '#F4B93A',
  },

  badgeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.white,
  },

  badgeTextUrgent: {
    color: '#4A3200',
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
});

export default MessagingScreen;
