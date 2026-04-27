import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';

export default function AboutScreen() {
  
  const nama = 'Khania Ramadhani Fitri';
  const nim = '2410501027';
  const kelas = 'D3 Sistem Informasi B';
  const tema = 'B - MovieDex';
  const apiCredit = 'https://api.tvmaze.com';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/foto_sayaa.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.name}>{nama}</Text>
        <Text style={styles.role}>2410501027</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informasi Pribadi</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>{nama}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>NIM</Text>
          <Text style={styles.value}>{nim}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Kelas</Text>
          <Text style={styles.value}>{kelas}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Tema</Text>
          <Text style={styles.value}>{tema}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tentang Aplikasi</Text>
        <Text style={styles.desc}>
          MovieDex adalah aplikasi katalog film dan series yang dibuat untuk
          memenuhi Ujian Tengah Semester mata kuliah Pemrograman Mobile Lanjut.
        </Text>
        <Text style={styles.desc}>
          Aplikasi ini mengambil data dari TVMaze API, sebuah database acara TV
          gratis dan terbuka untuk umum.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Credit API</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(apiCredit)}
        >
          <Text style={styles.link}>{apiCredit}</Text>
        </TouchableOpacity>
        <Text style={styles.descSmall}>
          Data yang ditampilkan di aplikasi ini disediakan oleh TVMaze. 

        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 {nama} - UTS Pemrograman Mobile Lanjut
        </Text>
        <Text style={styles.footerText}>Dibuat dengan rasa sabar yang luas di Expo</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083e3c',
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#052e2b',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0a4a46',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ecca3',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4ecca3',
    backgroundColor: '#052e2b',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  role: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#052e2b',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecca3',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#aaa',
  },
  value: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#0a4a46',
    marginVertical: 4,
  },
  desc: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
  descSmall: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
    marginTop: 8,
    fontStyle: 'italic',
  },
  link: {
    fontSize: 14,
    color: '#4ecca3',
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
});