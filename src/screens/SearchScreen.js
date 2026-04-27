import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [inputError, setInputError] = useState('');

  const validateInput = (text) => {
    if (text.trim().length === 0) {
      return 'Input tidak boleh kosong!';
    }
    if (text.trim().length < 3) {
      return 'Minimal 3 karakter ya!';
    }
    return '';
  };

  const handleChangeText = (text) => {
    setQuery(text);
  
    if (text.trim().length > 0 && text.trim().length < 3) {
      setInputError('Minimal 3 karakter ya!');
    } else {
      setInputError('');
    }
  };

  const handleSearch = async () => {
  
    const errorMsg = validateInput(query);
    if (errorMsg) {
      setInputError(errorMsg);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query.trim())}`
      );

      if (!response.ok) {
        throw new Error('Gagal mencari data');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Gagal mencari show. Cek koneksi internet kamu ya.');
      console.log('Search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const show = item.show;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {

          navigation.navigate('Home', {
            screen: 'Detail',
            params: { id: show.id },
          });
        }}
      >
        <Image
          source={{
            uri: show.image?.medium || 'https://via.placeholder.com/80x120?text=No+Image',
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {show.name}
          </Text>
          <Text style={styles.subtitle}>
            Rating: {show.rating?.average ? `⭐ ${show.rating.average}` : 'N/A'}
          </Text>
          <Text style={styles.subtitle}>
            Genre: {show.genres?.slice(0, 2).join(', ') || 'N/A'}
          </Text>
          <Text style={styles.subtitle}>
            Status: {show.status || 'Unknown'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    if (!searched) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Cari Show Kesukaanmu</Text>
          <Text style={styles.emptySubtitle}>
            Ketik judul show di kolom pencarian{'\n'}lalu tekan tombol Cari
          </Text>
        </View>
      );
    }
    if (results.length === 0 && !error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={styles.emptyTitle}>Gak ketemu</Text>
          <Text style={styles.emptySubtitle}>
            Coba kata kunci lain deh
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, inputError ? styles.inputError : null]}
          placeholder="Cari judul show..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {inputError ? (
          <Text style={styles.errorMsg}>{inputError}</Text>
        ) : null}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Cari</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ecca3" />
          <Text style={styles.loadingText}>Mencari...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleSearch}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.show.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083e3c',
  },
  searchContainer: {
    padding: 50,
    backgroundColor: '#052e2b',
    borderBottomWidth: 5,
    borderBottomColor: '#0a4a46',
  },
  input: {
    backgroundColor: '#0a4a46',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#0d5e58',
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorMsg: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
  searchBtn: {
    backgroundColor: '#4ecca3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#083e3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    color: '#ff8a80',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#4ecca3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#083e3c',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#052e2b',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
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
    justifyContent: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 160,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
  },
});