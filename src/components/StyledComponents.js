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
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 60px;
  padding: 0 15px 0 15px;
  margin-bottom: 10px;
  background-color: #87cdff;
  border-radius: 6px;
`;

export const CardText = styled.Text`
  font-size: 18px;
  color: #f0f0f0;
  font-weight: 600;
`;

export const Body = styled.View`
  padding: 20px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const MainWheather = styled.View`
  height: 12%;
  width: 90%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const InfoCard = styled.View`
  background-color: #87cdff;
  width: 150px;
  height: 60px;
  border-radius: 6px;
  margin: 10px;
  align-items: center;
  justify-content: center;
`;

export const InfoText = styled.Text `
  text-align: center;
  color: #fefefe;
  font-size: 13px;
`;

export const H1 = styled.Text `
  text-align: center;
  color: #fefefe;
  font-size: 20px;
`;