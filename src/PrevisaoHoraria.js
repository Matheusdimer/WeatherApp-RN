import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {
  Title,
  Card,
  Background,
  Body,
  MainWheather,
  CardText,
} from './components/StyledComponents';
import formatDescription from './util/formatDescription';
import LinearGradient from 'react-native-linear-gradient';

export default function Details({ route }) {
  console.log(route.params.detalhes);
  return (
    <>
      <Background>
        <LinearGradient
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 50,
            zIndex: 5,
          }}
          colors={['rgba(92, 187, 255, 0.0)', 'rgba(92, 187, 255, 1.0)']}
          pointerEvents={'none'}
        />
        <MainWheather>
          <View width="18%">
            <Image
              source={route.params.detalhes.icon}
              style={{
                width: 65,
                height: 65,
              }}
            />
          </View>

          <Text style={{ fontSize: 16, color: '#FFF', width: "42%" }}>
            {route.params.diaSem + '\n' + route.params.detalhes.description}
          </Text>
          <Text style={{ fontSize: 24, color: '#FFF' }}>
            {route.params.detalhes.max}ºC / {route.params.detalhes.min}ºC
          </Text>
        </MainWheather>
        <LinearGradient
          style={{
            position: 'absolute',
            top: 75,
            width: '100%',
            height: 50,
            zIndex: 5,
          }}
          colors={['rgba(92, 187, 255, 1.0)', 'rgba(92, 187, 255, 0.0)']}
          pointerEvents={'none'}
        />
        <ScrollView style={{ width: '100%', paddingTop: 10 }}>
          <Body>
            <CardsPrevisaoHoraria
              dados={route.params.dados}
              dia={route.params.day}
            />
          </Body>
        </ScrollView>
      </Background>
    </>
  );
}

function CardsPrevisaoHoraria(props) {
  let horaInicial = new Date(props.dados[0].dt * 1000);
  let previsao;
  let divisaoDia = 24 - horaInicial.getHours();

  if (props.dia == 0) {
    previsao = props.dados.slice(0, divisaoDia);
  } else {
    previsao = props.dados.slice(divisaoDia, 24 + divisaoDia);
  }

  return previsao.map((hour) => {
    let hora = new Date(hour.dt * 1000);
    let descricao = formatDescription(hour.weather[0].description);
    let chuva;

    hora = `${hora.getHours()}:00`;

    if (hour.rain) {
      chuva = hour.rain['1h'];
    } else {
      chuva = 0;
    }

    const Chuva = () => {
      if (chuva != 0) {
        return <Text style={{ fontSize: 16, color: '#f0f0f0' }}>{chuva} mm</Text>;
      } else {
        return <View />;
      }
    };

    return (
      <Card key={hora}>
        <CardText style={{ width: '18%' }}>{hora}</CardText>
        <CardText style={{ textAlign: 'left', paddingLeft: 5, width: '48%' }}>{descricao}</CardText>
        <View width="15%">
          <Image
            source={{
              uri: `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
            }}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </View>
        <View width="25%" style={{ alignItems: 'center', paddingRight: 5 }}>
          <CardText>{Math.round(hour.temp)}ºC</CardText>
          <Chuva />
        </View>
      </Card>
    );
  });
}
