import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import { Body, SearchField, GreenButton } from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getTenureYears, deleteTenureYear } from '../../../api/masters';

const TenureYearMasterScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = async (pageNum = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const result = await getTenureYears(pageNum, 50, searchTerm);
      if (result?.data) {
        setData(result.data);
        setPage(pageNum);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, '');
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    loadData(1, text);
  };

  const handleDelete = (item) => {
    Alert.alert('Delete', `Delete "${item.name}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const result = await deleteTenureYear(item._id);
            if (result?.success || result?.statusCode === 200) {
              Alert.alert('Success', 'Deleted');
              loadData(1, search);
            } else {
              Alert.alert('Error', result?.message);
            }
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.srNo}>#{(page - 1) * 50 + index + 1}</Text>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTenureYearScreen', { tenureYearData: item })}
            style={styles.actionBtn}
          >
            <Icon name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={[styles.actionBtn, styles.deleteBtnStyle]}
          >
            <Icon name="trash-can-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.statusRow}>
        <Text style={styles.label}>Status</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#D1FAE5' : '#FEE2E2' }]}>
          <Text style={[styles.statusText, { color: item.isActive ? '#065F46' : '#991B1B' }]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader navigation={navigation} title="Tenure Years" onBack={() => navigation.goBack()} />
        <View style={styles.body}>
          <Body>
            <View style={styles.headerRow}>
              <View style={styles.searchFlex}>
                <SearchField placeholder="Search..." value={search} onChangeText={handleSearch} />
              </View>
              <GreenButton title="+ Add" onPress={() => navigation.navigate('AddTenureYearScreen')} style={styles.addBtn} />
            </View>
            {loading && data.length === 0 ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadData(1, search)} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
                ListFooterComponent={loading && <ActivityIndicator size="small" color={colors.primary} />}
              />
            )}
          </Body>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F6F3' },
  body: { flex: 1, backgroundColor: colors.white },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', gap: 8, paddingHorizontal: wp('4%'), paddingVertical: 12, alignItems: 'flex-end' },
  searchFlex: { flex: 1 },
  addBtn: { height: 48, paddingHorizontal: 16 },
  listContent: { paddingHorizontal: wp('4%'), paddingBottom: 20 },
  card: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardInfo: { flex: 1 },
  srNo: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: colors.primary },
  nameText: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: colors.TitleColor, marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
  deleteBtnStyle: { backgroundColor: '#FEE2E2' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 8 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6B7280' },
});

export default TenureYearMasterScreen;
