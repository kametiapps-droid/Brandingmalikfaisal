# Kadooli Tea Palace - Digital Menu

## Overview
A digital menu application for Kadooli Tea Palace cafeteria located in Al Rashidiya, Dubai. Built with React and Vite, featuring a beautiful dark-themed UI with menu categories and items.

## Project Structure
```
├── public/images/    # Menu item images (PNG and WebP formats)
├── src/
│   ├── App.jsx       # Main application component
│   ├── App.css       # Application styles
│   ├── main.jsx      # Application entry point
│   ├── index.css     # Global styles
│   ├── menuData.js   # Menu items data
│   ├── lockConfig.js # Lock system configuration (pre-computed hashes)
│   └── OptimizedImage.jsx  # Image component with optimization
├── index.html        # HTML entry point
├── vite.config.js    # Vite configuration
└── package.json      # Project dependencies
```

## Running the Project
- **Development**: `npm run dev` - Runs on port 5000
- **Build**: `npm run build` - Creates production build in `dist/`
- **Preview**: `npm run preview` - Preview production build

## Tech Stack
- React 18
- Vite 5
- CSS (no framework)

## Lock System
The app includes a paywall/lock system:
- Phone numbers, location, and call buttons are locked with blur effects
- All menu categories are locked except Tea & Coffee and Breakfast
- Clicking locked items shows a payment popup with Ziina payment link
- Admin unlock codes (stored as pre-computed hashes for security):
  - KadooliAdmin2024
  - UnlockMenu2024
  - AdminAccess123
- Admin button is located at the bottom of the footer (developer section)
- Unlock state is stored in localStorage with time-based validation

## Payment Link
https://pay.ziina.com/faisalmalik1168/pNZ7rnwiu

## Deployment
Configured as a static site deployment. The build command generates static files in the `dist` directory.
