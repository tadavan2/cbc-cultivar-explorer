import { Cultivar } from '../types/cultivar';

interface CultivarCardProps {
  cultivar: Cultivar;
  isSelected: boolean;
  onClick: () => void;
}

export default function CultivarCard({ cultivar, isSelected, onClick }: CultivarCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cultivar-card relative ${isSelected ? 'selected' : ''}`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl">{cultivar.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-primary text-lg mb-1 truncate">{cultivar.name}</h3>
          <p className="text-secondary text-sm mb-3 flex items-center space-x-2">
            <span>{cultivar.type === 'Day-Neutral' ? '☀️' : '🌙'}</span>
            <span>{cultivar.type}</span>
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {cultivar.traits.slice(0, 2).map((trait) => (
              <span key={trait} className="trait-badge">
                {trait}
              </span>
            ))}
            {cultivar.traits.length > 2 && (
              <span className="trait-badge opacity-60">
                +{cultivar.traits.length - 2} more
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">📈</span>
              <div>
                <div className="text-secondary">Yield</div>
                <div className="text-primary font-semibold">{(cultivar.stats.yieldKgPerHa / 1000).toFixed(0)}t/ha</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">🍯</span>
              <div>
                <div className="text-secondary">Brix</div>
                <div className="text-primary font-semibold">{cultivar.stats.brix}°</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow"></div>
        </div>
      )}
    </div>
  );
} 