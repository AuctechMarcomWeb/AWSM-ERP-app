import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../themes/colors';
import typography from '../../themes/typography';
import CommunityPostHeader from '../../components/CommunityPostHeader/CommunityPostHeader';
import BottomNav from '../../components/BottomNav/BottomNav';

const { width } = Dimensions.get('window');

// 10 Extended Posts Data with Single and Multiple Images Support
const COMMUNITY_POSTS = [
  {
    id: '1',
    name: 'Holo D. Wisewolf',
    time: 'Posted 3m ago',
    avatar:
      'https://images.unsplash.com/photo-1594824813568-a4005ffc873f?w=150',
    text: "I've been struggling with severe headaches for years, but recently I've found some relief thanks to Doc Nightingale AI.!",
    emojis: '🎉🙌',
    hashtags: ['#goodbyeheadache', '#nightingalerocks'],
    images: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    ],
    views: '5,874',
    likes: '215',
    comments: '11',
  },
  {
    id: '2',
    name: 'Dr. Alex Mercer',
    time: 'Posted 2h ago',
    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    text: 'Just integrated the new AI diagnostic assistant into our daily clinic workflow. The accuracy in initial triage is truly remarkable!',
    emojis: '⚡ Stethoscope',
    hashtags: ['#HealthTech', '#FutureOfMedicine'],
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    ], // Multiple images example
    views: '1,240',
    likes: '89',
    comments: '5',
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    time: 'Posted 5h ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    text: 'Amazing support group session today. Remembering that we are never alone in our wellness journeys means everything.',
    emojis: '💚💪',
    hashtags: ['#MentalHealthAwareness', '#Community'],
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600',
    ],
    views: '3,412',
    likes: '150',
    comments: '22',
  },
  {
    id: '4',
    name: 'Dr. Robert Chen',
    time: 'Posted 1d ago',
    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    text: 'Explored advanced cardiovascular telemetry tools today. Patient monitoring has never been this seamless and non-invasive.',
    emojis: '🩺📈',
    hashtags: ['#Cardiology', '#Innovation'],
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    ], // Three images grid example
    views: '4,120',
    likes: '310',
    comments: '42',
  },
  {
    id: '5',
    name: 'Emily Watson',
    time: 'Posted 1d ago',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    text: 'Morning yoga routine combined with guided meditation app prompts. Feeling extremely energized and centered for the work week!',
    emojis: '🧘‍♀️✨',
    hashtags: ['#Mindfulness', '#HealthyHabits'],
    images: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600'],
    views: '2,950',
    likes: '184',
    comments: '9',
  },
  {
    id: '6',
    name: 'Mark Taylor',
    time: 'Posted 2d ago',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    text: 'Recovery tracking after knee surgery has become so easy with digital physical therapy check-ins. Highly recommended!',
    emojis: '🦾🚀',
    hashtags: ['#RecoveryJourney', '#PhysioTech'],
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    ],
    views: '1,890',
    likes: '95',
    comments: '14',
  },
  {
    id: '7',
    name: 'Dr. Priya Sharma',
    time: 'Posted 3d ago',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    text: 'Pediatric care seminar was a huge success today. Sharing digital vaccination tracker apps with parents is changing child healthcare compliance.',
    emojis: '👶💖',
    hashtags: ['#Pediatrics', '#DigitalHealth'],
    images: [
      'https://images.unsplash.com/photo-1584516150909-c43483ee7932?w=600',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600',
    ],
    views: '5,012',
    likes: '420',
    comments: '38',
  },
  {
    id: '8',
    name: 'Liam O’Connor',
    time: 'Posted 3d ago',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    text: 'Meal prepping healthy lunches for the week. Good nutrition is 80% of your fitness transformation goals!',
    emojis: '🥗🥑',
    hashtags: ['#Nutrition', '#CleanEating'],
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    ],
    views: '3,100',
    likes: '230',
    comments: '17',
  },
  {
    id: '9',
    name: 'Jessica Alba',
    time: 'Posted 4d ago',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    text: 'Completed my 30-day sleep improvement challenge using smart wearable tracking. Waking up refreshed is a game changer!',
    emojis: '😴🌙',
    hashtags: ['#SleepScience', '#Wellness'],
    images: [
      'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=600',
    ],
    views: '2,450',
    likes: '175',
    comments: '8',
  },
  {
    id: '10',
    name: 'Dr. Marcus Vance',
    time: 'Posted 5d ago',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    text: 'Excited to publish our latest findings on AI-driven preventative screening mechanisms in modern oncology.',
    emojis: '🔬📊',
    hashtags: ['#Oncology', '#MedicalResearch'],
    images: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
    ],
    views: '6,780',
    likes: '512',
    comments: '64',
  },
];

