/**
 * Moment — Root Layout
 * Provider, Font, Theme, Sentry 초기화
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Platform } from 'react-native';
import Head from 'expo-router/head';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {Platform.OS === 'web' && (
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Gowun+Batang&family=Gowun+Dodum&family=Noto+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet" />
        </Head>
      )}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#18181B' },
        }}
      >
        <Stack.Screen name="(app)" />
        <Stack.Screen 
          name="(modals)" 
          options={{ 
            presentation: 'transparentModal',
            animation: 'fade' // 오버레이 자체는 페이드인, 내부는 슬라이드업
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}
