import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sidebar from '../components/Sidebar/Sidebar';
import { MENU_CONFIG } from '../config/menuConfig';

// Import role-specific Dashboard screens
import SuperAdminDashboard from '../Screens/SuperAdmin/Dashboardscreen/Dashboardscreen';
import AdminDashboard from '../Screens/Admin/Dashboardscreen/Dashboardscreen';
import ExecutiveMemberDashboard from '../Screens/ExecutiveMember/Dashboardscreen/Dashboardscreen';
import OfficeBearerDashboard from '../Screens/OfficeBearer/Dashboardscreen/Dashboardscreen';
import OfficeBearersPluralDashboard from '../Screens/Office Bearers/Dashboardscreen/Dashboardscreen';
import OfficeStaffDashboard from '../Screens/OfficeStaff/Dashboardscreen/Dashboardscreen';
import LocalSecretaryDashboard from '../Screens/LocalSecretary/Dashboardscreen/Dashboardscreen';
import MembershipDashboard from '../Screens/Membership/Dashboardscreen/Dashboardscreen';
import WazifaUserDashboard from '../Screens/WazifaUser/Dashboardscreen/Dashboardscreen';
import ProfileScreen from '../Screens/Common/Profile/Profile';
import SettingsScreen from '../Screens/Common/SettingScreen/SettingScreen';
import MasterRegisterScreen from '../Screens/Common/MasterRegister/MasterRegister';
import MemberProfileScreen from '../Screens/Common/MemberProfile/MemberProfile';

const Drawer = createDrawerNavigator();

// Map dashboard screens by role
const dashboardScreens = {
  SuperAdmin: SuperAdminDashboard,
  Admin: AdminDashboard,
  ExecutiveMember: ExecutiveMemberDashboard,
  OfficeBearer: OfficeBearerDashboard,
  'Office Bearers': OfficeBearersPluralDashboard,
  OfficeStaff: OfficeStaffDashboard,
  LocalSecretary: LocalSecretaryDashboard,
  Membership: MembershipDashboard,
  WazifaUser: WazifaUserDashboard,
};

const AuthNavigation = () => {
  const { role } = useSelector(state => state.user);

  // Get the correct dashboard component for this role
  const DashboardComponent = dashboardScreens[role] || SuperAdminDashboard;

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={props => <Sidebar {...props} role={role} />}
    >
      {/* Dashboard Screen - Role Specific */}
      <Drawer.Screen
        name="Dashboard"
        component={DashboardComponent}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color }) => (
            <Icon
              name={MENU_CONFIG.Dashboard?.icon || 'home'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* Profile Screen - Universal */}
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color }) => (
            <Icon name="account-circle" size={20} color={color} />
          ),
        }}
      />

      {/* Settings Screen - Universal */}
      <Drawer.Screen
        name="SettingScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => (
            <Icon name="cog" size={20} color={color} />
          ),
        }}
      />

      {/* Member Profile Screen */}
      <Drawer.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
        options={{
          title: 'Member Profile',
          drawerIcon: ({ color }) => (
            <Icon name="account-card-details" size={20} color={color} />
          ),
        }}
      />

      {/* All Menu Screens from MENU_CONFIG */}
      {Object.entries(MENU_CONFIG)
        .filter(([menuKey]) => !['Dashboard', 'ProfileScreen', 'SettingScreen', 'MemberProfile'].includes(menuKey))
        .map(([menuKey, menuConfig]) => {
          // Map actual screen components for known menus
          let ScreenComponent;
          
          if (menuKey === 'MasterRegister') {
            ScreenComponent = MasterRegisterScreen;
          } else {
            // Use placeholder for other menus (Coming Soon)
            ScreenComponent = ({ route }) => (
              <View style={styles.screenContainer}>
                <View style={styles.card}>
                  <Icon
                    name={menuConfig.icon}
                    size={48}
                    color="#007A43"
                    style={styles.icon}
                  />
                  <Text style={styles.title}>{menuConfig.label}</Text>
                  <Text style={styles.subtitle}>Coming Soon</Text>
                </View>
              </View>
            );
          }

          return (
            <Drawer.Screen
              key={menuKey}
              name={menuKey}
              component={ScreenComponent}
              options={{
                title: menuConfig.label,
                drawerIcon: ({ color }) => (
                  <Icon name={menuConfig.icon} size={20} color={color} />
                ),
              }}
            />
          );
        })}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F7F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#123F2A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A8C82',
  },
});

export default AuthNavigation;
