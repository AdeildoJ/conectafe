// components/TopoComMenu.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TopoComMenu({ telaAtiva }: { telaAtiva: string }) {
  const router = useRouter();

  const botoes = [
    { nome: 'Devocional', icone: require('../../assets/menu/Devocional.png'), rota: '/tabs/home' },
    { nome: 'Agenda', icone: require('../../assets/menu/Agenda.png'), rota: '/tabs/agenda' },
    { nome: 'Oração', icone: require('../../assets/menu/Oracao.png'), rota: '/tabs/oracao' },
    { nome: 'ID Cristão', icone: require('../../assets/menu/Idcristao.png'), rota: '/tabs/idcristao' },
    { nome: 'Certificados', icone: require('../../assets/menu/Certificados.png'), rota: '/tabs/certificados' },
  ];

  return (
    <>
      {/* Topo */}
      <View style={styles.topo}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.nomeIgreja}>ConectaFé</Text>
      </View>

      {/* Menu horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menu}>
        {botoes.map((btn) => {
          const selecionado = telaAtiva === btn.nome;
          return (
            <TouchableOpacity
              key={btn.nome}
              onPress={() => router.push(btn.rota)}
              style={selecionado ? styles.botaoMenuSelecionado : styles.botaoMenu}
            >
              <Image source={btn.icone} style={styles.iconeMenu} />
              <Text style={selecionado ? styles.textoMenuSelecionado : styles.textoMenu}>
                {btn.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  nomeIgreja: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menu: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingLeft: 20,
  },
  botaoMenu: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    width: 75,
  },
  botaoMenuSelecionado: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A3D9A5',
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    width: 75,
  },
  iconeMenu: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  textoMenu: {
    fontSize: 12,
    color: '#000000',
  },
  textoMenuSelecionado: {
    fontSize: 12,
    color: '#144552',
    fontWeight: 'bold',
  },
});
