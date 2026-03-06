import React, { useState, useEffect } from 'react';
import { Microbe, Site } from '../types';
import MicrobeCard from './MicrobeCard';
import RequirementPanel from './RequirementPanel';
import { generateMicrobe } from '../services/gameLogic';
import { FlaskConical } from 'lucide-react';

interface Props {
  currentPool: Microbe[];
  site: Site;
  onComplete: (added: Microbe[]) => void;
}

const Stage3Prospecting: React.FC<Props> = ({ currentPool, site, onComplete }) => {
  const TARGET_POOL_SIZE = 10;
  const NEEDED = Math.max(0, TARGET_POOL_SIZE - currentPool.length);
  
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<Microbe[]>([]);
  const [selected, setSelected] = useState<Microbe[]>([]);

  useEffect(() => {
    if (round < NEEDED) {
        setOptions([
            generateMicrobe(`pros-${round}-1`),
            generateMicrobe(`pros-${round}-2`),
            generateMicrobe(`pros-${round}-3`),
        ]);
    } else if (round === NEEDED && NEEDED > 0) {
        onComplete(selected);
    } else if (NEEDED === 0) {
        onComplete([]);
    }
  }, [round, NEEDED]);

  const handleSelect = (m: Microbe) => {
    const newSelected = [...selected, m];
    setSelected(newSelected);
    setRound(round + 1);
  };

  if (NEEDED === 0) return null;
  if (round >= NEEDED) return <div className="text-white text-center text-xl animate-pulse">Analyzing final pool composition...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      {/* Left: Requirements & Current Pool */}
      <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 overflow-hidden">
         <div className="flex-shrink-0">
             <RequirementPanel site={site} />
         </div>
         
         <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-hidden flex flex-col">
            <h3 className="text-slate-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase">
                <FlaskConical className="w-4 h-4" />
                Current Pool ({currentPool.length})
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {currentPool.map(m => (
                    <div key={m.id} className="bg-slate-800 p-2 rounded border border-slate-700 text-xs">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-teal-300 truncate">{m.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 font-mono mb-1">
                            <span>T:{m.temp}</span>
                            <span>S:{m.salinity}</span>
                            <span>pH:{m.ph}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{m.trait}</div>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Right: Choices */}
      <div className="flex-1 flex flex-col">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Stage 3: Prospecting</h2>
            <p className="text-slate-400">Select {NEEDED} more microbes. Round {round + 1} of {NEEDED}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-center">
            {options.map((m) => (
                <div 
                    key={m.id} 
                    className="cursor-pointer transform hover:-translate-y-2 transition-transform duration-200 relative group h-96"
                    onClick={() => handleSelect(m)}
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        SELECT
                    </div>
                    <div className="h-full">
                        <MicrobeCard microbe={m} hideHints={true} />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stage3Prospecting;