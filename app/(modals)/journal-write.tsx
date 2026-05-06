import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  InteractionManager,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useJournalStore } from '@/stores/journalStore';
import { useThemeColors } from '@/stores/themeStore';

function getByteLength(str: string): number {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byte += code > 127 ? 2 : 1;
  }
  return byte;
}

export default function JournalWriteModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string, content?: string }>();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(params.content || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<TextInput>(null);
  const { updateJournal } = useJournalStore();
  const colors = useThemeColors();

  const MAX_BYTE = 100;
  const currentByte = getByteLength(text);

  const handleChangeText = (val: string) => {
    if (getByteLength(val) <= MAX_BYTE) {
      setText(val);
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    });
    return () => task.cancel();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20, backgroundColor: colors.bgSurface }]}>
          <View style={[styles.handle, { backgroundColor: colors.divider }]} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{params.content ? '기록 수정' : '나만의 기록'}</Text>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <X size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View 
              style={[
                styles.inputContainer,
                { backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
                isFocused && styles.inputFocused
              ]}
            >
              <TextInput
                ref={inputRef}
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="지금 떠오르는 생각을 적어보세요..."
                placeholderTextColor={colors.textSecondary}
                maxLength={MAX_BYTE}
                value={text}
                onChangeText={handleChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
              />
              <Pressable 
                style={[
                  styles.saveBtn, 
                  !text && [styles.saveBtnDisabled, { backgroundColor: colors.divider }]
                ]}
                disabled={!text}
                onPress={() => {
                  if (text.trim().length > 0) {
                    if (params.id) {
                      updateJournal(params.id, text);
                    }
                    router.back();
                  }
                }}
              >
                <Text style={[styles.saveBtnText, !text && { color: colors.textSecondary }]}>저장</Text>
              </Pressable>
            </View>
            <Text style={[
              styles.charCount,
              { color: colors.textSecondary },
              currentByte >= MAX_BYTE && { color: '#E8491E' }
            ]}>
              {currentByte} / {MAX_BYTE} bytes
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#E8491E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#F4F3EF',
    paddingVertical: 8,
  },
  charCount: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.3)',
    fontWeight: '600',
    textAlign: 'right',
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: '#E8491E',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  saveBtnDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
