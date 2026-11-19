import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  TextField,
  Dropdown,
  GreenButton,
  GrayButton,
} from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
  getUsersByRole,
  updateUser,
  resetPassword,
  suspendUser,
  activateUser,
} from '../../../api/userManagement';

const ROLES = ['Membership', 'WazifaUser'];
const STATUS_OPTIONS = ['Active', 'Suspended', 'All Status'];

const UserManagementScreen = ({ navigation }) => {
  const [activeRole, setActiveRole] = useState('Membership');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    userId: '',
    password: '',
    isSuspended: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  const debounceRef = useRef();

  // Load users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsersByRole(
        activeRole,
        page,
        limit,
        appliedSearch,
      );
      setUsers(result.users || []);
      setTotal(result.total || 0);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load users');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeRole, page, limit, appliedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = text => {
    setSearch(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedSearch(text);
      setPage(1);
    }, 400);
  };

  const openViewModal = user => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const openEditModal = user => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      userId: user.userId || '',
      password: '',
      isSuspended: user.isSuspended || false,
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editForm.name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }

    setEditSaving(true);
    try {
      const payload = {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        userId: editForm.userId,
        isSuspended: editForm.isSuspended,
      };
      if (editForm.password.trim()) payload.password = editForm.password;

      await updateUser(selectedUser._id, payload);
      Alert.alert('Success', 'User updated successfully');
      setEditModalOpen(false);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Update failed');
    } finally {
      setEditSaving(false);
    }
  };

  const handleResetPassword = async newPassword => {
    if (newPassword.length < 4) {
      Alert.alert('Validation', 'Password must be at least 4 characters');
      return;
    }

    try {
      await resetPassword(selectedUser._id, newPassword);
      Alert.alert('Success', 'Password reset successfully');
      setViewModalOpen(false);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    }
  };

  const handleToggleSuspend = async (user, suspend) => {
    try {
      await (suspend ? suspendUser(user._id, true) : activateUser(user._id));
      Alert.alert(
        'Success',
        `User ${suspend ? 'suspended' : 'activated'} successfully`,
      );
      loadUsers();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update user status');
    }
  };

  const renderUserItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(item.name || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{item.name || '—'}</Text>
            <Text style={styles.userRole}>{item.userId || '—'}</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            backgroundColor: item.isSuspended ? '#FEE2E2' : '#D1FAE5',
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xs,
              fontFamily: FontFamily.semiBold,
              color: item.isSuspended ? '#991B1B' : '#065F46',
            }}
          >
            {item.isSuspended ? 'Suspended' : 'Active'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Icon name="phone" size={14} color={colors.primary} />
          <Text style={styles.infoText}>{item.phone || '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="email" size={14} color={colors.primary} />
          <Text style={styles.infoText}>{item.email || '—'}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.viewBtn]}
          onPress={() => openViewModal(item)}
        >
          <Icon name="eye-outline" size={14} color={colors.primary} />
          <Text style={styles.actionBtnText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => openEditModal(item)}
        >
          <Icon name="pencil-outline" size={14} color="#D97706" />
          <Text style={[styles.actionBtnText, { color: '#D97706' }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            item.isSuspended ? styles.activateBtn : styles.suspendBtn,
          ]}
          onPress={() =>
            Alert.alert(
              'Confirm',
              `${item.isSuspended ? 'Activate' : 'Suspend'} this user?`,
              [
                { text: 'Cancel' },
                {
                  text: 'Yes',
                  onPress: () => handleToggleSuspend(item, !item.isSuspended),
                },
              ],
            )
          }
        >
          <Icon
            name={item.isSuspended ? 'check-circle-outline' : 'lock-outline'}
            size={14}
            color="#6B7280"
          />
          <Text style={[styles.actionBtnText, { color: '#6B7280' }]}>
            {item.isSuspended ? 'Activate' : 'Suspend'}
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
          title="User Management"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            {/* Role tabs */}
            <View style={styles.tabsContainer}>
              {ROLES.map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.tab, activeRole === role && styles.tabActive]}
                  onPress={() => {
                    setActiveRole(role);
                    setPage(1);
                    setSearch('');
                    setAppliedSearch('');
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeRole === role && styles.tabTextActive,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Icon
                name="magnify"
                size={18}
                color="#9CA3AF"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, phone, email, userId…"
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={handleSearch}
              />
            </View>

            {/* Users list */}
            {loading && users.length === 0 ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={item => item._id}
                renderItem={renderUserItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl refreshing={loading} onRefresh={loadUsers} />
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Icon name="account-multiple" size={40} color="#9CA3AF" />
                    <Text style={styles.emptyTitle}>No users found</Text>
                  </View>
                }
              />
            )}

            {/* Total count */}
            {!loading && users.length > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>
                  Total: <Text style={{ fontWeight: 'bold' }}>{total}</Text>
                </Text>
              </View>
            )}
          </Body>
        </View>

        {/* View Modal */}
        {viewModalOpen && selectedUser && (
          <ViewUserModal
            user={selectedUser}
            onClose={() => setViewModalOpen(false)}
            onEdit={() => {
              setViewModalOpen(false);
              openEditModal(selectedUser);
            }}
            onResetPassword={handleResetPassword}
          />
        )}

        {/* Edit Modal */}
        {editModalOpen && selectedUser && (
          <EditUserModal
            user={selectedUser}
            form={editForm}
            setForm={setEditForm}
            saving={editSaving}
            onSave={handleEditSave}
            onClose={() => setEditModalOpen(false)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}
      </View>
    </AppLayout>
  );
};

