# Live UI Editing - Implementation Guide

## 🎨 Overview
The **Live UI Editing** system allows Super Admins (Ghost Mode) to edit text content directly on the page, just by double-clicking it. This eliminates the need for code changes for simple copy updates.

## 🛠 How It Works

### 1. The Component
The core of this system is the `EditableContent` component (`/src/components/admin/EditableContent.tsx`).

It wraps regular text elements and adds:
- **Admin Detection**: Only activates if `isGhostAdmin` is true.
- **Double-Click Handler**: Turns text into an input field.
- **Persistence**: Saves changes to `localStorage` (currently) or Database (future).

### 2. Usage
To make any text editable, simply replace the HTML tag with `<EditableContent />`.

**Before:**
```tsx
<h1 className="text-4xl font-bold">Welcome Back</h1>
```

**After:**
```tsx
<EditableContent 
    id="welcome_title" 
    initialContent="Welcome Back" 
    tag="h1" 
    className="text-4xl font-bold" 
/>
```

### 3. Current Status
- **Frontend**: ✅ Component created and acting as a drop-in replacement.
- **Demo**: ✅ Applied to "New Releases" section in Marketplace.
- **Storage**: ⚠️ Currently using **Browser LocalStorage**. This means changes are only visible to YOU (the browser that made the edit).

## 🚀 Moving to Production (Database)

To make edits visible to ALL users, we need to connect this to the database.

### Step 1: Update Schema
Add this model to `prisma/schema.prisma`:

```prisma
model ContentBlock {
  id        String   @id // The 'id' prop passed to component (e.g. 'market_hero_title')
  content   String   @db.Text
  updatedAt DateTime @updatedAt
  updatedBy String?
}
```

### Step 2: Create API Endpoint
Create `/src/app/api/admin/content/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    // 1. Verify Admin Key
    // 2. { id, content } = await req.json()
    // 3. await prisma.contentBlock.upsert(...)
    // 4. return NextResponse.json({ success: true })
}
```

### Step 3: Update Component
Modify `EditableContent.tsx` to fetch from this API on mount and save to it on blur.

## 🧪 Try It Now
1. Go to **Command Center** and unlock Ghost Mode.
2. Go to **/marketplace**.
3. Double click "New Releases" or the subtitle below it.
4. Type your new text and press Enter.
5. Refresh the page - your changes will persist (locally)!
