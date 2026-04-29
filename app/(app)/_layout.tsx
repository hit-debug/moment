import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Pressable, Text, Platform, Dimensions } from 'react-native';
import { Quote, BookOpen, CircleUser } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');

/**
 * Moment 커스텀 플로팅 탭 바
 * 디자인 시안의 '명언', '저널', '마이' 3개 메뉴 구성을 충실히 재현합니다.
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarWrapper, { bottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          // 'library' 탭은 시안에 없으므로 제외 (필요시 '마이' 내부로 이동)
          if (route.name === 'library') return null;

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let Icon = Quote;
          let label = '명언';
          
          if (route.name === 'journal') {
            Icon = BookOpen;
            label = '저널';
          } else if (route.name === 'my') {
            Icon = CircleUser;
            label = '마이';
          }

          const activeColor = '#E8491E';
          const inactiveColor = 'rgba(244,243,239,0.4)';
          const color = isFocused ? activeColor : inactiveColor;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={styles.iconWrapper}>
                <Icon 
                  size={24} 
                  color={color} 
                  strokeWidth={isFocused ? 2.5 : 2}
                  fill={isFocused && route.name === 'quote' ? activeColor : 'none'}
                />
              </View>
              <Text style={[styles.tabLabel, { color }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AppTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // 배경이 비치는 투명 탭바를 위해 absolute 설정
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="quote"
        options={{
          title: '명언',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: '저널',
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          href: null, // 탭 바에서 숨김
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: '마이',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    height: 72,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
