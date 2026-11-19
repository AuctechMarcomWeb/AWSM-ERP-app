/**
 * User Management API Functions
 * Simple CRUD functions - no hooks
 */

import { createAxiosInstance } from './apiConfig';
const api = createAxiosInstance('');

// ================================================================
// GET USERS BY ROLE
// ================================================================

export const getUsersByRole = async (
  role,
  page = 1,
  limit = 20,
  search = '',
) => {
  let url = `staff/users-by-role?role=${role}&page=${page}&limit=${limit}&isPagination=true`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const response = await api.get(url);
  return response.data?.data || {};
};

// ================================================================
// UPDATE USER
// ================================================================

export const updateUser = async (userId, data) => {
  const response = await api.put(`staff/users-by-role/${userId}`, data);
  return response.data;
};

// ================================================================
// RESET/SET PASSWORD
// ================================================================

export const resetPassword = async (userId, password) => {
  const response = await api.put(`staff/users-by-role/${userId}`, { password });
  return response.data;
};

// ================================================================
// GET ALL STAFF USERS
// ================================================================

export const getStaffUsers = async (page = 1, limit = 20, search = '') => {
  let url = `staff/users-by-role?page=${page}&limit=${limit}&isPagination=true`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const response = await api.get(url);
  return response.data?.data || {};
};

// ================================================================
// GET MEMBERSHIP USERS
// ================================================================

export const getMembershipUsers = async (page = 1, limit = 20, search = '') => {
  return getUsersByRole('Membership', page, limit, search);
};

// ================================================================
// GET WAZIFA USERS
// ================================================================

export const getWazifaUsers = async (page = 1, limit = 20, search = '') => {
  return getUsersByRole('WazifaUser', page, limit, search);
};

// ================================================================
// SUSPEND USER
// ================================================================

export const suspendUser = async (userId, isSuspended = true) => {
  const response = await api.put(`staff/users-by-role/${userId}`, {
    isSuspended,
  });
  return response.data;
};

// ================================================================
// ACTIVATE USER
// ================================================================

export const activateUser = async userId => {
  return suspendUser(userId, false);
};
