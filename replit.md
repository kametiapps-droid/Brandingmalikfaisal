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

## Deployment
Configured as a static site deployment. The build command generates static files in the `dist` directory.
