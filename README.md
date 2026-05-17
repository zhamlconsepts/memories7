# Jamshid Memories

Jamshid bilan yorqin xotirangizni qoldiring — xotiralar devori.

## Vercel-ga deploy qilish (qadamlar)

### 1. Neon bepul database oling
1. [neon.tech](https://neon.tech) ga boring
2. Ro'yxatdan o'ting (GitHub bilan kirish mumkin)
3. Yangi project yarating
4. Dashboard-dan **Connection string** ni nusxalab oling (postgresql://... ko'rinishida)

### 2. GitHub-ga yuklang
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/jamshid-memories.git
git push -u origin main
```

### 3. Vercel-ga ulang
1. [vercel.com](https://vercel.com) ga boring
2. "New Project" > GitHub reponi tanlang
3. **Environment Variables** bo'limiga boring:
   - `DATABASE_URL` = Neon-dan olgan connection string
4. "Deploy" tugmasini bosing

### 4. Ma'lumotlar bazasini sozlang
Birinchi marta deploy bo'lgandan so'ng, Vercel-dagi loyihangizga kiring va quyidagi buyruqni ishga tushiring (yoki Neon dashboard-dagi SQL editor orqali):

```sql
CREATE TABLE IF NOT EXISTS memories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  image_data TEXT,
  edit_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

> **Eslatma:** Jadval avtomatik ham yaratiladi — birinchi so'rov kelganda `api/memories.ts` uni o'zi yaratadi.

## Mahalliy ishga tushirish (local)

```bash
npm install
cp .env.example .env.local
# .env.local fayliga DATABASE_URL ni qo'shing

npm run dev
```

## Texnologiyalar

- **Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Vercel Serverless Functions
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Auth:** Token-based (localStorage) — faqat o'z xotirangizni tahrirlash/o'chirish
