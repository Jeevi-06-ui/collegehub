# CollegeHub

CollegeHub is a production-ready MVP for college discovery and decision-making. It uses a Next.js 15 frontend, an Express.js API, MongoDB Atlas with Mongoose, JWT authentication through secure HTTP-only cookies, React Query, Zod validation, Tailwind CSS, and shadcn-style reusable UI components.

## Folder Structure

```txt
collegehub/
  backend/
    src/
      config/          MongoDB and environment setup
      controllers/     Route business logic
      middleware/      Auth, validation, and error handling
      models/          Mongoose models
      routes/          REST API route modules
      scripts/         Database seed script
      utils/           JWT, async, and error helpers
      validators/      Zod request schemas
  frontend/
    src/
      app/             Next.js App Router pages
      components/      Layout, college, compare, provider, and UI components
      hooks/           React Query and utility hooks
      lib/             API client, types, formatting, utilities
```

## Major Steps Created

1. Folder structure: split frontend/backend workspace with root scripts.
2. Backend setup: Express server, CORS, cookies, Helmet, MongoDB connection.
3. Database models: `User` and `College` with saved colleges and saved comparisons.
4. APIs: auth, profile, colleges, search, compare, save college, save comparison.
5. Frontend pages: Home, Colleges, College Details, Compare, Login, Signup, Saved.
6. Components: navbar, footer, filter sidebar, cards, skeletons, empty/error states, comparison table.
7. Authentication: JWT cookie login/signup/logout/profile and protected saved page.
8. Compare feature: add/remove 2-3 colleges, API comparison table, save comparison.
9. Saved items: saved college cards and saved comparison history.
10. Polish: responsive Tailwind UI, shadcn-style primitives, toasts, Zod forms.

## Local Setup

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run seed
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000/api`

Demo user after seeding:

```txt
demo@collegehub.dev
Password123
```

## Environment Variables

Backend `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/collegehub?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Frontend `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Routes

Auth:

```txt
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

Colleges:

```txt
GET /api/colleges
GET /api/colleges/:id
GET /api/colleges/search?q=bangalore
```

Compare and save:

```txt
POST /api/compare
POST /api/save/college
POST /api/save/comparison
```

`GET /api/colleges` supports `search`, `location`, `minFees`, `maxFees`, `rating`, `course`, `sortBy`, `sortOrder`, `page`, and `limit`.

## Scripts

```bash
npm run dev          # frontend + backend
npm run seed         # seed 50 colleges and demo user
npm run build        # build frontend
npm run typecheck    # TypeScript check frontend
npm run start        # start both apps
```

## MongoDB Atlas Setup

1. Create an Atlas project and free/shared cluster.
2. Create a database user with read/write permissions.
3. Add your IP address to Network Access, or use `0.0.0.0/0` for quick testing.
4. Copy the Node.js connection string.
5. Put it in `backend/.env` as `MONGODB_URI`.
6. Run `npm run seed`.

Deployment details are in [DEPLOYMENT.md](./DEPLOYMENT.md).
