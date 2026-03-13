import { Analytics } from '@vercel/analytics/react';
import React, { useState, useEffect } from 'react';
import { GameStage, Site, Microbe, ScoringResult } from './types';
import { generateSites, calculateScore } from './services/gameLogic';
import Stage1Profiling from './components/Stage1Profiling';
import Stage2Sieve from './components/Stage2Sieve';
import Stage3Prospecting from './components/Stage3Prospecting';
import Stage4Treatment from './components/Stage4Treatment';
import { Clock, Waves, Award, Play, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [sites] = useState<Site[]>(generateSites());
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [stage, setStage] = useState<GameStage>(GameStage.INTRO);
  
  // Pools
  const [currentPool, setCurrentPool] = useState<Microbe[]>([]);
  const [nextSitePool, setNextSitePool] = useState<Microbe[]>([]);
  
  // Timer (30 mins = 1800s)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isActive, setIsActive] = useState(false);

  // Score Tracking
  const [totalScore, setTotalScore] = useState(0);
  const [lastResult, setLastResult] = useState<ScoringResult | null>(null);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setStage(GameStage.GAME_OVER);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startGame = () => {
    setStage(GameStage.TUTORIAL);
  };

  const startMission = () => {
    setIsActive(true);
    setStage(GameStage.PROFILING);
  };

  const handleStage1Complete = () => {
    setStage(GameStage.CATEGORIZATION);
  };

  const handleStage2Complete = (kept: Microbe[], saved: Microbe[]) => {
    setCurrentPool([...currentPool, ...kept]);
    setNextSitePool([...nextSitePool, ...saved]); // Accumulate for next site
    setStage(GameStage.PROSPECTING);
  };

  const handleStage3Complete = (added: Microbe[]) => {
    setCurrentPool(prev => [...prev, ...added]);
    setStage(GameStage.TREATMENT);
  };

  const handleStage4Complete = (selected: Microbe[]) => {
    const result = calculateScore(selected, sites[currentSiteIndex]);
    setLastResult(result);
    setTotalScore(prev => prev + result.score);
    setStage(GameStage.SCORING);
  };

  const nextSite = () => {
    if (currentSiteIndex < sites.length - 1) {
        setCurrentSiteIndex(prev => prev + 1);
        setCurrentPool([...nextSitePool]); // Import saved microbes
        setNextSitePool([]); // Clear stash
        setStage(GameStage.PROFILING);
    } else {
        setStage(GameStage.GAME_OVER);
        setIsActive(false);
    }
  };

  const currentSite = sites[currentSiteIndex];
  const followingSite = currentSiteIndex < sites.length - 1 ? sites[currentSiteIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-teal-500/10 p-2 rounded-lg">
                    <Waves className="text-teal-400 w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-white leading-tight">Sea Wolf</h1>
                    <div className="text-xs text-slate-500 font-mono">SIMULATION_V3.1</div>
                </div>
            </div>

            {stage !== GameStage.INTRO && stage !== GameStage.TUTORIAL && stage !== GameStage.GAME_OVER && (
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <span className="text-xs text-slate-500 uppercase block">Current Site</span>
                        <span className="text-teal-300 font-bold">{currentSiteIndex + 1} / {sites.length}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-slate-500 uppercase block">Score</span>
                        <span className="text-white font-mono font-bold">{totalScore}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft < 300 ? 'bg-red-900/20 border-red-800 text-red-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-teal-400'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {stage === GameStage.INTRO && (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-teal-500 blur-3xl opacity-20 rounded-full"></div>
                    <Waves className="w-24 h-24 text-teal-400 relative z-10" />
                </div>
                <h1 className="text-5xl font-bold text-white mb-6">Sea Wolf Simulator</h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                    Welcome to the Ocean Treatment Optimization assessment. You will manage 3 microbial treatment sites.
                    Balance temperature, salinity, and pH while optimizing for genetic traits. 
                    <br/><br/>
                    <strong className="text-teal-400">Time Limit: 30 Minutes.</strong>
                </p>
                <button 
                    onClick={startGame}
                    className="group bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition-all shadow-lg shadow-teal-500/20 hover:scale-105"
                >
                    <Play className="w-6 h-6 fill-current" />
                    Initialize Simulation
                </button>
             </div>
        )}

        {stage === GameStage.TUTORIAL && (
             <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-700 rounded-xl p-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                    <div className="bg-teal-500/10 p-3 rounded-xl">
                        <BookOpen className="w-8 h-8 text-teal-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Mission Briefing</h2>
                        <p className="text-slate-400">Review the protocol before the timer begins.</p>
                    </div>
                </div>

                <div className="space-y-6 text-slate-300 mb-10">
                    <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-xl font-bold text-teal-400 mb-2">Your Objective</h3>
                        <p>You are tasked with treating 3 distinct oceanic sites using engineered microbes. Each site has specific environmental requirements for Temperature, Salinity, and pH, along with desirable and undesirable genetic traits.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                            <h4 className="font-bold text-white mb-1">1. Profiling</h4>
                            <p className="text-sm">Analyze the target site's environmental constraints and trait requirements.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                            <h4 className="font-bold text-white mb-1">2. Categorization</h4>
                            <p className="text-sm">Filter a raw sample of microbes. Keep the ones you need, and stash others for future sites.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                            <h4 className="font-bold text-white mb-1">3. Prospecting</h4>
                            <p className="text-sm">Review your curated pool and select the best candidates for the current site.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                            <h4 className="font-bold text-white mb-1">4. Treatment</h4>
                            <p className="text-sm">Deploy the microbes. Your score is based on how well the average stats of your selected microbes match the site's needs.</p>
                        </div>
                    </div>

                    <div className="bg-amber-900/20 border border-amber-900/50 p-4 rounded-lg flex items-start gap-4">
                        <Clock className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-500">Time is of the essence</h4>
                            <p className="text-sm text-amber-200/70">Once you begin, you will have exactly 30 minutes to complete all 3 sites. The timer does not pause between stages.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={startMission}
                        className="group bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition-all shadow-lg shadow-teal-500/20 hover:scale-105"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Begin Mission
                    </button>
                </div>
             </div>
        )}

        {stage === GameStage.PROFILING && (
            <Stage1Profiling site={currentSite} onComplete={handleStage1Complete} />
        )}

        {stage === GameStage.CATEGORIZATION && (
            <Stage2Sieve 
                site={currentSite} 
                nextSite={followingSite}
                onComplete={handleStage2Complete} 
            />
        )}

        {stage === GameStage.PROSPECTING && (
            <Stage3Prospecting 
                currentPool={currentPool} 
                site={currentSite}
                onComplete={handleStage3Complete} 
            />
        )}

        {stage === GameStage.TREATMENT && (
            <Stage4Treatment pool={currentPool} site={currentSite} onComplete={handleStage4Complete} />
        )}

        {stage === GameStage.SCORING && lastResult && (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-700 rounded-xl p-8 text-center animate-in zoom-in duration-300">
                <Award className={`w-16 h-16 mx-auto mb-6 ${lastResult.passed ? 'text-green-400' : 'text-amber-400'}`} />
                <h2 className="text-3xl font-bold text-white mb-2">{lastResult.passed ? 'Site Treated Successfully' : 'Treatment Sub-Optimal'}</h2>
                <div className="text-6xl font-black text-white mb-8 font-mono">{lastResult.score}<span className="text-2xl text-slate-500">/100</span></div>
                
                <div className="bg-slate-800 rounded-lg p-6 mb-8 text-left space-y-2">
                    {lastResult.breakdown.map((line, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${line.includes('+20') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-slate-300">{line}</span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={nextSite}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-3 rounded-lg font-bold text-lg w-full transition-colors"
                >
                    {currentSiteIndex < sites.length - 1 ? "Proceed to Next Site" : "Finalize Report"}
                </button>
            </div>
        )}

        {stage === GameStage.GAME_OVER && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Simulation Complete</h2>
                <p className="text-slate-400 mb-8">Final Aggregate Score</p>
                <div className="text-8xl font-black text-teal-400 mb-8">{totalScore}</div>
                <p className="text-slate-500 max-w-md mx-auto">
                    The Sea Wolf protocol has concluded. Your results have been logged for the assessment board.
                </p>
                <button onClick={() => window.location.reload()} className="mt-8 text-slate-400 hover:text-white underline">
                    Restart Simulation
                </button>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
