import { useFlashcards } from './hooks/useFlashcards';
import { useTheme } from './hooks/useTheme';
import { Flashcard } from './components/Flashcard';
import { Brain, Frown, Meh, Smile, Sun, Moon } from 'lucide-react';

export default function App() {
  const { currentCard, isFlipped, isFinished, handleFlip, handleReview, sessionTotal, sessionReviewed } = useFlashcards();
  const { isDark, toggleTheme } = useTheme();

  const progressPercent = sessionTotal > 0 ? Math.round((sessionReviewed / sessionTotal) * 100) : 100;

  const ThemeToggle = () => (
    <button 
      onClick={toggleTheme} 
      className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900"
      aria-label="Alternar tema"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
        <ThemeToggle />
        <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100 dark:border-slate-700 transform transition-all hover:-translate-y-1">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4">Parabéns!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Você revisou todos os cartões de hoje!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <ThemeToggle />
      
      <div className="max-w-2xl w-full flex flex-col items-center mt-8">
        {/* Header & Progress */}
        <div className="mb-10 text-center w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-3 transition-colors">
            <Brain className="text-indigo-600 dark:text-indigo-400" size={36} />
            Spaced<span className="text-indigo-600 dark:text-indigo-400">Cards</span>
          </h1>
          
          <div className="mt-8 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progresso Diário</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                {sessionReviewed} / {sessionTotal}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Área do Flashcard */}
        <div className="relative z-10">
          {currentCard && (
            <Flashcard 
              card={currentCard} 
              isFlipped={isFlipped} 
              onFlip={handleFlip} 
            />
          )}
        </div>

        {/* Área de Ações */}
        <div className={`mt-10 transition-all duration-500 w-full max-w-md ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 mb-4 font-bold uppercase tracking-widest">Como foi a revisão?</p>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => handleReview('Difícil')}
              className="flex flex-col items-center justify-center gap-2 py-4 px-2 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-2xl hover:bg-red-50 dark:hover:bg-slate-700 hover:border-red-200 dark:hover:border-red-800/50 hover:shadow-md transition-all group text-red-600 dark:text-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50"
            >
              <Frown className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Difícil</span>
              <span className="text-[10px] bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-md text-red-700 dark:text-red-300 opacity-80 group-hover:opacity-100 transition-opacity">Tecla 1</span>
            </button>
            <button 
              onClick={() => handleReview('Bom')}
              className="flex flex-col items-center justify-center gap-2 py-4 px-2 bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900/30 rounded-2xl hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-md transition-all group text-amber-500 dark:text-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/50"
            >
              <Meh className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Bom</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded-md text-amber-700 dark:text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity">Tecla 2</span>
            </button>
            <button 
              onClick={() => handleReview('Fácil')}
              className="flex flex-col items-center justify-center gap-2 py-4 px-2 bg-white dark:bg-slate-800 border border-green-100 dark:border-green-900/30 rounded-2xl hover:bg-green-50 dark:hover:bg-slate-700 hover:border-green-200 dark:hover:border-green-800/50 hover:shadow-md transition-all group text-green-600 dark:text-green-400 focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/50"
            >
              <Smile className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Fácil</span>
              <span className="text-[10px] bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-md text-green-700 dark:text-green-300 opacity-80 group-hover:opacity-100 transition-opacity">Tecla 3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
