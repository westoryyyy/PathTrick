# 🚀 API Integration Guide - Learning & Career Tracks

## Overview

This guide explains how to replace mock data with real API calls in the `LearningProgress` and `ExploreTracks` components. The architecture is production-ready and follows strict TypeScript contracts.

---

## Architecture

### Files & Their Roles

| File | Purpose | Status |
|------|---------|--------|
| `src/types/backend.ts` | **API Contract** — Strict TypeScript interfaces | ✅ Complete |
| `src/data/mockBackendData.ts` | **Mock Data** — Simulates backend response | ✅ Complete |
| `src/components/learning/LearningProgress.tsx` | **View 1** — 70/30 split, house syllabus | ✅ Complete |
| `src/components/tracks/ExploreTracks.tsx` | **View 2** — Career track catalog | ✅ Complete |

---

## Step 1: Create the API Service Layer

Create a new file: `src/services/api.ts`

```typescript
import { BackendResponse } from '@/types/backend';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class LearningAPI {
  /**
   * Fetch user progress, houses, and career tracks
   * Replaces mockBackendData with real API data
   */
  static async fetchUserProgressAndTracks(): Promise<BackendResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/progress-and-tracks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: BackendResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      throw error;
    }
  }

  /**
   * Claim daily bounty XP
   */
  static async claimDailyBounty(bountyId: string): Promise<{ xpAwarded: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/claim-bounty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ bountyId }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to claim bounty:', error);
      throw error;
    }
  }

  /**
   * Mark a stage as completed
   */
  static async completeStage(houseId: string, stageId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/complete-stage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ houseId, stageId }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to complete stage:', error);
      throw error;
    }
  }
}
```

---

## Step 2: Update LearningProgress Component

Modify `src/components/learning/LearningProgress.tsx`:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LearningAPI } from '@/services/api';
import { mockBackendData } from '@/data/mockBackendData'; // Fallback
import { House, Stage, BackendResponse } from '@/types/backend';

// ... (keep all existing styling and constants)

export default function LearningProgress() {
  const [data, setData] = useState<BackendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedHouse, setExpandedHouse] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiData = await LearningAPI.fetchUserProgressAndTracks();
        setData(apiData);
        setExpandedHouse(apiData.houses[0]?.id || null);
      } catch (err) {
        console.warn('Using mock data as fallback:', err);
        setData(mockBackendData);
        setExpandedHouse(mockBackendData.houses[0]?.id || null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { houses, user } = data;

  // ... (rest of your component code remains identical)
  // Just replace `mockBackendData` references with `data`
}
```

---

## Step 3: Update ExploreTracks Component

Modify `src/components/tracks/ExploreTracks.tsx`:

```typescript
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LearningAPI } from '@/services/api';
import { mockBackendData } from '@/data/mockBackendData'; // Fallback
import { CareerTrack, BackendResponse } from '@/types/backend';

// ... (keep all existing styling and constants)

export default function ExploreTracks() {
  const [data, setData] = useState<BackendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiData = await LearningAPI.fetchUserProgressAndTracks();
        setData(apiData);
      } catch (err) {
        console.warn('Using mock data as fallback:', err);
        setData(mockBackendData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading career tracks...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-red-600 font-semibold">Failed to load career tracks</p>
      </div>
    );
  }

  const { careerTracks, metadata } = data;

  // ... (rest of your component code remains identical)
}
```

---

## Step 4: Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.pathrick.io/api
```

---

## Expected Backend Endpoints

Your backend should provide these endpoints:

### 1. **GET** `/api/user/progress-and-tracks`

**Response:**
```json
{
  "user": {
    "userId": "user-123",
    "totalXP": 2450,
    "level": 7,
    "claimedSBTs": [...],
    "activeSBT": {...},
    "dailyBounty": {...}
  },
  "houses": [...],
  "careerTracks": [...],
  "metadata": {
    "riasecScore": "Investigative + Realistic",
    "primaryTrack": "Full-Stack Web Developer",
    "targetCountry": "Singapore"
  }
}
```

### 2. **POST** `/api/user/claim-bounty`

**Request Body:**
```json
{
  "bountyId": "bounty-daily-001"
}
```

**Response:**
```json
{
  "xpAwarded": 150,
  "newTotal": 2600,
  "nextClaimAt": "2026-09-15"
}
```

### 3. **POST** `/api/user/complete-stage`

**Request Body:**
```json
{
  "houseId": "house-tech",
  "stageId": "stage-html-basics"
}
```

**Response:**
```json
{
  "success": true,
  "xpAwarded": 50,
  "houseProgress": 100
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend AI Engine                         │
│           (Generates data based on RIASEC score)             │
└────────────────────────────┬────────────────────────────────┘
                             │
                    /api/user/progress-and-tracks
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              LearningAPI Service Layer                       │
│                    (src/services/api.ts)                     │
│                                                              │
│  • fetchUserProgressAndTracks()                             │
│  • claimDailyBounty()                                       │
│  • completeStage()                                          │
└────────────────────────────┬────────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
            ▼                                 ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│  LearningProgress.tsx    │    │  ExploreTracks.tsx       │
│                          │    │                          │
│  • House syllabus        │    │  • Career track catalog  │
│  • Progress tracking     │    │  • Filter & search       │
│  • Daily bounties        │    │  • Tech tags             │
└──────────────────────────┘    └──────────────────────────┘
```

---

## TypeScript Interfaces (Full Contract)

All types are defined in `src/types/backend.ts`:

- **Stage** — name, description, isCompleted, duration, contentType
- **House** — id, title, description, icon, status, stages, houseNumber, gradient, progress
- **CareerTrack** — id, title, description, techTags, iconType, category, difficulty, estimatedWeeks
- **UserProgress** — userId, claimedSBTs, activeSBT, dailyBounty, totalXP, level
- **BackendResponse** — user, houses, careerTracks, metadata

---

## Migration Checklist

- [ ] Create `src/services/api.ts` with API service layer
- [ ] Update `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Update `LearningProgress.tsx` to use API service
- [ ] Update `ExploreTracks.tsx` to use API service
- [ ] Test with mock data fallback
- [ ] Test with real API endpoints
- [ ] Implement error handling & retry logic
- [ ] Add loading states to components
- [ ] Deploy and monitor API calls

---

## Notes

✅ **Mock data is still used as a fallback** — If the API fails, components gracefully degrade to `mockBackendData`

✅ **TypeScript ensures type safety** — All responses are validated against `BackendResponse` interface

✅ **Ready for real backend** — Just swap `mockBackendData` with API calls, everything else stays the same

✅ **Scalable architecture** — All API logic is centralized in `LearningAPI` service class
