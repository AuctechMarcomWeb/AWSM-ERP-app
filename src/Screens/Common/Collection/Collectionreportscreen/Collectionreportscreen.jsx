import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FontFamily, FontSize } from '../../../../themes/typography';
import colors from '../../../../themes/colors';
import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  Section,
  SearchField,
  Dropdown,
  DateField,
  GreenButton,
  PillTabs,
  formatNumber,
  shared,
} from '../../../../components/Formparts';

// ---------------------------------------------------------------
// Tabs & Collectors
// ---------------------------------------------------------------
const TABS = ['Members', 'Income Exp.', 'Anonymous'];
const COLLECTORS = [
  'All Collected By',
  'Head Office',
  'Admin',
  'Mr. Ehsaan Imam Abidi',
  'Mr. S. Hashim Raza Rizvi',
  'Mr. Syed Abbas Raza Rizvi',
  'Mr. Syed Mazhar Haider Zaidi',
];

// ---------------------------------------------------------------
// Complete Data Structure with All Fields Intact
// ---------------------------------------------------------------
const REPORT = {
  Members: {
    groups: [
      {
        title: 'Life Member',
        rows: [
          {
            id: '1',
            no: '6',
            name: 'Mr. Mohammad Ali Shamsi',
            collectedBy: 'Head Office',
            fund: 'Life Member',
            amount: 200,
          },
        ],
      },
      {
        title: 'Ordinary Member',
        rows: [
          {
            id: '1',
            no: '6383',
            name: 'Harsh Gond',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 250,
          },
          {
            id: '2',
            no: '3769',
            name: 'Rocky Smith',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 200,
          },
          {
            id: '3',
            no: '4881',
            name: 'Rocky Smith',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 200,
          },
          {
            id: '4',
            no: '3769',
            name: 'Rocky Smith',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 650,
          },
          {
            id: '5',
            no: '3769',
            name: 'Rocky Smith',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 500,
          },
          {
            id: '6',
            no: '6383',
            name: 'Harsh Gond',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 500,
          },
          {
            id: '7',
            no: '70837',
            name: 'Mrs. Zarina Aftab',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 500,
          },
          {
            id: '8',
            no: '6',
            name: 'Mr. Mohammad Ali Shamsi',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 500,
          },
          {
            id: '9',
            no: '-',
            name: 'Anonymous',
            collectedBy: 'Head Office',
            fund: 'Ordinary Member',
            amount: 1500,
          },
        ],
      },
      {
        title: 'Sarparsat Member',
        rows: [
          {
            id: '1',
            no: '3418',
            name: 'Harsh Gond',
            collectedBy: '-',
            fund: 'Sarparsat Member',
            amount: 200,
          },
          {
            id: '2',
            no: '3418',
            name: 'Harsh Gond',
            collectedBy: 'Mr. Syed Mazhar Haider Zaidi',
            fund: 'Sarparsat Member',
            amount: 500,
          },
          {
            id: '3',
            no: '6173',
            name: 'Harsh Gond',
            collectedBy: 'Mr. Ehsaan Imam Abidi',
            fund: 'Sarparsat Member',
            amount: 200,
          },
          {
            id: '4',
            no: '3418',
            name: 'Harsh Gond',
            collectedBy: 'Mr. Syed Abbas Raza Rizvi',
            fund: 'Sarparsat Member',
            amount: 1500,
          },
          {
            id: '5',
            no: '70837',
            name: 'Mrs. Zarina Aftab',
            collectedBy: 'Head Office',
            fund: 'Sarparsat Member',
            amount: 500,
          },
        ],
      },
    ],
  },
  'Income Exp.': {
    groups: [
      {
        title: 'Income & Expenditure Breakdown',
        rows: [
          {
            id: '1',
            collectedBy: '-',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 200,
            mohsine: 0,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 200,
            namzad: 0,
            corp: 200,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 69000,
            total: 69600,
          },
          {
            id: '2',
            collectedBy: '6a06feb5adccc39fb75cffc6',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 0,
            mohsine: 0,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 0,
            namzad: 0,
            corp: 200,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 200,
          },
          {
            id: '3',
            collectedBy: 'Admin',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 0,
            mohsine: 0,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 0,
            namzad: 0,
            corp: 500,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 500,
          },
          {
            id: '4',
            collectedBy: 'Head Office',
            ord: 2300,
            life: 0,
            dawami: 0,
            sarp: 0,
            mohsine: 0,
            qarze: 12281,
            imam: 0,
            sadat: 0,
            gen: 650,
            namzad: 0,
            corp: 14100,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 29331,
          },
          {
            id: '5',
            collectedBy: 'Head Office',
            ord: 2500,
            life: 200,
            dawami: 0,
            sarp: 500,
            mohsine: 0,
            qarze: 0,
            imam: 200,
            sadat: 0,
            gen: 200,
            namzad: 0,
            corp: 500,
            calHadiya: 500,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 4600,
            total: 4600,
          },
          {
            id: '6',
            collectedBy: 'Mr. Ehsaan Imam Abidi',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 200,
            mohsine: 0,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 0,
            namzad: 0,
            corp: 0,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 200,
          },
          {
            id: '7',
            collectedBy: 'Mr. S. Hashim Raza Rizvi',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 0,
            mohsine: 3000,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 0,
            namzad: 0,
            corp: 0,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 3000,
          },
          {
            id: '8',
            collectedBy: 'Mr. Syed Abbas Raza Rizvi',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 1500,
            mohsine: 0,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 0,
            namzad: 0,
            corp: 0,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 1500,
          },
          {
            id: '9',
            collectedBy: 'Mr. Syed Mazhar Haider Zaidi',
            ord: 0,
            life: 0,
            dawami: 0,
            sarp: 500,
            mohsine: 0,
            qarze: 0,
            imam: 0,
            sadat: 0,
            gen: 0,
            namzad: 0,
            corp: 0,
            calHadiya: 0,
            magHadiya: 0,
            calAd: 0,
            magAd: 0,
            schol: 0,
            total: 500,
          },
        ],
      },
    ],
  },
  Anonymous: {
    groups: [
      {
        title: 'Anonymous / Unregistered Donors',
        rows: [
          {
            id: '1',
            donorName: '-',
            collectedBy: 'Head Office',
            receiptNo: '814333',
            amount: 200,
          },
          {
            id: '2',
            donorName: '-',
            collectedBy: 'Head Office',
            receiptNo: '797474',
            amount: 1500,
          },
          {
            id: '3',
            donorName: 'Anonymous',
            collectedBy: 'Head Office',
            receiptNo: '1201',
            amount: 650,
          },
          {
            id: '4',
            donorName: 'Anonymous',
            collectedBy: 'Head Office',
            receiptNo: 'RCPT_1786032262891',
            amount: 1500,
          },
        ],
      },
    ],
  },
};

