import React, { useState, useEffect } from 'react';
import { SwitchWordItem } from '../types';
import { X, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ChantModalProps {
  item: SwitchWordItem;
  onClose: () => void;
}

// Internal Confetti Component to avoid external dependencies
const ConfettiExplosion = () => {
  const particles = Array.from({ length: 50 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10%) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .confetti-piece {
            position: absolute;
            top: -20px;
            width: 10px;
            height: 10px;
            animation: fall linear forwards;
          }
        `}
      </style>
      {particles.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;
        const bg = ['#fbbf24', '#219ebc', '#8ecae6', '#fb8500', '#fff'][Math.floor(Math.random() * 5)];
        
        return (
          <div
            key={i}
            className="confetti-piece rounded-sm shadow-sm"
            style={{
              left: `${left}%`,
              backgroundColor: bg,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

const ChantModal: React.FC<ChantModalProps> = ({ item, onClose }) => {
  const TARGET = 108;
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [feedback, setFeedback] = useState(false);
  const isComplete = count >= TARGET;

  // Auto-increment logic
  useEffect(() => {
    let interval: any;
    if (isActive && mode === 'auto' && count < TARGET) {
      interval = setInterval(() => {
        setCount(prev => prev + 1);
      }, 2000); // 2 seconds per chant
    } else if (count >= TARGET) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, mode, count]);

  const handleManualCount = () => {
    if (mode === 'manual' && count < TARGET) {
      setCount(prev => prev + 1);
      setFeedback(true);
      setTimeout(() => setFeedback(false), 100);
    }
  };

  // SVG Configuration
  const size = 320;
  const center = size / 2;
  const radius = 120;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Clamp progress to 100%
  const progress = Math.min((count / TARGET) * 100, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark/95 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Celebration Overlay */}
      {isComplete && <ConfettiExplosion />}

      {/* Scrollable Container Wrapper */}
      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 md:p-8 relative">
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl opacity-50 transition-all duration-1000 ${isComplete ? 'bg-brand-orange/20 scale-150' : ''}`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl opacity-50 transition-all duration-1000 ${isComplete ? 'bg-brand-sky/20 scale-150' : ''}`}></div>
        </div>

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/5 backdrop-blur-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="relative z-10 flex flex-col items-center max-w-lg w-full space-y-8 md:space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4 pt-8 md:pt-0">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-sky/10 border border-brand-sky/20 text-brand-sky text-xs font-medium tracking-wider uppercase">
               <span>{item.subcategory || item.category}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-sky to-brand-primary tracking-tight leading-tight px-2 text-balance">
              {item.phrase}
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg max-w-sm mx-auto">{item.goal}</p>
          </div>

          {/* Interaction Area */}
          <div className="relative flex flex-col items-center justify-center">
              {/* The Circle Container */}
              <div 
                  className={`relative group cursor-pointer transition-transform duration-100 ease-out select-none ${feedback ? 'scale-95' : 'scale-100'}`}
                  onClick={handleManualCount}
                  style={{ width: 'min(80vw, 320px)', height: 'min(80vw, 320px)' }}
              >
                  {/* Glow effect behind circle */}
                  <div className={`absolute inset-0 blur-3xl rounded-full transition-all duration-1000 ${
                    isComplete 
                      ? 'bg-brand-yellow/30 opacity-100 animate-pulse' 
                      : 'bg-brand-primary/20 opacity-0 group-hover:opacity-40'
                  }`}></div>
                  
                  {/* Responsive SVG */}
                  <svg 
                    viewBox={`0 0 ${size} ${size}`} 
                    className="w-full h-full transform -rotate-90 drop-shadow-2xl overflow-visible"
                  >
                      {/* Background Circle */}
                      <circle
                          cx={center}
                          cy={center}
                          r={radius}
                          stroke="currentColor"
                          strokeWidth={strokeWidth}
                          fill="transparent"
                          className="text-slate-800/50"
                      />
                      {/* Progress Circle */}
                      <circle
                          cx={center}
                          cy={center}
                          r={radius}
                          stroke="currentColor"
                          strokeWidth={strokeWidth}
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className={`transition-all duration-300 ease-out ${
                             isComplete ? 'text-brand-yellow drop-shadow-[0_0_10px_rgba(255,183,3,0.6)]' : 'text-brand-primary'
                          }`}
                      />
                  </svg>

                  {/* Center Content - Absolutely positioned to fill the container */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className={`text-6xl md:text-7xl font-mono font-light tracking-tighter tabular-nums leading-none transition-colors duration-500 ${
                        isComplete ? 'text-brand-yellow scale-110 drop-shadow-md' : 'text-white'
                      }`}>
                          {count}
                      </span>
                      <span className={`text-xs md:text-sm font-medium tracking-widest mt-3 uppercase transition-colors duration-300 ${
                        isComplete ? 'text-brand-orange' : 'text-slate-500'
                      }`}>
                          of {TARGET}
                      </span>
                  </div>

                  {/* Tap Hint */}
                  {mode === 'manual' && !isComplete && (
                      <div className="absolute -bottom-12 inset-x-0 text-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest animate-pulse">Tap circle to count</span>
                      </div>
                  )}
              </div>
          </div>

          {/* Controls */}
          <div className="w-full flex justify-center pb-4">
            <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
               <button 
                 onClick={(e) => {
                    e.stopPropagation();
                    setCount(0);
                    setIsActive(false);
                 }}
                 className="p-3 md:p-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
                 title="Reset Counter"
               >
                  <RotateCcw size={20} />
               </button>

               <div className="h-8 w-px bg-white/10 mx-1"></div>

               {isComplete ? (
                   <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-yellow/20 to-brand-orange/20 text-brand-yellow border border-brand-yellow/30 flex items-center space-x-2 font-bold tracking-wide animate-in zoom-in duration-300 shadow-[0_0_15px_rgba(255,183,3,0.2)]">
                       <Sparkles size={18} className="animate-spin-slow" />
                       <span>Complete</span>
                   </div>
               ) : (
                 <div className="flex items-center bg-black/20 rounded-xl p-1 border border-white/5">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setMode('manual'); setIsActive(false); }}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                            mode === 'manual' 
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        Manual
                    </button>
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation();
                            setMode('auto'); 
                            if (mode !== 'auto') setIsActive(true);
                            else setIsActive(!isActive);
                        }}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                            mode === 'auto' 
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {isActive && mode === 'auto' ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        Auto
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChantModal;