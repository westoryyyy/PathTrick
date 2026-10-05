import Image from 'next/image';

const PIXEL_ICON_ASSETS: Record<string, string> = {
  // ICT & Tech
  '💻': '/gics_it.png',
  '🤖': '/NPC AI Engineer.png',
  // Engineering & Architecture
  '🏗️': '/gics_real_estate.png',
  '⚙️': '/gics_ind.png',
  // Health & Medicine
  '🩺': '/Healing Potions.png',
  '💊': '/Red Potion 1.png',
  // Business & Management
  '💼': '/gics_fin.png',
  '📈': '/Coin 2.png',
  // Law & Public Policy
  '⚖️': '/Scroll.png',
  '🏛️': '/px-icon-badge.jpg',
  // Social Sciences
  '📡': '/Letter.png',
  '🌍': '/Word Map.png',
  '🧠': '/NPC Mentor.png',
  // Education
  '🏫': '/npc-professor.png',
  '📚': '/book 2.png',
  // Arts & Humanities
  '🎨': '/Lantern.png',
  '✍️': '/Journall.png',
  // Science & Math
  '📐': '/Compass Rose.png',
  '🧪': '/Mana Potion.png',
  // Agriculture & Environment
  '🌾': '/gics_staples.png',
  '🌲': '/gics_material.png',

  // Others / Defaults
  '👨‍🎓': '/NPC University Student.png',
  '📊': '/px-icon-book.jpg',
  '🎓': '/Gold Ticket.png',
  '🚀': '/Sword.png',
  '🎯': '/Compass.png',
  '💡': '/Lantern.png',
  '🏆': '/course-master.png',
  '⭐': '/Energy Shard.png',
  '🛡️': '/Shield.png',
  '💎': '/blue-gem.png',
  '🔗': '/Compass.png',
  '🔒': '/Keyhole.png',
  '📜': '/Scroll.png',
  '🪙': '/Coin.png',
  '💰': '/Coin 2.png',
  '👑': '/Gold Ticket.png',
  '⚔️': '/Sword.png',
  '⚒️': '/Sword.png',
  '🏠': '/Map.png',
  '🏦': '/gics_fin.png',
  '🛍️': '/gics_disc.png',
  '🏭': '/gics_ind.png',
  '⚡': '/gics_energy.png',
  '⚗️': '/gics_material.png',
  '💧': '/gics_util.png',
  '🏢': '/gics_real_estate.png',
};

export function pixelAssetFor(icon: string): string {
  return PIXEL_ICON_ASSETS[icon] ?? '/Energy Shard.png';
}

export default function PixelIcon({
  icon,
  size = 32,
  alt = '',
  className,
}: {
  icon: string;
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src={pixelAssetFor(icon)}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', imageRendering: 'pixelated', height: 'auto' }}
    />
  );
}
