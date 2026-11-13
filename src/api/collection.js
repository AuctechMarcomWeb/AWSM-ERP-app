import { createAxiosInstance } from './apiConfig';

const api = createAxiosInstance('');

// ============================================================
// 1. EXECUTIVE MEMBERS (Office Bearers)
// ============================================================
export const getExecutiveMembers = async () => {
  try {
    const response = await api.get('executive-member?isPagination=false');
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.members) {
      return {
        success: true,
        members: data.data.members,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch executive members',
    };
  } catch (error) {
    console.error('❌ Error fetching executive members:', error);
    return {
      success: false,
      message: error.message || 'Error fetching executive members',
    };
  }
};

// ============================================================
// 2. OFFICE BEARERS (Designations + Tenure)
// ============================================================
export const getOfficeBearers = async () => {
  try {
    const response = await api.get('office-bearer?isPagination=false&sortBy=recent');
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.bearers) {
      return {
        success: true,
        bearers: data.data.bearers,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch office bearers',
    };
  } catch (error) {
    console.error('❌ Error fetching office bearers:', error);
    return {
      success: false,
      message: error.message || 'Error fetching office bearers',
    };
  }
};

// ============================================================
// 3. LOCAL SECRETARIES
// ============================================================
export const getLocalSecretaries = async () => {
  try {
    const response = await api.get('local-secretary?isPagination=false');
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.members) {
      return {
        success: true,
        members: data.data.members,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch local secretaries',
    };
  } catch (error) {
    console.error('❌ Error fetching local secretaries:', error);
    return {
      success: false,
      message: error.message || 'Error fetching local secretaries',
    };
  }
};

// ============================================================
// 4. FUND TYPES
// ============================================================
export const getFundTypes = async () => {
  try {
    const response = await api.get('fund-type?isActive=true&isPagination=false');
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.fundTypes) {
      return {
        success: true,
        fundTypes: data.data.fundTypes,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch fund types',
    };
  } catch (error) {
    console.error('❌ Error fetching fund types:', error);
    return {
      success: false,
      message: error.message || 'Error fetching fund types',
    };
  }
};

// ============================================================
// 5. PAYMENT MODES
// ============================================================
export const getPaymentModes = async () => {
  try {
    const response = await api.get('mode-of-payment?isActive=true&isPagination=false');
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.data) {
      return {
        success: true,
        paymentModes: data.data.data,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch payment modes',
    };
  } catch (error) {
    console.error('❌ Error fetching payment modes:', error);
    return {
      success: false,
      message: error.message || 'Error fetching payment modes',
    };
  }
};

// ============================================================
// 6. MEMBERS (All Members for Collection)
// ============================================================
export const getMembers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams({
      sortBy: params.sortBy || 'recent',
      isPagination: params.isPagination !== undefined ? params.isPagination : false,
      page: params.page || 1,
      limit: params.limit || 50,
    }).toString();
    
    const response = await api.get(`membership?${queryString}`);
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.members) {
      return {
        success: true,
        members: data.data.members,
        stats: data.data.stats || {},
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch members',
    };
  } catch (error) {
    console.error('❌ Error fetching members:', error);
    return {
      success: false,
      message: error.message || 'Error fetching members',
    };
  }
};

// ============================================================
// 7. CREATE PAYMENT ENTRY (Main Collection API)
// ============================================================
export const createPaymentEntry = async (payload) => {
  try {
    console.log('📤 Creating payment entry...');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await api.post('payment-entry', payload);
    const data = response.data;
    
    if (data.statusCode === 201 || data.statusCode === 200) {
      console.log('✅ Payment entry created successfully');
      return {
        success: true,
        message: 'Payment recorded successfully',
        data: data.data,
      };
    }
    
    return {
      success: false,
      message: data.message || 'Failed to create payment entry',
    };
  } catch (error) {
    console.error('❌ Error creating payment entry:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create payment entry',
    };
  }
};

