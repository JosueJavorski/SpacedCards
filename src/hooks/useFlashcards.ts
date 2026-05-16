import { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '../types/Flashcard';

const MOCK_CARDS: Flashcard[] = [
  {
    id: '1',
    front: 'O que é Closures em JavaScript?',
    back: 'É a capacidade de uma função lembrar do escopo em que foi criada, mesmo após ser executada.',
    nextReview: new Date().toISOString(),
  },
  {
    id: '2',
    front: 'Qual a diferença entre let e var?',
    back: 'var tem escopo de função, let tem escopo de bloco.',
    nextReview: new Date().toISOString(),
  },
  {
    id: '3',
    front: 'O que é o Event Loop?',
    back: 'É o mecanismo que permite ao Node.js/Browser realizar operações não-bloqueantes (I/O), repassando operações ao sistema sempre que possível.',
    nextReview: new Date().toISOString(),
  },
  {
    id: '4',
    front: 'O que significa SOLID?',
    back: 'Cinco princípios de design orientado a objetos: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation e Dependency Inversion.',
    nextReview: new Date().toISOString(),
  }
];

export function useFlashcards() {
  const [cards] = useState<Flashcard[]>(MOCK_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    if (!isFinished) {
      setIsFlipped(true);
    }
  }, [isFinished]);

  const handleReview = useCallback((level: 'Difícil' | 'Bom' | 'Fácil') => {
    if (!currentCard || !isFlipped) return;

    console.log(`Cartão ID: ${currentCard.id} | Nível: ${level}`);

    setIsFlipped(false);
    
    // Pequeno atraso para a animação de desvirar antes de trocar o cartão
    setTimeout(() => {
      if (currentIndex + 1 < cards.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 150);
  }, [currentCard, isFlipped, currentIndex, cards.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (!isFlipped && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleFlip();
        return;
      }

      if (isFlipped) {
        switch (e.key) {
          case '1':
            handleReview('Difícil');
            break;
          case '2':
            handleReview('Bom');
            break;
          case '3':
            handleReview('Fácil');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isFinished, handleFlip, handleReview]);

  return {
    currentCard,
    isFlipped,
    isFinished,
    handleFlip,
    handleReview
  };
}
