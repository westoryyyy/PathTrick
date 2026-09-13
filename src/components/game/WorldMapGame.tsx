'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { CourseNodeData } from '@/phaser/config';
import { WORLD_MAP_EVENTS } from '@/phaser/scenes/WorldMapScene';

interface WorldMapGameProps {
  onNodeSelected: (node: CourseNodeData) => void;
  onNodeNearby:   (node: CourseNodeData) => void;
  onNodeLeave:    () => void;
}

export default function WorldMapGame({
  onNodeSelected,
  onNodeNearby,
  onNodeLeave,
}: WorldMapGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameRef = useRef<any>(null);

  const initGame = useCallback(async () => {
    if (!containerRef.current || gameRef.current) return;

    // Dynamically import Phaser (browser-only, avoid SSR)
    const Phaser = (await import('phaser')).default;
    const { WorldMapScene } = await import('@/phaser/scenes/WorldMapScene');
    const { GAME_CONFIG } = await import('@/phaser/config');

    const container = containerRef.current;
    if (!container || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...GAME_CONFIG,
      type: Phaser.CANVAS,
      width:  container.clientWidth  || window.innerWidth,
      height: container.clientHeight || window.innerHeight,
      parent: container,
      scene:  [WorldMapScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Wire Phaser events → React callbacks
    game.events.on(WORLD_MAP_EVENTS.NODE_SELECTED, onNodeSelected);
    game.events.on(WORLD_MAP_EVENTS.NODE_NEARBY,   onNodeNearby);
    game.events.on(WORLD_MAP_EVENTS.NODE_LEAVE,    onNodeLeave);
  }, [onNodeSelected, onNodeNearby, onNodeLeave]);

  useEffect(() => {
    initGame();
    // Ensure the container gets focus so keyboard input (WASD) works immediately
    if (containerRef.current) {
      containerRef.current.focus();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.events?.off(WORLD_MAP_EVENTS.NODE_SELECTED, onNodeSelected);
        gameRef.current.events?.off(WORLD_MAP_EVENTS.NODE_NEARBY,   onNodeNearby);
        gameRef.current.events?.off(WORLD_MAP_EVENTS.NODE_LEAVE,    onNodeLeave);
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      id="phaser-world-map"
      tabIndex={0}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        background: '#0a0e1a',
        outline: 'none', // hide focus ring
      }}
    />
  );
}
