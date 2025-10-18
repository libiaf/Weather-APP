import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const API_KEY = '7ef51df59bc07f9bcc2885ec70a1efed';

export default function App() {
  const [city, setCity] = useState('Hermosillo');
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const json = await response.json();

      const forecasts = (json.list || []).map((item) => {
        const dateObj = new Date(item.dt_txt);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return {
          ...item,
          dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
          time,
        };
      });

      setWeatherData(forecasts);
      setCurrentWeather(forecasts[0] || null); 
    } catch (error) {
      console.log(error);
      setWeatherData([]);
      setCurrentWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) {
      setWeatherData([]);
      setCurrentWeather(null);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchWeather(city);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [city]);

  const handleCityChange = (text) => {
    setCity(text);
  };

  const Cell = ({ item }) => (
    <View style={styles.forecastItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayName}>{item.dayOfWeek}</Text>
        <Text style={styles.date}>{item.time}</Text>
      </View>

      <View style={styles.tempContainer}>
        <Text style={styles.temp}>{item.main.temp}°C</Text>
        <Text style={styles.desc}>{item.weather[0].description}</Text>
      </View>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
        style={styles.icon}
      />
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={handleCityChange}
            placeholder="Enter a city name"
            placeholderTextColor="#ffffffb3"
          />

          {loading && (
            <ActivityIndicator size="large" color="#2C5F8D" style={styles.marginInd} />
          )}

          {!loading && currentWeather && (
            <View style={styles.currentWeatherCard}>
              <Text style={styles.currentTemp}>{currentWeather.main.temp.toFixed()}°C</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png` }}
                style={styles.currentIcon}
              />
              <Text style={styles.currentDesc}>{currentWeather.weather[0].description}</Text>
              <Text style={styles.currentHighLow}>
                H: {currentWeather.main.temp_max}°C | L: {currentWeather.main.temp_min}°C
              </Text>
            </View>
          )}

          {!loading && weatherData.length === 0 && (
            <Text style={styles.noResultsText}>No results found.</Text>
          )}

          {!loading && (
            <FlatList
              data={weatherData}
              keyExtractor={(item) => item.dt.toString()}
              renderItem={Cell}
              style={styles.marginInd}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B2CCED',
    padding: 10,
  },
  input: {
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF4D',
    color: '#2C5F8D',
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: '#FFFFFF80',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  currentWeatherCard: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  currentTemp: {
    fontSize: 60,
    color: '#2C5F8D',
    fontWeight: '200',
    letterSpacing: -3,
  },
  currentDesc: {
    fontSize: 18,
    color: '#4A7BA7',
    marginTop: 8,
    textTransform: 'capitalize',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  currentIcon: {
    width: 80,
    height: 80,
    marginVertical: -5,
  },
  currentHighLow: {
    fontSize: 15,
    color: '#2C5F8D',
    marginTop: 12,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  forecastItem: {
    backgroundColor: '#FFFFFF66',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF99',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 95,
  },
  dayName: {
    fontWeight: '600',
    color: '#1A4D7A',
    fontSize: 15,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  date: {
    fontWeight: '400',
    color: '#5A8BB8',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  temp: {
    fontWeight: '600',
    color: '#1A4D7A',
    fontSize: 17,
  },
  desc: {
    textTransform: 'capitalize',
    color: '#4A7BA7',
    fontWeight: '400',
    fontSize: 14,
  },
  icon: {
    width: 50,
    height: 50,
  },
  tempContainer: {
    flex: 1,
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#1A4D7A',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
  },
  marginInd: {
    marginTop: 20,
  },
});

