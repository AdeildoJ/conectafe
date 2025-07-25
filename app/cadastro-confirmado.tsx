import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function CadastroConfirmadoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      <Text style={styles.title}>Cadastro Enviado com Sucesso!</Text>

      <Text style={styles.text}>
        Agora é só aguardar a aprovação da sua igreja vinculada ao código informado.
        Você será notificado quando seu acesso estiver liberado.
      </Text>

      <Button mode="contained" onPress={() => router.replace('/')} style={styles.button}>
        Voltar para o Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '80%',
  },
});
