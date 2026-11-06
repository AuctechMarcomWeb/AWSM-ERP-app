import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Share,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../themes/typography';

import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';

import { Body, SearchField, shared } from '../../../../components/Formparts';

// ---------------------------------------------------------------
// Dummy data — replace with your API response
// ---------------------------------------------------------------
const BASE_URL = 'https://your-domain.com/pay'; // TODO: your real payment page url

const PEOPLE = [
  { id: '1', name: 'President - Mr. Ehsaan Imam Abidi', place: 'Lucknow' },
  {
    id: '2',
    name: 'Vice President - Mr. Syed Saghir Ahmad',
    place: 'Barabanki',
  },
  { id: '3', name: 'General Secretary - Mr. Syed Mohd Zaki', place: 'Aligarh' },
  {
    id: '4',
    name: 'Joint Secretary - Mr. Mirza Ali Abbas',
    place: 'Gorakhpur',
  },
];

const ReferralLinkScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PEOPLE.filter(
      p =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.place.toLowerCase().includes(q),
    );
  }, [search]);

  const shareLink = async (person, fund) => {
    const url = `${BASE_URL}?ref=${person.id}&fund=${fund}`;

    try {
      await Share.share({ message: `${person.name}\n${url}` });
    } catch (e) {
      // user cancelled
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.iconCircle}>
          <Icon name="link-variant" size={22} color={colors.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.place}>{item.place}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.shareButton, styles.shareLeft]}
          activeOpacity={0.85}
          onPress={() => shareLink(item, 'corpus')}
        >
          <Icon name="share-variant" size={16} color={colors.white} />
          <Text style={styles.shareText}>For Corpus Fund</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, styles.shareRight]}
          activeOpacity={0.85}
          onPress={() => shareLink(item, 'membership')}
        >
          <Icon name="share-variant" size={16} color={colors.white} />
          <Text style={styles.shareText} numberOfLines={1}>
            For Membership Fee & Donation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Referral Link"
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
                <SearchField
                  placeholder="Search..."
                  value={search}
                  onChangeText={setSearch}
                  style={styles.search}
                />
              }
              ListEmptyComponent={
                <View style={shared.empty}>
                  <Icon
                    name="link-off"
                    size={46}
                    color={colors.placeHolderColor}
                  />
                  <Text style={shared.emptyText}>No results</Text>
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

  search: {
    marginBottom: 14,
    marginTop: 16,
  },

  card: {
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },

  place: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginTop: 1,
  },

  buttons: {
    flexDirection: 'row',
    marginTop: 12,
  },

  shareButton: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  shareLeft: {
    flex: 0.8,
    marginRight: 8,
  },

  shareRight: {
    flex: 1.3,
  },

  shareText: {
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
    color: colors.white,
    marginLeft: 5,
    flexShrink: 1,
  },
});

export default ReferralLinkScreen;
