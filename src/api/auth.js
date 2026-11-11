import { createAxiosInstance, setCachedToken } from './apiConfig';

const authApi = createAxiosInstance('auth');

/**
 * Login with userId and password
 * Returns: { success, token, user, message }
 */
export const loginWithPassword = async (userId, password) => {
  try {
    const response = await authApi.post('/loginWithPassword', {
      userId,
      password,
    });

    if (response.data.success && response.data.data) {
      const token = response.data.data.authToken;
      
      // Cache token for subsequent requests
      setCachedToken(token);
      
      return {
        success: true,
        token: token,
        user: response.data.data,
        message: response.data.message,
      };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get user profile with permissions
 * Returns: { success, user, permissions, role, message }
 */
export const getProfile = async () => {
  try {
    // authApi will automatically use cached token from interceptor
    const response = await authApi.get('/profile');

    if (response.data.success && response.data.data?.user) {
      const userData = response.data.data.user;
      const permissions = userData.permissions || [];
      
      console.log('✅ Profile API Response:');
      console.log('   - User:', userData.name);
      console.log('   - Role:', userData.role);
      console.log('   - Total Permissions:', permissions.length);
      console.log('   - Permissions:', permissions);
      
      return {
        success: true,
        user: userData,
        permissions: permissions,
        role: userData.role,
        message: response.data.message,
      };
    }
    
    console.warn('Profile API error:', response.data.message);
    return { success: false, message: response.data.message || 'Failed to fetch profile' };
  } catch (error) {
    console.error('Profile error:', error.message);
    console.error('Profile error response:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error',
    };
  }
};

/**
 * Logout
 * Returns: { success, message }
 */
export const logout = async () => {
  try {
    const response = await authApi.post('/logout');
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Update profile
 * Returns: { success, user, message }
 */
export const updateProfile = async userData => {
  try {
    const response = await authApi.put('/profile', userData);

    if (response.data.success) {
      return {
        success: true,
        user: response.data.data,
        message: response.data.message,
      };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
