# Cloudinary Upload Preset Setup for Stories

## 🎯 **Quick Setup (5 minutes)**

### **Step 1: Create Upload Preset**

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Click **Settings** (gear icon) → **Upload**
3. Scroll to **Upload presets**
4. Click **Add upload preset**

### **Step 2: Configure Preset**

**Preset Name**: `student_hub_stories`

**Settings**:
- **Signing Mode**: `Unsigned` ✅ (IMPORTANT!)
- **Folder**: `student-hub/stories`
- **Resource type**: `Video`
- **Access mode**: `Public`
- **Allowed formats**: `mp4, mov, avi, webm`
- **Max file size**: `100 MB`
- **Overwrite**: `false`
- **Unique filename**: `true`

**Optional (Recommended)**:
- **Auto-tagging**: `campus-pulse, stories`
- **Eager transformations**: Leave empty (we'll handle this in code)

### **Step 3: Save**

Click **Save** at the bottom.

---

## ✅ **Why This Works**

### **Unsigned Upload Preset**
- ✅ Works with Edge runtime (no server-side signing needed)
- ✅ Compatible with Cloudflare Workers
- ✅ No FormData parsing issues
- ✅ Handles large files (up to 100MB)
- ✅ Built-in progress tracking
- ✅ Camera recording support

### **Security**
- Upload preset restricts uploads to specific folder
- Only videos allowed (no arbitrary file uploads)
- Size limits enforced by Cloudinary
- Public read, but controlled write

---

## 🚀 **Features You Get**

1. **Direct Upload** - Files go straight to Cloudinary (no server bottleneck)
2. **Progress Bar** - Real-time upload progress
3. **Camera Recording** - Record videos directly in browser
4. **Preview** - See video before publishing
5. **Change Video** - Easy to replace before publishing
6. **Mobile Support** - Works on all devices

---

## 📝 **Alternative: Use Existing Preset**

If you already have an upload preset, update the code:

```tsx
// In VideoUpload.tsx, change this line:
uploadPreset="student_hub_stories"

// To your preset name:
uploadPreset="your_preset_name"
```

---

## 🔧 **Troubleshooting**

### **Error: "Upload preset not found"**
- Make sure the preset name matches exactly
- Check that signing mode is **Unsigned**
- Verify you're using the correct Cloudinary cloud name

### **Error: "Upload failed"**
- Check file size (must be under 100MB)
- Verify file format (mp4, mov, avi, webm only)
- Ensure Cloudinary API keys are in `.env.local`

---

## 🎉 **Done!**

Once the preset is created, video uploads will work perfectly with:
- ✅ Edge runtime
- ✅ Cloudflare deployment
- ✅ Large files (up to 100MB)
- ✅ No build errors

**The upload widget handles everything automatically!** 🚀
