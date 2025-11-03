# 🚀 Quick Start Guide - Profile System

## How to Test the Profile System

### Step 1: Navigate to Profile
1. From the **Home** page, click the **avatar icon** in the top-left corner
2. You'll be taken to `/profile` showing:
   - Your username (from onboarding)
   - Your status (if set)
   - Your flair emoji (if selected)
   - Level card (default: 8)
   - Streak card (default: 12 days)
   - Stats: Lessons, Challenges, Achievements

### Step 2: Access Edit Menu
1. Click the **three dots menu** (⋯) in the top-right corner of the profile page
2. You'll see two options:
   - **Edit** - Opens the edit profile form
   - **Share Profile** - Placeholder (TODO: implement)

### Step 3: Edit Your Profile
Click **Edit** to go to `/profile/edit` where you can:

#### Profile Picture
- Click the avatar to open file picker
- Select a photo from gallery or take a picture
- (File selection logged to console; backend integration TODO)

#### Flair
- Click "Add or remove flair" button
- You'll see 5 categories of flair items:
  - **Remove Flair** - Clear your flair
  - **Membership** - 💎 Diamond badges (all unlocked)
  - **Crowns & Royalty** - 👑 Crowns and ⭐ stars (last 2 locked)
  - **Emojis** - 😊 General use emojis (all unlocked)
  - **Holidays & Seasons** - 🎄 Holiday emojis (all unlocked)
- Select any unlocked item
- See live preview next to your username
- Click "Save Flair" to save

#### Status
- Text input field (max 50 chars)
- Shows character count
- Will display under your username on profile

#### Personal Info
- **First Name** - Your first name
- **Last Name** - Your last name
- **Username** - Read-only (set during onboarding)
- **Location** - City or region
- **Country** - Dropdown with 12 countries

#### Language
- Click "Language" to go to `/profile/edit/language`
- Toggle switches:
  - "Display content in English when not available in my language" (default: ON)
  - "Force English" (default: OFF)
- "Select Language" button (TODO: implement language picker)
- Click back to return to edit form

#### Save
- Click "Save Changes" button at bottom
- All data persists to localStorage
- You're redirected back to profile

### Step 4: Verify Persistence
1. On the profile page, set your status: "Testing the new profile!"
2. Add flair: Select the 😊 emoji
3. Go to home, refresh the page
4. Return to profile (click avatar)
5. **Your status and flair should still be there!**

---

## 🗺️ All Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/profile` | Main Profile | View your profile |
| `/profile/edit` | Edit Profile | Edit all profile info |
| `/profile/edit/flair` | Flair Selector | Choose flair emoji |
| `/profile/edit/language` | Language Settings | Language preferences |

---

## 🎨 UI Features to Test

### Profile Page
- [ ] Avatar icon in top-left navigates to profile
- [ ] Three-dot menu opens/closes
- [ ] Edit option navigates to edit page
- [ ] Share Profile placeholder works
- [ ] Back button returns to home
- [ ] Level and streak cards display correctly
- [ ] Status appears under username when set
- [ ] Flair emoji displays next to username

### Edit Profile Page
- [ ] Avatar click opens file picker
- [ ] File picker selection works
- [ ] Flair button navigates to flair page
- [ ] Status input accepts text (max 50 chars)
- [ ] Username displays as read-only
- [ ] First/Last Name inputs work
- [ ] Country dropdown opens and selects
- [ ] Location input accepts text
- [ ] Language button navigates to language page
- [ ] Save button persists data and returns to profile

### Flair Page
- [ ] All 5 categories visible
- [ ] Can select any unlocked item
- [ ] Preview shows selected flair next to username
- [ ] Locked items show lock icon
- [ ] Checkmark appears on selected item
- [ ] Remove Flair (✕) clears selection
- [ ] Save Flair button saves and returns

### Language Page
- [ ] Both toggle switches visible
- [ ] Toggles animate smoothly
- [ ] "Select Language" button clickable
- [ ] Back button returns to edit page
- [ ] Helper text visible at bottom

---

## 💾 Data Storage

All data is stored in browser localStorage:

**View your profile data:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('mahjong-user-profile'))
```

You'll see:
```json
{
  "firstName": "",
  "lastName": "",
  "status": "",
  "location": "",
  "country": "United States",
  "flair": "",
  "language": "English",
  "level": 8,
  "streak": 12
}
```

**Clear profile data:**
```javascript
localStorage.removeItem('mahjong-user-profile')
```

---

## 🐛 Known Limitations (By Design)

- Avatar upload: File selected but not uploaded (backend integration needed)
- Profile pictures: Using emoji avatar (real image upload TODO)
- Language picker: "Select Language" button doesn't open selector yet
- Share profile: Menu option is placeholder

---

## ✨ Tips & Tricks

1. **Test with different flairs:**
   - Try different emoji categories
   - See how they display on profile
   - Remove and re-add

2. **Test persistence:**
   - Set profile data
   - Close browser tab
   - Reopen app
   - Data should still be there

3. **Test navigation:**
   - Use back buttons throughout
   - Try deep linking directly to `/profile/edit/flair`
   - Verify all routes work

4. **Test responsiveness:**
   - Resize browser window
   - Test on mobile device
   - Check mobile viewport (375px)

---

## 📸 What It Looks Like

### Profile Page
```
Profile
├─ Avatar (👤)
├─ Username "yuehjwjejenehej"
├─ Status (if set)
├─ Flair emoji (if selected)
├─ Level Card: 8
├─ Streak Card: 12 Days
├─ Stats Grid: Lessons/Challenges/Achievements
└─ Menu: Edit & Share
```

### Edit Profile
```
Edit Profile
├─ Profile Picture (Avatar with camera overlay)
├─ Flair (Button → /profile/edit/flair)
├─ Status (Input field, max 50 chars)
├─ Username (Read-only)
├─ First Name (Input field)
├─ Last Name (Input field)
├─ Country (Dropdown selector)
├─ Location (Input field)
├─ Language (Button → /profile/edit/language)
└─ Save Changes Button
```

### Flair Selector
```
Select Flair
├─ Preview Section
├─ Remove Flair (✕)
├─ Membership (6 items)
├─ Crowns & Royalty (6 items, 2 locked)
├─ Emojis (6 items)
├─ Holidays & Seasons (6 items)
└─ Save Flair Button
```

### Language Settings
```
Language
├─ Toggle: "Display content in English..."
├─ Toggle: "Force English"
├─ Select Language Button
└─ Helper Text
```

---

## 🆘 Troubleshooting

**Problem:** Profile doesn't load  
**Solution:** Clear localStorage and refresh

**Problem:** Data not persisting  
**Solution:** Check if localStorage is enabled in browser settings

**Problem:** Flair not showing  
**Solution:** Make sure to click "Save Flair" on the flair page

**Problem:** Can't navigate between pages  
**Solution:** Make sure all files are in correct location:
- `/app/profile/page.tsx`
- `/app/profile/edit/page.tsx`
- `/app/profile/edit/flair/page.tsx`
- `/app/profile/edit/language/page.tsx`

---

## 📝 Next: Advanced Testing

After basic functionality works, test:
- [ ] Avatar upload with backend integration
- [ ] Language selection functionality
- [ ] Share profile implementation
- [ ] Flair locking based on achievements
- [ ] Profile validation (unique username, etc.)
- [ ] API integration for profile sync

---

**Happy Testing! 🎉**

For detailed documentation, see `PROFILE-FEATURE.md`
