'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CourseNodeData } from '@/phaser/config';
import { useMapStore } from '@/store/useMapStore';
import PlayerHUD from '@/components/ui/PlayerHUD';
import NodeInfoPanel from '@/components/ui/NodeInfoPanel';
import SBTBadgePopup from '@/components/ui/SBTBadgePopup';
import QuestTracker from '@/components/ui/QuestTracker';
import GameLoadingScreen from '@/components/ui/GameLoadingScreen';

// WorldMapGame must be client-only (Phaser uses window)
const WorldMapGame = dynamic(() => import('@/components/game/WorldMapGame'), {
  ssr: false,
  loading: () => <GameLoadingScreen statusText="Memuat Peta Dunia..." />,
});

// ── Mock user data — replace with Zustand/API later ──
const MOCK_USER = {
  name: 'Petualang',
  xp: 4250,
  xpToNext: 5000,
  level: 2,
  sbtCount: 1,
};

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('module');
  const chapterId = searchParams.get('chapter');

  const {
    nodes, isLoading, fetchRoadmap, completeNode, role,
    fetchRecommendedCourses, currentActiveCourse,
  } = useMapStore();

  const [selectedNode, setSelectedNode] = useState<CourseNodeData | null>(null);
  const [nearbyNode,   setNearbyNode]   = useState<CourseNodeData | null>(null);
  const [showSBT,      setShowSBT]      = useState(false);
  const [sbtData,      setSbtData]      = useState<{ name: string; emoji: string; xp: number; badgeImage?: string } | null>(null);
  
  // Dynamic nodes based on Module and Chapter
  const [dynamicNodes, setDynamicNodes] = useState<CourseNodeData[]>([]);

  useEffect(() => {
    if (moduleId && chapterId) {
      // Generate dynamic levels (Sub-Bab) for the selected Module -> Chapter
      const completed = useMapStore.getState().completedDynamicNodes || [];
      
      const id1 = `${moduleId}-${chapterId}-1`;
      const id2 = `${moduleId}-${chapterId}-2`;
      const id3 = `${moduleId}-${chapterId}-3`;

      const is1Completed = completed.includes(id1);
      const is2Completed = completed.includes(id2);
      const is3Completed = completed.includes(id3);

      const levels = [
        {
          id: id1,
          title: `Bab ${chapterId}: Level 1`,
          description: 'Pengenalan konsep dasar.',
          category: 'foundation' as const,
          status: is1Completed ? 'completed' : 'available' as const,
          xp: 100,
          x: 20, // Center X
          y: 5,  // Top
          prerequisites: [],
          badgeImage: '/first-step.png',
        },
        {
          id: id2,
          title: `Bab ${chapterId}: Level 2`,
          description: 'Implementasi dan praktik.',
          category: 'skill' as const,
          status: is2Completed ? 'completed' : (is1Completed ? 'available' : 'locked') as const,
          xp: 150,
          x: 10, // Left
          y: 11,
          prerequisites: [id1],
          badgeImage: '/book.png',
        },
        {
          id: id3,
          title: `Bab ${chapterId}: Level 3 (Boss)`,
          description: 'Ujian akhir dari bab ini!',
          category: 'milestone' as const,
          status: is3Completed ? 'completed' : (is2Completed ? 'available' : 'locked') as const,
          xp: 300,
          x: 30, // Right
          y: 18,
          prerequisites: [id2],
          badge: '🏆',
          badgeImage: '/course-master.png',
        }
      ];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDynamicNodes(levels);
      useMapStore.setState({ nodes: levels, isLoading: false }); // override store for Map Game
    } else {
      if (role === 'SMA') {
        fetchRecommendedCourses();
      } else {
        fetchRoadmap();
      }
    }
  }, [moduleId, chapterId, role, fetchRecommendedCourses, fetchRoadmap]);

  const handleNodeSelected = useCallback((node: CourseNodeData) => {
    if (moduleId) {
      router.push(`/quest/${node.id}?module=${moduleId}&chapter=${chapterId}`);
    } else {
      router.push(`/quest/${node.id}`);
    }
  }, [router, moduleId, chapterId]);

  const handleNodeNearby = useCallback((node: CourseNodeData) => {
    setNearbyNode(node);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setNearbyNode(null);
  }, []);

  const handleStartCourse = useCallback(async (node: CourseNodeData) => {
    setSelectedNode(null);

    if (role === 'SMA' && !moduleId) {
      // In Duolingo mode, we navigate to the actual learning/quiz interface.
      router.push(`/quest/${node.id}`);
    } else {
      // Dynamic module/chapter mode or Legacy Mahasiswa mode
      await completeNode(node.id);
      
      // Update dynamicNodes state locally for UI reflection
      setDynamicNodes(prev => {
        const newNodes = prev.map(n => n.id === node.id ? { ...n, status: 'completed' as const } : n);
        // unlock next
        const completedIds = new Set(newNodes.filter(n => n.status === 'completed').map(n => n.id));
        return newNodes.map(n => {
          if (n.status === 'locked' && n.prerequisites.every(req => completedIds.has(req))) {
            return { ...n, status: 'available' as const };
          }
          return n;
        });
      });
      
      if (node.category === 'milestone') {
        setSbtData({ name: node.title, emoji: node.badge ?? '🏆', xp: node.xp, badgeImage: node.badgeImage });
        setShowSBT(true);
      } else {
        // Show an in-game toast (TODO)
        alert('Mission Completed! +XP');
      }
    }
  }, [completeNode, role, router, moduleId]);

  if (isLoading && !moduleId) {
    return <GameLoadingScreen statusText="Memuat Peta Dunia..." />;
  }

  // Determine which nodes to pass to QuestTracker
  const trackerNodes = moduleId ? dynamicNodes : (currentActiveCourse ? currentActiveCourse.quests : nodes);

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <WorldMapGame 
          onNodeSelected={handleNodeSelected}
          onNodeNearby={handleNodeNearby}
          onNodeLeave={handleNodeLeave}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        <PlayerHUD
          playerName={MOCK_USER.name}
          xp={MOCK_USER.xp}
          xpToNext={MOCK_USER.xpToNext}
          level={MOCK_USER.level}
          sbtCount={role === 'SMA' ? 0 : MOCK_USER.sbtCount}
          nearbyNodeTitle={nearbyNode?.title ?? null}
        />



        {/* Back to Dashboard/Module Button */}
        <button
          onClick={() => {
            if (moduleId) {
              router.push(`/mahasiswa/learning/${moduleId}`);
            } else if (role === 'SMA') {
              router.push('/dashboard/sma');
            } else {
              router.push('/mahasiswa');
            }
          }}
          style={{
            position: 'absolute',
            top: 80,
            left: 20,
            zIndex: 1000,
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: '#3b261b',
            border: '2px solid #5a3a29',
            borderRadius: '0',
            color: '#fbbf24',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.45rem',
            cursor: 'pointer',
            boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.8)',
            transition: 'transform 0.1s, background 0.1s',
          }}
        >
          ← Kembali
        </button>
      </div>

      {selectedNode && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'center' }}>
              <NodeInfoPanel
                node={selectedNode}
                isNearby={!!nearbyNode && nearbyNode.id === selectedNode.id}
                onStartCourse={handleStartCourse}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          </div>
        </div>
      )}

      {showSBT && sbtData && (
        <SBTBadgePopup
          badgeName={sbtData.name}
          badgeEmoji={sbtData.emoji}
          badgeImage={sbtData.badgeImage}
          xpEarned={sbtData.xp}
          onClose={() => setShowSBT(false)}
        />
      )}
    </>
  );
}

export default function MapPage() {
  return (
    <main
      id="map-page-main"
      style={{ position: 'fixed', inset: 0, background: '#0a0e1a', overflow: 'hidden' }}
    >
      <Suspense fallback={<GameLoadingScreen statusText="Memuat Peta..." />}>
        <MapContent />
      </Suspense>
    </main>
  );
}
