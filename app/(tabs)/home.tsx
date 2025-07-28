// app/(tabs)/home.tsx
import React, { Context, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useRouter } from 'expo-router';
import fundoConecta from '../../assets/fundoconectafe.png';
import bibliaIcone from '../../assets/icons/biblia.png';
import pombaIcone from '../../assets/icons/pomba.png';
import playIcon from '../../assets/icons/play.png';
import audioIcon from '../../assets/icons/audio.png';
import * as Speech from 'expo-speech';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useNavigation } from 'expo-router';
import eventosIcone from '../../assets/icons/Eventos.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import LayoutPadrao from '../components/LayoutPadrao';




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
  const [nomeIgreja, setNomeIgreja] = useState('ConectaFé');
  const [usuarioId, setUsuarioId] = useState(null);
  const [mostrarDevocional, setMostrarDevocional] = useState(false);
  const router = useRouter();
  const [voltarComDevocionalAberto, setVoltarComDevocionalAberto] = useState(false);
  const [eventoAberto, setEventoAberto] = useState(false);



  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const versiculo = '"Lâmpada para os meus pés é tua palavra, e luz para os meus caminhos." - Salmos 119:105';
  const devocionalTexto = 'Hoje, Deus quer lembrar você que mesmo nas sombras Ele permanece guiando. Confie na direção dEle.';

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.displayName) {
        const nome = user.displayName.split(' ')[0];
        setPrimeiroNome(nome);
      }
      setUsuarioId(user.uid);
    }
  });
  return unsubscribe;
}, []);

  const [aniversariantes, setAniversariantes] = useState([]);
const hoje = new Date();

const buscarAniversariantes = async () => {
  try {
    const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
    const lista = [];

    usuariosSnapshot.forEach((doc) => {
      const dados = doc.data();
      if (!dados.dataNascimento || !dados.fotoPerfil) return;

      const nascimento = new Date(dados.dataNascimento);
      if (
        nascimento.getDate() === hoje.getDate() &&
        nascimento.getMonth() === hoje.getMonth()
      ) {
        lista.push({
          nome: dados.nome,
          foto: dados.fotoPerfil,
          id: doc.id,
        });
      }
    });

    setAniversariantes(lista);
  } catch (err) {
    console.error('Erro ao buscar aniversariantes:', err);
  }
};

useEffect(() => {
  buscarAniversariantes();
}, []);

  useFocusEffect(
  useCallback(() => {
    if (voltarComDevocionalAberto) {
      setMostrarDevocional(true); // Reabre o devocional
      setVoltarComDevocionalAberto(false); // Reseta o controle
    }
  }, [voltarComDevocionalAberto])
);

  const falarDevocional = () => {
  Speech.stop(); // para caso esteja lendo algo
  Speech.speak(devocionalTexto, {
    language: 'pt-BR',
    rate: 0.9,
  });
};
const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = navigation.addListener('state', () => {
    setMostrarDevocional(false);
  });

  return unsubscribe;
}, [navigation]);

useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', () => {
    setMostrarDevocional(false);
  });

  return unsubscribe;
}, [navigation]);



  return (
  <LayoutPadrao telaAtiva="Devocional">
    <TouchableOpacity style={styles.versiculoCard} onPress={() => router.push('https://www.bibliaonline.com.br/')}>
      <View style={styles.versiculoTopo}>
        <Image source={bibliaIcone} style={styles.bibliaIcone} />
        <Text style={styles.tituloVersiculo}>Versículo do Dia</Text>
      </View>
      <Text style={styles.conteudoVersiculo}>{versiculo}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.devocionalCard} onPress={() => setMostrarDevocional(true)}>
      <View style={styles.devocionalTopo}>
        <Image source={pombaIcone} style={styles.pombaIcone} />
        <Text style={styles.tituloDevocional}>Devocional</Text>
      </View>
      <Text style={styles.conteudoDevocional}>{devocionalTexto}</Text>
    </TouchableOpacity>

    <View style={styles.eventoTopo}>
      <Image source={eventosIcone} style={styles.eventosIcone} />
      <Text style={styles.tituloSecao}>Eventos em Destaque</Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
      {[1, 2, 3].map((n) => (
        <View key={n} style={styles.eventoCard}>
          <Image source={require('../../assets/icons/Eventos.png')} style={styles.cartazEvento} />
          <Text style={styles.eventoTitulo}>Culto da Família</Text>
          <Text style={styles.eventoInfo}>Domingo - 19h</Text>
          <TouchableOpacity
            style={styles.botaoVerDetalhes}
            onPress={() => setEventoAberto(true)}
          >
            <Text style={styles.botaoDetalhe}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>

    {mostrarDevocional && (
      <View style={[styles.devocionalExpandido, { zIndex: 1 }]}>
        <Text style={styles.conteudoExpandido}>{devocionalTexto}</Text>

        <View style={styles.iconesContainer}>
          <TouchableOpacity style={styles.iconeMenu} onPress={falarDevocional}>
            <Image source={audioIcon} style={styles.iconeImagem} />
            <Text style={styles.iconeLabel}>Áudio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconeMenu}
            onPress={() => {
              setVoltarComDevocionalAberto(true);
              router.push('/devocional/youtube');
            }}
          >
            <Image source={playIcon} style={styles.iconeImagem} />
            <Text style={styles.iconeLabel}>Vídeos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoTransparente} onPress={() => alert('📘 Instruções básicas para fazer um devocional')}>
          <Text style={styles.link}>📘 Como fazer um devocional?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoFechar} onPress={() => setMostrarDevocional(false)}>
          <Text style={styles.botaoTexto}>Fechar</Text>
        </TouchableOpacity>
      </View>
    )}

    {eventoAberto && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.modalTitulo}>📅 Culto da Família</Text>

        <Image
          source={require('../../assets/icons/Eventos.png')}
          style={styles.modalCartaz}
        />

        <Text style={styles.modalData}>🗓 Domingo - 29/07/2025 às 19h</Text>

        {/* Botões lado a lado */}
        <View style={styles.modalBotoesLaterais}>
          <TouchableOpacity style={styles.modalBotaoSecundario}>
            <Text style={styles.modalBotaoTexto}>✅ Confirmar Presença</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalBotaoSecundario}>
            <Text style={styles.modalBotaoTexto}>⏰ Lembre-me</Text>
          </TouchableOpacity>
        </View>

        {/* Liturgia */}
        <Text style={styles.modalSubtitulo}>🎤 Liturgia</Text>
        <Text style={styles.modalLinha}>Tema: Família, Projeto de Deus</Text>
        <Text style={styles.modalLinha}>Orador: Pr. João Marcos</Text>
        <Text style={styles.modalLinha}>Louvor: Ministério Vida</Text>
        <Text style={styles.modalLinha}>Coral: Vozes da Graça</Text>

        {/* Pós-evento */}
        <Text style={styles.modalSubtitulo}>📖 Pós-evento</Text>
        <Text style={styles.modalLinha}>Versículos: Salmos 23, Efésios 6</Text>
        <Text style={styles.modalLinha}>Louvores: A Ele a Glória, Tu és Santo</Text>

        {/* Botão Ofertar */}
        <TouchableOpacity style={styles.modalBotaoOfertar}>
          <Text style={styles.modalBotaoTextoGrande}>OFERTA</Text>
        </TouchableOpacity>

        {/* Botão Fechar */}
        <TouchableOpacity style={styles.modalBotaoFechar} onPress={() => setEventoAberto(false)}>
          <Text style={styles.modalBotaoTextoFechar}>FECHAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
)}


    {aniversariantes.some((a) => a.id === usuarioId) && (
      <View style={styles.aniversario}>
        <Text style={styles.aniversarioTexto}>
          🎉 Feliz aniversário, {primeiroNome}! Veja as mensagens que te deixaram hoje. Que Deus te abençoe imensamente!
        </Text>
      </View>
    )}

    {aniversariantes.length > 0 && (
      <View style={styles.aniversariantesCard}>
        <Text style={styles.tituloSecao}>🎂 Aniversariantes de hoje</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {aniversariantes.map((pessoa) => (
            <View key={pessoa.id} style={styles.aniversarianteCard}>
              <Image source={{ uri: pessoa.foto }} style={styles.fotoAniversariante} />
              <Text style={styles.nomeAniversariante}>{pessoa.nome}</Text>
              <TouchableOpacity
                style={styles.botaoParabens}
                onPress={() => alert(`Você desejou parabéns para ${pessoa.nome}! 🙏`)}
              >
                <Text style={styles.textoBotaoParabens}>🎉 Parabenizar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    )}

    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Sair do ConectaFé</Text>
    </TouchableOpacity>
  </LayoutPadrao>
);

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
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
  botaoDetalhe: {
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
  versiculoCard: {
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  borderColor: '#A3D9A5',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},

versiculoTopo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

tituloVersiculo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#A3D9A5',
  marginLeft: 10,
},

conteudoVersiculo: {
  color: '#ffffff',
  fontSize: 14,
  fontStyle: 'italic',
},

bibliaIcone: {
  width: 28,
  height: 28,
  resizeMode: 'contain',
},
devocionalCard: {
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  borderColor: '#A3D9A5',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},

devocionalTopo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

tituloDevocional: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#A3D9A5',
  marginLeft: 10,
},

conteudoDevocional: {
  color: '#ffffff',
  fontSize: 14,
  fontStyle: 'italic',
},

pombaIcone: {
  width: 28,
  height: 28,
  resizeMode: 'contain',
},
devocionalExpandido: {
  position: 'absolute',
  top: 120,
  left: 20,
  right: 20,
  backgroundColor: '#c3f9fcf4',
  padding: 20,
  borderRadius: 12,
  elevation: 10,
  zIndex: 999,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},
iconesContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 16,
},

