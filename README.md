# HealthScore - AI-Powered Food Analysis 🥗

An intelligent food analysis application that uses Google Gemini AI to analyze food photos and provide instant nutritional information with a comprehensive health score.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)

## ✨ Features

- **🤖 AI-Powered Analysis**: Upload food photos and get instant nutritional breakdown using Google Gemini AI
- **📊 Health Score**: Each meal receives a 0-100 health score based on nutritional value
- **🍎 Detailed Nutrition**: View calories, protein, carbs, fats, fiber, sugar, and sodium
- **📝 Ingredient Detection**: AI identifies ingredients in your meals
- **📈 Meal History**: Track all your analyzed meals over time
- **📉 Dashboard Analytics**: View trends and statistics with beautiful charts
- **🎨 Modern UI**: Beautiful, responsive design using shadcn/ui components
- **🌙 Dark Mode Ready**: Supports system theme preferences

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (free tier available)
- A Supabase project

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd /path/to/project
   pnpm install
   ```

2. **Set up your environment variables:**
   
   Create a `.env` file in the project root:
   ```env
   # Connect to Supabase via connection pooling with Supavisor
   DATABASE_URL="postgres://postgres.[your-project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

   # Direct connection to the database (required for migrations)
   DIRECT_URL="postgres://postgres.[your-project-ref]:[password]@aws-0-[region].supabase.co:5432/postgres"

   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

3. **Get your Gemini API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and paste it in your `.env` file

4. **Set up the database:**
   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/   # Food image analysis endpoint
│   │   │   └── meals/     # Meal CRUD and stats endpoints
│   │   ├── dashboard/     # Analytics dashboard page
│   │   ├── history/       # Meal history page
│   │   └── page.tsx       # Home page with upload
│   ├── components/
│   │   └── ui/            # shadcn/ui components
│   └── lib/
│       ├── gemini.ts      # Google Gemini AI integration
│       ├── health-score.ts # Health scoring utilities
│       └── prisma.ts      # Database client
└── public/
    └── uploads/           # Uploaded food images
```

## 🎯 How It Works

1. **Upload a Photo**: Drag and drop or click to upload a food image
2. **AI Analysis**: Google Gemini Vision analyzes the image
3. **Get Results**: Receive detailed nutritional information including:
   - Dish name and ingredients
   - Calories, protein, carbs, and fats
   - Health score (0-100) with explanation
4. **Track Progress**: View your meal history and nutrition trends

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Upload and analyze a food image |
| `/api/meals` | GET | Fetch meal history with pagination |
| `/api/meals` | DELETE | Delete a meal by ID |
| `/api/meals/stats` | GET | Get aggregated statistics |

## 📊 Health Score Guidelines

| Score | Rating | Description |
|-------|--------|-------------|
| 90-100 | Excellent | Very healthy, nutrient-dense, minimal processing |
| 70-89 | Good | Healthy with minor concerns |
| 50-69 | Moderate | Some healthy aspects but also concerns |
| 30-49 | Below Average | Multiple nutritional concerns |
| 0-29 | Poor | Highly processed, high sugar/sodium |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase) with Prisma ORM 7
- **AI**: Google Gemini 1.5 Flash
- **UI**: shadcn/ui + Tailwind CSS v4
- **Charts**: Recharts

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Supabase connection pool URL | Yes |
| `DIRECT_URL` | Supabase direct connection URL | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and Google Gemini AI
