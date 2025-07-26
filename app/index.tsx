// app/index.tsx
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import { auth, db } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  // 🔐 Login com Google
  const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '577255371725-n768h8mepopfi83rags6eq1m7qh22hap.apps.googleusercontent.com', // Web - Expo Go
  androidClientId: '577255371725-8rgrik1civg5827kfjs5jmdfaudkvkin.apps.googleusercontent.com', // APK real
  redirectUri: AuthSession.makeRedirectUri({
    native: 'conectafe://redirect',
  }),
});

  useEffect(() => {
    if (response?.type === 'success') {
      const { idToken } = response.authentication!;
      const credential = GoogleAuthProvider.credential(idToken);


      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const userRef = doc(db, 'membros', user.uid);

          await setDoc(userRef, {
            nome: user.displayName,
            email: user.email,
            foto: user.photoURL,
            criadoEm: new Date(),
          }, { merge: true });

          router.replace('/home'); // ou sua tela principal
        })
        .catch((err) => {
          console.error('Erro ao autenticar com Google', err);
          Alert.alert('Erro', 'Falha ao autenticar com Google');
        });
    }
  }, [response]);

  // 🛡️ Validação
  const loginValidationSchema = Yup.object().shape({
    login: Yup.string().required('Informe seu e-mail ou CPF'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe sua senha'),
  });

  const handleLogin = async (values: { login: string; password: string }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, values.login, values.password);
    const user = userCredential.user;

    // ✅ Redirecionar para a Home (dentro de app/tabs)
    router.replace('/(tabs)/home');
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.message);

    let mensagem = 'Erro ao fazer login.';
    if (error.code === 'auth/user-not-found') mensagem = 'Usuário não encontrado.';
    if (error.code === 'auth/wrong-password') mensagem = 'Senha incorreta.';
    if (error.code === 'auth/invalid-email') mensagem = 'E-mail inválido.';

    Alert.alert('Erro de login', mensagem);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.title}>ConectaFé</Text>
      </View>

      {/* Botão de Login com Google */}
      <Button
        mode="contained"
        style={styles.button}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        Entrar com Google
      </Button>

      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="E-mail ou CPF"
              mode="outlined"
              value={values.login}
              onChangeText={handleChange('login')}
              onBlur={handleBlur('login')}
              error={touched.login && !!errors.login}
              style={styles.input}
            />
            {touched.login && errors.login && (
              <Text style={styles.error}>{errors.login}</Text>
            )}

            <TextInput
              label="Senha"
              mode="outlined"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && !!errors.password}
              style={styles.input}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Button mode="contained" onPress={() => handleSubmit()} style={styles.button}>
              Entrar
            </Button>

            <Button onPress={() => router.push('/forgot-password')} style={styles.link}>
              Esqueci minha senha
            </Button>

            <Text style={styles.text}>Não tem conta?</Text>
            <Button onPress={() => router.push('/register')}>Registre-se aqui</Button>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: -30,
  },
  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    marginTop: 10
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 8,
  },
  text: {
    marginTop: 24,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
  },
});
