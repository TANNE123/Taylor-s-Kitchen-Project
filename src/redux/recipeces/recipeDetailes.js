

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const recipeDetailesFetch = createAsyncThunk("getBymealId", async (mealId, { rejectWithValue }) => {
    try {
        const recipeDetailesData = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        console.log(recipeDetailesData.data.meals, 'recipeDetailesData')
        return recipeDetailesData.data.meals

    }
    catch (error) {
        console.log(error)
        return rejectWithValue(error)
    }
})



const singleRecipesSlice = createSlice({
    name: "single/recipe",
    initialState: {
        singleRecipe: [],
        singleLoading: false,
        singleError: ""
    },
    extraReducers: (builder) => {
        builder
            .addCase(recipeDetailesFetch.pending, (state) => {
                state.singleLoading = true,
                    state.singleError = ""
            })
            .addCase(recipeDetailesFetch.fulfilled, (state, action) => {
                state.singleRecipe = action.payload,
                    state.singleLoading = false
            })
            .addCase(recipeDetailesFetch.rejected, (state, action) => {
                state.singleLoading = false
                state.error = action.payload
            })
    }
})


export default singleRecipesSlice.reducer