import { Cultivar } from '../types/cultivar';
import CultivarCard from './CultivarCard';

interface CultivarListProps {
  cultivars: Cultivar[];
  selectedCultivar: Cultivar;
  onSelectCultivar: (cultivar: Cultivar) => void;
}

export default function CultivarList({ cultivars, selectedCultivar, onSelectCultivar }: CultivarListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-bold text-primary mb-2">Premium Cultivars</h2>
        <p className="text-sm text-secondary flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>{cultivars.length} varieties available</span>
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cultivars.map((cultivar) => (
          <CultivarCard
            key={cultivar.id}
            cultivar={cultivar}
            isSelected={selectedCultivar.id === cultivar.id}
            onClick={() => onSelectCultivar(cultivar)}
          />
        ))}
      </div>
    </div>
  );
} 