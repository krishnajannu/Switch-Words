import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Copy, Check, Stars, Zap, Heart, Brain, Wallet, Shield } from 'lucide-react';
import { generateSwitchWord } from '../services/geminiService';

// Loading messages to keep user engaged
const LOADING_MESSAGES = [
  "Aligning with universal frequencies...",
  "Consulting the energetic archives...",
  "Crafting your power vibration...",
  "Synthesizing ancient wisdom...",
  "Manifesting your solution..."
];

const QUICK_TAGS = [
  { label: "Attract Money", icon: Wallet, prompt: "I want to attract unexpected money and abundance quickly." },
  { label: "Find Love", icon: Heart, prompt: "I want to attract a loyal and loving romantic partner." },
  { label: "Peace & Calm", icon: Shield, prompt: "I am feeling overwhelmed and anxious, I need peace." },
  { label: "Focus & Success", icon: Brain, prompt: "I need laser focus to finish my work and succeed." },
  { label: "Energy Boost", icon: Zap, prompt: "I feel tired and drained, I need a burst of vitality." },
];

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ phrase: string, explanation: string, ritual: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Cycle loading messages
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (overrideInput?: string) => {
    const textToUse = overrideInput || input;
    if (!textToUse.trim()) return;
    
    // Update input if tag was clicked
    if (overrideInput) setInput(overrideInput);

    setLoading(true);
    setResult(null);
    setCopied(false);
    
    try {
      const text = await generateSwitchWord(textToUse);
      
      // Robust Parsing
      const phraseMatch = text.match(/PHRASE:\s*(.*)/i);
      const wisdomMatch = text.match(/WISDOM:\s*(.*)/i);
      const ritualMatch = text.match(/RITUAL:\s*(.*)/i);
      
      const phrase = phraseMatch ? phraseMatch[1].trim() : "TOGETHER-DIVINE-BE"; // Fallback
      
      // Handle multi-line extractions or fallback
      let explanation = wisdomMatch ? wisdomMatch[1].trim() : "This phrase connects you to the universal flow.";
      // Clean up if the regex captured too much (e.g. stopped at next keyword)
      if (explanation.includes('RITUAL:')) explanation = explanation.split('RITUAL:')[0].trim();

      const ritual = ritualMatch ? ritualMatch[1].trim() : "Visualize the words glowing in gold light as you chant.";

      setResult({ phrase, explanation, ritual });
    } catch (e) {
      setResult({ 
        phrase: "CANCEL-CLEAR-DELETE", 
        explanation: "We encountered a cosmic glitch. Please try again to realign.",
        ritual: "Take a deep breath and press the button again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-brand-sky/30 to-brand-primary/10 mb-2 shadow-sm border border-white/50">
            <Sparkles size={28} className="text-brand-primary animate-pulse" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight">Cosmic Energy Mentor</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Share your heart's intention. Using advanced metaphysical logic, we will craft a 
          <span className="font-semibold text-brand-primary"> personalized energetic frequency </span> 
          just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-white/50">
              <label className="block text-sm font-bold text-brand-dark mb-3 uppercase tracking-wider">Your Intention</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to manifest or heal (e.g., 'I want to feel confident in my presentation')..."
                className="w-full h-40 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white transition-all outline-none resize-none text-brand-dark placeholder:text-slate-400 leading-relaxed"
              />
              
              <button 
                onClick={() => handleGenerate()}
                disabled={loading || !input.trim()}
                className="w-full mt-4 bg-brand-dark hover:bg-brand-primary disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-semibold text-lg"
              >
                {loading ? (
                  <>
                     <Stars className="animate-spin" /> Channeling...
                  </>
                ) : (
                  <>
                     Channel My Phrase <ArrowRight size={20} />
                  </>
                )}
              </button>
           </div>

           {/* Quick Tags */}
           <div className="space-y-3">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Or choose a quick focus</p>
             <div className="flex flex-wrap justify-center gap-2">
               {QUICK_TAGS.map((tag) => (
                 <button
                   key={tag.label}
                   onClick={() => handleGenerate(tag.prompt)}
                   disabled={loading}
                   className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-brand-primary hover:bg-brand-sky/10 rounded-full text-sm font-medium text-slate-600 hover:text-brand-dark transition-all"
                 >
                   <tag.icon size={14} />
                   {tag.label}
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-full min-h-[400px] bg-brand-dark/5 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
               <div className="relative">
                 <div className="absolute inset-0 bg-brand-primary blur-xl opacity-20 animate-pulse rounded-full"></div>
                 <Stars size={48} className="text-brand-primary animate-spin-slow relative z-10" />
               </div>
               <h3 className="mt-6 text-xl font-medium text-brand-dark animate-pulse">
                 {LOADING_MESSAGES[loadingMsgIndex]}
               </h3>
            </div>
          ) : result ? (
            <div className="bg-gradient-to-br from-brand-dark via-slate-900 to-brand-primary rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
               
               {/* Decorative background blobs */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

               <div className="relative z-10 space-y-8">
                  
                  {/* The Phrase Section */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-brand-sky text-xs font-bold tracking-widest uppercase mb-4">
                      <Sparkles size={12} /> Your Cosmic Code
                    </div>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-sky to-brand-yellow tracking-tight leading-none drop-shadow-sm mb-6 break-words">
                      {result.phrase}
                    </div>
                    
                    <button 
                      onClick={handleCopy}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        copied 
                          ? 'bg-brand-primary border-brand-primary text-white scale-105' 
                          : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                      }`}
                    >
                      {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Phrase'}</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <div className="grid md:grid-cols-2 gap-8">
                     {/* Wisdom */}
                     <div className="space-y-2">
                        <h4 className="text-brand-yellow font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                          <Brain size={16} /> Why this works
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          "{result.explanation}"
                        </p>
                     </div>

                     {/* Ritual */}
                     <div className="space-y-2">
                        <h4 className="text-brand-sky font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                          <Stars size={16} /> Ritual
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-brand-primary/50 pl-3">
                          {result.ritual}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-brand-sky/10 rounded-full flex items-center justify-center mb-6">
                 <Sparkles size={32} className="text-brand-primary opacity-50" />
               </div>
               <h3 className="text-xl font-bold text-brand-dark mb-2">Ready to Manifest?</h3>
               <p className="text-slate-500 max-w-xs">
                 Select a quick tag on the left or type your own intention to receive your personalized energy code.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;