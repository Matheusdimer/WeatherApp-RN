import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import geolocation from 'react-native-geolocation-service';
import {styles} from './style/Styles';
import formatDescription from './util/formatDescription';
import Loading from './components/Loading';

const semana = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const apiKey = 'bb4764a9433157d317e12eb7c2407786'; //"bb4764a9433157d317e12eb7c2407786"
const unity = 'ºC';

export default function HomeWheather({navigation}) {
  const [hasLocation, setHasLocation] = useState(false);
  const [useLocation, setUseLocation] = useState(true);
  const [city, setCity] = useState('Localização atual');
  const [country, setCountry] = useState('BR');
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [horaria, setHoraria] = useState([]);
  const [week, setWeek] = useState([]);
  const [today, setToday] = useState({});
  const [loading, setLoading] = useState(true);

  async function verifyLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão de uso de Localização');
        setHasLocation(true);
      } else {
        console.log('Sem permissão de localização');
        setHasLocation(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    verifyLocationPermission();

    if (hasLocation && useLocation) {
      geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          console.log(lat, lon);
        },
        (error) => {
          console.log(error.code, error.message);
        },
      );
    }
  }, [hasLocation, useLocation, lat, lon]);

  useEffect(() => {
    if (city !== 'Localização atual') {
      setLoading(true);
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
      ).then((response) => {
        response.json().then((json) => {
          setLat(json.coord.lat);
          setLon(json.coord.lon);
          setCity(json.name);
          setCountry(json.sys.country);
        });
      });
      console.log(city);
      setUseLocation(false);
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=minutely&appid=${apiKey}`;
    if (lat && lon) {
      setLoading(true);
      fetch(apiUrl).then((response) =>
        response.json().then((json) => {
          let temp_week = [];
          setToday({
            icon: {
              uri: `https://openweathermap.org/img/wn/${json?.current.weather[0].icon}@2x.png`,
            },
            climaAtual: formatDescription(json?.current.weather[0].description),
            temp: Math.round(json?.current.temp),
            feelsLike: Math.round(json?.current.feels_like),
            wind: Math.round(json?.current.wind_speed * 3.6),
            umidade: json?.current.humidity,
            min: Math.round(json?.daily[0].temp.min),
            max: Math.round(json?.daily[0].temp.max),
          });

          json.daily.map((data, i) => {
            const weekDay = new Date(data.dt * 1000);

            temp_week.push({
              icon: {
                uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
              },
              description: formatDescription(data.weather[0].description),
              min: Math.round(data.temp.min),
              max: Math.round(data.temp.max),
              rain: data.rain ? data.rain.toFixed(1) : 0,
              day: i === 0 ? 'Hoje' : semana[weekDay.getDay()],
              vento: data.wind_speed,
              umidade: data.humidity,
              nuvens: data.clouds,
              sunrise: data.sunrise,
              sunset: data.sunset,
            });
          });

          if (useLocation) {
            setCity('Localização atual');
          }
          setWeek(temp_week);
          setHoraria(json?.hourly);
          setLoading(false);
        }),
      );
    }
  }, [lat, lon, useLocation]);

  function Semana() {
    return week.map((data, i) => (
      <TouchableHighlight
        key={data.day}
        activeOpacity={0.6}
        underlayColor="#fff"
        onPress={() => {
          if (i === 0 || i === 1) {
            navigation.navigate('Detalhes', {
              day: i,
              dados: horaria,
              detalhes: data,
              diaSem: data.day,
            });
          } else {
            ToastAndroid.show(
              'Previsão horária disponível somente para dois primeiros dias.',
              ToastAndroid.SHORT,
            );
          }
        }}>
        <View style={styles.weekView}>
          <View style={styles.weekContents}>
            <Image source={data.icon} style={styles.imgWeek} />
            <Text style={{marginHorizontal: 5}}>
              {data.day + '\n' + data.description}
            </Text>
          </View>

          <View style={styles.weekContents}>
            <Text style={{textAlign: 'center', marginRight: 15}}>
              Chuva{'\n' + data.rain} mm
            </Text>
            <Text>
              Máx. {data.max}ºC{'\n'}Mín. {data.min}ºC
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    ));
  }

  return (
    <>
      <SafeAreaView style={styles.fundo}>
        <View style={styles.location}>
          <TextInput
            style={styles.search}
            onSubmitEditing={({nativeEvent}) => setCity(nativeEvent.text)}>
            {city}
          </TextInput>
          <TouchableHighlight>
            <Image
              source={require('./icons/search.png')}
              style={styles.searchIcon}
            />
          </TouchableHighlight>
        </View>
        {loading ? (
          <View style={styles.centerBox}>
            <Loading />
          </View>
        ) : (
          <View style={styles.centerBox}>
            <Text style={{marginTop: 20, fontSize: 16, color: '#555'}}>
              {city + ', ' + country}
            </Text>
            <Image source={today.icon} style={styles.image} />
            <Text style={styles.fonteBig}>
              {today.climaAtual + '\n' + today.temp + unity}
            </Text>
            <Text style={styles.fontNormal}>
              Min: {today.min + unity} Máx: {today.max + unity}
            </Text>
            <Text style={styles.fontNormal}>
              Sensação térmica: {today.feelsLike + unity}
            </Text>
            <Text style={styles.fontNormal}>
              Vento: {today.wind} km/h Umidade: {today.umidade}%
            </Text>
            <ScrollView style={styles.week}>
              <Semana />
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
