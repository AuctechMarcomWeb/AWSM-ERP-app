# 🏢 Organization API - Complete Setup Guide

Complete API integration for AWSM-ERP Organization Management with 4 custom React hooks.

---

## 📂 File Structure

```
AWSM/
├── src/
│   ├── api/
│   │   ├── organization.js                    ← Main API functions (573 lines)
│   │   ├── ORGANIZATION_API_DOCS.md           ← Full documentation
│   │   └── ORGANIZATION_QUICK_REF.js          ← Quick reference
│   ├── hooks/
│   │   └── useOrganization.js                 ← Custom React hooks
│   └── Screens/
│       └── Common/
│           └── OrganizationStructure/
│               └── [React components]
└── ORGANIZATION_API_SETUP.md                  ← This file
```

---

## 🎯 What's Included

### 📡 API Functions (20 Total)

| Category | Functions |
|----------|-----------|
| **Organization Structure** | get, getById, create, update, delete |
| **Office Bearer** | get, getById, create, update, delete |
| **Executive Members** | get, getById, create, update, delete |
| **Local Secretaries** | get, getById, create, update, delete |

### 🎣 Custom React Hooks (4 Total)

1. `useOrganizationStructures()` - Handle organization structures
2. `useOfficeBearers()` - Handle office bearers
3. `useExecutiveMembers()` - Handle executive members
4. `useLocalSecretaries()` - Handle local secretaries

---

## 💻 Quick Start

### Method 1: Using Custom Hooks (Recommended)

```javascript
import { useOfficeBearers } from '../../hooks/useOrganization';

function MyComponent() {
  const {
    bearers,
    loading,
    error,
    page,
    total,
    loadBearers,
    createBearer,
    updateBearer,
    deleteBearer,
  } = useOfficeBearers();

  // Load data on mount
  useEffect(() => {
    loadBearers(1, '');
  }, []);

  // Handle create
  const handleCreate = async (data) => {
    const result = await createBearer(data);
    if (result.success) {
      // Data auto-reloaded
    }
  };

  // Handle update
  const handleUpdate = async (id, data) => {
    const result = await updateBearer(id, data);
    if (result.success) {
      // Data auto-reloaded
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await deleteBearer(id);
    if (result.success) {
      // Data auto-reloaded
    }
  };

  return (
    // JSX with bearers, loading, error states
  );
}
```

### Method 2: Direct API Functions

```javascript
import {
  getOfficeBearers,
  createOfficeBearer,
  updateOfficeBearer,
  deleteOfficeBearer,
} from '../../api/organization';

async function loadBearers() {
  const result = await getOfficeBearers(1, 10, 'search-term');
  if (result.success) {
    console.log(result.bearers);
  }
}

async function addBearer() {
  const result = await createOfficeBearer({
    name: 'John Doe',
    position: 'President',
    memberId: 'M123',
  });
  if (result.success) {
    console.log('Created:', result.data);
  }
}
```

---

## 🔄 API Endpoints

### Base URL: `/api/organization`

#### Organization Structure
```
GET    /get-structures              - List all (paginated)
GET    /structure/:id               - Get single
POST   /create-structure            - Create new
PUT    /update-structure/:id        - Update
DELETE /delete-structure/:id        - Delete
```

#### Office Bearer
```
GET    /office-bearers              - List all (paginated)
GET    /office-bearer/:id           - Get single
POST   /create-office-bearer        - Create new
PUT    /update-office-bearer/:id    - Update
DELETE /delete-office-bearer/:id    - Delete
```

#### Executive Members
```
GET    /executive-members           - List all (paginated)
GET    /executive-member/:id        - Get single
POST   /create-executive-member     - Create new
PUT    /update-executive-member/:id - Update
DELETE /delete-executive-member/:id - Delete
```

#### Local Secretaries
```
GET    /local-secretaries           - List all (paginated)
GET    /local-secretary/:id         - Get single
POST   /create-local-secretary      - Create new
PUT    /update-local-secretary/:id  - Update
DELETE /delete-local-secretary/:id  - Delete
```

