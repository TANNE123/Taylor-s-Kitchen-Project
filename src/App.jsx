import React, { useEffect, useState } from 'react';
import { Search, Clock, ChefHat, Utensils, Heart, X, Filter, Loader2, Star, Users } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { recipesFetch } from './redux/recipeces/recipeSlice';
import { recipeDetailesFetch } from './redux/recipeces/recipeDetailes';

const popularIngredients = [
  { name: 'chicken', icon: '🐔' },
  { name: 'beef', icon: '🥩' },
  { name: 'salmon', icon: '🐟' },
  { name: 'pasta', icon: '🍝' },
  { name: 'rice', icon: '🍚' },
  { name: 'eggs', icon: '🥚' },
  { name: 'tomato', icon: '🍅' },
  { name: 'cheese', icon: '🧀' },
  { name: 'mushroom', icon: '🍄' },
  { name: 'onion', icon: '🧅' },
  { name: 'garlic', icon: '🧄' },
  { name: 'potato', icon: '🥔' },
];


const moodSuggestions = {
  comfort: {
    ingredients: ['chicken', 'pasta', 'cheese', 'potato'],
    description: 'Cozy meals after a long day',
    icon: '🤗',
  },
  healthy: {
    ingredients: ['salmon', 'chicken', 'spinach', 'broccoli'],
    description: 'Nutritious options to fuel your day',
    icon: '💚',
  },
  quick: {
    ingredients: ['eggs', 'pasta', 'chicken', 'rice'],
    description: '30 minutes or less',
    icon: '⚡',
  },
  exotic: {
    ingredients: ['curry', 'beef', 'lamb', 'seafood'],
    description: 'Adventure on your plate',
    icon: '🌍',
  },
};
const TaylorRecipeApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [mealId, setMeadId] = useState(null)
  const dispatch = useDispatch();

  const { recipeData, loading, error } = useSelector((state) => state.recipes);
  const { singleRecipe } = useSelector((state) => state.singleRecipeStore)

  useEffect(() => {
    dispatch(recipesFetch(searchTerm));
  }, [searchTerm, timeFilter, moodFilter, dispatch]);

  useEffect(() => {
    if (mealId)
      setSelectedRecipe(singleRecipe)
  }, [singleRecipe, mealId])

  useEffect(() => {
    if (mealId) {
      dispatch(recipeDetailesFetch(mealId));
    } else {
      setSelectedRecipe(null)
    }
  }, [mealId])


  useEffect(() => {
    if (recipeData && Array.isArray(recipeData)) {
      setRecipes(recipeData);
    }
  }, [recipeData]);

  const clearFilters = () => {
    setSearchTerm('');
    setTimeFilter('all');
    setMoodFilter('all');
    setSearchHistory([]);
    dispatch(recipesFetch(''));
  };
   
  const getRecipeDetails = (mealId) => {
    setMeadId(mealId)
  };

  const extractIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient,
          measure: measure ? measure.trim() : '',
        });
      }
    }
    return ingredients;
  };

  const getEstimatedTime = (recipe) => {
    const name = recipe?.strMeal?.toLowerCase();
    if (name?.includes('quick') || name?.includes('easy') || name?.includes('simple')) {
      return '15-20 min';
    }
    if (name?.includes('slow') || name?.includes('braised') || name?.includes('roast')
    ) {
      return '2-3 hours';
    }
    if (name?.includes('grilled') || name?.includes('fried') || name?.includes('stir')) {
      return '20-30 min';
    }
    return '30-45 min';
  };

  const getDifficulty = (recipe) => {
    const instructions = recipe.strInstructions?.toLowerCase() || '';
    console.log(instructions, 'instructions')
    const ingredientCount = extractIngredients(recipe).length;
    if (ingredientCount <= 2 && (instructions.includes('simple') || instructions.includes('easy'))) {
      return 'Easy';
    }
    if (ingredientCount > 5 || instructions.includes('marinate') || instructions.includes('rest')) {
      return 'Hard';
    }
    return 'Medium';
  };


  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(recipesFetch(searchTerm));
      setSearchHistory((prev) => [...new Set([searchTerm, ...prev])].slice(0, 5));
    }
  };

  const handleQuickSearch = (ingredient) => {
    setSearchTerm(ingredient);
    setSearchHistory((prev) => [...new Set([ingredient, ...prev])].slice(0, 5));
  };

  const handleMoodSearch = (mood) => {
    setMoodFilter(mood);
    const suggestions = moodSuggestions[mood].ingredients;
    if (suggestions && suggestions.length > 0) {
      const randomIngredient = suggestions[Math.floor(Math.random() * suggestions.length)];
      setSearchTerm(randomIngredient);
      setSearchHistory((prev) => [...new Set([randomIngredient, ...prev])].slice(0, 5));
    }
  };

  const toggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.idMeal === recipe.idMeal);
      if (isFavorite) {
        return prev.filter((fav) => fav.idMeal !== recipe.idMeal);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const isFavorite = (recipe) => {
    return favorites.some((fav) => fav.idMeal === recipe.idMeal);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (timeFilter === 'quick') {
      const time = getEstimatedTime(recipe);
      return time.includes('15-20') || time.includes('20-30');
    }
    if (timeFilter === 'medium') {
      return getEstimatedTime(recipe).includes('30-45');
    }
    if (timeFilter === 'long') {
      return getEstimatedTime(recipe).includes('2-3');
    }
    return true;
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* top nav bar */}
      <header className="bg-white shadow-lg border-b border-orange-100 sticky top-0 z-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Taylor's Kitchen</h1>
                <p className="text-sm text-gray-600">Smart recipes for busy professionals</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {favorites.length > 0 && (
                <div className="hidden sm:flex items-center text-sm text-gray-600 bg-red-50 px-3 py-1 rounded-full">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  {favorites.length} saved
                </div>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-orange-500 text-white p-2 rounded-lg shadow-md hover:bg-orange-600"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 min-h-[calc(100vh-0rem)]">
          {/* said nav bar  */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'} bg-white rounded-xl shadow-sm p-6 max-h-[calc(100vh-0rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100`}>
            <div className="space-y-6">
              {/* said nav bar top */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  What's your mood today?
                </h3>
                <div className="space-y-3">
                  {Object.entries(moodSuggestions).map(([mood, data]) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodSearch(mood)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${moodFilter === mood
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                        }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{data.icon}</span>
                        <div>
                          <div className="font-medium">{mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
                          <div className="text-xs opacity-75">{data.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* said nav bar middel */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Available Time
                </h3>
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'Any time', desc: 'All recipes' },
                    { value: 'quick', label: 'Quick & Easy', desc: '15-30 minutes' },
                    { value: 'medium', label: 'Moderate', desc: '30-45 minutes' },
                    { value: 'long', label: 'Weekend Project', desc: '2+ hours' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="timeFilter"
                        value={option.value}
                        checked={timeFilter === option.value}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* said nav bar buttom quick search  */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Ingredient Search</h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularIngredients.map((ingredient) => (
                    <button
                      key={ingredient.name}
                      onClick={() => handleQuickSearch(ingredient.name)}
                      className="p-2 bg-gray-50 text-gray-700 text-sm rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 flex items-center"
                    >
                      <span className="mr-2">{ingredient.icon}</span>
                      {ingredient.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* clear button container */}

              {(searchTerm || timeFilter !== 'all' || moodFilter !== 'all') && (
                <div>
                  <button
                    onClick={clearFilters}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* user sreach history  */}
              {searchHistory.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Searches</h3>
                  <div className="space-y-2">
                    {searchHistory.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* user favorites cards */}

              {favorites.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Your Favorites ({favorites.length})
                  </h3>
                  <div className="space-y-2">
                    {favorites.slice(0, 3).map((recipe) => (
                      <div
                        key={recipe.idMeal}
                        onClick={() => getRecipeDetails(recipe.idMeal)}
                        className="p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900 truncate">{recipe.strMeal}</p>
                        <p className="text-xs text-gray-600">{getEstimatedTime(recipe)}</p>
                      </div>
                    ))}
                    {favorites.length > 3 && (
                      <p className="text-xs text-gray-500 text-center pt-2">+{favorites.length - 3} more recipes</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

              {/* right said search bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="What ingredients do you have? (e.g., chicken, pasta, tomato)"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchTerm.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Find Recipes
                    </>
                  )}
                </button>
              </div>
              {/* example simgple ingredient container */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Try:</span>
                {['chicken', 'pasta', 'salmon', 'eggs'].map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => handleQuickSearch(ingredient)}
                    className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex">
                  <X className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* filter recipes data  */}
            {filteredRecipes.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}{' '}
                    {searchTerm && ` with "${searchTerm}"`}
                  </h2>
                  {(timeFilter !== 'all' || moodFilter !== 'all') && (
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      Filtered by:{' '}
                      {timeFilter !== 'all' && `${timeFilter} cooking time`}
                      {timeFilter !== 'all' && moodFilter !== 'all' && ', '}
                      {moodFilter !== 'all' && moodFilter}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
                  {filteredRecipes.map((recipe) => (
                    <article
                      key={recipe.idMeal}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover" loading="lazy" />
                        <button
                          onClick={() => toggleFavorite(recipe)}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isFavorite(recipe) ? 'bg-red-500 text-white shadow-lg' : 'bg-white bg-opacity-90 text-gray-600 hover:text-red-500 hover:bg-red-50'
                            }`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(recipe) ? 'fill-current' : ''}`} />
                        </button>

                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{recipe.strMeal}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-blue-500" />
                            {getEstimatedTime(recipe)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-green-500" />
                            Serves 4
                          </div>
                        </div>
                        <button
                          onClick={() => getRecipeDetails(recipe.idMeal)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        >
                          View Recipe
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* shart search ingredient container  */}

            {!loading && filteredRecipes.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full w-20 h-20 mx-auto mb-6">
                  <ChefHat className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your kitchen assistant!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Search by ingredient, choose your mood, or pick from popular options to discover delicious recipes
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                  {popularIngredients.slice(0, 6).map((ingredient) => (
                    <button
                      key={ingredient.name}
                      onClick={() => handleQuickSearch(ingredient.name)}
                      className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">{ingredient.icon}</div>
                      <div className="text-sm font-medium text-gray-700">{ingredient.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>


      {/* single recipe full detailes  */}

      {selectedRecipe && singleRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
            <div className="relative">
              <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} className="w-full h-64 sm:h-80 object-cover" />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-full p-2 hover:bg-opacity-90 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-4 flex space-x-2">
                {/* <span className="bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">{getDifficulty(selectedRecipe)}</span> */}
                <span className="bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">{getEstimatedTime(selectedRecipe)}</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">{selectedRecipe.strMeal}</h2>
                <button
                  onClick={() => toggleFavorite(selectedRecipe)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${isFavorite(selectedRecipe) ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite(selectedRecipe) ? 'fill-current' : ''}`} />
                  {isFavorite(selectedRecipe) ? 'Saved' : 'Save Recipe'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Cook Time</div>
                  <div className="text-sm text-gray-600">{getEstimatedTime(selectedRecipe)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Servings</div>
                  <div className="text-sm text-gray-600">4 People</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <ChefHat className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Difficulty</div>
                  <div className="text-sm text-gray-600">{getDifficulty(selectedRecipe)}</div>
                </div>
              </div>

              {extractIngredients(selectedRecipe).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-orange-500" />
                    Ingredients
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {extractIngredients(selectedRecipe).map((ingredient, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-900">
                          <span className="font-medium">{ingredient.measure}</span> {ingredient.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecipe.strInstructions && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
                      {selectedRecipe.strInstructions}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaylorRecipeApp;