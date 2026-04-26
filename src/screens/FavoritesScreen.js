import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>😢</Text>
        <Text style={styles.emptyTitle}>Belum ada favorit</Text>
        <Text style={styles.emptySubtitle}>
          Yuk tambahin film yang kamu suka,{'\n'}lalu tekan tombol ❤ Supaya kamu bisa rewatch film favoritmu!
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: item.image?.medium || 'https://via.placeholder.com/100x150?text=No+Image',
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
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeBtnText}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Favorit Saya ({favorites.length})
      </Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083e3c',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#052e2b',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#083e3c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    padding: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#052e2b',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#1a5c56',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#b0d4ce',
    marginBottom: 2,
  },
  removeBtn: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});