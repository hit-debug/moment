export type Quote = {
  id: string;
  categories: string[];
  text: string;
  author: string;
  author_role: string;
  bg_image: string;
};

export const mockQuotes: Quote[] = [
  {
    id: "q001",
    categories: ["성장", "습관"],
    text: "작은 전진이라도 매일 반복되면 결국 아무도 막을 수 없는 힘이 된다.",
    author: "제임스 클리어",
    author_role: "《아주 작은 습관의 힘》 저자",
    bg_image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  },
  {
    id: "q002",
    categories: ["용기"],
    text: "두려움이 사라질 때까지 기다리지 마라. 두려움을 느끼면서도 그냥 해라.",
    author: "수전 제퍼스",
    author_role: "심리학자 · 자기계발 작가",
    bg_image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  },
  {
    id: "q003",
    categories: ["평온", "명상"],
    text: "지금 이 순간이 언제나 그랬던 것처럼 될 것이다.",
    author: "에크하르트 톨레",
    author_role: "영적 지도자 · 《지금 이 순간을 살아라》 저자",
    bg_image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  },
];

export type ThemeConcept = "nature" | "city" | "mood";

export type Theme = {
  id: number;
  name: string;
  concept: ThemeConcept;
  image: string;
};

export const mockThemes: Theme[] = [
  { id: 0,  name: "설산의 새벽",   concept: "nature", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
  { id: 1,  name: "바다 안개",     concept: "nature", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
  { id: 2,  name: "가을 숲길",     concept: "nature", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400" },
  { id: 3,  name: "사막의 노을",   concept: "nature", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400" },
  { id: 4,  name: "눈 내린 들판",  concept: "nature", image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400" },
  { id: 5,  name: "벚꽃 새벽",     concept: "nature", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400" },
  { id: 6,  name: "푸른 호수",     concept: "nature", image: "https://images.unsplash.com/photo-1439853949212-36689a8d2c85?w=400" },
  { id: 7,  name: "초원의 빛",     concept: "nature", image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400" },
  { id: 8,  name: "폭포 소리",     concept: "nature", image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400" },
  { id: 9,  name: "밤하늘 별",     concept: "nature", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400" },
  { id: 10, name: "도심 야경",     concept: "city",   image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400" },
  { id: 11, name: "빗속의 거리",   concept: "city",   image: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=400" },
  { id: 12, name: "새벽 카페",     concept: "city",   image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400" },
  { id: 13, name: "지하철 빛",     concept: "city",   image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400" },
  { id: 14, name: "골목의 오후",   concept: "city",   image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400" },
  { id: 15, name: "고층의 구름",   concept: "city",   image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400" },
  { id: 16, name: "브릿지 황혼",   concept: "city",   image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400" },
  { id: 17, name: "공항의 새벽",   concept: "city",   image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400" },
  { id: 18, name: "창문의 빗줄기", concept: "city",   image: "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=400" },
  { id: 19, name: "심야 편의점",   concept: "city",   image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=400" },
  { id: 20, name: "촛불과 책",     concept: "mood",   image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
  { id: 21, name: "손끝의 커피",   concept: "mood",   image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
  { id: 22, name: "낡은 편지",     concept: "mood",   image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400" },
  { id: 23, name: "흑백 골목",     concept: "mood",   image: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=400" },
  { id: 24, name: "안개 속 인물",  concept: "mood",   image: "https://images.unsplash.com/photo-1502101872923-d48509bff386?w=400" },
  { id: 25, name: "빛과 그림자",   concept: "mood",   image: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=400" },
  { id: 26, name: "파도와 발자국", concept: "mood",   image: "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?w=400" },
  { id: 27, name: "흩날리는 꽃잎", concept: "mood",   image: "https://images.unsplash.com/photo-1490750967868-88df5691cc27?w=400" },
  { id: 28, name: "달빛 창가",     concept: "mood",   image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400" },
  { id: 29, name: "빈 벤치",       concept: "mood",   image: "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=400" },
];

export type UserRole = "guest" | "free" | "subscribed";
