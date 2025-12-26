# Active Protocols - Feature Explanation & Power

## What Are Active Protocols?

Active Protocols are **system-wide feature toggles** that control which parts of the OMNI platform are enabled or disabled.

---

## The 4 Protocols

### 1. **MARKET** 🛍️
**What it controls**: Marketplace functionality

**When ON** (Active):
- ✅ Users can browse marketplace
- ✅ Users can add items to cart
- ✅ Users can make purchases
- ✅ Vendors can list products
- ✅ Category hubs accessible

**When OFF** (Inactive):
- ❌ Marketplace shows "Feature Disabled" message
- ❌ Users cannot browse or buy
- ❌ Vendors cannot list new products
- ❌ Existing carts are frozen

**Use Cases**:
- Disable during major updates
- Prevent trading during system maintenance
- Emergency shutdown if fraud detected

---

### 2. **PULSE** 📱
**What it controls**: Campus Pulse (Stories/Social Feed)

**When ON** (Active):
- ✅ Users can view Campus Pulse feed
- ✅ Users can upload videos/stories
- ✅ My Pulse creator studio accessible
- ✅ Theater mode works
- ✅ Likes, comments, shares enabled

**When OFF** (Inactive):
- ❌ Campus Pulse shows "Feature Disabled"
- ❌ Users cannot upload content
- ❌ Existing content hidden
- ❌ Theater mode disabled

**Use Cases**:
- Disable during content moderation
- Prevent uploads during server issues
- Emergency shutdown for inappropriate content

---

### 3. **RUNNER** 🏃
**What it controls**: Runner/Delivery system

**When ON** (Active):
- ✅ Runners can accept delivery missions
- ✅ Users can request delivery
- ✅ Runner dashboard accessible
- ✅ Delivery tracking works
- ✅ Runner earnings calculated

**When OFF** (Inactive):
- ❌ No new delivery requests accepted
- ❌ Runner dashboard shows "Feature Disabled"
- ❌ Existing deliveries can complete
- ❌ No new runner signups

**Use Cases**:
- Disable during holidays/breaks
- Pause during campus events
- Emergency shutdown for safety

---

### 4. **ESCROW** 🛡️
**What it controls**: Escrow payment protection

**When ON** (Active):
- ✅ Payments held in escrow
- ✅ Buyer protection enabled
- ✅ Vendor payouts on delivery
- ✅ Dispute resolution available
- ✅ Refunds possible

**When OFF** (Inactive):
- ❌ Direct payments (no escrow)
- ❌ No buyer protection
- ❌ Instant vendor payouts
- ❌ No dispute system
- ⚠️ **DANGEROUS**: Only disable for testing

**Use Cases**:
- Testing payment flows
- Emergency bypass (rare)
- **NOT recommended for production**

---

## How They Work

### Database Storage:
```typescript
SystemSettings {
    id: 'GLOBAL_CONFIG'
    maintenanceMode: boolean
    activeFeatures: string[]  // ['MARKET', 'PULSE', 'RUNNER', 'ESCROW']
    globalNotice: string | null
}
```

### Toggle Behavior:
1. Click protocol card in Command Center
2. Updates `activeFeatures` array in database
3. API endpoint: `POST /api/admin/system`
4. Changes take effect immediately
5. All users affected globally

### Visual Indicators:
- **Active**: Blue glow, full progress bar, bright text
- **Inactive**: Gray, empty progress bar, dimmed text

---

## Current Implementation

### What Works NOW:
✅ **Visual Toggle**: Click to turn on/off
✅ **Database Update**: Saves to SystemSettings table
✅ **UI Feedback**: Shows active/inactive state

### What COULD Work (Future):
🔄 **Actual Feature Blocking**: Need to add checks in each feature
🔄 **User Notifications**: Alert users when feature disabled
🔄 **Graceful Degradation**: Show helpful messages

---

## Making Protocols Actually Work

### Step 1: Add Checks to Features

**Marketplace** (`/marketplace/page.tsx`):
```tsx
const [systemConfig, setSystemConfig] = useState(null);

useEffect(() => {
    fetch('/api/system/config')
        .then(res => res.json())
        .then(data => setSystemConfig(data));
}, []);

if (!systemConfig?.activeFeatures?.includes('MARKET')) {
    return <FeatureDisabledMessage feature="Marketplace" />;
}
```

**Campus Pulse** (`/stories/page.tsx`):
```tsx
if (!systemConfig?.activeFeatures?.includes('PULSE')) {
    return <FeatureDisabledMessage feature="Campus Pulse" />;
}
```

**Runner Dashboard** (`/runner/page.tsx`):
```tsx
if (!systemConfig?.activeFeatures?.includes('RUNNER')) {
    return <FeatureDisabledMessage feature="Runner Mode" />;
}
```

**Escrow** (in checkout flow):
```tsx
if (!systemConfig?.activeFeatures?.includes('ESCROW')) {
    // Use direct payment instead
    processDirectPayment();
} else {
    // Use escrow protection
    processEscrowPayment();
}
```

---

## Power Features

### 1. **Emergency Shutdown**
Turn off MARKET protocol → Entire marketplace disabled instantly

### 2. **Gradual Rollout**
- Launch new feature with protocol OFF
- Test with admin account
- Turn ON when ready
- Instant activation for all users

### 3. **A/B Testing**
- Enable RUNNER for 50% of users
- Compare metrics
- Roll out to everyone

### 4. **Scheduled Maintenance**
- Disable MARKET at midnight
- Perform updates
- Re-enable in morning

### 5. **Safety Controls**
- Fraud detected → Disable ESCROW
- Inappropriate content → Disable PULSE
- Campus emergency → Disable RUNNER

---

## Recommended Implementation

### Priority 1: MARKET Protocol
Most critical - controls revenue

### Priority 2: PULSE Protocol
Content moderation control

### Priority 3: RUNNER Protocol
Safety and logistics

### Priority 4: ESCROW Protocol
Payment security (already mostly working via maintenance mode)

---

## Summary

**Current State**: Protocols toggle in UI and save to database
**Next Step**: Add feature checks to actually enforce protocols
**Power**: Global instant control over entire platform features
**Use Case**: Emergency shutdowns, gradual rollouts, A/B testing

**Should we implement the actual feature blocking now?** 🚀
