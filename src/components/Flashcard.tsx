import type { Flashcard as FlashcardType } from '../types/Flashcard';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div 
      className="w-96 h-64 [perspective:1000px] cursor-pointer group"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full duration-500 preserve-3d shadow-xl rounded-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Lado Frontal */}
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl flex flex-col items-center justify-center p-8 border border-slate-100 dark:border-slate-700 transition-colors">
          <span className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-4">Pergunta</span>
          <h2 className="text-2xl font-bold text-center leading-snug">{card.front}</h2>
          {!isFlipped && (
            <p className="absolute bottom-4 text-xs text-slate-400 dark:text-slate-500 font-medium">Clique ou pressione Espaço para virar</p>
          )}
        </div>

        {/* Lado Verso */}
        <div className="absolute w-full h-full backface-hidden bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl flex flex-col items-center justify-center p-8 rotate-y-180 shadow-inner transition-colors">
          <span className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-4">Resposta</span>
          <p className="text-xl text-center leading-relaxed font-medium">{card.back}</p>
        </div>
      </div>
    </div>
  );
}
