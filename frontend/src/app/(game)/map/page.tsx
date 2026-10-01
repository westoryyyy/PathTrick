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
    if (roleQuery === 'chaser') {
      useMapStore.setState({ role: 'MAHASISWA' });
    }

    if (chapterId) {
      if (roleQuery === 'chaser' || role === 'MAHASISWA') {
        useMapStore.setState({ activeChapterId: chapterId });
        fetchRoadmap(chapterId).then(() => {
          const fetchedNodes = useMapStore.getState().nodes;
          setDynamicNodes(fetchedNodes);
        });
        return;
      }

      // Find the Chapter inside the Module (Legacy SMA)
      let targetChapter: Chapter | null = null;
      let targetHouseId = searchParams.get('house') || searchParams.get('houseId');
      for (const h of mockBackendData.houses) {
        for (const s of h.stages) {
          if (s.chapters) {
            const found = s.chapters.find(c => c.id === chapterId);
            if (found) {
              targetChapter = found;
              targetHouseId = targetHouseId || h.id;
              break;
            }
          }
        }
        if (targetChapter) break;
      }
      
      if (targetHouseId) {
        useMapStore.setState({ houseId: targetHouseId });
        setHouseId(targetHouseId);
      }
      
      // Fallback for Mahasiswa modules
      let inferredModuleId = moduleId;
      if (!inferredModuleId && chapterId && chapterId.includes('-bab-')) {
        const match = chapterId.match(/^(module-.*?)-bab/);
        if (match) inferredModuleId = match[1];
      }
      
      if (!targetChapter && inferredModuleId && chapterId.includes('-bab-')) {
        targetChapter = { id: chapterId, name: `Bab ${chapterId}`, duration: chapterId === '3' ? '1 Levels' : '3 Levels' };
        useMapStore.setState({ role: 'MAHASISWA' });
      }

      // If still no target chapter (meaning it's likely a real DB chapter ID), fetch from API
      if (!targetChapter) {
        import('@/hooks/useAuthSync').then(({ getAuthHeaders }) => {
          import('@/config/pathtrick').then(({ API_BASE_URL }) => {
            fetch(`${API_BASE_URL}/api/chapters/${chapterId}`, { headers: getAuthHeaders() })
              .then(res => res.json())
              .then(chapterData => {
                if (chapterData && !chapterData.error) {
                  const dbDuration = chapterData.sections?.length ? `${chapterData.sections.length} Levels` : '6 Levels';
                  const tChapter = { id: chapterData.id, name: chapterData.title, duration: dbDuration, sections: chapterData.sections };
                  generateNodesForChapter(tChapter, targetHouseId, inferredModuleId, chapterId);
                } else {
                  useMapStore.setState({ isLoading: false, activeChapterId: undefined });
                  router.push('/map');
                }
              })
              .catch(() => {
                useMapStore.setState({ isLoading: false, activeChapterId: undefined });
                router.push('/map');
              });
          });
        });
        return; // async fetch will handle generating nodes
      } else {
        generateNodesForChapter(targetChapter, targetHouseId, inferredModuleId, chapterId);
      }
      
      function generateNodesForChapter(tChapter: any, tHouseId: any, iModuleId: any, cId: string) {
        // Generate generic levels for this Chapter
        const completedDynamicNodes = useMapStore.getState().completedDynamicNodes;
        
        const numLevelsMatch = tChapter.duration ? tChapter.duration.match(/\d+/) : null;
        const numLevels = tChapter.sections?.length || (numLevelsMatch ? parseInt(numLevelsMatch[0]) : 6);
        
        const pathCoords = [
          {x: 13, y: 23},  // Level 1: Depan Sumur (Kiri Bawah)
          {x: 6,  y: 8},   // Level 2: Depan Rumah Biru (Kiri Atas)
          {x: 22, y: 17},  // Level 3: Depan Rumah Hijau (Tengah)
          {x: 21, y: 8},   // Level 4: Tangga Kemah (Tengah Atas)
          {x: 31, y: 11},  // Level 5: Depan Rumah Kincir (Kanan Atas)
          {x: 28, y: 24},  // Level 6 (Boss): Pantai Kanan Bawah
          // Fallback coords if > 6 levels
          {x: 26, y: 28},
          {x: 10, y: 28}
        ];
        
        let levels: CourseNodeData[] = [];
        
        const baseIdPrefix = tHouseId ? cId : cId.includes('-bab-') ? cId : `${iModuleId || moduleId}-bab-${cId}`;
        
        for (let i = 1; i <= numLevels; i++) {
          const isFirst = i === 1;
          const isLast = i === numLevels;
          const coords = pathCoords[(i-1) % pathCoords.length];
          const actualSection = tChapter.sections ? tChapter.sections[i-1] : null;
          
          let title = actualSection ? actualSection.title : `Level ${i}: Materi Praktik`;
          let badgeImage = '/book.png';
          let category: CourseNodeData['category'] = actualSection?.category === 'milestone' ? 'milestone' : 'skill';
          let npcKey = 'npc-professor';
          
          if (isFirst && !actualSection) {
            title = `Level 1: Teori Dasar`;
            badgeImage = '/first-step.png';
            category = 'foundation';
          } else if (isLast && !actualSection) {
            title = `Level ${i}: Boss Fight`;
            badgeImage = '/course-master.png';
            category = 'milestone';
          } else if (!actualSection) {
            title = `Level ${i}: Kuis Praktik`;
          }

          if (isFirst) {
            badgeImage = '/first-step.png';
            category = 'foundation';
          }
          if (category === 'milestone' || isLast) {
            badgeImage = '/course-master.png';
            npcKey = 'npc-wizard';
          } else {
            switch(i) {
              case 1: npcKey = 'npc-mentor'; break;
              case 2: npcKey = 'npc-recruiter'; break;
              case 3: npcKey = 'npc-scholarship'; break;
              case 4: npcKey = 'npc-professor'; break;
              case 5: npcKey = 'npc-ai-engineer'; break;
              default: npcKey = 'npc-professor'; break;
            }
          }
          
          levels.push({
            id: actualSection?.id || `${baseIdPrefix}-level-${i}`,
            missionId: actualSection?.missionId || undefined,
            title: title,
            description: actualSection ? `Materi dari bab ${tChapter.name}` : (isLast ? `Selesaikan tantangan Boss Fight!` : (isFirst ? `Pengenalan fundamental untuk ${tChapter.name}` : `Uji pemahamanmu tentang ${tChapter.name}`)),
            category: category,
            status: isFirst ? 'available' : 'locked',
            xp: actualSection?.xpReward || (isLast ? 300 : (isFirst ? 100 : 150)),
            x: coords.x,
            y: coords.y,
            prerequisites: isFirst ? [] : [actualSection ? tChapter.sections[i-2].id : `${baseIdPrefix}-level-${i-1}`],
            badgeImage: badgeImage,
            npcKey: npcKey,
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
        useMapStore.setState({ nodes: levels, isLoading: false, activeChapterId: chapterId ?? undefined }); // override store for Map Game
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

    if (role === 'SMA') {
      router.push(`/dreamer/learning-progress/${node.id}`);
    } else {
      router.push(`/chaser/learning-mission/mission/${node.id}`);
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
          sbtCount={0}
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
                router.push('/dreamer/dashboard');
              }
            } else {
              if (houseId) {
                router.push(`/chaser/learning-mission/house/${houseId}`);
              } else if (moduleId) {
                router.push(`/chaser/learning-mission/${moduleId}`);
              } else {
                router.push('/chaser/learning-mission');
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