const CollectionReportScreen = ({ navigation }) => {
  const [tab, setTab] = useState('Members');
  const [search, setSearch] = useState('');

  const [applied, setApplied] = useState({
    search: '',
    from: null,
    to: null,
    collector: 'All Collected By',
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(null);
  const [draftTo, setDraftTo] = useState(null);
  const [draftCollector, setDraftCollector] = useState('All Collected By');

  const config = REPORT[tab];

  const openFilter = () => {
    setDraftFrom(applied.from);
    setDraftTo(applied.to);
    setDraftCollector(applied.collector);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setApplied(prev => ({
      ...prev,
      from: draftFrom,
      to: draftTo,
      collector: draftCollector,
    }));
    setFilterOpen(false);
  };

  const groups = useMemo(() => {
    const q = applied.search.trim().toLowerCase();

    return config.groups
      .map(g => ({
        ...g,
        rows: g.rows.filter(r => {
          if (tab === 'Income Exp.') {
            const matchesCollector =
              applied.collector === 'All Collected By' ||
              r.collectedBy === applied.collector;
            const matchesSearch = !q || r.collectedBy.toLowerCase().includes(q);
            return matchesCollector && matchesSearch;
          } else if (tab === 'Anonymous') {
            const matchesSearch =
              !q ||
              r.donorName.toLowerCase().includes(q) ||
              r.receiptNo.toLowerCase().includes(q);
            const matchesCollector =
              applied.collector === 'All Collected By' ||
              r.collectedBy === applied.collector;
            return matchesSearch && matchesCollector;
          } else {
            const matchesSearch =
              !q ||
              r.name.toLowerCase().includes(q) ||
              r.no.toLowerCase().includes(q);
            const matchesCollector =
              applied.collector === 'All Collected By' ||
              r.collectedBy === applied.collector;
            return matchesSearch && matchesCollector;
          }
        }),
      }))
      .filter(g => g.rows.length > 0);
  }, [config, applied, tab]);

  const grandTotal = useMemo(() => {
    return groups.reduce(
      (acc, g) =>
        acc + g.rows.reduce((sum, r) => sum + (r.amount || r.total || 0), 0),
      0,
    );
  }, [groups]);

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Collection Reports"
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={shared.scroll}
            >
              <PillTabs tabs={TABS} active={tab} onChange={setTab} />

              {/* Search & Filter Row */}
              <View style={styles.searchFilterContainer}>
                <View style={styles.searchFlex}>
                  <SearchField
                    placeholder="Search..."
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
                  <Icon name="filter-variant" size={22} color={colors.white} />
                </TouchableOpacity>
              </View>

              {/* Groups & Card Layout */}
              {groups.length === 0 && (
                <View style={shared.empty}>
                  <Icon
                    name="chart-bar"
                    size={46}
                    color={colors.placeHolderColor}
                  />
                  <Text style={shared.emptyText}>No records found</Text>
                </View>
              )}

              {groups.map(g => {
                const groupTotal = g.rows.reduce(
                  (s, r) => s + (r.amount || r.total || 0),
                  0,
                );

                return (
                  <Section key={g.title} title={g.title} style={styles.group}>
                    {g.rows.map((r, i) => (
                      <View key={r.id || i} style={styles.cardItem}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardIndex}>#{i + 1}</Text>
                          <Text style={styles.cardAmount}>
                            ₹ {formatNumber(r.amount || r.total || 0)}
                          </Text>
                        </View>

                        {tab === 'Income Exp.' ? (
                          <View style={styles.cardBody}>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>
                                Collected By:
                              </Text>
                              <Text style={styles.fieldValue}>
                                {r.collectedBy}
                              </Text>
                            </View>
                            {r.ord > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Ordinary Member:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.ord)}
                                </Text>
                              </View>
                            )}
                            {r.life > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Life Member:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.life)}
                                </Text>
                              </View>
                            )}
                            {r.dawami > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Dawami Member:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.dawami)}
                                </Text>
                              </View>
                            )}
                            {r.sarp > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Sarparsat Member:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.sarp)}
                                </Text>
                              </View>
                            )}
                            {r.mohsine > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Mohsine Member:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.mohsine)}
                                </Text>
                              </View>
                            )}
                            {r.qarze > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Return of Qarze Hasna:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.qarze)}
                                </Text>
                              </View>
                            )}
                            {r.imam > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Sahme-Imam(Khums):
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.imam)}
                                </Text>
                              </View>
                            )}
                            {r.gen > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  General Donation:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.gen)}
                                </Text>
                              </View>
                            )}
                            {r.corp > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Corpus Fund:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.corp)}
                                </Text>
                              </View>
                            )}
                            {r.calHadiya > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Calendar Hadiya:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.calHadiya)}
                                </Text>
                              </View>
                            )}
                            {r.schol > 0 && (
                              <View style={styles.cardField}>
                                <Text style={styles.fieldLabel}>
                                  Scholarship Pay:
                                </Text>
                                <Text style={styles.fieldValue}>
                                  ₹ {formatNumber(r.schol)}
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : tab === 'Anonymous' ? (
                          <View style={styles.cardBody}>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>Donor Name:</Text>
                              <Text style={styles.fieldValue}>
                                {r.donorName}
                              </Text>
                            </View>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>
                                Collected By:
                              </Text>
                              <Text style={styles.fieldValue}>
                                {r.collectedBy}
                              </Text>
                            </View>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>Receipt No:</Text>
                              <Text style={styles.fieldValue}>
                                {r.receiptNo}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.cardBody}>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>Member No:</Text>
                              <Text style={styles.fieldValue}>{r.no}</Text>
                            </View>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>Name:</Text>
                              <Text style={styles.fieldValue}>{r.name}</Text>
                            </View>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>
                                Collected By:
                              </Text>
                              <Text style={styles.fieldValue}>
                                {r.collectedBy}
                              </Text>
                            </View>
                            <View style={styles.cardField}>
                              <Text style={styles.fieldLabel}>Fund Type:</Text>
                              <Text style={styles.fieldValue}>
                                {r.fund || g.title}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    ))}

                    {/* Group Total Footer */}
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>TOTAL ({g.title})</Text>
                      <Text style={styles.totalValue}>
                        ₹ {formatNumber(groupTotal)}
                      </Text>
                    </View>
                  </Section>
                );
              })}

              {/* Grand Total Footer Card */}
              {groups.length > 0 && (
                <View style={styles.grandTotalCard}>
                  <Text style={styles.grandTotalLabel}>Grand Total</Text>
                  <Text style={styles.grandTotalValue}>
                    ₹ {formatNumber(grandTotal)}
                  </Text>
                </View>
              )}
            </ScrollView>
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
              <Text style={styles.filterTitle}>Filter Collection Reports</Text>

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

              <Label text="Collected By" />
              <Dropdown
                value={draftCollector}
                options={COLLECTORS}
                onSelect={setDraftCollector}
                style={styles.modalGap}
              />

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

  group: {
    marginBottom: 14,
  },

  cardItem: {
    backgroundColor: colors.cardColorLight,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    paddingBottom: 6,
  },

  cardIndex: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.secondary,
  },

  cardAmount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.success,
  },

  cardBody: {
    gap: 4,
  },

  cardField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },

  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },

  fieldValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.warningBg,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderTopWidth: 0,
  },

  totalLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },

  totalValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.success,
  },

  grandTotalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  grandTotalLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.primaryDark,
  },

  grandTotalValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.primary,
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

export default CollectionReportScreen;
