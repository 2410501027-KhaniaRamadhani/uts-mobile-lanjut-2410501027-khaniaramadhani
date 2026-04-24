import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchShows = async () => {
    try {
      setError(null);
      const response = await fetch('https://api.tvmaze.com/shows');

      if (!response.ok) {
        throw new Error('Server error');
      }

      const json = await response.json();
      setShows(json);
    } catch (err) {
      setError('Oops... Periksa kembali koneksi internetmu ya!');
      console.log('Error fetching shows:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShows();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
       
        console.log('Show ID:', item.id, 'Name:', item.name);
      }}
    >
      <Image
        source={{
          uri: item.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image',
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.subtitle}>
          Rating: {item.rating?.average ? `⭐ ${item.rating.average}` : 'N/A'}
        </Text>
        <Text style={styles.subtitle}>
          Genre: {item.genres?.slice(0, 2).join(', ') || 'N/A'}
        </Text>
        <Text style={styles.subtitle}>
          Status: {item.status || 'Unknown'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Tunggu sebentar ya...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchShows}>
          <Text style={styles.retryButtonText}>Muat Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={shows}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['white']}
          tintColor="white"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#083e3c',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#083e3c',
    fontSize: 17,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#075f5c',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    backgroundColor: '#2aa39f',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: 'white',
    marginBottom: 2,
  },
});