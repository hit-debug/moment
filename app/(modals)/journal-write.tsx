import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

export default function JournalWriteModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const charLimit = 100; // KR limit
  const currentLength = text.length;

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>저널 기록</Text>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <X size={24} color="rgba(244,243,239,0.5)" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={[
              styles.inputContainer,
              isFocused && styles.inputFocused
            ]}>
              <TextInput
                style={styles.input}
                placeholder="이 글귀를 전하고 싶은 분에게 한 줄을 남겨보세요."
                placeholderTextColor="rgba(244,243,239,0.3)"
                multiline
                maxLength={charLimit}
                value={text}
                onChangeText={setText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
              />
              <Text style={[
                styles.charCount,
                currentLength >= charLimit && { color: '#E8491E' }
              ]}>
                {currentLength} / {charLimit}
              </Text>
            </View>

            <Pressable 
              style={[styles.saveBtn, !text && styles.saveBtnDisabled]}
              disabled={!text}
              onPress={() => router.back()}
            >
              <Text style={styles.saveBtnText}>저장하기</Text>
            </Pressable>
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
    gap: 24,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#E8491E',
  },
  input: {
    fontSize: 16,
    color: '#F4F3EF',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    fontSize: 12,
    color: 'rgba(244,243,239,0.3)',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#E8491E',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