// ─── View User Modal ──────────────────────────────────────────

function ViewUserModal({ user, onClose, onEdit, onResetPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const copyToClipboard = (text, field) => {
    if (!text) return;
    // For React Native, use share or other methods
    Alert.alert('Copied', `${field}: ${text}`);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleResetPwd = async () => {
    if (newPassword.length < 4) {
      Alert.alert('Validation', 'Password must be at least 4 characters');
      return;
    }
    setResetting(true);
    try {
      await onResetPassword(newPassword);
      setNewPassword('');
    } finally {
      setResetting(false);
    }
  };

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {(user.name || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.modalHeaderTitle}>{user.name}</Text>
                <Text style={styles.modalHeaderSubtitle}>{user.role}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Icon name="close" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Basic Info */}
            <Label text="Contact Information" />
            <View style={styles.infoCard}>
              <View style={styles.infoPair}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone || '—'}</Text>
              </View>
              <View style={styles.infoPair}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email || '—'}</Text>
              </View>
              <View style={styles.infoPair}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: user.isSuspended ? '#DC2626' : '#16A34A',
                    },
                  ]}
                >
                  {user.isSuspended ? 'Suspended' : 'Active'}
                </Text>
              </View>
            </View>

            {/* Credentials */}
            <Label text="Login Credentials" />
            <View style={styles.credentialsCard}>
              <View style={styles.credRow}>
                <Text style={styles.credLabel}>👤 User ID</Text>
                <View style={styles.credValue}>
                  <Text style={styles.credText}>
                    {user.userId || 'Not set'}
                  </Text>
                  {user.userId && (
                    <TouchableOpacity
                      onPress={() => copyToClipboard(user.userId, 'User ID')}
                    >
                      <Icon
                        name="content-copy"
                        size={14}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.credRow}>
                <Text style={styles.credLabel}>🔑 Password</Text>
                <View style={styles.credValue}>
                  <Text style={styles.credText}>
                    {user.password
                      ? showPassword
                        ? user.password
                        : '•'.repeat(Math.min(user.password.length, 12))
                      : 'Not set'}
                  </Text>
                  <View style={styles.credActions}>
                    {user.password && (
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Icon
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={14}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                    {user.password && (
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(user.password, 'Password')
                        }
                      >
                        <Icon
                          name="content-copy"
                          size={14}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Reset Password */}
            <Label text="Set New Password" />
            <View style={styles.resetPwdCard}>
              <View style={styles.passwordInputGroup}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Min 4 characters"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.pwdToggle}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              <GreenButton
                title={resetting ? 'Resetting…' : 'Reset Password'}
                onPress={handleResetPwd}
                disabled={!newPassword || resetting}
                style={styles.resetBtn}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <GrayButton
              title="Close"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <GreenButton
              title="Edit Details"
              onPress={onEdit}
              style={styles.footerBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Edit User Modal ──────────────────────────────────────────

function EditUserModal({
  user,
  form,
  setForm,
  saving,
  onSave,
  onClose,
  showPassword,
  setShowPassword,
}) {
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Edit User</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Icon name="close" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            <Label text="Full Name *" />
            <TextField
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
              editable={!saving}
              style={{ marginBottom: 12 }}
            />

            <Label text="Phone" />
            <TextField
              value={form.phone}
              onChangeText={text =>
                setForm({
                  ...form,
                  phone: text.replace(/\D/g, '').slice(0, 10),
                })
              }
              keyboardType="phone-pad"
              maxLength={10}
              editable={!saving}
              style={{ marginBottom: 12 }}
            />

            <Label text="Email" />
            <TextField
              value={form.email}
              onChangeText={text => setForm({ ...form, email: text })}
              keyboardType="email-address"
              editable={!saving}
              style={{ marginBottom: 12 }}
            />

            <Label text="User ID" />
            <TextField
              value={form.userId}
              onChangeText={text => setForm({ ...form, userId: text })}
              editable={!saving}
              style={{ marginBottom: 12 }}
            />

            <Label text="New Password (leave blank to keep)" />
            <View style={styles.passwordInputGroup}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={text => setForm({ ...form, password: text })}
                editable={!saving}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.pwdToggle}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() =>
                  setForm({ ...form, isSuspended: !form.isSuspended })
                }
              >
                <Icon
                  name={
                    form.isSuspended
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={18}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Suspend this user</Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <GrayButton
              title="Cancel"
              onPress={onClose}
              disabled={saving}
              style={styles.footerBtn}
            />
            <GreenButton
              title={saving ? 'Saving…' : 'Update'}
              onPress={onSave}
              disabled={saving}
              style={styles.footerBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6F3',
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: '#6B7280',
  },
  tabTextActive: {
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: wp('4%'),
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: FontSize.sm,
    color: '#111827',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },
  userName: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },
  userRole: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  cardInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  viewBtn: {
    backgroundColor: '#E6F7F0',
    borderColor: '#A7E9C5',
  },
  editBtn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  suspendBtn: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  activateBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7E9C5',
  },
  actionBtnText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 8,
  },
  totalRow: {
    paddingHorizontal: wp('4%'),
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalAvatarText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },
  modalHeaderTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
  },
  modalHeaderSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 8,
  },
  modalBody: {
    padding: 16,
    maxHeight: '70%',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerBtn: {
    flex: 1,
    height: 44,
  },

  infoCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoPair: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },

  credentialsCard: {
    backgroundColor: '#F0FDF7',
    borderWidth: 1,
    borderColor: '#A7E9C5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  credRow: {
    marginBottom: 10,
  },
  credLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: '#6B7280',
    marginBottom: 4,
  },
  credValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#A7E9C5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  credText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    flex: 1,
  },
  credActions: {
    flexDirection: 'row',
    gap: 8,
  },

  resetPwdCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  passwordInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: FontSize.sm,
    color: '#111827',
  },
  pwdToggle: {
    paddingHorizontal: 10,
  },
  resetBtn: {
    height: 40,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
  },
});

export default UserManagementScreen;