---

## 📊 Response Formats

### List Endpoints
```javascript
{
  success: true,
  structures: [{...}, {...}],  // or bearers, members, secretaries
  total: 50,
  message: "Success"
}
```

### Single Item Endpoints
```javascript
{
  success: true,
  data: {
    _id: "123",
    name: "John Doe",
    position: "President",
    ...
  },
  message: "Success"
}
```

### Create/Update Endpoints
```javascript
{
  success: true,
  data: { _id, name, position, ... },
  message: "Created successfully"
}
```

### Delete Endpoints
```javascript
{
  success: true,
  message: "Deleted successfully"
}
```

### Error Response
```javascript
{
  success: false,
  data: null,
  message: "Error message here"
}
```

---

## 🎣 Hook Methods

Each custom hook returns:

```javascript
{
  // State
  structures/bearers/members/secretaries,  // Array of items
  loading,                                  // Boolean
  error,                                    // String or null
  page,                                     // Current page
  total,                                    // Total items count
  
  // Methods
  loadStructures/Bearers/Members/Secretaries(pageNum, search),
  createStructure/Bearer/Member/Secretary(data),
  updateStructure/Bearer/Member/Secretary(id, data),
  deleteStructure/Bearer/Member/Secretary(id)
}
```

---

## 📋 Example: Complete CRUD Component

```javascript
import React, { useState, useEffect } from 'react';
import { useOfficeBearers } from '../../hooks/useOrganization';

function OfficeBearersManager() {
  const {
    bearers,
    loading,
    error,
    page,
    total,
    loadBearers,
    createBearer,
    updateBearer,
    deleteBearer,
  } = useOfficeBearers();

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    memberId: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadBearers(1, '');
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await updateBearer(editingId, formData);
      setEditingId(null);
    } else {
      await createBearer(formData);
    }
    setFormData({ name: '', position: '', memberId: '' });
  };

  const handleEdit = (bearer) => {
    setFormData(bearer);
    setEditingId(bearer._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteBearer(id);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Form */}
      <input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
      />
      <button onClick={handleSubmit}>
        {editingId ? 'Update' : 'Create'}
      </button>

      {/* List */}
      {bearers.map((bearer) => (
        <div key={bearer._id}>
          <h3>{bearer.name}</h3>
          <p>{bearer.position}</p>
          <button onClick={() => handleEdit(bearer)}>Edit</button>
          <button onClick={() => handleDelete(bearer._id)}>Delete</button>
        </div>
      ))}

      <p>Total: {total} | Page: {page}</p>
    </div>
  );
}

export default OfficeBearersManager;
```

---

## 🔒 Error Handling

All functions include error handling:

```javascript
async function safeCall() {
  try {
    const result = await getOfficeBearers(1, 10);
    
    if (!result.success) {
      console.error('API Error:', result.message);
      return null;
    }
    
    return result.bearers;
  } catch (error) {
    console.error('❌ Unexpected Error:', error);
    return null;
  }
}
```

---

## ✨ Features

✅ Full CRUD operations  
✅ Pagination support  
✅ Search functionality  
✅ Custom React hooks  
✅ Error handling & logging  
✅ Standardized responses  
✅ Axios integration  
✅ JSDoc documentation  
✅ TypeScript-friendly  

---

## 🚀 Usage Tips

1. **Always use hooks in functional components** for automatic state management
2. **Call loadXxx() on component mount** to fetch initial data
3. **Error state is managed in the hook** - just display it
4. **Loading state prevents duplicate requests** - built-in protection
5. **After CRUD operations, data auto-reloads** - no manual refresh needed

---

## 📞 Support

For API issues, check:
- `src/api/organization.js` - API implementation
- `src/api/ORGANIZATION_API_DOCS.md` - Full documentation
- `src/hooks/useOrganization.js` - Hook implementation

---

**Ready to use! Start building organization management screens now.** 🚀
