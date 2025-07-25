// app/(tabs)/home.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';


const menuItems = [
  { label: 'Devocional', image: require('../../assets/menu/Devocional.png'), route: '/tabs/home' },
  { label: 'Agenda', image: require('../../assets/menu/Agenda.png'), route: '/agenda' },
  { label: 'Oração', image: require('../../assets/menu/Oracao.png'), route: '/oracao' },
  { label: 'ID Cristão', image: require('../../assets/menu/Idcristao.png'), route: '/idcristao' },
  { label: 'Contribuição', image: require('../../assets/menu/Contribuicao.png'), route: '/contribuicao' },
  { label: 'Certificados', image: require('../../assets/menu/Certificados.png'), route: '/certificados' },
];

export default function HomeScreen() {
  const [primeiroNome, setPrimeiroNome] = useState('Irmão');
  const [nomeIgreja, setNomeIgreja] = useState('Igreja ConectaFé');

  const router = useRouter();

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.replace('/'); // ou '/index' se estiver configurado
  } catch (error) {
    console.error('Erro ao sair:', error);
  }
};

  const versiculo = '“Lâmpada para os meus pés é tua palavra, e luz para os meus caminhos.” - Salmos 119:105';
  const devocionalTexto = 'Hoje, Deus quer lembrar você que mesmo nas sombras Ele permanece guiando. Confie na direção dEle.';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        const nome = user.displayName.split(' ')[0];
        setPrimeiroNome(nome);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Topo com logo e nome da igreja */}
      <View style={styles.header}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.nomeIgreja}>{nomeIgreja}</Text>
      </View>

      {/* Menu horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => alert(`Abrir rota: ${item.route}`)}>
            <Image source={item.image} style={styles.menuImage} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Versículo do Dia */}
      <View style={styles.card}>
        <Text style={styles.tituloSecao}>📖 Versículo do Dia</Text>
        <Text style={styles.conteudo}>{versiculo}</Text>
      </View>

      {/* Devocional */}
      <View style={styles.card}>
        <Text style={styles.tituloSecao}>🕊 Devocional</Text>
        <Text style={styles.conteudo}>{devocionalTexto}</Text>
      </View>

      {/* Link de tutorial */}
      <TouchableOpacity onPress={() => alert('Instruções de devocional')}>
        <Text style={styles.link}>Como fazer um devocional?</Text>
      </TouchableOpacity>

      {/* Eventos em destaque */}
      <Text style={styles.tituloSecao}>📆 Eventos em Destaque</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={styles.eventoCard}>
            <Text style={styles.eventoTitulo}>Culto da Família</Text>
            <Text style={styles.eventoInfo}>Domingo - 19h</Text>
            <TouchableOpacity style={styles.botao}>
              <Text style={styles.botaoTexto}>Confirmar presença</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Exemplo: Banner de aniversário */}
      <View style={styles.aniversario}>
        <Text style={styles.aniversarioTexto}>🎉 Parabéns! Que Deus continue te abençoando.</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
  <Text style={styles.logoutText}>Sair do ConectaFé</Text>
</TouchableOpacity>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000ff',
  },
  scroll: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: -35,
    marginTop: -35,
    justifyContent: 'center',
    marginRight: -30,
  },
  nomeIgreja: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#448b9fff',
  },
  menuContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  menuItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  menuImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  menuLabel: {
    fontSize: 12,
    color: '#ffffffff',
    textAlign: 'center',
    width: 70,
  },
  card: {
    backgroundColor: '#f3eeeeff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#57bedaff',
    marginBottom: 8,
  },
  conteudo: {
    color: '#333',
    fontSize: 14,
  },
  link: {
    color: '#56a9c0ff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  eventoCard: {
    backgroundColor: '#2f332fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
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
  botao: {
    backgroundColor: '#144552',
    padding: 8,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aniversario: {
    backgroundColor: '#FFF3C4',
    borderRadius: 10,
    padding: 12,
    marginTop: 24,
  },
  aniversarioTexto: {
    textAlign: 'center',
    color: '#000000CC',
    fontWeight: '600',
  },
  logoutButton: {
  marginTop: 30,
  padding: 12,
  backgroundColor: '#ff5555',
  borderRadius: 8,
  alignItems: 'center',
},
logoutText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});