import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('spacedcards_deck');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cards', e);
      }
    }
    localStorage.setItem('spacedcards_deck', JSON.stringify(MOCK_CARDS));
    return MOCK_CARDS;
  });

  const cardsDueToday = useMemo(() => {
    const now = Date.now();
    return cards.filter(c => new Date(c.nextReview).getTime() <= now);
  }, [cards]);

  const [sessionTotal, setSessionTotal] = useState(cardsDueToday.length);
  const [isFlipped, setIsFlipped] = useState(false);

  // Se a fila de hoje aumentar durante a sessão (ex: card Difícil voltou após 1 minuto), ajustamos o total
  useEffect(() => {
    if (cardsDueToday.length > sessionTotal) {
      setSessionTotal(cardsDueToday.length);
    }
  }, [cardsDueToday.length, sessionTotal]);

  const currentCard = cardsDueToday[0] || null;
  const isFinished = cardsDueToday.length === 0;

  const handleFlip = useCallback(() => {
    if (!isFinished) {
      setIsFlipped(true);
    }
  }, [isFinished]);

  const handleReview = useCallback((level: 'Difícil' | 'Bom' | 'Fácil') => {
    if (!currentCard || !isFlipped) return;

    setIsFlipped(false);
    
    // Pequeno atraso para a animação de desvirar antes de trocar o cartão
    setTimeout(() => {
      setCards(prev => {
        const updatedCards = prev.map(card => {
          if (card.id === currentCard.id) {
            const now = new Date();
            let nextDate = new Date();

            switch (level) {
              case 'Difícil':
                // Repetir hoje: adiciona 1 minuto para voltar para o fim da fila caso haja outros
                nextDate = new Date(now.getTime() + 60 * 1000);
                break;
              case 'Bom':
                // Repetir em 2 dias
                nextDate.setDate(now.getDate() + 2);
                break;
              case 'Fácil':
                // Repetir em 5 dias
                nextDate.setDate(now.getDate() + 5);
                break;
            }

            return { ...card, nextReview: nextDate.toISOString() };
          }
          return card;
        });

        localStorage.setItem('spacedcards_deck', JSON.stringify(updatedCards));
        return updatedCards;
      });
    }, 150);
  }, [currentCard, isFlipped]);

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
    handleReview,
    sessionTotal,
    sessionReviewed: sessionTotal - cardsDueToday.length
  };
}
