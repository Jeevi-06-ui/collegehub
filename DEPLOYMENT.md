# CollegeHub Deployment Guide

## Render Backend

1. Push this repo to GitHub.
2. Create a new Render Web Service.
3. Select the repo and set the root directory to `backend`.
4. Use these commands:

```bash
npm install
npm run start
```

5. Add environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/collegehub?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
```

6. Deploy. Your API base URL will look like:

```txt
https://your-render-service.onrender.com/api
```

7. Run the seed script from Render Shell, or locally with the production MongoDB URI:

```bash
npm run seed --workspace backend
```

## Vercel Frontend

1. Create a new Vercel project from the same GitHub repo.
2. Set the root directory to `frontend`.
3. Add this environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
```

4. Build command:

```bash
npm run build
```

5. Output is handled by Next.js automatically.
6. Deploy.

## Production Cookie Notes

The API stores JWTs in an HTTP-only cookie. In production the cookie uses:

```txt
secure: true
sameSite: none
```

That means both frontend and backend must use HTTPS. Render and Vercel both provide HTTPS URLs by default.

## MongoDB Atlas Checklist

1. Create cluster.
2. Create database user.
3. Add Render outbound access. For MVP deployments, `0.0.0.0/0` is the quickest option.
4. Use the Atlas connection string in Render.
5. Seed the database once.

## Health Check

Use this endpoint after deployment:

```txt
GET https://your-render-service.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "CollegeHub API is healthy"
}
```
