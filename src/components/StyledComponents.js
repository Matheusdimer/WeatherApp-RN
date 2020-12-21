import { View, Text } from 'react-native'
import styled from 'styled-components'

const fundo = "#5cbbff"

export const Title = styled.Text`
  color: #333333;
  font-size: 24px;
  text-align: center;
  margin: 15px;
`;

export const Background = styled.View`
  background-color: ${fundo};
  flex: 1;
`;

export const Card = styled.View`
  width: 125px;
  height: 160px;
  background-color: #FFFFFF;
  border-radius: 1px;
  margin-left: 10px;
  margin-right: 2px;
  margin-bottom: 10px;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

export const Body = styled.View`
  padding: 0px;
  flex: 1;
  align-items: center;
`;

export const MainWheather = styled.View`
  height: 50%;
  width: 90%;
  background-color: #F00;
  margin: 20px;
`;