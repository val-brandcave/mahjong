# 🎮 Quick Start Guide - Friends System

## How to Test the Friends Page

### Step 1: Navigate to Friends Page
1. From the **Home** page, click the **friends/users icon** (👥) in the top-right corner
2. You'll be taken to `/friends` showing:
   - Quick action buttons: Search Contacts, Facebook Friends, Invite Friends
   - Search bar for filtering
   - 3 tabs: Friends, Suggestions, Leaderboard

### Step 2: View Default Friends
1. The **Friends** tab should show 2 default friends:
   - **sarahjohn** - Sarah Johnson, Level 12
   - **patriciachen** - Patricia Chen, Level 15
2. Each shows:
   - Avatar emoji (👩‍🦰, 👩‍🦱)
   - Username in bold
   - Country flag (🇺🇸)
   - Full name
   - Level badge
   - View Profile button (👁️)

### Step 3: View Suggestions
1. Click the **Suggestions** tab
2. You'll see 4 suggested friends:
   - **codymiles512** - Cody Miles, Level 400
   - **return_of_n00b** - Return NoOb, Level 254
   - **ahsanmazindrani** - Ahsan M, Level 180 (India 🇮🇳)
   - **Anup1729** - Anup Kumar, Level 400 (India 🇮🇳)
3. Each shows the same info as friends but with a green **+** button to add

### Step 4: Add a Friend
1. In the **Suggestions** tab, click the green **+** button on any suggestion
2. The friend will be added to your friends list
3. Switch to **Friends** tab to see the new friend added
4. The suggestion will disappear from suggestions (smart filtering)
5. **Data persists!** Refresh the page and the friend stays added

### Step 5: Search Functionality
1. Type in the search bar at the top:
   - Try "sarah" - filters friends by name
   - Try "cody" - filters suggestions by name
   - Try "return" - filters suggestions by username
2. Search works on **both tabs** simultaneously
3. Clear the search to see all again

### Step 6: View Profile (Placeholder)
1. Click the **eye icon** (👁️) on any friend
2. Currently logs to console: "View profile: [username]"
3. Future: Will navigate to friend's profile page

---

## 📋 UI Elements Overview

### Header
```
← Friends 🎮
```
- Back button (returns to home)
- Title "Friends"
- Game controller icon (top-right)

### Quick Actions
```
🔍 Search Contacts
ⓕ Facebook Friends
✉️  Invite Friends
```
- 3 action buttons (placeholders for future implementation)

### Search Bar
```
🔍 Search by name or username
```
- Real-time filtering
- Works on both tabs

### Tab Navigation
```
Friends 2 | Suggestions 4 | 🏆 Leaderboard
```
- Shows count of items in each tab
- Underline indicates active tab
- Leaderboard is placeholder

### Friend Card
```
👤 sarahjohn 🇺🇸
Sarah Johnson
Level 12                              👁️
```
- Avatar on left
- Username + country flag
- Full name
- Level badge
- View Profile button on right

### Suggestion Card
```
👤 codymiles512 🇺🇸
Cody Miles
Level 400                             ➕
```
- Same as friend card
- Add Friend button instead of View Profile

---

## 🎨 Testing Interactions

### Test Search Filtering
- [ ] Search "sarah" shows only Sarah Johnson
- [ ] Search "patricia" shows only Patricia Chen
- [ ] Search in Suggestions filters correctly
- [ ] Search case-insensitive ("SARAH" = "sarah")
- [ ] Clear search shows all again

### Test Adding Friends
- [ ] Click + on Cody Miles
- [ ] Switches to Friends tab automatically? (No, stays in Suggestions)
- [ ] Switch to Friends tab manually
- [ ] Cody Miles now in friends list
- [ ] Cody Miles gone from suggestions
- [ ] Refresh page - Cody Miles still in friends

### Test Tab Navigation
- [ ] Friends tab shows count and correct friends
- [ ] Suggestions tab shows count and correct suggestions
- [ ] Can switch between tabs
- [ ] Leaderboard tab clickable (placeholder)
- [ ] Active tab has bottom border highlight

### Test Data Persistence
1. Add 2-3 friends
2. Refresh the page (F5 or Cmd+R)
3. All added friends should still be there
4. View in browser dev tools:
   ```javascript
   JSON.parse(localStorage.getItem('mahjong-friends'))
   ```

### Test Empty States
1. Clear localStorage:
   ```javascript
   localStorage.removeItem('mahjong-friends')
   ```
