import React from "react";
import { LineChart } from "react-native-svg-charts";
import { Text, Image } from "react-native-svg";
import { View } from "react-native";

export const Grafico = (props) => {
  return (
    <>
      <LineChart
        contentInset={{ top: 25, left: 25, right: 25, bottom: 0 }}
        style={{ height: '100%', margin: 20, width: props.temp.length * 80 }}
        data={props.temp}
        svg={{ stroke: '#F0f0f0' }}
        yMin={props.yMin}
      >
        <Label horas={props.horas} icons={props.icons} chuva={props.chuva} />
      </LineChart>
    </>
  )
}

function Label(props) {
  return props.data.map((value, index) => (
    <View key={(`${value}-${index}`)}>
      <Text
        fill="#FFF"
        stroke="#FFF"
        fontSize="16"
        fontWeight="300"
        x={props.x(index)}
        y={props.y(value) - 10}
        textAnchor="middle"
      >
        {value}º
      </Text>
      {props.chuva[index] &&
        <Text
          fill="#FFF"
          stroke="#FFF"
          fontSize="12"
          fontWeight="200"
          x={props.x(index)}
          y="62%"
          textAnchor="middle"
        >
          {props.chuva[index] + ' mm'}
        </Text>
      }
      <Image
        x={props.x(index) - 25}
        y="67%"
        width="50"
        height="40"
        preserveAspectRatio="xMidYMid slice"
        opacity="0.9"
        href={props.icons[index]}
      />
      <Text
        fill="#FFF"
        stroke="#FFF"
        fontSize="12"
        fontWeight="200"
        x={props.x(index)}
        y="85%"
        textAnchor="middle"
      >
        {("00" + props.horas[index]).slice(-2) + ':00'}
      </Text>
    </View>
  ));
}