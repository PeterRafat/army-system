import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Soldier, Recommendation } from '../models/soldier.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = environment.supabase.url;
    const supabaseAnonKey = environment.supabase.anonKey;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Normalize Arabic text for search
   */
  normalizeArabic(text: string): string {
    return text
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[أإآ]/g, 'ا');
  }

  /**
   * Search soldiers by name or police number
   */
  async searchSoldiers(query: string, useAdvancedFilter: boolean = false): Promise<Soldier[]> {
   if (!query || query.trim().length === 0) {
     return [];
    }

  try {
      // Fetch all soldiers first
      const { data: allSoldiers, error } = await this.supabase
        .from('soldiers')
        .select('*');

     if (error) {
        console.error('Error fetching soldiers:', error);
     return [];
      }

   if (!allSoldiers || allSoldiers.length === 0) {
    return [];
    }

    const normalizedQuery = this.normalizeArabic(query.toLowerCase().trim());

    if (useAdvancedFilter) {
      // Advanced filter mode: %letter% pattern matching
      return this.advancedFilterMatch(allSoldiers, normalizedQuery);
    } else {
      // Normal mode: exact order word-by-word matching
      return this.normalSearchMatch(allSoldiers, normalizedQuery);
    }
  } catch (error) {
    console.error('Error searching soldiers:', error);
    return [];
  }
}

  /**
   * Normal search: exact order word-by-word matching
   */
  private normalSearchMatch(soldiers: Soldier[], query: string): Soldier[] {
    const searchWords = query.split(/\s+/).filter(word => word.length > 0);

    const matchedSoldiers = soldiers.filter(soldier => {
      const normalizedName = this.normalizeArabic(soldier.name.toLowerCase());
      
      // Check for police number match
     if (soldier.police_number.toLowerCase().includes(query)) {
      return true;
      }

      // Check if ALL search words appear in the name IN ORDER
      let currentIndex = 0;
      const allWordsInOrder = searchWords.every(searchWord => {
        const foundIndex = normalizedName.indexOf(searchWord, currentIndex);
        if (foundIndex !== -1) {
          currentIndex = foundIndex + searchWord.length;
         return true;
        }
       return false;
      });

      // Also check direct contains match (for single word or exact phrase)
      const directMatch = normalizedName.includes(query);

    return directMatch || allWordsInOrder;
    });

    // Sort by relevance
    matchedSoldiers.sort((a, b) => {
      const aName = this.normalizeArabic(a.name.toLowerCase());
      const bName = this.normalizeArabic(b.name.toLowerCase());

      // Exact match gets highest score
      const aExact = aName === query ? 3 : 0;
      const bExact = bName === query ? 3 : 0;

      // Starts with gets second highest
      const aStartsWith = aName.startsWith(query) ? 2 : 0;
      const bStartsWith = bName.startsWith(query) ? 2 : 0;

      // Word matching score (first word priority)
      let aWordScore = 0;
      let bWordScore = 0;

      const aWords = aName.split(/\s+/).filter(word => word.length > 0);
      const bWords = bName.split(/\s+/).filter(word => word.length > 0);

    searchWords.forEach((word, index) => {
        // Higher score if word appears at same position
      if (aWords[index] === word) aWordScore += 3;
      if (bWords[index] === word) bWordScore += 3;
        
        // Regular score if word appears anywhere
      if (aWords.some(w => w.includes(word))) aWordScore++;
      if (bWords.some(w => w.includes(word))) bWordScore++;
      });

    return (bExact + bStartsWith + bWordScore) - (aExact + aStartsWith + aWordScore);
    });

  return matchedSoldiers;
  }

  /**
   * Advanced filter: %letter% pattern matching (ignores spaces)
   */
  private advancedFilterMatch(soldiers: Soldier[], query: string): Soldier[] {
    // Remove % signs and spaces from query to get just the letters
    const lettersOnly = query.replace(/%/g, '').replace(/\s+/g, '');
    
    // Build regex pattern: each letter followed by optional spaces/characters
    const pattern = lettersOnly.split('').map(letter => 
      `${letter}[^${letter}]*`
    ).join('');

    const regex = new RegExp(pattern, 'i');

    const matchedSoldiers = soldiers.filter(soldier => {
      const normalizedName = this.normalizeArabic(soldier.name.toLowerCase());
      
      // Check for police number match
     if (soldier.police_number.toLowerCase().includes(lettersOnly)) {
      return true;
      }

      // Test the pattern against name (spaces removed)
      const nameWithoutSpaces = normalizedName.replace(/\s+/g, '');
      return regex.test(nameWithoutSpaces);
    });

    // Sort by relevance (shorter names with exact matches first)
    matchedSoldiers.sort((a, b) => {
      const aName = this.normalizeArabic(a.name.toLowerCase()).replace(/\s+/g, '');
      const bName = this.normalizeArabic(b.name.toLowerCase()).replace(/\s+/g, '');
      
      // Shorter names rank higher (more precise match)
      const lengthDiff = aName.length - bName.length;
      
      // Contains all letters in order
      return lengthDiff;
    });

  return matchedSoldiers;
  }

  /**
   * Get soldier by ID
   */
  async getSoldierById(id: string): Promise<Soldier | null> {
    try {
      const { data, error } = await this.supabase
        .from('soldiers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching soldier:', error);
      return null;
      }

    return data;
    } catch (error) {
      console.error('Error fetching soldier:', error);
    return null;
    }
  }

  /**
   * Get all soldiers
   */
  async getAllSoldiers(): Promise<Soldier[]> {
    try {
      const { data, error } = await this.supabase
        .from('soldiers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching soldiers:', error);
      return [];
      }

    return data || [];
    } catch (error) {
      console.error('Error fetching soldiers:', error);
    return [];
    }
  }

  /**
   * Get all recommendations for a soldier
   */
  async getRecommendationsBySoldierId(soldierId: string): Promise<Recommendation[]> {
    try {
      const { data, error } = await this.supabase
        .from('recommendations')
        .select('*')
        .eq('soldier_id', soldierId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  /**
   * Add a new recommendation
   */
  async addRecommendation(recommendation: Omit<Recommendation, 'id' | 'created_at'>): Promise<Recommendation | null> {
    try {
      const { data, error } = await this.supabase
        .from('recommendations')
        .insert([recommendation])
        .select()
        .single();

      if (error) {
        console.error('Error adding recommendation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding recommendation:', error);
      return null;
    }
  }

  /**
   * Get all recommendations
   */
  async getAllRecommendations(): Promise<Recommendation[]> {
    try {
      const { data, error } = await this.supabase
        .from('recommendations')
        .select('*, soldiers(name, police_number)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  /**
   * Delete a recommendation
   */
  async deleteRecommendation(recommendationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('recommendations')
        .delete()
        .eq('id', recommendationId);

      if (error) {
        console.error('Error deleting recommendation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      return false;
    }
  }
}
