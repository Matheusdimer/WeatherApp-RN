import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  TextInput,
  TouchableHighlight,
  RefreshControlComponent,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import NavigationBar from 'react-native-navbar-color';
import geolocation from 'react-native-geolocation-service'

const semana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
]
const fundo = "#5cbbff"
const apiKey = 'bb4764a9433157d317e12eb7c2407786' //'bb4764a9433157d317e12eb7c2407786'
var unity = 'ºC'

function App(){
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

  async function verifyLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED){
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

    if (hasLocation && useLocation){
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
    if (city != 'Localização atual'){
      apiLoc = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      console.log(city)
      reqLoc.open('GET', apiLoc, true)
      reqLoc.onload = function() {
        var json = JSON.parse(reqLoc.responseText);
        console.log(json)
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
    req.onload = function() {
      var temp_week = []
      var jsonResponse = req.responseText
      if (jsonResponse){
        jsonResponse = JSON.parse(jsonResponse)
        console.log(jsonResponse.hourly.length)
        setToday({
          icon: {uri: `http://openweathermap.org/img/wn/${jsonResponse.current.weather[0].icon}@2x.png`},
          climaAtual: jsonResponse.current.weather[0].description.charAt(0).toUpperCase() + jsonResponse.current.weather[0].description.slice(1),
          temp: jsonResponse.current.temp.toFixed(0),
          feelsLike: jsonResponse.current.feels_like.toFixed(0),
          wind: jsonResponse.current.wind_speed,
          umidade: jsonResponse.current.humidity,
          min: jsonResponse.daily[0].temp.min.toFixed(0),
          max: jsonResponse.daily[0].temp.max.toFixed(0),
        });

        jsonResponse.daily.map((data, i) => {
          const weekDay = new Date(data.dt*1000)

          temp_week.push({
            icon: {uri: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`},
            description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
            min: data.temp.min.toFixed(0),
            max: data.temp.max.toFixed(0),
            rain: (data.rain) ? data.rain : 0,
            day: (i == 0) ? 'Hoje' : semana[weekDay.getDay()],
          });
        });
        if (useLocation){
          setCity('Localização atual')
        }
        setWeek(temp_week);
      }
    };
    req.send(null);
  }, [lat, lon, setLat, setLon]);

  NavigationBar.setColor(fundo)
  
  const Semana = () => {
      return week.map((data, i) => (
        <TouchableHighlight key={data.day} activeOpacity={0.6} underlayColor='#fff' onPress={() => {console.log('Week content clicked')}}>
          <View style={styles.weekView}>
            <View style={styles.weekContents}>
              <Image
                source={data.icon}
                style={styles.imgWeek}
              />
              <Text style={{marginHorizontal: 5}}>{data.day + '\n' + data.description}</Text>
            </View>
      
            <View style={styles.weekContents}>
              <Text style={{textAlign: "center", marginRight: 15}}>Chuva{'\n' + data.rain} mm</Text>
              <Text>Máx. {data.max}ºC{'\n'}Mín.  {data.min}ºC</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    )
  }

  return (
    <>
      <StatusBar barStyle="white-content" backgroundColor={fundo}/>
      <SafeAreaView style={styles.fundo}>
        <View style={styles.location}>
          <TextInput style={styles.search} onSubmitEditing={({nativeEvent}) => setCity(nativeEvent.text)}>{city}</TextInput>
          <TouchableHighlight>
            <Image
              source={require('./icons/search.png')}
              style={styles.searchIcon}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.centerBox}>
          <Text style={{marginTop: 20, fontSize: 16, color: '#555'}}>{city + ', ' + country}</Text>
          <Image
            source={today.icon}
            style={styles.image}
          />
          <Text style={styles.fonteBig}>{today.climaAtual + '\n' + today.temp + unity}</Text>
          <Text style={styles.fontNormal}>Min: {today.min + unity}    Máx: {today.max + unity}</Text>
          <Text style={styles.fontNormal}>Sensação térmica: {today.feelsLike + unity}</Text>
          <Text style={styles.fontNormal}>Vento: {today.wind} km/h    Umidade: {today.umidade}%</Text>
          <ScrollView  style={styles.week}>          
            <Semana/>
          </ScrollView>
        </View>
        <Text style={{color: "#444", marginTop: 25, fontSize: 13}}>Desenvolvido por Matheus Dimer</Text>
      </SafeAreaView>        
    </>
  );
};

const styles = StyleSheet.create({
  fundo: {
    backgroundColor: fundo,
    height: "100%",
    height: "100%",
    alignItems: "center",
  },
  searchIcon:{
    resizeMode: 'stretch',
    width: 22,
    height: 22,
    marginRight: 20,
  },
  image:{
    justifyContent: 'center',
    marginTop: 5,
    resizeMode: 'stretch',
    width: 90,
    height: 90,
  },
  fonteBig:{
    marginTop: 0,
    marginBottom: 5,
    color: "#777",
    fontSize: 28,
    textAlign: 'center',
  },
  fontNormal:{
    fontSize: 15,
    color: "#444444"
  },
  centerBox:{
    backgroundColor: "#fff",
    width: "90%",
    height: "77%",
    borderRadius: 20,
    display: "flex",
    alignItems: "center"
  },
  location:{
    marginTop: 30,
    marginBottom: 30,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  week:{
    borderRadius: 50,
    width: "100%",
    marginTop: 15,
    marginBottom: 20
  }, 
  imgWeek:{
    resizeMode: 'stretch',
    width: 50,
    height: 50
  },
  weekView:{
    backgroundColor: '#E5E5E5',
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
  },
  search:{
    color: "#444444",
    fontSize: 20,
    width: "90%",
    borderRadius: 10,
    paddingHorizontal: 20
  },
  weekContents: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default App;
