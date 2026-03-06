import React, { useState } from 'react';
import { Microbe, Site } from '../types';
import { Check, AlertTriangle, Target } from 'lucide-react';

interface Props {
  pool: Microbe[];
  site: Site;
  onComplete: (selected: Microbe[]) => void;
}

const Stage4Treatment: React.FC<Props> = ({ pool, site, onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedMicrobes = pool.filter(m => selectedIds.includes(m.id));
  
  const handleSubmit = () => {
    onComplete(selectedMicrobes);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Left: Pool Selection */}
      <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Stage 4: Treatment Formulation</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedIds.length === 3 ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                Selected: {selectedIds.length}/3
            </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
                        <th className="p-2">Name</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">T/S/pH</th>
                        <th className="p-2">Trait</th>
                        <th className="p-2">Select</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {pool.map(m => (
                        <tr 
                            key={m.id} 
                            onClick={() => toggleSelection(m.id)}
                            className={`border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedIds.includes(m.id) ? 'bg-teal-900/20' : ''}`}
                        >
                            <td className="p-3 font-mono text-slate-200">{m.name}</td>
                            <td className="p-3 text-slate-400">{m.type}</td>
                            <td className="p-3 text-slate-300 font-mono">
                                {m.temp}/{m.salinity}/{m.ph}
                            </td>
                            <td className="p-3">
                                <span className={`text-xs px-2 py-0.5 rounded border border-slate-700 ${
                                    site.requirements.desirable.includes(m.trait) ? 'text-green-400 border-green-900' :
                                    site.requirements.undesirable.includes(m.trait) ? 'text-rose-400 border-rose-900' : 'text-slate-500'
                                }`}>
                                    {m.trait}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                    selectedIds.includes(m.id) 
                                        ? 'bg-teal-500 border-teal-500' 
                                        : 'border-slate-600'
                                }`}>
                                    {selectedIds.includes(m.id) && <Check className="w-3 h-3 text-slate-900" />}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Right: Manual Calculation Required */}
      <div className="w-full lg:w-80 bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col">
        <h3 className="text-lg font-bold text-teal-300 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Targets
        </h3>
        
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 mb-6">
            <p className="text-sm text-slate-400 mb-4 italic">
                Calculator offline. Manual aggregation required.
            </p>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Target Temp</span>
                        <span className="text-white font-mono">{site.requirements.temp.min} - {site.requirements.temp.max}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 w-full opacity-30"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Target Salinity</span>
                        <span className="text-white font-mono">{site.requirements.salinity.min} - {site.requirements.salinity.max}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 w-full opacity-30"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Target pH</span>
                        <span className="text-white font-mono">{site.requirements.ph.min} - {site.requirements.ph.max}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 w-full opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4 mb-auto">
            {selectedIds.length < 3 && (
                <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-900/20 p-3 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    Select {3 - selectedIds.length} more microbes.
                </div>
            )}
            
            <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-500">
                Ensure the average of selected microbes falls within the target ranges.
            </div>
        </div>

        <button 
            onClick={handleSubmit}
            disabled={selectedIds.length !== 3}
            className={`w-full py-4 rounded-lg font-bold text-lg mt-4 transition-all ${
                selectedIds.length === 3
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
        >
            Deploy Treatment
        </button>
      </div>
    </div>
  );
};

export default Stage4Treatment;