2. Refresh page
3. Should show: "You haven't added any Friends yet"
4. Reset friends:
   ```javascript
   localStorage.setItem('mahjong-friends', '{"friends":[]}')
   ```

---

## 📊 Data Storage

View your friends data:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('mahjong-friends'))
```

You'll see:
```json
{
  "friends": [
    {
      "id": "friend1",
      "username": "sarahjohn",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "level": 12,
      "avatar": "👩‍🦰",
      "country": "United States"
    },
    // ... more friends
  ]
}
```

Clear friends data:
```javascript
localStorage.removeItem('mahjong-friends')
```

Reset to defaults:
```javascript
localStorage.removeItem('mahjong-friends')
// Refresh page - defaults reload
```

---

## 🐛 Known Behaviors

- ✅ Notifications dot removed from friends icon (as requested)
- ✅ 2 default friends on app start
- ✅ 4 suggestions always available
- ✅ Smart filtering (added friends hidden from suggestions)
- ✅ Real-time search filtering
- ✅ Full persistence to localStorage
- ✅ Smooth animations on all interactions
- ⏳ View Profile button logs to console (TODO: implement)
- ⏳ Search Contacts button is placeholder
- ⏳ Facebook Friends button is placeholder
- ⏳ Invite Friends button is placeholder
- ⏳ Leaderboard tab is placeholder

---

## 🔍 Detailed Feature Testing

### Search by Username
```
Type: "codymiles512"
Expected: Shows codymiles512 in suggestions
Result: ✅
```

### Search by First Name
```
Type: "Patricia"
Expected: Shows Patricia Chen in suggestions
Result: ✅
```

### Search by Last Name
```
Type: "Johnson"
Expected: Shows Sarah Johnson in friends
Result: ✅
```

### Add Friend & Re-filter
```
1. Type "cody" in search
2. See codymiles512 in suggestions
3. Click + to add
4. Type "cody" again
5. codymiles512 should NOT appear
Result: ✅
```

### Level Display
```
Each friend/suggestion shows level with icon
Friends: 12-15 range
Suggestions: 180-400 range
Result: ✅
```

---

## 📱 Mobile Testing

- [ ] Page loads on mobile (375px viewport)
- [ ] Search bar is usable
- [ ] Buttons are tappable (44px minimum)
- [ ] Cards stack properly
- [ ] No horizontal scrolling
- [ ] Animations smooth on mobile
- [ ] Back button works
- [ ] Tabs scrollable if needed

---

## 🎯 All Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/friends` | Friends | View friends & suggestions |

---

## 🔗 Navigation Map

```
Home (/home)
  └─ Top-right icon (👥) → /friends
      ├─ Back button → Home
      ├─ Tabs:
      │  ├─ Friends (with "View Profile" CTA)
      │  ├─ Suggestions (with "Add Friend" CTA)
      │  └─ Leaderboard (placeholder)
      └─ Search (filters both tabs)
```

---

## ✨ Tips & Tricks

1. **Test Search Across Tabs**
   - Type "sarah" while in Suggestions tab
   - Should show empty state
   - Switch to Friends tab - shows Sarah Johnson
   - Proves search works across tabs

2. **Test Persistence**
   - Add several friends
   - Open DevTools (F12)
   - Go to Application → LocalStorage → mahjong-friends
   - See your added friends in JSON

3. **Test Smart Filtering**
   - Add "Cody Miles" as friend
   - Go to Suggestions tab
   - Cody Miles should be gone
   - Other suggestions still there

4. **Test Animations**
   - Watch friend cards slide in from left
   - Buttons have smooth hover states
   - Tab switches smoothly

---

## 🆘 Troubleshooting

**Problem:** Friends page doesn't load  
**Solution:** Clear localStorage and refresh

**Problem:** Friends not persisting  
**Solution:** Check if localStorage enabled in browser

**Problem:** Can't add friend  
**Solution:** Make sure you're clicking the green + button

**Problem:** Search not working  
**Solution:** Try typing slowly, check for typos

**Problem:** Suggestions empty  
**Solution:** Might have added all suggestions - remove some friends

---

## 📝 Console Logging

When you interact with the page, watch the console:
```javascript
// View Profile button logs:
"View profile: sarahjohn"

// Add Friend creates new friend object and updates store
```

---

**Ready to test! 🚀**

For detailed documentation, see `FRIENDS-FEATURE.md`