const CommunityPostCard = ({ navigation }) => {
  const handleTabPress = key => {
    if (key === 'Dashboard') return;
    navigation?.navigate(key);
  };

  return (
    <View style={styles.container}>
      <CommunityPostHeader
        onMenuPress={() =>
          navigation && navigation.openDrawer && navigation.openDrawer()
        }
        onBellPress={() => navigation && navigation.navigate('Notifications')}
        onProfilePress={() =>
          navigation && navigation.navigate('ProfileScreen')
        }
      />

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {COMMUNITY_POSTS.map(post => (
            <View key={post.id} style={styles.cardWrapper}>
              <View style={styles.card}>
                {/* Header of the Post */}
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: post.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.userTextContainer}>
                      <View style={styles.nameRow}>
                        <Text style={[typography.heading, styles.userName]}>
                          {post.name}
                        </Text>
                        <MaterialIcons
                          name="verified"
                          size={16}
                          color={colors.info}
                          style={styles.verifiedIcon}
                        />
                      </View>
                      <Text style={[typography.caption, styles.postTime]}>
                        {post.time}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Post Description Text */}
                <View style={styles.contentContainer}>
                  <Text style={[typography.body, styles.postText]}>
                    {post.text} <Text>{post.emojis}</Text>
                  </Text>
                  <View style={styles.hashtagRow}>
                    {post.hashtags.map((tag, index) => (
                      <Text key={index} style={styles.hashtag}>
                        {tag}{' '}
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Dynamic Image Container (Supports 1 or Multiple Images) */}
                {post.images && post.images.length > 0 && (
                  <View
                    style={
                      post.images.length === 1
                        ? styles.imageContainer
                        : styles.imageGridContainer
                    }
                  >
                    {post.images.length === 1 ? (
                      <>
                        <Image
                          source={{ uri: post.images[0] }}
                          style={styles.postImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity style={styles.expandButton}>
                          <MaterialIcons
                            name="fullscreen"
                            size={20}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      post.images.map((imgUri, imgIndex) => (
                        <View
                          key={imgIndex}
                          style={
                            post.images.length === 2
                              ? styles.halfImageWrapper
                              : styles.gridImageWrapper
                          }
                        >
                          <Image
                            source={{ uri: imgUri }}
                            style={styles.gridImage}
                            resizeMode="cover"
                          />
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* Post Footer Actions */}
                <View style={styles.postFooter}>
                  <View style={styles.footerLeft}>
                    <View style={styles.statItem}>
                      <Ionicons
                        name="eye-outline"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={[typography.caption, styles.statText]}>
                        {post.views}
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Ionicons name="heart" size={16} color={colors.danger} />
                      <Text style={[typography.caption, styles.statText]}>
                        {post.likes}
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Ionicons
                        name="chatbubble"
                        size={16}
                        color={colors.success}
                      />
                      <Text style={[typography.caption, styles.statText]}>
                        {post.comments}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <BottomNav active="CommunityPost" onPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6F3',
  },
  body: {
    flex: 1,
    marginTop: -22,
    backgroundColor: colors.backgroundDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 12,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: colors.cardColor,
    borderRadius: 24,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.inputBorder,
  },
  userTextContainer: {
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  postTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  contentContainer: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  hashtag: {
    fontSize: 14,
    color: colors.info,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  imageGridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  halfImageWrapper: {
    width: '48.8%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImageWrapper: {
    width: '31.8%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  expandButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 6,
    borderRadius: 8,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default CommunityPostCard;
