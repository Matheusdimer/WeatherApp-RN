import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  MainWheather,
  InfoCard,
  InfoText,
  H1,
} from './components/StyledComponents';
import {Grafico} from './components/grafico';
import LinearGradient from 'react-native-linear-gradient';

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = StatusBar.currentHeight;
const NAVBAR_HEIGHT = DEVICE_HEIGHT - WINDOW_HEIGHT;

console.log(NAVBAR_HEIGHT);

export default function Details({route}) {
  const {dados, day, detalhes, diaSem} = route.params;

  let horaInicial = new Date(dados[0].dt * 1000);
  let divisaoDia = 24 - horaInicial.getHours();
  let previsao;

  if (day === 0) {
    previsao = dados.slice(0, divisaoDia);
  } else {
    previsao = dados.slice(divisaoDia, 24 + divisaoDia);
  }

  let menorTemperatura = Math.round(previsao[0].temp);

  const graficoHora = previsao.map((data) => {
    let hora = new Date(data.dt * 1000);
    return hora.getHours();
  });

  const graficoTemp = previsao.map((data) => {
    let temperatura = Math.round(data.temp);
    if (temperatura < menorTemperatura) {
      menorTemperatura = temperatura;
    }
    return temperatura;
  });

  const icones = previsao.map((data) => {
    return `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  });

  const chuva = previsao.map((data) => {
    return data.rain ? data.rain['1h'].toFixed(1) : false;
  });

  let nascer = new Date(detalhes.sunrise * 1000);
  nascer = `${nascer.getHours()}:${nascer.getMinutes()}`;

  let pordoSol = new Date(detalhes.sunset * 1000);
  pordoSol = `${pordoSol.getHours()}:${pordoSol.getMinutes()}`;

  return (
    <>
      <LinearGradient
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        colors={['#7dc8ff', '#0496c7']}
        pointerEvents={'none'}
      />
      <View
        style={{
          flex: 1,
          marginBottom: NAVBAR_HEIGHT,
          marginTop: STATUS_HEIGHT,
        }}>
        <MainWheather>
          <View width="20%">
            <Image
              source={detalhes.icon}
              style={{
                width: 65,
                height: 65,
              }}
            />
          </View>

          <Text style={{fontSize: 16, color: '#FFF', width: '45%'}}>
            {diaSem + '\n' + detalhes.description}
          </Text>
          <Text style={{fontSize: 24, color: '#FFF'}}>
            {detalhes.max}ºC / {detalhes.min}ºC
          </Text>
        </MainWheather>

        <View
          style={{
            height: '40%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View>
            <InfoCard>
              <InfoText>Vento</InfoText>
              <H1>{Math.round(detalhes.vento * 3.6)} km/h</H1>
            </InfoCard>
            <InfoCard>
              <InfoText>Nuvens</InfoText>
              <H1>{detalhes.nuvens}%</H1>
            </InfoCard>
            <InfoCard>
              <InfoText>Nascer do Sol</InfoText>
              <H1>{nascer}</H1>
            </InfoCard>
          </View>
          <View>
            <InfoCard>
              <InfoText>Umidade</InfoText>
              <H1>{detalhes.umidade}%</H1>
            </InfoCard>
            <InfoCard>
              <InfoText>Chuva</InfoText>
              <H1>{detalhes.rain} mm</H1>
            </InfoCard>
            <InfoCard>
              <InfoText>Por do Sol</InfoText>
              <H1>{pordoSol}</H1>
            </InfoCard>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          style={{margin: 0}}
          showsHorizontalScrollIndicator={false}>
          <Grafico
            temp={graficoTemp}
            horas={graficoHora}
            icons={icones}
            chuva={chuva}
            yMin={menorTemperatura - 10}
          />
        </ScrollView>
      </View>
    </>
  );
}
