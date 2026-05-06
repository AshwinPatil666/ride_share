# College RideShare App

A simple and efficient ride-sharing application designed for college students to share rides to and from campus. Built with React, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Sign up and login using college email.
- **Post a Ride**: Students can offer rides by specifying source, destination, date, time, and available seats.
- **Find a Ride**: Search for available rides posted by other students.
- **Ride Requests**: Request to join a ride and get notified when the driver accepts.
- **Profile Management**: Manage your profile and view your ride history.
- **Demo Mode**: Includes a local demo mode for testing without a full database setup.

## Tech Stack

- **Frontend**: React.js, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth & Database)
- **State Management**: React Hooks (useState, useEffect)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/college-rideshare-app.git
   cd college-rideshare-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the app**:
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/components`: Reusable UI components.
- `src/pages`: Main application pages (Home, Login, Signup, Post Ride, etc.).
- `src/lib`: Database configuration and demo logic.
- `src/hooks`: Custom hooks for authentication and data fetching.

## Author

Created by [Your Name] - 2nd Year B.Tech Student.
