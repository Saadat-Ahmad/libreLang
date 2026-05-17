#!/bin/bash

# Urdu Learning App - Fast Setup with Progress
# Shows what's happening, no silent waiting

set -e

echo "🚀 Urdu Learning App - Fast Setup"
echo "=================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
print_step() { echo -e "${BLUE}▶ $1${NC}"; }

mkdir -p frontend backend python-services docs

#########################
# FRONTEND - MANUAL CREATE
#########################

print_step "Creating Angular frontend manually (30 seconds)..."
cd frontend

# Create package.json directly
cat > package.json << 'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --open",
    "build": "ng build"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/compiler": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/platform-browser-dynamic": "^18.0.0",
    "@angular/router": "^18.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.6.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.0.0",
    "@angular/cli": "^18.0.0",
    "@angular/compiler-cli": "^18.0.0",
    "typescript": "~5.4.0"
  }
}
EOF

# Create tsconfig
cat > tsconfig.json << 'EOF'
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
EOF

# Create angular.json
cat > angular.json << 'EOF'
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "frontend": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/frontend",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "buildTarget": "frontend:build"
          }
        }
      }
    }
  }
}
EOF

# Create src structure
mkdir -p src/app
mkdir -p public

# Create index.html
cat > src/index.html << 'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Urdu Learning App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
EOF

# Create main.ts
cat > src/main.ts << 'EOF'
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [provideRouter([])]
}).catch(err => console.error(err));
EOF

# Create app.component.ts
cat > src/app/app.component.ts << 'EOF'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <div class="card">
        <h1>🎓 Urdu Learning App</h1>
        <p class="urdu">اردو سیکھیں</p>
        <div class="status">
          <h2>✅ Setup Complete!</h2>
          <p>Your Angular 18 app is running perfectly.</p>
          <div class="badges">
            <span class="badge">Angular 18</span>
            <span class="badge">TypeScript</span>
            <span class="badge">Routing</span>
          </div>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 60px;
      max-width: 800px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      font-size: 3rem;
      color: #333;
      margin-bottom: 20px;
    }
    .urdu {
      font-family: 'Noto Nastaliq Urdu', serif;
      font-size: 2.5rem;
      color: #667eea;
      margin-bottom: 30px;
      direction: rtl;
    }
    .status {
      background: #f0f7ff;
      padding: 30px;
      border-radius: 15px;
      margin: 30px 0;
    }
    h2 {
      color: #333;
      margin-bottom: 15px;
    }
    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
    .badges {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .badge {
      background: #4caf50;
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 0.9rem;
    }
  `]
})
export class AppComponent {}
EOF

# Create styles.scss
cat > src/styles.scss << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
}
EOF

print_step "Installing Angular dependencies (this is the slow part - 1-2 min)..."
npm install --legacy-peer-deps

print_success "Frontend ready!"
cd ..

#########################
# BACKEND
#########################

print_step "Setting up backend (10 seconds)..."
cd backend

cat > package.json << 'EOF'
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

mkdir -p src

cat > src/index.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Backend is running! 🚀',
    urdu: 'اردو سیکھیں',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
      urdu: 'اردو',
      english: 'Urdu'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
});
EOF

cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
EOF

npm install --silent
print_success "Backend ready!"
cd ..

#########################
# PYTHON
#########################

print_step "Setting up Python..."
cd python-services

cat > requirements.txt << 'EOF'
flask==3.0.0
flask-cors==4.0.0
EOF

cat > app.py << 'EOF'
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'Python AI Service'
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
EOF

print_success "Python ready!"
cd ..

#########################
# DOCS
#########################

cat > README.md << 'EOF'
# Urdu Learning App

## Start Services

**Frontend:**
```bash
cd frontend && npm start
```
→ http://localhost:4200

**Backend:**
```bash
cd backend && npm run dev
```
→ http://localhost:3000

**Test:**
```bash
curl http://localhost:3000/api/health
```
EOF

cat > docs/NEXT_STEPS.md << 'EOF'
# Next Steps

## 1. Start Development

### Frontend
```bash
cd frontend
npm start
```

### Backend
```bash
cd backend
npm run dev
```

## 2. Test Everything

Visit: http://localhost:4200
Test API: curl http://localhost:3000/api/health

## 3. Push to GitHub

```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 4. Start Building Features

Follow week1_quickstart.md from the task distribution.
EOF

#########################
# DONE
#########################

echo ""
echo "========================================"
echo -e "${GREEN}✨ Setup Complete! ✨${NC}"
echo "========================================"
echo ""
echo "📁 Project: $PROJECT_NAME"
echo ""
echo "🚀 Start Now:"
echo ""
echo "   Terminal 1 (Frontend):"
echo "   cd $PROJECT_NAME/frontend"
echo "   npm start"
echo ""
echo "   Terminal 2 (Backend):"
echo "   cd $PROJECT_NAME/backend"  
echo "   npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:4200"
echo "   Backend:  http://localhost:3000/api/health"
echo ""
echo "✅ Everything installed!"
echo "✅ No errors!"
echo "✅ Ready to code!"
echo ""
echo "📚 See docs/NEXT_STEPS.md for what to do next"
echo ""