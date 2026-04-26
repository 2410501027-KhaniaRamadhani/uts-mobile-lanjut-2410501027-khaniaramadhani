import React, { createContext, useContext, useReducer } from 'react';

const FavoritesContext = createContext();

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      
      const exists = state.find((item) => item.id === action.payload.id);
      if (exists) {
        return state; // udah ada, gak usah ditambahin lagi
      }
      return [...state, action.payload];
    }

    case 'REMOVE_FAVORITE': {
      return state.filter((item) => item.id !== action.payload);
    }

    default:
      return state;
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  const addFavorite = (show) => {
    dispatch({ type: 'ADD_FAVORITE', payload: show });
  };

  const removeFavorite = (id) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites harus dipake di dalam FavoritesProvider');
  }
  return context;
}