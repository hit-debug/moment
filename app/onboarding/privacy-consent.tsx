/**
 * R-023: 개인정보 동의 (R-002 Step3 통합)
 */
import { View, Text, StyleSheet } from 'react-native';

export default function PrivacyConsentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>개인정보 동의</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#F4F3EF' },
});
