/**
 * API Service Layer Template
 *
 * Usage:
 * 1. Copy this file to src/services/api.ts
 * 2. Update API_BASE_URL with your backend URL
 * 3. Replace fetch calls with your HTTP client (axios, fetch, etc.)
 * 4. Implement error handling & retry logic as needed
 */

import { BackendResponse } from '@/types/backend';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Get auth token from localStorage or cookie
 * Implement based on your auth solution
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || null;
}

/**
 * Common error handler
 */
function handleApiError(error: unknown, context: string): Error {
  if (error instanceof Error) {
    console.error(`[${context}] Error:`, error.message);
    return error;
  }
  const message = `[${context}] Unknown error: ${String(error)}`;
  console.error(message);
  return new Error(message);
}

export class LearningAPI {
  /**
   * Fetch user progress, houses, and career tracks
   *
   * This is the main entry point that combines:
   * - User progress (XP, level, SBTs)
   * - 12 Houses with stages
   * - Career tracks for exploration
   * - User metadata (RIASEC score, primary track, target country)
   *
   * @returns Promise<BackendResponse> Complete user data and learning paths
   * @throws Error if API call fails
   */
  static async fetchUserProgressAndTracks(): Promise<BackendResponse> {
    try {
      const authToken = getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/user/progress-and-tracks`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
          },
          // Prevent caching to always get fresh data
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      const data: BackendResponse = await response.json();

      // Validate response structure
      if (!data.user || !data.houses || !data.careerTracks) {
        throw new Error('Invalid API response structure');
      }

      return data;
    } catch (error) {
      throw handleApiError(error, 'fetchUserProgressAndTracks');
    }
  }

  /**
   * Claim daily bounty and award XP
   *
   * Marks a bounty as claimed and credits the user with XP.
   * Can only be claimed once per day.
   *
   * @param bountyId - ID of the bounty to claim
   * @returns Promise<{ xpAwarded: number; newTotal: number; nextClaimAt: string }>
   * @throws Error if bounty already claimed or API fails
   */
  static async claimDailyBounty(bountyId: string): Promise<{
    xpAwarded: number;
    newTotal: number;
    nextClaimAt: string;
  }> {
    try {
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error('Authentication required to claim bounty');
      }

      const response = await fetch(
        `${API_BASE_URL}/user/claim-bounty`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ bountyId }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Bounty already claimed today');
        }
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'claimDailyBounty');
    }
  }

  /**
   * Mark a stage as completed
   *
   * Updates the stage status to "completed" and awards XP.
   * Updates house progress percentage automatically.
   *
   * @param houseId - ID of the house containing the stage
   * @param stageId - ID of the stage to mark as completed
   * @returns Promise<{ success: boolean; xpAwarded: number; houseProgress: number }>
   * @throws Error if stage not found or API fails
   */
  static async completeStage(
    houseId: string,
    stageId: string
  ): Promise<{
    success: boolean;
    xpAwarded: number;
    houseProgress: number;
  }> {
    try {
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error('Authentication required to complete stage');
      }

      const response = await fetch(
        `${API_BASE_URL}/user/complete-stage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ houseId, stageId }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('House or stage not found');
        }
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'completeStage');
    }
  }

  /**
   * Unlock a house (when previous house is completed)
   *
   * Called automatically when user completes a house.
   * Unlocks the next house in the sequence.
   *
   * @param houseId - ID of the house to unlock
   * @returns Promise<{ success: boolean }>
   * @throws Error if house cannot be unlocked
   */
  static async unlockHouse(houseId: string): Promise<{
    success: boolean;
  }> {
    try {
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error('Authentication required to unlock house');
      }

      const response = await fetch(
        `${API_BASE_URL}/user/unlock-house`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ houseId }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Prerequisites not met to unlock house');
        }
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'unlockHouse');
    }
  }

  /**
   * Enroll in a career track
   *
   * Saves the career track as a user's secondary learning path.
   * Creates a new learning roadmap based on the track.
   *
   * @param trackId - ID of the career track to enroll in
   * @returns Promise<{ success: boolean; enrolledAt: string }>
   * @throws Error if track not found or already enrolled
   */
  static async enrollInTrack(trackId: string): Promise<{
    success: boolean;
    enrolledAt: string;
  }> {
    try {
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error('Authentication required to enroll');
      }

      const response = await fetch(
        `${API_BASE_URL}/user/enroll-track`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ trackId }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Already enrolled in this track');
        }
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'enrollInTrack');
    }
  }

  /**
   * Claim a Soulbound Token (SBT)
   *
   * Mints and claims an on-chain SBT when stage requirements are met.
   * Transfers the SBT to the user's wallet address.
   *
   * @param houseId - ID of the house completed
   * @returns Promise<{ success: boolean; tokenId: string; claimedAt: string }>
   * @throws Error if prerequisites not met or SBT cannot be minted
   */
  static async claimSoulboundToken(houseId: string): Promise<{
    success: boolean;
    tokenId: string;
    claimedAt: string;
  }> {
    try {
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error('Authentication required to claim SBT');
      }

      const response = await fetch(
        `${API_BASE_URL}/user/claim-sbt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ houseId }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('House not fully completed yet');
        }
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, 'claimSoulboundToken');
    }
  }
}

/**
 * React Hook: Use user learning data
 *
 * Example usage in components:
 *
 * export default function MyComponent() {
 *   const { data, loading, error } = useUserLearningData();
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <Component data={data} />;
 * }
 */
export function useUserLearningData() {
  const [data, setData] = React.useState<BackendResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await LearningAPI.fetchUserProgressAndTracks();
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Re-import React if using hook
import React from 'react';
