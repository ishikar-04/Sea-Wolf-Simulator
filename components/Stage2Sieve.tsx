import React, { useState, useEffect } from 'react';
import { Microbe, Site } from '../types';
import MicrobeCard from './MicrobeCard';
import RequirementPanel from './RequirementPanel';
import { generateMicrobe } from '../services/gameLogic';
import { Archive, Save, Trash2 } from 'lucide-react';

interface Stage2Props {
  onComplete: (kept: Microbe[], saved: Microbe[]) => void;
  site: Site;
  nextSite?: Site;
}

const Stage2Sieve: React.FC<Stage2Props> = ({ onComplete, site, nextSite }) => {
  const [queue, setQueue] = useState<Microbe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kept, setKept] = useState<Microbe[]>([]);
  const [saved, setSaved] = useState<Microbe[]>([]);
  const [nextSiteClue, setNextSiteClue] = useState<string>("");

  useEffect(() => {
    // Generate 10 microbes for screening
    const newQueue = Array.from({ length: 10 }).map((_, i) => 
        generateMicrobe(`sieve-${site.id}-${i}`)
    );
    setQueue(newQueue);

    // Generate specific metric clue for next site if available
    if (nextSite) {
        const metrics = [
            `Temp range: ${nextSite.requirements.temp.min}-${nextSite.requirements.temp.max}`,
            `Salinity range: ${nextSite.requirements.salinity.min}-${nextSite.requirements.salinity.max}`,
            `pH range: ${nextSite.requirements.ph.min}-${nextSite.requirements.ph.max}`
        ];
        setNextSiteClue(metrics[Math.floor(Math.random() * metrics.length)]);
    } else {
        setNextSiteClue("No further sites.");
    }

  }, [site.id, nextSite]);

  const handleAction = (action: 'KEEP' | 'SAVE' | 'REJECT') => {
    const currentMicrobe = queue[currentIndex];
    
    if (action === 'KEEP') {
        setKept([...kept, currentMicrobe]);
    } else if (action === 'SAVE') {
        setSaved([...saved, currentMicrobe]);
    }
    // REJECT does nothing but move index

    if (currentIndex < queue.length - 1) {
        setCurrentIndex(currentIndex + 1);
    } else {
        const finalKept = action === 'KEEP' ? [...kept, currentMicrobe] : kept;
        const finalSaved = action === 'SAVE' ? [...saved, currentMicrobe] : saved;
        onComplete(finalKept, finalSaved);
    }
  };

  const currentMicrobe = queue[currentIndex];

  if (!currentMicrobe) return <div className="text-white">Loading Sieve...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px]">
        {/* Left: Requirements & Intel */}
        <div className="w-full lg:w-72 flex-shrink-0">
            <RequirementPanel site={site} nextSiteClue={nextSiteClue} />
        </div>

        {/* Right: Sieve Interaction */}
        <div className="flex-1 flex flex-col">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Stage 2: The Sieve</h2>
                <div className="flex justify-center gap-6 text-sm font-mono bg-slate-900/50 py-2 rounded-full inline-flex px-6 mx-auto border border-slate-800">
                    <span className="text-teal-400">Kept: {kept.length}</span>
                    <span className="text-slate-500">Left: {queue.length - currentIndex}</span>
                    <span className="text-amber-400">Saved: {saved.length}</span>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="relative h-96 w-full max-w-sm">
                    <MicrobeCard microbe={currentMicrobe} hideHints={true} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-auto">
                <button 
                    onClick={() => handleAction('KEEP')}
                    className="flex flex-col items-center justify-center p-4 bg-teal-900/30 border border-teal-600/50 rounded-xl hover:bg-teal-900/50 transition-colors group"
                >
                    <Archive className="w-6 h-6 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-teal-200 font-bold">Keep (S1)</span>
                </button>

                <button 
                    onClick={() => handleAction('SAVE')}
                    className="flex flex-col items-center justify-center p-4 bg-amber-900/30 border border-amber-600/50 rounded-xl hover:bg-amber-900/50 transition-colors group"
                >
                    <Save className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-amber-200 font-bold">Save (Next)</span>
                </button>

                <button 
                    onClick={() => handleAction('REJECT')}
                    className="flex flex-col items-center justify-center p-4 bg-rose-900/30 border border-rose-600/50 rounded-xl hover:bg-rose-900/50 transition-colors group"
                >
                    <Trash2 className="w-6 h-6 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-rose-200 font-bold">Reject</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Stage2Sieve;