# Deployment Guide for Switch Words Hub

Currently, this application is set up as a lightweight prototype using CDN imports. To deploy it to production platforms like Vercel or Google Cloud Run, we must first "standardize" it into a buildable Node.js application using **Vite**.

## Phase 1: Preparation (Required for both platforms)

Before deploying, create the following configuration files in your project root directory.

### 1. Create `package.json`
This defines your dependencies and build commands.

```json
{
  "name": "switch-words-hub",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^0.1.1",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.5"
  }
}
```

### 2. Create `vite.config.ts`
This configures the build tool and ensures your API Key works correctly.

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the existing code structure
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
```

### 3. Create `tsconfig.json`
To handle TypeScript compilation.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

### 4. Create `postcss.config.js` and `tailwind.config.js`
Since we are moving to a build step, we should handle Tailwind locally instead of via CDN for better performance.

**postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**tailwind.config.js**
(Copy the config object from your `index.html` script tag into here)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: '#8ecae6',
          primary: '#219ebc',
          dark: '#023047',
          yellow: '#ffb703',
          orange: '#fb8500',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
```

### 5. Update `index.html`
Remove the CDN scripts (`importmap` and `tailwindcss` script) and ensure the entry point is clean.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Switch Words Hub</title>
    <!-- Fonts remain via CDN -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

---

## Deployment Option 1: GitHub via Vercel (Recommended)

This is the easiest and fastest method.

1.  **Push Code to GitHub**:
    *   Initialize a git repo: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "Initial commit"`
    *   Push to a new repository on GitHub.

2.  **Connect to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your GitHub repository.

3.  **Configure Project**:
    *   **Framework Preset**: Vercel should auto-detect "Vite". If not, select it.
    *   **Root Directory**: `./`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`

4.  **Environment Variables (Crucial)**:
    *   Expand the **"Environment Variables"** section.
    *   Key: `API_KEY`
    *   Value: `[Your actual Google Gemini API Key]`
    *   Click **Add**.

5.  **Deploy**:
    *   Click **Deploy**. Vercel will build your site and provide a URL (e.g., `https://switch-words-hub.vercel.app`).

---

## Deployment Option 2: Google Cloud Run

Cloud Run is ideal if you want a containerized, scalable solution.

### 1. Create `Dockerfile`
Create a file named `Dockerfile` (no extension) in the root:

```dockerfile
# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm install
COPY . .
# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Add custom nginx config to handle React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create `nginx.conf`
Create this file to ensure refreshing pages works (handling Single Page App routing):

```nginx
server {
    listen 80;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Build and Deploy
You need the Google Cloud CLI (`gcloud`) installed.

1.  **Authenticate**:
    ```bash
    gcloud auth login
    gcloud config set project [YOUR_PROJECT_ID]
    ```

2.  **Build the Container**:
    ```bash
    gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/switch-words-app
    ```

3.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy switch-words-service \
      --image gcr.io/[YOUR_PROJECT_ID]/switch-words-app \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars API_KEY=[YOUR_GEMINI_API_KEY]
    ```

4.  **Result**:
    The console will output a `Service URL` (e.g., `https://switch-words-service-xyz.a.run.app`).
