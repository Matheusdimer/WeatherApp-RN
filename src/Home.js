import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableHighlight,
  PermissionsAndroid,
} from 'react-native';
import NavigationBar from 'react-native-navbar-color';
import geolocation from 'react-native-geolocation-service';
import styled from 'styled-components';
import { Title, Card, Background, Body, MainWheather } from './components/StyledComponents';
import { styles } from './style/Styles'

const semana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const fundo = "#5cbbff"
const apiKey = "bb4764a9433157d317e12eb7c2407786" //"bb4764a9433157d317e12eb7c2407786"
const unity = "ºC"
let previsaoHoraria = []

function HomeWheather({ navigation }) {
  const [hasLocation, setHasLocation] = useState(false)
  const [useLocation, setUseLocation] = useState(true)
  const [city, setCity] = useState('Localização atual')
  const [country, setCountry] = useState('BR')
  const [lat, setLat] = useState()
  const [lon, setLon] = useState()
  const [week, setWeek] = useState([])
  const [today, setToday] = useState({
    icon: {},
    climaAtual: 'Carregando',
    temp: 'Aguarde...',
    feelsLike: '...',
    wind: '...',
    umidade: '...',
    min: '...',
    max: '...',
  });
  
  NavigationBar.setColor(fundo)
  
  async function verifyLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão de uso de Localização')
        setHasLocation(true)
      } else {
        console.log('Sem permissão de localização')
        setHasLocation(false)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  useEffect(() => {
    verifyLocationPermission();

    if (hasLocation && useLocation) {
      geolocation.getCurrentPosition(
        position => {
          setLat(position.coords.latitude)
          setLon(position.coords.longitude)
          console.log(lat, lon)
        },
        error => {
          console.log(error.code, error.message)
        }
      )
    }
  }, [hasLocation, useLocation]);

  useEffect(() => {
    let reqLoc = new XMLHttpRequest();
    let apiLoc = ''
    if (city != 'Localização atual') {
      apiLoc = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      console.log(city)
      reqLoc.open('GET', apiLoc, true)
      reqLoc.onload = function () {
        var json = JSON.parse(reqLoc.responseText);
        setLat(json.coord.lat)
        setLon(json.coord.lon)
        setCity(json.name)
        setCountry(json.sys.country)
      };
      reqLoc.send(null);
      setUseLocation(false);
    }
  }, [city]);

  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=minutely&appid=${apiKey}`
    req = new XMLHttpRequest();
    req.open('GET', apiUrl, true)
    req.onload = function () {
      var temp_week = []
      var jsonResponse = req.responseText
      if (jsonResponse) {
        jsonResponse = JSON.parse(jsonResponse)
        setToday({
          icon: { uri: `http://openweathermap.org/img/wn/${jsonResponse?.current.weather[0].icon}@2x.png` },
          climaAtual: jsonResponse?.current.weather[0].description.charAt(0).toUpperCase() + jsonResponse?.current.weather[0].description.slice(1),
          temp: jsonResponse?.current.temp.toFixed(0),
          feelsLike: jsonResponse?.current.feels_like.toFixed(0),
          wind: jsonResponse?.current.wind_speed,
          umidade: jsonResponse?.current.humidity,
          min: jsonResponse?.daily[0].temp.min.toFixed(0),
          max: jsonResponse?.daily[0].temp.max.toFixed(0),
        });

        jsonResponse.daily.map((data, i) => {
          const weekDay = new Date(data.dt * 1000)

          temp_week.push({
            icon: { uri: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` },
            description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
            min: data.temp.min.toFixed(0),
            max: data.temp.max.toFixed(0),
            rain: (data.rain) ? data.rain : 0,
            day: (i == 0) ? 'Hoje' : semana[weekDay.getDay()],
          });
        });
        if (useLocation) {
          setCity('Localização atual')
        }
        setWeek(temp_week);
        previsaoHoraria = jsonResponse?.hourly
      }
    };
    req.send(null);
  }, [lat, lon, setLat, setLon]);



  function Semana() {
    return week.map((data, i) => (
      <TouchableHighlight
        key={data.day}
        activeOpacity={0.6}
        underlayColor='#fff'
        onPress={() => {
          navigation.navigate('Detalhes')
        }}
      >
        <View style={styles.weekView}>
          <View style={styles.weekContents}>
            <Image
              source={data.icon}
              style={styles.imgWeek}
            />
            <Text style={{ marginHorizontal: 5 }}>{data.day + '\n' + data.description}</Text>
          </View>

          <View style={styles.weekContents}>
            <Text style={{ textAlign: "center", marginRight: 15 }}>Chuva{'\n' + data.rain} mm</Text>
            <Text>Máx. {data.max}ºC{'\n'}Mín.  {data.min}ºC</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
    )
  }

  return (
    <>
      <StatusBar barStyle="white-content" backgroundColor={fundo} />
      <SafeAreaView style={styles.fundo}>
        <View style={styles.location}>
          <TextInput style={styles.search} onSubmitEditing={({ nativeEvent }) => setCity(nativeEvent.text)}>{city}</TextInput>
          <TouchableHighlight>
            <Image
              source={require('./icons/search.png')}
              style={styles.searchIcon}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.centerBox}>
          <Text style={{ marginTop: 20, fontSize: 16, color: '#555' }}>{city + ', ' + country}</Text>
          <Image
            source={today.icon}
            style={styles.image}
          />
          <Text style={styles.fonteBig}>{today.climaAtual + '\n' + today.temp + unity}</Text>
          <Text style={styles.fontNormal}>Min: {today.min + unity}    Máx: {today.max + unity}</Text>
          <Text style={styles.fontNormal}>Sensação térmica: {today.feelsLike + unity}</Text>
          <Text style={styles.fontNormal}>Vento: {today.wind} km/h    Umidade: {today.umidade}%</Text>
          <ScrollView style={styles.week}>
            <Semana />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

function Details() {
  return (
    <>
      <StatusBar barStyle="white-content" backgroundColor={fundo} />
      <Background>
        <Body>
          <MainWheather>

          </MainWheather>
          <View>
            <ScrollView horizontal={true}>
              <CardsPrevisaoHoraria/>
            </ScrollView>
          </View>
        </Body>
      </Background>
    </>
  )
}

function CardsPrevisaoHoraria() {
  let horaInicial = new Date(previsaoHoraria[0].dt * 1000)
  let previsaoHoje = previsaoHoraria.slice(0, 24 - horaInicial.getHours())
  return previsaoHoje.map((hour) => {
    let hora = new Date(hour.dt * 1000);
    let descricao = hour.weather[0].description.charAt(0).toUpperCase() + hour.weather[0].description.slice(1);
    let chuva;

    hora = `${hora.getHours()}:00`

    if (hour.rain) {
      chuva = hour.rain['1h']
    }
    else {
      chuva = 0
    }

    let Chuva = () => {
      if (chuva != 0) {
        return (
          <Text>{chuva} mm</Text>
        )
      } else {
        return (
          <View />
        )
      }
    };

    return (
      <Card key={hora}>
        <Text>{hora}</Text>
        <Image
          source={{ uri: `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png` }}
          style={{
            width: 50,
            height: 50,
          }}
        />
        <View style={{ alignItems: 'center', }}>
          <Chuva />
          <Text>{hour.temp + unity}</Text>
          <Text>{descricao}</Text>
        </View>
      </Card>
    );
  });
}

export {
  HomeWheather,
  Details,
};