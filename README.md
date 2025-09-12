#  Project Setup – Next.js + Supabase + Prisma

##  Prerequisites
- **Node.js**: v18+ (check with `node -v`)  
- **npm** 
- **Supabase account** 

##  1. Go to project folder
```bash
cd <project-folder>
```

##  2. Install Dependencies
```bash
npm install
```

##  3. Environment Variables
Create a `.env` file in the project root.

You will need:
```env
# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
BASE_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"

# Google Gemini
GEMINI_API_KEY="<your-gemini-api-key>"
```

##  4. Supabase Setup
1. Go to [Supabase Dashboard](https://app.supabase.com/).  
2. Create a new project.  
3. Apply migrations to your database:  
   ```bash
   npx prisma migrate deploy
   ```
4. Ensure there is a **Storage Bucket** named:
   ```
   files
   ```

##  5. Run the App Locally
Start the dev server:
```bash
npm run dev
```
The app will be running at:
```
http://localhost:3000
```

##  6. Build for Production
```bash
npm run build
npm start
```
