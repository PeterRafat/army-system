# Military Personnel Recommendation Management System

A modern web application for managing military personnel recommendations, built with **Angular 17** (standalone components) and **Supabase** as the backend database. This system replaces Excel filtering for searching soldiers and storing recommendations.

## 🎯 Features

### Search Capabilities
- **Partial name matching** - Search by soldier name (supports Arabic text)
- **Police number search** - Quick lookup by police number
- **Arabic normalization** - Automatically handles Arabic character variations:
  - ى → ي
  - ة → ه  
  - أ / إ / آ → ا

### Soldier Information Display
- Serial Number
- Name
- Police Number
- Governorate
- Qualification
- Current Unit
- Batch
- Assigned Date

### Recommendation Management
- Add new recommendations for soldiers
- View complete recommendation history
- Track recommendations by date
- Full audit trail

## 📁 Project Structure

```
army-system/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── soldier-card/
│   │   │   └── recommendation-list/
│   │   ├── models/
│   │   │   └── soldier.model.ts
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── search/
│   │   │   └── recommendations/
│   │   ├── services/
│   │   │   └── supabase.service.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.css
│   └── index.html
├── supabase-schema.sql
├── package.json
└── angular.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)
- A Supabase account (free tier available at https://supabase.com)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Angular 17 framework
- Bootstrap for styling
- Supabase JavaScript client

### Step 2: Set Up Supabase Database

1. **Create a new Supabase project:**
   - Go to https://supabase.com
   - Sign up or log in
   - Create a new project
   - Choose your region and database password

2. **Run the SQL schema:**
   - In your Supabase dashboard, go to **SQL Editor**
   - Click **New Query**
   - Copy and paste the entire content of `supabase-schema.sql`
   - Click **Run** to execute the script
   
   This will create:
   - `soldiers` table with sample data
   - `recommendations` table with sample data
   - Indexes for optimized search
   - Row Level Security policies

3. **Get your Supabase credentials:**
   - Go to **Settings** → **API**
   - Copy your **Project URL**
   - Copy your **anon/public key**

### Step 3: Configure Supabase Connection

Open `src/app/services/supabase.service.ts` and update the credentials:

```typescript
constructor() {
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Paste your Project URL
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Paste your anon/public key
  this.supabase = createClient(supabaseUrl, supabaseAnonKey);
}
```

Example:
```typescript
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 4: Run the Application

```bash
ng serve
```

The application will start on `http://localhost:4200`

## 🎨 Usage Guide

### Home Page
- Navigate to `http://localhost:4200`
- Overview of system features
- Quick access to Search and Recommendations

### Search Soldiers
1. Go to **Search Soldiers** page
2. Enter a soldier's name (partial match supported) or police number
3. Click **Search** or press Enter
4. Results appear in card format
5. Click **View Recommendations** on any soldier card
6. View soldier details and complete recommendation history
7. Click **Add Recommendation** to add a new recommendation

### Add Recommendation
1. After selecting a soldier, click **Add Recommendation**
2. Fill in the form:
   - **Target Unit**: The unit being recommended to
   - **Recommended By**: Officer making the recommendation
   - **Recommended To**: Higher authority receiving the recommendation
3. Click **Submit Recommendation**
4. Success message appears and recommendation is saved

### View All Recommendations
1. Go to **Recommendations** page
2. See all recommendations in a table format
3. Includes soldier name, police number, and recommendation details

## 🔧 Technical Details

### Arabic Normalization
The search function automatically normalizes Arabic text to handle spelling variations:

```typescript
normalizeArabic(text: string): string {
  return text
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[أإآ]/g, 'ا');
}
```

This ensures searches work regardless of which Arabic character variant is used.

### Database Schema

**soldiers table:**
- `id` (UUID) - Primary key
- `serial_number` - Unique serial identifier
- `name` - Soldier's full name (Arabic)
- `normalized_name` - Name with Arabic normalization applied
- `police_number` - Police ID number
- `governorate` - Home governorate
- `qualification` - Educational qualification
- `current_unit` - Current military unit
- `batch` - Training batch/year
- `assigned_date` - Date of assignment
- `created_at` - Timestamp

**recommendations table:**
- `id` (UUID) - Primary key
- `soldier_id` (UUID) - Foreign key to soldiers
- `recommended_to` - Recipient of recommendation
- `recommended_by` - Officer making recommendation
- `target_unit` - Target unit for assignment
- `created_at` - Timestamp

### Async/Await Pattern
All database operations use async/await for clean, readable code:

```typescript
async searchSoldiers(query: string): Promise<Soldier[]> {
  const normalizedQuery = this.normalizeArabic(query.toLowerCase());
  const { data, error } = await this.supabase
    .from('soldiers')
    .select('*')
    .or(`normalized_name.ilike.%${normalizedQuery}%,police_number.ilike.%${query}%`);
  return data || [];
}
```

## 📦 Build for Production

```bash
ng build --configuration production
```

Production files will be in the `dist/` folder.

## 🔄 Data Management

### Adding New Soldiers

You can add soldiers via Supabase dashboard or programmatically:

```typescript
const newSoldier = {
  serial_number: 'SN011',
  name: 'جندي تجريبي',
  normalized_name: 'جندي تجريبي',
  police_number: 'POL-2024-011',
  governorate: 'القاهرة',
  qualification: 'بكالوريوس',
  current_unit: 'وحدة اختبار',
  batch: 'دفعة 2024',
  assigned_date: '2024-01-01'
};

await supabase.from('soldiers').insert([newSoldier]);
```

### Exporting Data

Use Supabase's built-in CSV export feature:
1. Go to **Table Editor**
2. Select the table (soldiers or recommendations)
3. Click the three dots menu
4. Select **Export to CSV**

## 🛡️ Security Notes

**Important:** The current setup uses open RLS policies for development ease. For production:

1. Implement proper authentication (Supabase Auth)
2. Update RLS policies to restrict access based on user roles
3. Use environment variables for sensitive data
4. Enable HTTPS in production

## 🐛 Troubleshooting

### No results in search
- Verify Supabase credentials are correct
- Check if tables have data in Supabase dashboard
- Ensure RLS policies allow read access
- Check browser console for errors

### Bootstrap styles not loading
- Verify bootstrap is installed: `npm list bootstrap`
- Check that `@import "bootstrap/dist/css/bootstrap.min.css";` is in `styles.css`
- Restart the development server

### Supabase connection errors
- Verify your internet connection
- Check Supabase project status
- Ensure API keys are correct
- Check Supabase service quota

## 📝 Sample Test Queries

Try these Arabic search queries:

- "أحمد" or "احمد" (both should work due to normalization)
- "محمد" 
- "POL-2024-001" (police number)
- "القاهرة" (governorate)

## 🎓 Learning Resources

- [Angular 17 Documentation](https://angular.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Arabic Text Processing Best Practices](https://www.arabeyes.org/)

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase dashboard logs
3. Check browser console for errors
4. Verify all configuration settings

---

**Built with ❤️ using Angular 17 and Supabase**
