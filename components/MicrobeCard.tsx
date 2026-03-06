import React from 'react';
import { Microbe, Trait } from '../types';
import { Microscope, Activity, Droplets, Thermometer } from 'lucide-react';

interface Props {
  microbe: Microbe;
  compact?: boolean;
  hideHints?: boolean;
}

const MicrobeCard: React.FC<Props> = ({ microbe, compact = false, hideHints = false }) => {
  const isGoodTrait = [Trait.FAST_REPRODUCTION, Trait.HIGH_YIELD, Trait.TOXIN_RESISTANCE, Trait.BIO_LUMINESCENCE].includes(microbe.trait);
  const isBadTrait = [Trait.OXYGEN_DEPLETION, Trait.INVASIVE, Trait.SLOW_GROWTH].includes(microbe.trait);

  let traitColorClass = 'bg-slate-700 border-slate-600 text-slate-300';
  
  if (!hideHints) {
    if (isGoodTrait) traitColorClass = 'bg-green-900/20 border-green-800 text-green-300';
    else if (isBadTrait) traitColorClass = 'bg-red-900/20 border-red-800 text-red-300';
  }

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-lg overflow-hidden flex flex-col h-full ${compact ? 'text-xs' : ''}`}>
      <div className={`p-3 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center ${compact ? 'py-2' : ''}`}>
        <div className="flex items-center gap-2">
          <Microscope className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-teal-400`} />
          <span className={`font-mono font-bold text-slate-200 ${compact ? 'text-xs' : 'text-sm'}`}>{microbe.name}</span>
        </div>
        <span className="text-slate-500 text-[10px] uppercase tracking-wider">{microbe.type}</span>
      </div>

      <div className={`flex-1 p-4 space-y-3 ${compact ? 'p-2 space-y-1' : ''}`}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-700/50 rounded p-2 text-center">
                <Thermometer className="w-3 h-3 mx-auto text-rose-400 mb-1" />
                <span className="text-slate-300 font-bold block">{microbe.temp}</span>
            </div>
            <div className="bg-slate-700/50 rounded p-2 text-center">
                <Droplets className="w-3 h-3 mx-auto text-sky-400 mb-1" />
                <span className="text-slate-300 font-bold block">{microbe.salinity}</span>
            </div>
            <div className="bg-slate-700/50 rounded p-2 text-center">
                <Activity className="w-3 h-3 mx-auto text-emerald-400 mb-1" />
                <span className="text-slate-300 font-bold block">{microbe.ph}</span>
            </div>
        </div>
        
        <div className={`pt-2 border-t border-slate-700/50 ${compact ? 'mt-1' : 'mt-2'}`}>
            <span className="text-slate-500 text-[10px] uppercase block mb-1">Genetic Trait</span>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${traitColorClass}`}>
                <span className="font-medium truncate">{microbe.trait}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MicrobeCard;