import Image from 'next/image';

const PIXEL_ICON_ASSETS: Record<string, string> = {
  '💻': '/px-js.jpg',
  '👨‍🎓': '/NPC University Student.png',
  '🎨': '/px-icon-badge.jpg',
  '📊': '/px-icon-book.jpg',
  '💼': '/Backpack.png',
  '🏥': '/Healing Potions.png',
  '⚖️': '/Scroll.png',
  '🧠': '/NPC Wizard.png',
  '🎓': '/Gold Ticket.png',
  '🚀': '/Sword.png',
  '🎯': '/Compass.png',
  '💡': '/Lantern.png',
  '🏆': '/course-master.png',
  '⭐': '/Energy Shard.png',
  '🛡️': '/Shield.png',
  '⚙️': '/Energy Shard.png',
  '💎': '/blue-gem.png',
  '🔗': '/Compass.png',
  '🔒': '/Keyhole.png',
  '📚': '/Book.png',
  '📜': '/Scroll.png',
  '🏗️': '/Sword.png',
  '🪙': '/Coin.png',
  '💰': '/Coin 2.png',
  '👑': '/Gold Ticket.png',
  '⚔️': '/Sword.png',
  '⚒️': '/Sword.png',
  '📡': '/Compass.png',
  '🌍': '/globe.svg',
  '🏠': '/Map.png',
  '🤖': '/NPC Wizard.png',
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
      style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
    />
  );
}
