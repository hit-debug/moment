import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');

const THEME_CATEGORIES = ['전체', '자연', '도시', '감성'];
const FONTS = [
  { id: 'f1', name: 'Pretendard', family: 'System' },
  { id: 'f2', name: '나눔명조', family: 'serif' },
  { id: 'f3', name: 'Inter', family: 'sans-serif' },
];

export default function QuoteCustomizeModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedFont, setSelectedFont] = useState('f1');
  const [selectedThemeId, setSelectedThemeId] = useState(1);

  const getThemeImage = (id: number) => {
    const images = [
      'https://images.unsplash.com/photo-1497215848147-750f003714b6',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      'https://images.unsplash.com/photo-1514539079130-25950c84af65',
      'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
    ];
    return images[(id - 1) % images.length];
  };

  const currentFontFamily = FONTS.find(f => f.id === selectedFont)?.family;

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>테마 설정</Text>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={24} color="rgba(244,243,239,0.5)" />
          </Pressable>
        </View>

        {/* Preview Card */}
        <View style={styles.previewContainer}>
          <View style={styles.previewCard}>
            <Image 
              source={{ uri: getThemeImage(selectedThemeId) }}
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.previewContent}>
              <Text style={[styles.previewQuote, currentFontFamily ? { fontFamily: currentFontFamily } : null]}>
                작은 전진이라도 매일 반복되면 결국 아무도 막을 수 없는 힘이 된다.
              </Text>
              <Text style={[styles.previewAuthor, currentFontFamily ? { fontFamily: currentFontFamily } : null]}>
                제임스 클리어
              </Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Theme Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>배경 테마</Text>
            <View style={styles.categoryList}>
              {THEME_CATEGORIES.map((cat) => (
                <Pressable 
                  key={cat} 
                  style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScroll}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Pressable 
                  key={i} 
                  style={[styles.themeItem, selectedThemeId === i && styles.themeItemActive]}
                  onPress={() => setSelectedThemeId(i)}
                >
                  <Image 
                    source={{ uri: getThemeImage(i) }}
                    style={styles.themeImagePlaceholder} 
                  />
                  <Text style={[styles.themeName, selectedThemeId === i && styles.themeNameActive]}>테마 {i}</Text>
                  {selectedThemeId === i && (
                    <View style={styles.checkBadge}>
                      <Check size={10} color="#FFF" strokeWidth={4} />
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Font Selection */}
          <View style={[styles.section, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>폰트 설정</Text>
            <View style={styles.fontList}>
              {FONTS.map((font) => (
                <Pressable 
                  key={font.id} 
                  style={[styles.fontBtn, selectedFont === font.id && styles.fontBtnActive]}
                  onPress={() => setSelectedFont(font.id)}
                >
                  <Text style={[
                    styles.fontText, 
                    { fontFamily: font.family },
                    selectedFont === font.id && styles.fontTextActive
                  ]}>
                    {font.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.applyBtn} onPress={() => router.back()}>
            <Text style={styles.applyBtnText}>적용하기</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
    height: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  closeBtn: {
    padding: 4,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewCard: {
    width: SCREEN_W * 0.45,
    aspectRatio: 9 / 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  previewContent: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 8,
  },
  previewQuote: {
    fontSize: 13,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewAuthor: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '700',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(244,243,239,0.6)',
    marginBottom: 16,
  },
  categoryList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#E8491E',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.5)',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  themeScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  themeItem: {
    width: 100,
    marginRight: 12,
  },
  themeItemActive: {
    opacity: 1,
  },
  themeImagePlaceholder: {
    width: 100,
    height: 140,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(244,243,239,0.7)',
    textAlign: 'center',
  },
  themeNameActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8491E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontList: {
    flexDirection: 'row',
    gap: 8,
  },
  fontBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnActive: {
    backgroundColor: 'rgba(232, 73, 30, 0.1)',
    borderColor: '#E8491E',
    borderWidth: 1.5,
  },
  fontText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.6)',
  },
  fontTextActive: {
    color: '#F4F3EF',
    fontWeight: '700',
  },
  applyBtn: {
    marginTop: 40,
    backgroundColor: '#E8491E',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
