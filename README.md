# ProLance Lite

A smart personal task + freelance work manager for freelancers. Manage projects, track income, and boost productivity.

## Features

- **Task Management**: Create, edit, and track freelance projects with intelligent priority scoring
- **Income Tracking**: Monitor earnings, payments, and financial performance
- **Client Management**: Keep track of client relationships and payment behaviors
- **Built-in Timer**: Track time spent on tasks and calculate hourly rates
- **Focus Mode**: Distraction-free environment for concentrated work
- **Smart Planning**: AI-powered daily planner for optimal task ordering
- **Statistics**: Visual charts and reports for performance analysis

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── layout.tsx          # Root layout with navbar and footer
├── page.tsx            # Landing page
├── login/              # Authentication
├── register/
├── tasks/              # Task management
├── add/                # Add new tasks
├── clients/            # Client management
├── focus/[id]/         # Focus mode
└── stats/              # Statistics and charts

components/
├── Navbar.tsx          # Top navigation
├── Footer.tsx          # Footer
├── TaskCard.tsx        # Task display card
├── ClientCard.tsx      # Client display card
├── Timer.tsx           # Work timer
├── Planner.tsx         # Daily planner
├── Charts.tsx          # Statistics charts
└── ThemeToggle.tsx     # Dark/light mode toggle

lib/
├── auth.ts             # Authentication utilities
├── storage.ts          # Local storage helpers
├── calculations.ts     # Business logic calculations
└── mockData.ts         # Sample data

services/
├── taskService.ts      # Task CRUD operations
└── clientService.ts    # Client CRUD operations

types/
├── task.ts             # Task and template types
├── client.ts           # Client type
└── user.ts             # User type
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Add Tasks**: Create new freelance projects with details
3. **Manage Clients**: Add and organize your clients
4. **Track Work**: Use the timer and focus mode for productivity
5. **View Stats**: Monitor your income and performance

## Future Firebase Integration

The codebase is structured for easy Firebase integration:
- Services layer separates data operations
- Local storage can be replaced with Firestore
- Authentication ready for Firebase Auth
- Real-time updates can be added later

## License

This project is for demonstration purposes.
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
