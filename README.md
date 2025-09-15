Project Name
Taylor's Kitchen Recipe App


Overview
Taylor's Kitchen is a React-based web application designed for busy professionals to discover recipes based on ingredients, mood, and available cooking time. It integrates with TheMealDB API to fetch recipes and provides features like favoriting recipes, filtering by cooking time and mood, and viewing detailed recipe information.
Features

Search by Ingredient: Search recipes using specific ingredients.
Mood-Based Suggestions: Filter recipes by mood (e.g., comfort, healthy, quick, exotic).
Time Filters: Filter recipes by estimated cooking time (quick, moderate, or long).
Favorites: Save and view favorite recipes.
Search History: Track recent searches for quick access.
Recipe Details: View detailed recipe information, including ingredients, instructions, cook time, servings, and difficulty.
Responsive Design: Optimized for both desktop and mobile devices with Tailwind CSS styling.

Tech Stack

Frontend: React, Redux Toolkit, Tailwind CSS
API: TheMealDB API (https://www.themealdb.com/api/json/v1/1/)
Icons: Lucide React for UI icons
State Management: Redux Toolkit with async thunks for API calls
Dependencies: Axios for HTTP requests, React-Redux for state management



Setup Instructions

Clone the Repository:
git clone https://github.com/TANNE123/Taylor-s-Kitchen-Project.git



Install Dependencies:Ensure you have Node.js installed, then run:
npm install

Optional
Install Required Packages:The app requires the following dependencies:
npm install react react-dom react-redux @reduxjs/toolkit axios lucide-react


Run the Application:Start the development server:
npm start

The app will be available at http://localhost:5173. or http://localhost:3000
this deploye link :https://taylor-s-kitchen-project.vercel.app/


Usage

Search: Enter ingredients in the search bar (e.g., "chicken", "pasta") and press Enter or click "Find Recipes".
Quick Search: Click on popular ingredients or mood suggestions for instant searches.
Filters: Use the sidebar to filter by cooking time or mood.
Favorites: Click the heart icon on a recipe card to save it as a favorite.
Recipe Details: Click "View Recipe" to see detailed instructions, ingredients, and more.
Clear Filters: Reset all filters and search history using the "Clear All Filters" button.

API Details
The app uses TheMealDB API:

Recipe Search: https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}
Recipe Details: https://www.themealdb.com/api/json/v1/1/lookup.php?i={mealId}

