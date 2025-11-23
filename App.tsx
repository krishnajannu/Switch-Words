import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Menu, Heart, Sparkles, Home, ChevronRight, 
  X, Compass, Feather, ChevronDown, ChevronUp, Layers, List,
  ArrowUpDown, Sun, Calendar, CheckCircle
} from 'lucide-react';
import { RAW_DATA_STRING, parseData } from './raw_data';
import { CategoryStructure, SwitchWordItem, ViewState } from './types';
import ChantModal from './components/ChantModal';
import AIAssistant from './components/AIAssistant';

// --- Sub-components for Cleaner App.tsx ---

const Toast = ({ message, isVisible }: { message: string; isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-brand-dark text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-brand-sky/20">
        <div className="bg-brand-orange rounded-full p-1">
          <CheckCircle size={14} className="text-white" />
        </div>
        <span className="font-medium text-sm tracking-wide">{message}</span>
      </div>
    </div>
  );
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  badgeCount
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  badgeCount?: number
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
      active 
        ? 'bg-brand-sky/20 text-brand-dark font-semibold' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-dark'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={20} className={active ? 'text-brand-dark' : 'text-slate-400'} />
      <span>{label}</span>
    </div>
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        active ? 'bg-brand-orange text-white' : 'bg-slate-200 text-slate-600'
      }`}>
        {badgeCount}
      </span>
    )}
  </button>
);

interface SwitchWordCardProps {
  item: SwitchWordItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onChant: () => void;
  variant?: 'default' | 'featured';
}

const SwitchWordCard: React.FC<SwitchWordCardProps> = ({ 
  item, 
  isFavorite, 
  onToggleFavorite, 
  onChant,
  variant = 'default'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
  };

  if (variant === 'featured') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-brand-primary rounded-3xl p-6 md:p-8 shadow-xl text-white">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-yellow/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-sky/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-brand-yellow text-xs font-bold tracking-widest uppercase">
              <Sparkles size={14} />
              <span>Cosmic Message for You</span>
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-2">
                {item.phrase}
              </h3>
              <p className="text-brand-sky text-lg opacity-90">{item.goal}</p>
            </div>
            <div className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-medium text-brand-sky">
               {item.category} • {item.subcategory}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <button
              onClick={handleFavoriteClick}
              className={`p-3 rounded-xl backdrop-blur-md border border-white/20 transition-all ${
                isFavorite ? 'bg-white text-brand-orange' : 'bg-white/10 text-white hover:bg-white/20'
              } ${isAnimating ? 'scale-110' : ''}`}
             >
               <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
             </button>
             <button
               onClick={onChant}
               className="flex-1 md:flex-none px-6 py-3 bg-brand-yellow text-brand-dark rounded-xl font-bold hover:bg-brand-orange hover:text-white transition-colors shadow-lg"
             >
               Start Chanting
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Card
  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase bg-brand-sky/10 px-2 py-1 rounded-md truncate max-w-[70%]">
            {item.subcategory}
          </span>
          <button 
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-all duration-300 relative flex-shrink-0 ${
              isFavorite 
                ? 'text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20' 
                : 'text-slate-400 hover:text-brand-orange hover:bg-slate-100'
            } ${isAnimating ? 'scale-125 bg-brand-orange/20 shadow-inner ring-4 ring-brand-orange/10' : 'active:scale-90'}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              fill={isFavorite ? "currentColor" : "none"} 
              className={`transition-all duration-300 ${isAnimating ? 'fill-brand-orange stroke-brand-orange' : ''}`}
            />
          </button>
        </div>
        <h3 className="text-lg font-medium text-brand-dark leading-snug mb-4">{item.goal}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100 group-hover:border-brand-sky/50 transition-colors">
          <p className="text-lg font-bold text-slate-700 tracking-wide break-words">{item.phrase}</p>
        </div>
        
        <button 
          onClick={onChant}
          className="w-full py-2.5 rounded-xl bg-brand-dark text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-brand-primary"
        >
          Start Chanting
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // Data State - Initialize synchronously to allow immediate lookup for persisted state
  const [categories] = useState<CategoryStructure[]>(() => parseData(RAW_DATA_STRING));
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // UI State - Initialize from localStorage to restore session
  const [view, setView] = useState<ViewState>(() => {
    try {
      const saved = localStorage.getItem('lumina_view');
      if (saved === 'home' || saved === 'favorites' || saved === 'assistant') {
        return saved as ViewState;
      }
    } catch (e) {}
    return 'home';
  });

  const [activeCategory, setActiveCategory] = useState<CategoryStructure | null>(() => {
    try {
      const savedName = localStorage.getItem('lumina_active_category_name');
      if (savedName) {
        // We can access 'categories' here because it's defined in the scope above
        return categories.find(c => c.name === savedName) || null;
      }
    } catch (e) {}
    return null;
  });

  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(() => {
    try {
      // Only restore subcategory if category is also being restored
      const savedCatName = localStorage.getItem('lumina_active_category_name');
      if (!savedCatName) return null;
      
      return localStorage.getItem('lumina_active_subcategory');
    } catch (e) {
      return null;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chantItem, setChantItem] = useState<SwitchWordItem | null>(null);
  const [sortBy, setSortBy] = useState<'goal' | 'phrase'>('goal');
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Persist expanded categories state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    try {
      const saved = localStorage.getItem('lumina_expanded_categories');
      if (saved) {
        JSON.parse(saved).forEach((cat: string) => initialSet.add(cat));
      }
    } catch (e) {}

    // UX Improvement: Always expand the active category if one is restored
    const savedActiveCat = localStorage.getItem('lumina_active_category_name');
    if (savedActiveCat) {
      initialSet.add(savedActiveCat);
    }
    
    return initialSet;
  });

  // Helper to get random word
  const getRandomSwitchWord = () => {
    const allItems = categories.flatMap(c => c.subcategories.flatMap(s => s.items));
    if (allItems.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * allItems.length);
    return allItems[randomIndex];
  };

  // Featured Word State
  const [featuredWord, setFeaturedWord] = useState<SwitchWordItem | null>(() => getRandomSwitchWord());

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('lumina_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lumina_expanded_categories', JSON.stringify(Array.from(expandedCategories)));
  }, [expandedCategories]);

  useEffect(() => {
    localStorage.setItem('lumina_view', view);
  }, [view]);

  useEffect(() => {
    if (activeCategory) {
      localStorage.setItem('lumina_active_category_name', activeCategory.name);
    } else {
      localStorage.removeItem('lumina_active_category_name');
    }
  }, [activeCategory]);

  useEffect(() => {
    if (activeSubcategory) {
      localStorage.setItem('lumina_active_subcategory', activeSubcategory);
    } else {
      localStorage.removeItem('lumina_active_subcategory');
    }
  }, [activeSubcategory]);

  // Helper: Show Toast
  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, show: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Actions
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(id);
      if (isFavorite) {
        showToast('Removed from Favorites');
        return prev.filter(fid => fid !== id);
      } else {
        showToast('Added to Favorites');
        return [...prev, id];
      }
    });
  };

  const handleChant = (item: SwitchWordItem) => {
    setChantItem(item);
  };

  const toggleCategoryExpansion = (catName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catName)) {
        next.delete(catName);
      } else {
        next.add(catName);
      }
      return next;
    });
  };

  // Used for dashboard navigation to category
  const handleCategoryClick = (cat: CategoryStructure) => {
    setActiveCategory(cat);
    setActiveSubcategory(null);
    setSortBy('goal'); // Reset sort to default
    
    // Ensure category is expanded in sidebar when navigating from dashboard
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.add(cat.name);
      return next;
    });

    setView('home');
    // Scroll to top when entering a category
    scrollContainerRef.current?.scrollTo(0, 0);
  };

  // Used for sidebar "View All" link
  const handleViewAllCategory = (cat: CategoryStructure) => {
    setActiveCategory(cat);
    setActiveSubcategory(null);
    setSortBy('goal'); // Reset sort to default
    setView('home');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    scrollContainerRef.current?.scrollTo(0, 0);
  };

  const handleSubcategoryClick = (cat: CategoryStructure, subName: string) => {
    setActiveCategory(cat);
    setActiveSubcategory(subName);
    setSortBy('goal'); // Reset sort to default
    setView('home');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    scrollContainerRef.current?.scrollTo(0, 0);
  };

  const resetToLibrary = () => {
    setView('home');
    setActiveCategory(null);
    setActiveSubcategory(null);
    setIsSidebarOpen(false);
    setChantItem(null);
    setSortBy('goal');
    
    // Refresh the featured word
    setFeaturedWord(getRandomSwitchWord());

    // Reset scroll position to top instantly to prevent lag
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
    const allItems = categories.flatMap(c => c.subcategories.flatMap(s => s.items));
    
    if (view === 'favorites') {
      return allItems.filter(item => favorites.includes(item.id));
    }
    
    // Category Navigation Logic
    if (activeCategory) {
      if (activeSubcategory) {
         const sub = activeCategory.subcategories.find(s => s.name === activeSubcategory);
         return sub ? sub.items : [];
      }
      return activeCategory.subcategories.flatMap(s => s.items);
    }

    return []; 
  }, [categories, view, activeCategory, activeSubcategory, favorites]);

  // Sorting Logic
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'goal') {
        return a.goal.localeCompare(b.goal);
      } else {
        return a.phrase.localeCompare(b.phrase);
      }
    });
  }, [filteredItems, sortBy]);

  // --- Render Helpers ---

  const renderContent = () => {
    if (view === 'assistant') {
      return <AIAssistant />;
    }

    // Home View (Dashboard) - Only shown if no active category selected
    if (view === 'home' && !activeCategory) {
      return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
           <header className="mb-8 text-center md:text-left">
             <h1 className="text-4xl font-light text-brand-dark mb-2">Switch Words <span className="font-bold text-brand-primary">Hub</span></h1>
             <p className="text-slate-500">Select a category from the sidebar to begin manifesting.</p>
           </header>

           {/* Switch Word of the Day */}
           {featuredWord && (
             <div className="mb-10 animate-in slide-in-from-top-2 duration-500">
               <SwitchWordCard 
                 item={featuredWord}
                 isFavorite={favorites.includes(featuredWord.id)}
                 onToggleFavorite={() => toggleFavorite(featuredWord.id)}
                 onChant={() => handleChant(featuredWord)}
                 variant="featured"
               />
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  className="group relative bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-16 bg-gradient-to-br from-brand-sky/20 to-white rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-brand-sky/20 text-brand-primary flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <Feather size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-dark mb-1">{cat.name}</h3>
                    <p className="text-sm text-slate-400">{cat.subcategories.length} Topics</p>
                  </div>
                </button>
              ))}
           </div>
        </div>
      );
    }

    // List View (Items)
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
                {activeCategory && view === 'home' && (
                <button 
                    onClick={() => { setActiveCategory(null); setActiveSubcategory(null); scrollContainerRef.current?.scrollTo(0,0); }} 
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors mr-2"
                    title="Back to Categories"
                >
                    <ChevronRight className="rotate-180" size={20} />
                </button>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-400 uppercase tracking-wider font-medium">
                    {view === 'home' && activeCategory && (
                        <>
                            <span>{activeCategory.name}</span>
                            {activeSubcategory && (
                                <>
                                    <ChevronRight size={12} />
                                    <span className="text-brand-primary">{activeSubcategory}</span>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            <h2 className="text-3xl font-bold text-brand-dark mt-2">
              {view === 'favorites' ? 'Your Favorites' : 
              activeSubcategory ? activeSubcategory : 
              activeCategory ? `All ${activeCategory.name}` : ''}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{filteredItems.length} switch words found</p>
          </div>

          {/* Sort Controls */}
          {filteredItems.length > 0 && (
            <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <div className="px-2 flex items-center text-slate-400">
                    <ArrowUpDown size={14} />
                </div>
                <div className="flex">
                    <button
                        onClick={() => setSortBy('goal')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            sortBy === 'goal' 
                            ? 'bg-brand-sky/20 text-brand-primary shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        Goal
                    </button>
                    <button
                        onClick={() => setSortBy('phrase')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            sortBy === 'phrase' 
                            ? 'bg-brand-sky/20 text-brand-primary shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        Phrase
                    </button>
                </div>
            </div>
          )}
        </header>

        {sortedItems.length === 0 ? (
          view === 'favorites' ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">No favorites yet</h3>
              <p className="text-slate-500 max-w-xs text-center mb-6">
                Save your favorite switch words by tapping the heart icon to access them quickly here.
              </p>
              <button 
                onClick={resetToLibrary}
                className="px-6 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-full text-sm font-medium transition-colors"
              >
                Browse Library
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Compass size={48} className="mb-4 opacity-50" />
              <p>No switch words found.</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {sortedItems.map(item => (
              <SwitchWordCard 
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onChant={() => handleChant(item)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
      {/* Toast Notification */}
      <Toast message={toast.message} isVisible={toast.show} />

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div 
            className="flex items-center space-x-2 text-brand-dark cursor-pointer"
            onClick={resetToLibrary}
          >
            <Layers size={28} className="text-brand-primary" />
            <span className="text-xl font-bold tracking-tight">Hub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <NavItem 
            icon={Home} 
            label="Library" 
            active={view === 'home' && !activeCategory} 
            onClick={resetToLibrary} 
          />
          <NavItem 
            icon={Sparkles} 
            label="AI Assistant" 
            active={view === 'assistant'} 
            onClick={() => { setView('assistant'); setIsSidebarOpen(false); scrollContainerRef.current?.scrollTo(0,0); }} 
          />
          <NavItem 
            icon={Heart} 
            label="Favorites" 
            active={view === 'favorites'} 
            onClick={() => { setView('favorites'); setIsSidebarOpen(false); scrollContainerRef.current?.scrollTo(0,0); }} 
            badgeCount={favorites.length}
          />

          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
             <span>Categories</span>
          </div>
          
          <div className="space-y-1">
            {categories.map((cat) => {
              const isExpanded = expandedCategories.has(cat.name);
              const isActive = activeCategory?.name === cat.name;

              return (
                <div key={cat.name} className="px-1">
                  <button
                    onClick={() => toggleCategoryExpansion(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive || isExpanded ? 'text-brand-dark bg-brand-sky/20' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    title={cat.name}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-brand-primary' : 'bg-slate-300'}`}></span>
                        <span className="font-medium truncate">{cat.name}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="flex-shrink-0 ml-2" /> : <ChevronDown size={14} className="flex-shrink-0 ml-2" />}
                  </button>

                  {/* Subcategories Accordion */}
                  {isExpanded && (
                    <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                      {/* View All Button */}
                      <button
                        onClick={() => handleViewAllCategory(cat)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors flex items-center gap-2 ${
                           isActive && !activeSubcategory ? 'text-brand-primary font-semibold bg-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                         <List size={12} />
                         View All
                      </button>

                      {cat.subcategories.map(sub => (
                        <button
                          key={sub.name}
                          onClick={() => handleSubcategoryClick(cat, sub.name)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors block truncate ${
                            activeSubcategory === sub.name ? 'text-brand-primary font-semibold bg-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                          title={sub.name}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Wrapper - Flex column to separate Header from Scroll Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative">
        {/* Fixed Header */}
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            
            <button 
              onClick={resetToLibrary}
              className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-full transition-colors"
              title="Go to Home"
            >
              <Home size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
           {renderContent()}
        </div>
      </main>

      {/* Chant Modal */}
      {chantItem && (
        <ChantModal item={chantItem} onClose={() => setChantItem(null)} />
      )}
    </div>
  );
};

export default App;