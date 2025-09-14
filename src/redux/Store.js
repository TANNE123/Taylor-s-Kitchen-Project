import { configureStore } from "@reduxjs/toolkit";
import recipeSlice from "./recipeces/recipeSlice";
import singleRecipesSlice from "./recipeces/recipeDetailes";

const store = configureStore({
  reducer: {
    recipes: recipeSlice,
    singleRecipeStore:singleRecipesSlice
  },
});

export default store;
