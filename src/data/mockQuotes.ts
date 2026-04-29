/**
 * Moment — 목업 명언 데이터 (개발용)
 * 기존 프로토타입 데이터 기반, 추후 Supabase 연동 시 제거
 */

export interface MockQuote {
  id: string;
  text: string;
  author: string;
  authorRole: string;
  categories: string[];
}

export const mockQuotes: MockQuote[] = [
  {
    id: 'q_001',
    text: '삶이 있는 한 희망은 있다.',
    author: '키케로',
    authorRole: 'ROMAN PHILOSOPHER',
    categories: ['지혜'],
  },
  {
    id: 'q_002',
    text: '산다는 것, 그것은 충분히 행복한 것이다.',
    author: '알베르 카뮈',
    authorRole: 'FRENCH AUTHOR',
    categories: ['행복'],
  },
  {
    id: 'q_003',
    text: '우리가 두려워해야 할 것은 두려움 그 자체뿐이다.',
    author: '프랭클린 D. 루즈벨트',
    authorRole: '32ND U.S. PRESIDENT',
    categories: ['용기'],
  },
  {
    id: 'q_004',
    text: '진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라 새로운 눈을 갖는 것이다.',
    author: '마르셀 프루스트',
    authorRole: 'FRENCH NOVELIST',
    categories: ['성장', '지혜'],
  },
  {
    id: 'q_005',
    text: '행복은 습관이다. 그것을 몸에 지니라.',
    author: '허버드',
    authorRole: 'AMERICAN WRITER',
    categories: ['행복'],
  },
  {
    id: 'q_006',
    text: '가장 큰 영광은 한 번도 실패하지 않음이 아니라 실패할 때마다 다시 일어서는 데에 있다.',
    author: '공자',
    authorRole: 'CHINESE PHILOSOPHER',
    categories: ['용기', '성장'],
  },
  {
    id: 'q_007',
    text: '오늘 할 수 있는 일에 전력을 다하라. 그러면 내일에는 한 걸음 더 진보한다.',
    author: '아이작 뉴턴',
    authorRole: 'ENGLISH PHYSICIST',
    categories: ['노력'],
  },
];