iconeMenu: {
  alignItems: 'center',
  marginHorizontal: 10,
},

iconeImagem: {
  width: 48,
  height: 48,
  resizeMode: 'contain',
  marginBottom: 4,
},

iconeLabel: {
  fontSize: 12,
  color: '#144552',
  fontWeight: 'bold',
},

conteudoExpandido: {
  fontSize: 16,
  color: '#333',
  marginBottom: 16,
},

botaoTransparente: {
  marginTop: 8,
},

botaoFechar: {
  marginTop: 16,
  backgroundColor: '#144552',
  padding: 10,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
},

botaoTexto: {
  color: '#FFFFFF', // 👈 aqui você troca a cor
  fontSize: 16,
  fontWeight: 'bold',
},

eventoTopo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

eventosIcone: {
  width: 28,
  height: 28,
  resizeMode: 'contain',
  marginRight: 8,
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

botaoVerDetalhes: {
  backgroundColor: '#144552',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginTop: 8,
},

aniversariantesCard: {
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  borderColor: '#FFD700',
  borderRadius: 12,
  padding: 16,
  marginTop: 20,
},

aniversarianteCard: {
  width: 140,
  backgroundColor: '#fff',
  borderRadius: 10,
  marginRight: 16,
  padding: 10,
  alignItems: 'center',
  elevation: 4,
},

fotoAniversariante: {
  width: 64,
  height: 64,
  borderRadius: 32,
  marginBottom: 8,
  resizeMode: 'cover',
  borderWidth: 2,
  borderColor: '#FFD700',
},

nomeAniversariante: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#144552',
  textAlign: 'center',
  marginBottom: 6,
},

botaoParabens: {
  backgroundColor: '#FFD700',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 8,
},

textoBotaoParabens: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#000',
},

meuAniversarioCard: {
  backgroundColor: '#ffeaa7',
  padding: 20,
  borderRadius: 12,
  marginVertical: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5,
},

fotoAniversarianteGrande: {
  width: 90,
  height: 90,
  borderRadius: 45,
  borderWidth: 3,
  borderColor: '#FFD700',
  marginBottom: 10,
},

textoEspecial: {
  color: '#444',
  fontSize: 14,
  textAlign: 'center',
  marginVertical: 10,
},

botaoVerMensagens: {
  backgroundColor: '#144552',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
},
modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(80, 80, 80, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  zIndex: 999,
},

modalContainer: {
  width: '100%',
  maxHeight: '100%',
  backgroundColor: '#18495bf6',
  borderRadius: 16,
  elevation: 10,
},

modalContent: {
  padding: 20,
},

modalTitulo: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#c1e8baff',
  textAlign: 'center',
  marginBottom: 12,
},

modalCartaz: {
  width: '100%',
  height: 180,
  borderRadius: 12,
  marginBottom: 16,
  resizeMode: 'cover',
},

modalData: {
  fontSize: 15,
  color: '#ffffffff',
  textAlign: 'center',
  marginBottom: 18,
},

modalBotoesLaterais: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 20,
},

modalBotaoSecundario: {
  flex: 1,
  backgroundColor: '#A3D9A5',
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#144552',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},

modalBotaoTexto: {
  color: '#144552',
  fontSize: 14,
  fontWeight: 'bold',
},

modalSubtitulo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#c1e8baff',
  marginTop: 20,
  marginBottom: 6,
},

modalLinha: {
  fontSize: 14,
  color: '#fefefeff',
  marginBottom: 4,
},

modalBotaoOfertar: {
  backgroundColor: '#46a078ff',
  marginTop: 24,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  elevation: 4,
  shadowColor: '#d98e00',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.4,
  shadowRadius: 5,
},

modalBotaoTextoGrande: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#f3f7f9ff',
},

modalBotaoFechar: {
  marginTop: 16,
  backgroundColor: '#144552',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},

modalBotaoTextoFechar: {
  color: '#f7f2f2ff',
  fontSize: 16,
  fontWeight: 'bold',
},

});
