import React, { useState } from 'react';
import { Site, Trait } from '../types';
import { Target, Search, X, Plus, Settings2 } from 'lucide-react';

interface Stage1Props {
  site: Site;
  onComplete: () => void;
}

const Stage1Profiling: React.FC<Stage1Props> = ({ site, onComplete }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  // Filter Builder State
  const [activeTab, setActiveTab] = useState<'physical' | 'traits'>('physical');
  const [activeAttribute, setActiveAttribute] = useState<string | null>(null);
  const [rangeStart, setRangeStart] = useState<number>(4);

  const attributes = ["Temperature", "Salinity", "pH"];
  const allTraits = Object.values(Trait).filter(t => t !== Trait.NONE);

  const removeFilter = (f: string) => {
    setSelectedFilters(selectedFilters.filter(item => item !== f));
  };

  const addPhysicalFilter = () => {
    if (activeAttribute && selectedFilters.length < 2) {
        const filter = `${activeAttribute}: ${rangeStart}-${rangeStart + 2}`;
        if (!selectedFilters.includes(filter)) {
            setSelectedFilters([...selectedFilters, filter]);
            setActiveAttribute(null); // Reset after adding
        }
    }
  };

  const addTraitFilter = (t: string) => {
    if (selectedFilters.length < 2 && !selectedFilters.includes(t)) {
        setSelectedFilters([...selectedFilters, t]);
    }
  };

  const handleSearch = () => {
    setIsReady(true);
    setTimeout(() => {
        onComplete();
    }, 1500); 
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="text-teal-400" />
          Stage 1: Site Profiling
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Requirements Review */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-teal-300 mb-6">Site 0{site.id} Requirements</h3>
          
          <div className="space-y-6">
            <div>
                <h4 className="text-slate-400 text-xs uppercase mb-3">Environmental Ranges (1-10)</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-700/50 p-2 rounded text-center">
                        <div className="text-xs text-slate-400">Temp</div>
                        <div className="font-mono text-lg font-bold text-white">{site.requirements.temp.min}-{site.requirements.temp.max}</div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded text-center">
                        <div className="text-xs text-slate-400">Salinity</div>
                        <div className="font-mono text-lg font-bold text-white">{site.requirements.salinity.min}-{site.requirements.salinity.max}</div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded text-center">
                        <div className="text-xs text-slate-400">pH</div>
                        <div className="font-mono text-lg font-bold text-white">{site.requirements.ph.min}-{site.requirements.ph.max}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-green-400 block text-xs uppercase mb-2">Desirable Traits</span>
                  <div className="flex flex-col gap-2">
                    {site.requirements.desirable.map(t => (
                      <span key={t} className="px-2 py-1 bg-green-900/20 border border-green-700/50 text-green-300 text-xs rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-red-400 block text-xs uppercase mb-2">Avoid Traits</span>
                  <div className="flex flex-col gap-2">
                    {site.requirements.undesirable.map(t => (
                      <span key={t} className="px-2 py-1 bg-red-900/20 border border-red-700/50 text-red-300 text-xs rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Filter Configuration */}
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-teal-400"/>
                    Configure Database Filters
                </h3>
                <p className="text-xs text-slate-400 mt-1">Select up to 2 parameters to refine the microbial search.</p>
            </div>

            {/* Active Filters Display */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 mb-4 min-h-[80px]">
                <div className="text-xs text-slate-500 uppercase mb-2">Active Filters ({selectedFilters.length}/2)</div>
                <div className="flex flex-wrap gap-2">
                    {selectedFilters.length === 0 && <span className="text-slate-600 text-sm italic">No filters selected.</span>}
                    {selectedFilters.map(f => (
                        <div key={f} className="bg-teal-900/30 border border-teal-700/50 text-teal-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 animate-in zoom-in duration-200">
                            <span>{f}</span>
                            <button onClick={() => removeFilter(f)} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Creator */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex-1 flex flex-col">
                <div className="flex border-b border-slate-700">
                    <button 
                        onClick={() => setActiveTab('physical')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'physical' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
                    >
                        Physical Attributes
                    </button>
                    <button 
                        onClick={() => setActiveTab('traits')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'traits' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
                    >
                        Genetic Traits
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {activeTab === 'physical' ? (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                {attributes.map(attr => (
                                    <button
                                        key={attr}
                                        onClick={() => setActiveAttribute(attr)}
                                        className={`flex-1 py-2 px-1 rounded text-sm border transition-all ${activeAttribute === attr ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                                    >
                                        {attr}
                                    </button>
                                ))}
                            </div>

                            {activeAttribute && (
                                <div className="bg-slate-900/50 p-4 rounded border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs text-slate-400 uppercase block mb-2">Select Range ({activeAttribute})</label>
                                    <div className="flex items-center gap-4 mb-4">
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="8" 
                                            step="1"
                                            value={rangeStart}
                                            onChange={(e) => setRangeStart(parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                        />
                                        <div className="bg-slate-800 px-3 py-1 rounded border border-slate-600 font-mono text-white min-w-[60px] text-center">
                                            {rangeStart}-{rangeStart + 2}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={addPhysicalFilter}
                                        disabled={selectedFilters.length >= 2}
                                        className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Filter
                                    </button>
                                </div>
                            )}
                            {!activeAttribute && (
                                <div className="text-center text-slate-500 text-sm py-8">Select an attribute to configure range.</div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {allTraits.map(trait => (
                                <button
                                    key={trait}
                                    onClick={() => addTraitFilter(trait)}
                                    disabled={selectedFilters.includes(trait) || selectedFilters.length >= 2}
                                    className={`px-3 py-2 rounded text-sm text-left border flex items-center gap-2 ${
                                        selectedFilters.includes(trait) 
                                            ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed'
                                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                                    }`}
                                >
                                    {trait}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleSearch}
                disabled={selectedFilters.length !== 2 || isReady}
                className={`w-full mt-4 py-4 rounded-lg font-bold text-lg transition-all flex justify-center items-center gap-2 ${
                    selectedFilters.length === 2 && !isReady
                        ? 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
            >
                {isReady ? (
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 animate-spin" />
                        Running Database Scan...
                    </div>
                ) : (
                    <>Initiate Scan ({selectedFilters.length}/2)</>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Stage1Profiling;