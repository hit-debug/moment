import { create } from 'zustand';

export interface JournalEntry {
  id: string;
  date: string;
  quoteText: string;
  author: string;
  userText: string;
}

const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'j_1',
    date: '2026년 4월 28일',
    quoteText: '행동이 두려움을 없앤다',
    author: '인디라 간디',
    userText: '오늘 시작한 것만으로도 충분하다. 어제보다 조금 나은 오늘이면 된다.',
  },
  {
    id: 'j_2',
    date: '2026년 4월 27일',
    quoteText: '성장은 편안함의 경계 너머에 있다',
    author: '존 맥스웰',
    userText: '오늘 새벽에 읽고 마음이 흔들렸다. 정말 편안한 자리를 떠날 용기가 있을까?',
  },
  {
    id: 'j_3',
    date: '2026년 4월 25일',
    quoteText: '두려워해야 할 유일한 것은 두려움 자체다',
    author: '루즈벨트',
    userText: '면접 전날 이 문장을 읽었다. 심호흡하고 들어갔더니 생각보다 잘 됐다.',
  },
  {
    id: 'j_4',
    date: '2026년 4월 10일',
    quoteText: '시작이 반이다',
    author: '아리스토텔레스',
    userText: '오랫동안 미뤄왔던 운동을 오늘 드디어 시작했다.',
  },
  {
    id: 'j_5',
    date: '2026년 3월 15일',
    quoteText: '가장 큰 위험은 위험을 감수하지 않는 것이다',
    author: '마크 주커버그',
    userText: '이직을 고민하던 중 이 명언을 보았다. 결심을 굳히는 데 도움이 되었다.',
  },
  {
    id: 'j_6',
    date: '2026년 3월 5일',
    quoteText: '인생은 우리가 만드는 것이다',
    author: '엘리너 루즈벨트',
    userText: '내 삶의 주도권은 나에게 있다. 환경을 탓하지 말자.',
  },
];

interface JournalState {
  journals: JournalEntry[];
  addJournal: (entry: JournalEntry) => void;
  updateJournal: (id: string, userText: string) => void;
  deleteJournal: (id: string) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  journals: INITIAL_JOURNALS,
  addJournal: (entry) => set((state) => ({ journals: [entry, ...state.journals] })),
  updateJournal: (id, userText) => set((state) => ({
    journals: state.journals.map(j => j.id === id ? { ...j, userText } : j)
  })),
  deleteJournal: (id) => set((state) => ({
    journals: state.journals.filter(j => j.id !== id)
  })),
}));
