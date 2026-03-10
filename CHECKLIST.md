# Setup Checklist ✓

Use this checklist to ensure everything is properly configured.

## Initial Setup

- [ ] **Node.js installed** (v18 or higher)
  - Check: `node --version`
  
- [ ] **npm installed** (v9 or higher)
  - Check: `npm --version`
  
- [ ] **Angular CLI installed** (v17 or higher)
  - Check: `ng version`
  - Install: `npm install -g @angular/cli`

- [ ] **Dependencies installed**
  - Run: `npm install`
  - Should complete without errors

## Supabase Setup

- [ ] **Supabase account created**
  - Visit: https://supabase.com
  - Sign up for free account
  
- [ ] **Project created**
  - Click "New Project"
  - Choose organization
  - Select region (closest to you)
  - Set database password (save it!)
  - Wait for project to provision (~2 minutes)

- [ ] **Database schema created**
  - Open Supabase dashboard
  - Navigate to SQL Editor (left sidebar)
  - Click "New Query"
  - Open `supabase-schema.sql` file
  - Copy entire content
  - Paste into SQL Editor
  - Click "Run" or press Ctrl+Enter
  - Should see: "Success. No rows returned"
  - Verify tables created: Go to Table Editor, should see `soldiers` and `recommendations`

- [ ] **Sample data loaded**
  - In Table Editor, click on `soldiers` table
  - Should see 10 rows of soldier data
  - Click on `recommendations` table
  - Should see 11 rows of recommendation data

- [ ] **Credentials obtained**
  - Go to Settings → API (in Supabase)
  - Under "Project URL", click copy button
  - Save this URL
  - Under "Project API keys", copy the `anon` `public` key
  - Save this key

## Application Configuration

- [ ] **Environment file updated**
  - Open `src/environments/environment.ts`
  - Replace `'YOUR_SUPABASE_URL'` with your actual Project URL
  - Replace `'YOUR_SUPABASE_ANON_KEY'` with your actual anon key
  - Save the file
  
  Example:
  ```typescript
  export const environment = {
    production: false,
    supabase: {
      url: 'https://xyzcompany.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  };
  ```

- [ ] **Verify configuration**
  - Check for syntax errors in environment.ts
  - Ensure both URL and Key are properly quoted strings
  - No trailing commas or missing brackets

## Running the Application

- [ ] **Development server started**
  - In terminal, run: `ng serve`
  - Wait for "Build at:" message
  - Should say "Initial chunk files..." with file sizes
  - Server running on http://localhost:4200

- [ ] **Application accessible**
  - Open browser (Chrome, Firefox, Edge)
  - Navigate to: http://localhost:4200
  - Should see home page with "Military Personnel Recommendation System"
  - No console errors (press F12 to check)

- [ ] **Navigation working**
  - Click "Search Soldiers" in navbar
  - Should navigate to search page
  - Click "Recommendations" in navbar
  - Should navigate to recommendations page
  - Click logo or home link
  - Should return to home page

## Testing Functionality

### Search Test
- [ ] **Search by name**
  - Go to Search page
  - Enter: "أحمد" in search box
  - Click Search or press Enter
  - Should see results (at least 1 soldier)
  - Soldier cards should display all information
  
- [ ] **Arabic normalization test**
  - Search for: "احمد" (without hamza)
  - Should return same results as "أحمد"
  - Try: "محمود" and "محمود"
  - Both should work
  
- [ ] **Search by police number**
  - Clear search box
  - Enter: "POL-2024-001"
  - Click Search
  - Should find matching soldier

### View Recommendations Test
- [ ] **Select soldier**
  - On any search result card
  - Click "View Recommendations" button
  - Soldier details should expand
  - Should show "Recommendations" section below
  
- [ ] **Recommendations display**
  - If soldier has recommendations, they appear in table
  - Shows: Target Unit, Recommended By, Recommended To, Date
  - If no recommendations, shows info message

### Add Recommendation Test
- [ ] **Open recommendation form**
  - After selecting a soldier
  - Click "Add Recommendation" button
  - Form should appear with green header
  
- [ ] **Fill form**
  - Target Unit: Enter any text (e.g., "اللواء الثالث")
  - Recommended By: Enter officer name (e.g., "العقيد أحمد")
  - Recommended To: Enter authority (e.g., "اللواء محمد")
  - All fields required
  
- [ ] **Submit recommendation**
  - Click "Submit Recommendation"
  - Should see success alert
  - Form should close
  - New recommendation appears in table below
  - Refresh page - recommendation still there

### All Recommendations Page Test
- [ ] **View all recommendations**
  - Click "Recommendations" in navbar
  - Should see table with all recommendations
  - Includes soldier name and police number
  - Sorted by date (newest first)

## Troubleshooting Common Issues

### ❌ No search results
- [ ] Check Supabase project has data (Table Editor)
- [ ] Verify credentials in environment.ts match exactly
- [ ] Check browser console for errors (F12)
- [ ] Ensure internet connection active
- [ ] Verify RLS policies allow reads (should be open by default)

### ❌ Bootstrap styles not loading
- [ ] Run: `npm install bootstrap`
- [ ] Check `src/styles.css` has Bootstrap import
- [ ] Restart development server: Ctrl+C, then `ng serve`

### ❌ Can't connect to Supabase
- [ ] Verify Project URL is correct (no typos)
- [ ] Verify Anon Key is correct (copy-paste carefully)
- [ ] Check Supabase project status (should be green in dashboard)
- [ ] Ensure project is not paused (free tier pauses after inactivity)

### ❌ Build errors
- [ ] Run: `npm install` to ensure all dependencies present
- [ ] Delete `node_modules` folder and run `npm install` again
- [ ] Check TypeScript errors in terminal output
- [ ] Verify Angular CLI version: `ng version`

### ❌ Arabic text not displaying correctly
- [ ] Ensure browser encoding is UTF-8 (default in modern browsers)
- [ ] Check source files saved with UTF-8 encoding
- [ ] Verify database has Arabic text (check in Supabase Table Editor)

## Performance Checks

- [ ] **Page loads quickly** (< 2 seconds)
- [ ] **Search returns results fast** (< 1 second)
- [ ] **No console errors** (F12 → Console tab)
- [ ] **Responsive on mobile** (resize browser window)
- [ ] **Forms validate properly** (try submitting empty fields)

## Final Verification

- [ ] All navigation links work
- [ ] Search finds soldiers by name and police number
- [ ] Arabic normalization works (ى/ي, ة/ه, أ/ا)
- [ ] Can view soldier recommendations
- [ ] Can add new recommendations
- [ ] New data persists after refresh
- [ ] UI looks good on desktop and mobile
- [ ] No errors in browser console
- [ ] Build completes successfully

## Optional: Production Build

- [ ] **Test production build**
  - Run: `ng build --configuration production`
  - Check `dist/` folder created
  - Files optimized and minified

## Success Criteria

✅ All checkboxes above completed  
✅ Application runs without errors  
✅ Can search and find soldiers  
✅ Can add and view recommendations  
✅ Data persists in Supabase  

---

## 🎉 Congratulations!

If all items are checked, your Military Personnel Recommendation System is fully operational!

**Next Steps:**
1. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete feature list
2. Customize UI colors in `src/styles.css` if desired
3. Add more soldiers via Supabase Table Editor
4. Consider deploying to production when ready

**Need Help?**
- Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed guide
- Review [QUICKSTART.md](QUICKSTART.md) for quick reference
- Examine browser console for error messages
- Verify Supabase dashboard shows active project
