'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CourseNodeData } from '@/phaser/config';
import { useMapStore } from '@/store/useMapStore';
import PlayerHUD from '@/components/ui/PlayerHUD';
import NodeInfoPanel from '@/components/ui/NodeInfoPanel';
import SBTBadgePopup from '@/components/ui/SBTBadgePopup';
import GameLoadingScreen from '@/components/ui/GameLoadingScreen';
import { mockBackendData } from '@/data/mockBackendData';
import type { Chapter } from '@/types/backend';
import { useUserStore } from '@/store/useUserStore';
import { usePrivy, useWallets } from '@privy-io/react-auth';

// WorldMapGame must be client-only (Phaser uses window)
const WorldMapGame = dynamic(() => import('@/components/game/WorldMapGame'), {
  ssr: false,
  loading: () => <GameLoadingScreen statusText="Memuat Komponen Game..." />,
});

// ── Mock user data — replace with Zustand/API later ──
const MOCK_USER = {
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
  const roleQuery = searchParams.get('role');

  const {
    isLoading, fetchRoadmap, role,
    fetchRecommendedCourses,
  } = useMapStore();

  const [selectedNode, setSelectedNode] = useState<CourseNodeData | null>(null);
  const [nearbyNode,   setNearbyNode]   = useState<CourseNodeData | null>(null);
  const [showSBT,      setShowSBT]      = useState(false);
  const [sbtData]      = useState<{ name: string; emoji: string; xp: number; badgeImage?: string } | null>(null);
  const [houseId,      setHouseId]      = useState<string | null>(null);

  const { user } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  const { displayName: savedName, level, totalXP } = useUserStore();
  
  const playerName = savedName 
    || user?.google?.name 
    || user?.email?.address?.split('@')[0] 
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Ksatria');

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };
  
  // Dynamic nodes based on Module and Chapter
  const [dynamicNodes, setDynamicNodes] = useState<CourseNodeData[]>([]);

  useEffect(() => {
    if (roleQuery === 'mahasiswa') {
      useMapStore.setState({ role: 'MAHASISWA' });
    }

    if (chapterId) {
      if (roleQuery === 'mahasiswa' || role === 'MAHASISWA') {
        useMapStore.setState({ activeChapterId: chapterId });
        fetchRoadmap(chapterId).then(() => {
          const fetchedNodes = useMapStore.getState().nodes;
          setDynamicNodes(fetchedNodes);
        });
        return;
      }

      // Find the Chapter inside the Module (Legacy SMA)
      let targetChapter: Chapter | null = null;
      let targetHouseId = null;
      for (const h of mockBackendData.houses) {
        for (const s of h.stages) {
          if (s.chapters) {
            const found = s.chapters.find(c => c.id === chapterId);
            if (found) {
              targetChapter = found;
              targetHouseId = h.id;
              break;
            }
          }
        }
        if (targetChapter) break;
      }
      
      // Fallback for Mahasiswa modules
      let inferredModuleId = moduleId;
      if (!inferredModuleId && chapterId && chapterId.includes('-bab-')) {
        const match = chapterId.match(/^(module-.*?)-bab/);
        if (match) inferredModuleId = match[1];
      }
      
      if (!targetChapter && inferredModuleId && chapterId) {
        targetChapter = { id: chapterId, name: `Bab ${chapterId}`, duration: chapterId === '3' ? '1 Levels' : '3 Levels' };
        useMapStore.setState({ role: 'MAHASISWA' });
      }
      
      if (targetHouseId) {
        // This state mirrors the selected legacy house from the URL.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHouseId(targetHouseId);
      }
      
      if (targetChapter) {
        // Generate generic levels for this Chapter
        const completedDynamicNodes = useMapStore.getState().completedDynamicNodes;
        
        const numLevelsMatch = targetChapter.duration ? targetChapter.duration.match(/\d+/) : null;
        const numLevels = numLevelsMatch ? parseInt(numLevelsMatch[0]) : 6;
        
        const pathCoords = [
          {x: 13, y: 23},  // Level 1: Depan Sumur (Kiri Bawah)
          {x: 6,  y: 8},   // Level 2: Depan Rumah Biru (Kiri Atas)
          {x: 22, y: 17},  // Level 3: Depan Rumah Hijau (Tengah)
          {x: 21, y: 8},   // Level 4: Tangga Kemah (Tengah Atas)
          {x: 31, y: 11},  // Level 5: Depan Rumah Kincir (Kanan Atas)
          {x: 32, y: 24},  // Level 6 (Boss): Depan Toko (Kanan Bawah)
          // Fallback coords if > 6 levels
          {x: 26, y: 28},
          {x: 10, y: 28}
        ];
        
        let levels: CourseNodeData[] = [];
        
        const baseIdPrefix = targetHouseId ? chapterId : chapterId.includes('-bab-') ? chapterId : `${inferredModuleId || moduleId}-bab-${chapterId}`;
        
        for (let i = 1; i <= numLevels; i++) {
          const isFirst = i === 1;
          const isLast = i === numLevels;
          const coords = pathCoords[(i-1) % pathCoords.length];
          
          let title = `Level ${i}: Materi Praktik`;
          let badgeImage = '/book.png';
          let category: CourseNodeData['category'] = 'skill';
          
          if (isFirst) {
            title = `Level 1: Teori Dasar`;
            badgeImage = '/first-step.png';
            category = 'foundation';
          } else if (isLast) {
            title = `Level ${i}: Boss Fight`;
            badgeImage = '/course-master.png';
            category = 'milestone';
          } else {
            title = `Level ${i}: Kuis Praktik`;
          }
          
          levels.push({
            id: `${baseIdPrefix}-level-${i}`,
            title: title,
            description: isLast ? `Selesaikan tantangan Boss Fight!` : (isFirst ? `Pengenalan fundamental untuk ${targetChapter.name}` : `Uji pemahamanmu tentang ${targetChapter.name}`),
            category: category,
            status: isFirst ? 'available' : 'locked',
            xp: isLast ? 300 : (isFirst ? 100 : 150),
            x: coords.x,
            y: coords.y,
            prerequisites: isFirst ? [] : [`${baseIdPrefix}-level-${i-1}`],
            badgeImage: badgeImage,
          });
        }
        
        // Update statuses based on completedDynamicNodes
        levels = levels.map(level => {
          if (completedDynamicNodes.includes(level.id)) {
            return { ...level, status: 'completed' };
          }
          if (level.prerequisites.length > 0) {
            const allPrereqsMet = level.prerequisites.every(req => completedDynamicNodes.includes(req));
            if (allPrereqsMet) {
              return { ...level, status: 'available' };
            }
          }
          return level;
        });

        setDynamicNodes(levels);
        useMapStore.setState({ nodes: levels, isLoading: false, activeChapterId: chapterId }); // override store for Map Game
      } else {
        useMapStore.setState({ isLoading: false, activeChapterId: undefined });
      }
    } else {
      if (role === 'SMA') {
        fetchRecommendedCourses();
      } else {
        fetchRoadmap();
      }
    }
  }, [moduleId, chapterId, role, roleQuery, fetchRecommendedCourses, fetchRoadmap]);

  const handleNodeSelected = useCallback((node: CourseNodeData) => {
    setSelectedNode(node);
  }, []);

  const handleNodeNearby = useCallback((node: CourseNodeData) => {
    setNearbyNode(node);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setNearbyNode(null);
  }, []);

  const handleStartCourse = useCallback(async (node: CourseNodeData) => {
    setSelectedNode(null);

    // Dynamic module/chapter mode or Legacy Mahasiswa mode
    if (role === 'SMA') {
      router.push(`/sma/learning-progress/${node.id}`);
    } else {
      router.push(`/mahasiswa/learning-mission/mission/${node.id}`);
    }
  }, [role, router]);

  if (isLoading || (chapterId && dynamicNodes.length === 0)) {
    return <GameLoadingScreen statusText="Menyiapkan Data Peta..." />;
  }

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
          playerName={playerName}
          xp={totalXP}
          xpToNext={level * 2500}
          level={level}
          sbtCount={role === 'SMA' ? 0 : MOCK_USER.sbtCount}
          nearbyNodeTitle={nearbyNode?.title ?? null}
        />



        {/* Back to Dashboard/Module Button */}
        <button
          onClick={() => {
            const isMahasiswaFallback = moduleId && !houseId;
            if (role === 'SMA' && !isMahasiswaFallback) {
              if (houseId) {
                router.push(`/house/${houseId}`);
              } else {
                router.push('/sma/dashboard');
              }
            } else {
              if (houseId) {
                router.push(`/mahasiswa/learning-mission/house/${houseId}`);
              } else if (moduleId) {
                router.push(`/mahasiswa/learning-mission/${moduleId}`);
              } else {
                router.push('/mahasiswa/learning-mission');
              }
            }
          }}
          onMouseEnter={playHoverSound}
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
            border: '4px solid #5a3a29',
            borderRadius: '16px',
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
