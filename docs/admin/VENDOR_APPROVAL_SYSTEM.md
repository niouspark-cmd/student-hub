# 🛡️ Vendor Approval System - Complete Guide

## ✅ System Status: FULLY OPERATIONAL

Your admin panel **already has** the ability to accept or decline pending vendor applications! Here's how it works:

---

## 🎯 How to Access the Vendor Approval System

### Step 1: Access Admin Dashboard
Navigate to: **`/dashboard/admin`**

You'll see the main admin command center with:
- Total revenue, orders, users
- **Pending Partners** count (highlighted in yellow)
- Two main action cards at the bottom

### Step 2: Enter Partner Vetting
Click on the **"Partner Vetting"** card or navigate directly to:
**`/dashboard/admin/vetting`**

### Step 3: Review & Approve/Reject Vendors
On the vetting page, you'll see all pending vendor applications with:
- **Shop Name** (e.g., "New Shop")
- **Location** (shop landmark)
- **Owner Name**
- Two action buttons:
  - 🔴 **Deny** - Rejects the application (sets status to SUSPENDED)
  - ✅ **Authorize Partner** - Approves the application (sets status to ACTIVE)

---

## 🔧 Technical Implementation

### API Endpoint
**File:** `/src/app/api/admin/vetting/route.ts`

**GET Request:**
- Fetches all vendors with `vendorStatus: 'PENDING'`
- Returns list of pending vendors

**POST Request:**
- Accepts: `{ vendorId, action }` where action is 'APPROVE' or 'REJECT'
- Updates vendor status:
  - `APPROVE` → Sets `vendorStatus` to `ACTIVE`
  - `REJECT` → Sets `vendorStatus` to `SUSPENDED`
- Logs action in admin audit trail

### Frontend Page
**File:** `/src/app/dashboard/admin/vetting/page.tsx`

Features:
- ✨ Animated vendor cards with Framer Motion
- 🔄 Real-time updates after approval/rejection
- 🎨 Premium OMNI design aesthetic
- 🔒 Admin-only access with security checks

### Security
**File:** `/src/lib/auth/admin.ts`

Two-layer security:
1. **Cookie Check:** Validates `OMNI_BOSS_TOKEN` cookie
2. **Database Check:** Verifies user role is `ADMIN`

### Audit Logging
**File:** `/src/lib/admin/audit.ts`

Every approval/rejection is logged with:
- Admin ID (who performed the action)
- Action type (`PARTNER_APPROVE` or `PARTNER_REJECT`)
- Vendor details
- Timestamp

---

## 📊 Vendor Status Flow

```
User Applies → PENDING → Admin Reviews → APPROVE or REJECT
                                              ↓           ↓
                                          ACTIVE    SUSPENDED
```

### Status Meanings:
- **PENDING**: Awaiting admin approval (vendor sees "Application Pending" screen)
- **ACTIVE**: Approved vendor with full dashboard access
- **SUSPENDED**: Rejected or banned vendor (sees "Account Suspended" screen)

---

## 🎨 User Experience

### For Vendors (PENDING status):
When a vendor has `vendorStatus: 'PENDING'`, they see:
- ⏳ Hourglass icon
- "APPLICATION PENDING" message
- Shop name they registered
- "Return to Marketplace" button
- **No access to vendor dashboard**

### For Vendors (ACTIVE status):
After admin approval:
- ✅ Full vendor dashboard access
- Can list products
- Can manage orders
- Can withdraw funds
- Rush mode toggle enabled

### For Vendors (SUSPENDED status):
If rejected:
- 🚫 "Account Suspended" message
- No dashboard access
- Prompted to contact support

---

## 🚀 Testing the System

1. **Create a test vendor account:**
   - Sign up as a new user
   - Go to `/dashboard/vendor`
   - Complete vendor onboarding
   - You'll be in PENDING status

2. **Switch to admin account:**
   - Navigate to `/dashboard/admin`
   - Click "Partner Vetting"
   - You should see the test vendor

3. **Approve or reject:**
   - Click "Authorize Partner" to approve
   - Click "Deny" to reject

4. **Verify:**
   - Switch back to vendor account
   - Refresh the page
   - If approved: you'll see the full dashboard
   - If rejected: you'll see the suspended message

---

## 🔍 Database Schema

The system uses the `User` model with these key fields:
```prisma
model User {
  id            String        @id @default(cuid())
  clerkId       String        @unique
  role          Role          @default(STUDENT)
  vendorStatus  VendorStatus? // PENDING, ACTIVE, SUSPENDED
  shopName      String?
  shopLandmark  String?
  // ... other fields
}

enum VendorStatus {
  PENDING
  ACTIVE
  SUSPENDED
}
```

---

## ✨ Features Already Implemented

✅ Admin authentication & authorization  
✅ Pending vendor list view  
✅ One-click approve/reject actions  
✅ Real-time UI updates  
✅ Security audit logging  
✅ Premium OMNI design  
✅ Animated transitions  
✅ Mobile responsive  
✅ Error handling  
✅ Loading states  

---

## 🎯 Next Steps (Optional Enhancements)

If you want to add more features:
- 📧 Email notifications to vendors on approval/rejection
- 💬 Admin notes/comments on applications
- 📋 Bulk approve/reject actions
- 🔍 Search and filter pending vendors
- 📊 Vendor application analytics
- ⏰ Auto-reject after X days of pending

---

## 🆘 Troubleshooting

**Issue:** Can't access admin dashboard  
**Solution:** Make sure you have admin access. Use the gatekeeper code to become admin.

**Issue:** Pending vendors not showing  
**Solution:** Check that vendors have `vendorStatus: 'PENDING'` in the database.

**Issue:** Actions not working  
**Solution:** Check browser console for errors. Verify admin authentication.

---

## 📝 Summary

Your vendor approval system is **100% functional** and ready to use! Simply navigate to `/dashboard/admin/vetting` to start approving or rejecting vendor applications. The system includes security, audit logging, and a beautiful UI that matches your OMNI aesthetic.

**No additional code changes needed** - the feature is already built and working! 🎉
