/**
 * R-007: 카테고리 필터
 */
import { View, Text, StyleSheet } from 'react-native';

export default function QuoteCategoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>카테고리</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#F4F3EF' },
});
