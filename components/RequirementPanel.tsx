import React from 'react';
import { Site } from '../types';
import { Target } from 'lucide-react';

interface Props {
  site: Site;
  nextSiteClue?: string;
}

const RequirementPanel: React.FC<Props> = ({ site, nextSiteClue }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-teal-400 font-bold mb-4 flex items-center gap-2">
        <Target className="w-4 h-4" />
        Site Parameters
      </h3>
      
      <div className="space-y-4 flex-1">
        <div>
          <h4 className="text-xs text-slate-500 uppercase mb-2">Target Ranges (1-10)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-slate-800 rounded">
              <span className="text-slate-300">Temp</span>
              <span className="text-white font-mono">{site.requirements.temp.min} - {site.requirements.temp.max}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800 rounded">
              <span className="text-slate-300">Salinity</span>
              <span className="text-white font-mono">{site.requirements.salinity.min} - {site.requirements.salinity.max}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-800 rounded">
              <span className="text-slate-300">pH</span>
              <span className="text-white font-mono">{site.requirements.ph.min} - {site.requirements.ph.max}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs text-slate-500 uppercase mb-2">Traits</h4>
          <div className="space-y-2">
            <div>
                <span className="text-green-500 text-xs block mb-1">Seek:</span>
                {site.requirements.desirable.map(t => (
                  <div key={t} className="px-2 py-1 bg-slate-800 border border-green-900/30 text-green-400 text-xs rounded mb-1">
                    {t}
                  </div>
                ))}
            </div>
            <div>
                <span className="text-rose-500 text-xs block mb-1">Avoid:</span>
                {site.requirements.undesirable.map(t => (
                  <div key={t} className="px-2 py-1 bg-slate-800 border border-rose-900/30 text-rose-400 text-xs rounded mb-1">
                    {t}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {nextSiteClue && (
        <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs text-amber-500 uppercase mb-2">Next Site Intel</h4>
            <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded text-amber-200 text-sm font-mono">
                {nextSiteClue}
            </div>
        </div>
      )}
    </div>
  );
};

export default RequirementPanel;