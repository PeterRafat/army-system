# Quick Start Guide

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Account
1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project
4. Choose your region

### 3. Set Up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire content from `supabase-schema.sql`
4. Click **Run** ✓

### 4. Get Credentials
1. Go to **Settings** → **API** in Supabase
2. Copy **Project URL**
3. Copy **anon/public key**

### 5. Configure App
Open `src/app/services/supabase.service.ts`:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Paste here
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Paste here
```

### 6. Run Application
```bash
ng serve
```

Visit http://localhost:4200 🎉

---

## Test It Out

### Search Test
1. Go to Search page
2. Try searching: "أحمد" or "محمد"
3. Or search by police number: "POL-2024-001"

### Add Recommendation Test
1. Click "View Recommendations" on any soldier
2. Click "Add Recommendation"
3. Fill in the form
4. Submit

---

## Troubleshooting

**No search results?**
- Check if you ran the SQL script in Supabase
- Verify credentials in `supabase.service.ts`

**Styles broken?**
- Make sure Bootstrap is installed: `npm install bootstrap`

**Can't start app?**
- Run: `npm install`
- Then: `ng serve`

---

## Next Steps

1. Add more soldiers via Supabase Table Editor
2. Customize the UI colors in `styles.css`
3. Deploy to production when ready

**Enjoy your new system!** 🚀
