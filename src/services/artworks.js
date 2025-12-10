/**
 * Service pour récupérer les artworks depuis l'API backend
 */

import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Récupère le token d'authentification depuis Supabase
 */
const getAuthToken = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

/**
 * Récupère un artwork par son ID
 */
export const getArtworkById = async (id) => {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token d'authentification si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Artwork avec l'ID "${id}" introuvable`);
      }
      if (response.status === 403) {
        throw new Error(`Accès interdit. Veuillez vous connecter pour accéder à cette ressource.`);
      }
      throw new Error(`Erreur lors de la récupération de l'artwork: ${response.statusText}`);
    }
    
    const artwork = await response.json();
    return artwork;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artwork:', error);
    throw error;
  }
};

/**
 * Récupère tous les artworks
 * @returns {Promise<Array>} Liste de tous les artworks
 */
export const getAllArtworks = async () => {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token d'authentification si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/artworks`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`Accès interdit. Veuillez vous connecter pour accéder à cette ressource.`);
      }
      throw new Error(`Erreur lors de la récupération des artworks: ${response.statusText}`);
    }
    
    const artworks = await response.json();
    return artworks;
  } catch (error) {
    console.error('Erreur lors de la récupération des artworks:', error);
    throw error;
  }
};

/**
 * Met à jour un artwork
 */
export const updateArtwork = async (id, payload) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentification requise pour modifier une œuvre.');
    }

    const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Échec de la mise à jour de l’œuvre.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'artwork:', error);
    throw error;
  }
};
