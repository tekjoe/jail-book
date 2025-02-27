# Wisconsin Inmate Lookup

A Next.js application that allows users to view and look up inmates in Wisconsin county jails. The application features a sidebar listing all Wisconsin counties and a main section displaying inmate information.

## Features

- View inmates by county
- Search for specific inmates
- Daily updates from county jail rosters
- Responsive design for desktop and mobile
- ID-based county routing for improved performance

## Technical Overview

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: Supabase
- **Data Collection**: Automated scraping of county jail PDFs
- **Scheduling**: Daily updates at 8:00 AM CST

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wisconsin-inmate-lookup.git
   cd wisconsin-inmate-lookup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on the `.env.local.example` template:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update the `.env.local` file with your Supabase credentials.

5. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL schema in `supabase/schema.sql` to create the necessary tables

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Initialize the counties and scheduler:
   ```bash
   npm run init-all
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run start:with-scheduler`: Start the production server with scheduler
- `npm run init-counties`: Initialize the counties table
- `npm run init-scheduler`: Initialize the scheduler
- `npm run init-all`: Initialize both counties and scheduler
- `npm run scrape`: Trigger immediate scraping
- `npm run refresh`: Refresh all inmate data

## Deployment

This application can be deployed to Vercel or any other Next.js-compatible hosting service.

1. Set up environment variables in your hosting provider
2. Deploy the application
3. Set up a cron job or scheduled function to hit the `/api/init` endpoint on startup
4. Set up a cron job to hit the `/api/scrape` endpoint daily at 8:00 AM CST

## Database Schema

### Inmates Table
```sql
CREATE TABLE inmates (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  county TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_county ON inmates (county);
```

### Counties Table
```sql
CREATE TABLE counties (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Data provided by Wisconsin county sheriff's offices
- Built with Next.js, Tailwind CSS, and Supabase
