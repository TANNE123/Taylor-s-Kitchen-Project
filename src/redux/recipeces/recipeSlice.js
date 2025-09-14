import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const recipesFetch = createAsyncThunk("recipes/data", async (ingredient, { rejectWithValue }) => {
    try {
        const data = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        return data?.data?.meals
    }
    catch (error) {
        return rejectWithValue(error.message)

    }
})


const recipeSlice = createSlice({
    name: "recipes",
    initialState: {
        recipeData: [],
        loading: false,
        error: ""
    },
    extraReducers: (builder) => {
        builder
            .addCase(recipesFetch.pending, (state) => {
                state.loading = true;
                state.error = ""
            })
            .addCase(recipesFetch.fulfilled, (state, action) => {
                state.recipeData = action.payload;
                state.loading = false

            })
            .addCase(recipesFetch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})


export default recipeSlice.reducer