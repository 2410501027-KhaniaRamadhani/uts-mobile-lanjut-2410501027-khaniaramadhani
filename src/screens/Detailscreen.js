import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
      
      if (!response.ok) {
        throw new Error('Gagal ngambil detail');
      }
      
      const data = await response.json();
      setShow(data);
    } catch (err) {
      setError('Gagal memuat detail show. Coba lagi nanti.');
      console.log('Error detail:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const stripHtml = (html) => {
    if (!html) return 'Tidak ada deskripsi.';
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4ecca3" />
        <Text style={styles.loadingText}>Memuat detail...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😵</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchDetail}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!show) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Data tidak ditemukan</Text>
      </View>
    );
  }

  const genres = show.genres?.length > 0 ? show.genres.join(', ') : 'N/A';
  const schedule = show.schedule?.days?.length > 0
    ? `${show.schedule.days.join(', ')} jam ${show.schedule.time || '??:??'}`
    : 'Jadwal tidak tersedia';
  const rating = show.rating?.average ? `⭐ ${show.rating.average}/10` : 'Belum ada rating';
  const network = show.network?.name || show.webChannel?.name || 'Tidak diketahui';
  const officialSite = show.officialSite;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {show.image?.original ? (
        <Image
          source={{ uri: show.image.original }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{show.name}</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{show.status || 'Unknown'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Rating</Text>
          <Text style={styles.value}>{rating}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Genre</Text>
          <Text style={styles.value}>{genres}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Jaringan</Text>
          <Text style={styles.value}>{network}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Jadwal</Text>
          <Text style={styles.value}>{schedule}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Bahasa</Text>
          <Text style={styles.value}>{show.language || 'N/A'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Tipe</Text>
          <Text style={styles.value}>{show.type || 'N/A'}</Text>
        </View>

        {show.premiered && (
          <View style={styles.infoItem}>
            <Text style={styles.label}>Tayang Perdana</Text>
            <Text style={styles.value}>{show.premiered}</Text>
          </View>
        )}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.summaryText}>{stripHtml(show.summary)}</Text>
      </View>

      <View style={styles.actionContainer}>
       <TouchableOpacity
  style={[
    styles.favButton,
    isFavorite(show.id) && styles.favButtonActive,
  ]}
  onPress={() => {
    if (isFavorite(show.id)) {
      removeFavorite(show.id);
    } else {
      addFavorite(show);
    }
  }}
>
  <Text style={styles.favButtonText}>
    {isFavorite(show.id) ? '💔 Hapus dari Favorit' : '❤ Tambah ke Favorit'}
  </Text>
</TouchableOpacity>
        {officialSite && (
          <TouchableOpacity
            style={styles.siteButton}
            onPress={() => {
              Linking.openURL(officialSite);
            }}
          >
            <Text style={styles.siteButtonText}>🌐 Kunjungi Situs Resmi</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083e3c',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#083e3c',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  errorText: {
    color: '#ff8a80',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#4ecca3',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#083e3c',
    fontWeight: 'bold',
  },
  poster: {
    width: '100%',
    height: 400,
  },
  noImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#052e2b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#aaa',
    fontSize: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#7eb5a6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  summarySection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecca3',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
    textAlign: 'justify',
  },
  actionContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  favButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
   favButtonActive: {
    backgroundColor: 'white',
  },
  favButtonText: {
    color: '#083e3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  siteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  siteButtonText: {
    color: 'white',
    fontSize: 14,
  },
});