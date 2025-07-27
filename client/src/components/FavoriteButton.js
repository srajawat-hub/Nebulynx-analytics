import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const FavoriteButton = ({ symbol, size = 20, className = '', showToast = true }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [symbol]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`/api/favorites/check/${symbol}`);
      setIsFavorite(response.data.data.is_favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`/api/favorites/toggle/${symbol}`);
      setIsFavorite(response.data.data.is_favorite);
      
      if (showToast) {
        if (response.data.data.is_favorite) {
          toast.success(`${symbol} added to favorites`);
        } else {
          toast.success(`${symbol} removed from favorites`);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (showToast) {
        toast.error('Failed to update favorites');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-200 hover:scale-110 disabled:opacity-50 ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart 
          size={size} 
          className="text-red-500 hover:text-red-600 transition-colors" 
        />
      ) : (
        <FaRegHeart 
          size={size} 
          className="text-gray-400 hover:text-red-500 transition-colors" 
        />
      )}
    </button>
  );
};

export default FavoriteButton; 