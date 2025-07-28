import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LayoutPadrao from '../components/LayoutPadrao';
import { Calendar } from 'react-native-calendars';
import { ScrollView, Image, TouchableOpacity } from 'react-native';


export default function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [mostrarLegenda, setMostrarLegenda] = useState(false);


  return (
  <LayoutPadrao telaAtiva="Agenda">
    <View style={styles.card}>
      <Text style={styles.tituloCard}>📅 Agenda Espiritual</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#144552',
          },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#144552',
          selectedDayBackgroundColor: '#144552',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#607744',
          arrowColor: '#144552',
          monthTextColor: '#144552',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />

        <Text
  style={styles.botaoLegenda}
  onPress={() => setMostrarLegenda(!mostrarLegenda)}
>
  {mostrarLegenda ? 'Ocultar Legenda' : 'Mostrar Legenda'}
</Text>
{mostrarLegenda && (
  <View style={styles.legendaContainer}>
    <Text style={styles.legendaTitulo}>🔹 Legenda de Cores</Text>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#2ecc71' }]} />
      <Text style={styles.legendaTexto}>Dízimo</Text>
    </View>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#3498db' }]} />
      <Text style={styles.legendaTexto}>Oferta voluntária</Text>
    </View>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#e67e22' }]} />
      <Text style={styles.legendaTexto}>Campanha ou contribuição especial</Text>
    </View>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#9b59b6' }]} />
      <Text style={styles.legendaTexto}>Voto / Promessa</Text>
    </View>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#8d6748' }]} />
      <Text style={styles.legendaTexto}>Trabalho voluntário</Text>
    </View>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#f1c40f' }]} />
      <Text style={styles.legendaTexto}>Evento com presença confirmada</Text>
    </View>

    <View style={styles.legendaLinha}>
      <View style={[styles.circuloCor, { backgroundColor: '#bdc3c7' }]} />
      <Text style={styles.legendaTexto}>Evento não confirmado</Text>
    </View>
  </View>
)}
    </View>
    <View style={styles.eventoTopo}>
  <Image source={require('../../assets/icons/Eventos.png')} style={styles.eventosIcone} />
  <Text style={styles.tituloSecao}>Eventos em Destaque</Text>
</View>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
  {[1, 2, 3].map((n) => (
    <View key={n} style={styles.eventoCard}>
      <Image source={require('../../assets/icons/Eventos.png')} style={styles.cartazEvento} />
      <Text style={styles.eventoTitulo}>Culto da Família</Text>
      <Text style={styles.eventoInfo}>Domingo - 19h</Text>
      <TouchableOpacity style={styles.botaoVerDetalhes}>
        <Text style={styles.botaoDetalhe}>Ver detalhes</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView>

  </LayoutPadrao>
);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    elevation: 3,
  },
  tituloCard: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#144552',
  },
  legendaContainer: {
  marginTop: 20,
  backgroundColor: '#F4F4F4',
  borderRadius: 10,
  padding: 12,
},
legendaTexto: {
  fontSize: 14,
  color: '#333333',
},

legendaTitulo: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#144552',
},

circuloCor: {
  width: 16,
  height: 16,
  borderRadius: 8,
  marginRight: 8,
  borderWidth: 1,
  borderColor: '#ccc',
},

legendaLinha: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},

botaoLegenda: {
  marginTop: 16,
  marginBottom: 12,
  color: '#144552',
  textAlign: 'right',
  fontWeight: 'bold',
  textDecorationLine: 'underline',
},

eventoTopo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 10,
},

eventosIcone: {
  width: 28,
  height: 28,
  resizeMode: 'contain',
  marginRight: 8,
},

tituloSecao: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#57bedaff',
  marginBottom: 8,
},

eventoCard: {
  width: 240,
  backgroundColor: '#060000ff',
  borderRadius: 12,
  marginRight: 16,
  padding: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 6,
  alignItems: 'center',
},

cartazEvento: {
  width: '100%',
  height: 120,
  borderRadius: 8,
  marginBottom: 8,
},

eventoTitulo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#7cd3ebff',
  marginBottom: 4,
},

eventoInfo: {
  fontSize: 14,
  color: '#fffbfbbb',
  marginBottom: 12,
},

botaoVerDetalhes: {
  backgroundColor: '#144552',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginTop: 8,
},

botaoDetalhe: {
  color: '#FFFFFF',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 14,
},

});