// ============================================================
// 8. FETCH PAYMENTS (List all payments with filters)
// ============================================================
export const fetchPayments = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'recent',
      isPagination: filters.isPagination !== undefined ? filters.isPagination : true,
      ...(filters.collectedBy && { collectedBy: filters.collectedBy }),
      ...(filters.paymentMode && { paymentMode: filters.paymentMode }),
      ...(filters.fromDate && { fromDate: filters.fromDate }),
      ...(filters.toDate && { toDate: filters.toDate }),
      ...(filters.memberCode && { memberCode: filters.memberCode }),
    }).toString();
    
    const response = await api.get(`payment-entry?${queryString}`);
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.payments) {
      return {
        success: true,
        payments: data.data.payments,
        currentPage: data.data.currentPage || 1,
        totalPages: data.data.totalPages || 1,
        totalAmount: data.data.totalAmount || 0,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch payments',
    };
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    return {
      success: false,
      message: error.message || 'Error fetching payments',
    };
  }
};

// ============================================================
// 9. GET SINGLE PAYMENT ENTRY
// ============================================================
export const getPaymentEntry = async (paymentId) => {
  try {
    const response = await api.get(`payment-entry/${paymentId}`);
    const data = response.data;
    
    if (data.statusCode === 200 && data.data) {
      return {
        success: true,
        payment: data.data,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch payment entry',
    };
  } catch (error) {
    console.error('❌ Error fetching payment entry:', error);
    return {
      success: false,
      message: error.message || 'Error fetching payment entry',
    };
  }
};

// ============================================================
// 10. UPDATE PAYMENT ENTRY
// ============================================================
export const updatePaymentEntry = async (paymentId, payload) => {
  try {
    console.log('📝 Updating payment entry...');
    
    const response = await api.put(`payment-entry/${paymentId}`, payload);
    const data = response.data;
    
    if (data.statusCode === 200) {
      console.log('✅ Payment entry updated successfully');
      return {
        success: true,
        message: 'Payment updated successfully',
        data: data.data,
      };
    }
    
    return {
      success: false,
      message: data.message || 'Failed to update payment entry',
    };
  } catch (error) {
    console.error('❌ Error updating payment entry:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update payment entry',
    };
  }
};

// ============================================================
// 11. DELETE PAYMENT ENTRY
// ============================================================
export const deletePaymentEntry = async (paymentId) => {
  try {
    console.log('🗑️ Deleting payment entry...');
    
    const response = await api.delete(`payment-entry/${paymentId}`);
    const data = response.data;
    
    if (data.statusCode === 200) {
      console.log('✅ Payment entry deleted successfully');
      return {
        success: true,
        message: 'Payment deleted successfully',
      };
    }
    
    return {
      success: false,
      message: data.message || 'Failed to delete payment entry',
    };
  } catch (error) {
    console.error('❌ Error deleting payment entry:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete payment entry',
    };
  }
};

// ============================================================
// 12. UPLOAD PAYMENT RECEIPT / DOCUMENT
// ============================================================
export const uploadPaymentDocument = async (formData) => {
  try {
    console.log('📤 Uploading payment document...');
    
    const response = await api.post('payment-entry/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data = response.data;
    
    if (data.statusCode === 200 || data.statusCode === 201) {
      console.log('✅ Document uploaded successfully');
      return {
        success: true,
        documentUrl: data.data?.documentUrl || data.data?.url,
      };
    }
    
    return {
      success: false,
      message: 'Failed to upload document',
    };
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    return {
      success: false,
      message: error.message || 'Error uploading document',
    };
  }
};

// ============================================================
// 13. COLLECTION REPORT / SUMMARY
// ============================================================
export const getCollectionReport = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams({
      fromDate: filters.fromDate || '',
      toDate: filters.toDate || '',
      collectedBy: filters.collectedBy || '',
      paymentMode: filters.paymentMode || '',
    }).toString();
    
    const response = await api.get(`payment-entry/report?${queryString}`);
    const data = response.data;
    
    if (data.statusCode === 200 && data.data) {
      return {
        success: true,
        report: data.data,
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch collection report',
    };
  } catch (error) {
    console.error('❌ Error fetching collection report:', error);
    return {
      success: false,
      message: error.message || 'Error fetching collection report',
    };
  }
};

// ============================================================
// 14. SEARCH MEMBERS BY NAME OR CODE
// ============================================================
export const searchMembers = async (searchTerm) => {
  try {
    const response = await api.get(`membership/search?q=${encodeURIComponent(searchTerm)}`);
    const data = response.data;
    
    if (data.statusCode === 200 && data.data?.members) {
      return {
        success: true,
        members: data.data.members,
      };
    }
    
    return {
      success: false,
      message: 'No members found',
    };
  } catch (error) {
    console.error('❌ Error searching members:', error);
    return {
      success: false,
      message: error.message || 'Error searching members',
    };
  }
};

// ============================================================
// 15. GET COLLECTED BY OPTIONS (Collectors/Users)
// ============================================================
export const getCollectors = async () => {
  try {
    // Get executive members, office bearers, and local secretaries
    const [executiveRes, bearersRes, secretariesRes] = await Promise.all([
      getExecutiveMembers(),
      getOfficeBearers(),
      getLocalSecretaries(),
    ]);
    
    const collectorMap = new Map(); // Use Map to avoid duplicates
    
    // Add executive members
    if (executiveRes.success && executiveRes.members) {
      executiveRes.members.forEach(m => {
        const key = m._id; // Use _id as unique key
        if (!collectorMap.has(key)) {
          collectorMap.set(key, {
            _id: m._id,
            name: m.name,
            type: 'Executive Member',
            memberId: m.memberId,
            city: m.city,
          });
        }
      });
    }
    
    // Add office bearers
    if (bearersRes.success && bearersRes.bearers) {
      bearersRes.bearers.forEach(b => {
        const key = b._id;
        if (!collectorMap.has(key)) {
          collectorMap.set(key, {
            _id: b._id,
            name: b.name,
            type: 'Office Bearer',
            designation: b.designation?.name,
          });
        }
      });
    }
    
    // Add local secretaries
    if (secretariesRes.success && secretariesRes.members) {
      secretariesRes.members.forEach(s => {
        const key = s._id;
        if (!collectorMap.has(key)) {
          collectorMap.set(key, {
            _id: s._id,
            name: s.name,
            type: 'Local Secretary',
            memberId: s.memberId,
            city: s.city,
          });
        }
      });
    }
    
    const collectors = Array.from(collectorMap.values());
    
    console.log('✅ Collectors loaded (no duplicates):', collectors.length);
    
    return {
      success: true,
      collectors,
    };
  } catch (error) {
    console.error('❌ Error fetching collectors:', error);
    return {
      success: false,
      message: error.message || 'Error fetching collectors',
    };
  }
};

// ============================================================
// HELPER: Prepare Payment Payload
// ============================================================
export const preparePaymentPayload = (formData) => {
  return {
    date: formData.date, // YYYY-MM-DD
    regNo: formData.regNo || '',
    receiptNo: formData.receiptNo || '',
    tallyNo: formData.tallyNo || '',
    collectedBy: formData.collectedBy,
    collectedByMemberId: formData.collectedByMemberId || '',
    paymentMode: formData.paymentMode,
    amountDetails: (formData.funds || []).map(f => ({
      fundType: f.type,
      amount: parseFloat(f.amount),
      paymentType: 'memberPayment',
    })),
    isAnonymous: formData.isAnonymous || false,
    memberCode: formData.memberCode || '',
    memberName: formData.memberName || '',
    memberType: formData.memberType || '',
    address: formData.address || '',
    city: formData.city || '',
    country: formData.country || 'India',
    remarks: formData.remarks || '',
  };
};

// ============================================================
// HELPER: Format collectors for display (name + type)
// ============================================================
export const formatCollectorsForDisplay = (collectors) => {
  return collectors.map(c => ({
    _id: c._id,
    displayName: `${c.name} (${c.type})`,
    name: c.name,
    type: c.type,
  }));
};

// ============================================================
// HELPER: Format fund types for display
// ============================================================
export const formatFundTypesForDisplay = (fundTypes) => {
  return fundTypes.map(f => ({
    _id: f._id,
    displayName: f.title,
    title: f.title,
    amount: f.amount,
  }));
};
