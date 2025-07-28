// app/components/LayoutPadrao.tsx
// app/components/LayoutPadrao.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import fundoConecta from '../../assets/fundoconectafe.png'; // <- adicione essa linha se ainda não tiver



const menuItems = [
  { label: 'Devocional', image: require('../../assets/menu/Devocional.png'), route: '/home' },
  { label: 'Agenda', image: require('../../assets/menu/Agenda.png'), route: '/agenda' },
  { label: 'Oração', image: require('../../assets/menu/Oracao.png'), route: '/oracao' },
  { label: 'ID Cristão', image: require('../../assets/menu/Idcristao.png'), route: '/idcristao' },
  { label: 'Certificados', image: require('../../assets/menu/Certificados.png'), route: '/certificados' },
];

export default function LayoutPadrao({ children, telaAtiva }: { children: React.ReactNode; telaAtiva: string }) {
  const router = useRouter();

  return (
    <ImageBackground source={fundoConecta} style={styles.wrapper} resizeMode="cover">
      <View style={styles.topo}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.nomeIgreja}>ConectaFé</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.container}>
          <View style={styles.scroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, telaAtiva === item.label && styles.menuItemAtivo]}
                  onPress={() => router.push(item.route)}
                >
                  <Image source={item.image} style={styles.menuImage} />
                  <Text style={[styles.menuLabel, telaAtiva === item.label && styles.menuLabelAtivo]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {children}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  topo: {
    backgroundColor: '#345f8d7c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 5,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 0,
  },
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    overflow: 'hidden',
  },
  scroll: {
    padding: 20,
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginBottom: -20,
    marginTop: -30,
  },
  nomeIgreja: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d9f7ffff',
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  menuItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemAtivo: {
    borderBottomWidth: 2,
    borderColor: '#A3D9A5',
  },
  menuImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 4,
    marginTop: 4,
  },
  menuLabel: {
    fontSize: 12,
    color: '#7cd3ebff',
    textAlign: 'center',
    width: 70,
  },
  menuLabelAtivo: {
    color: '#A3D9A5',
    fontWeight: 'bold',
  },
});
