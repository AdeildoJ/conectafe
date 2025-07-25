import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('E-mail inválido').required('Informe seu e-mail'),
  });

  const handleSendResetLink = async (values: { email: string }) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      Alert.alert('Recuperação', 'Link de redefinição enviado para seu e-mail');
      router.replace('/');
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      Alert.alert('Erro', 'Não foi possível enviar o e-mail. Verifique se está correto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSendResetLink}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="E-mail"
              mode="outlined"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && !!errors.email}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Button mode="contained" onPress={() => handleSubmit()} style={styles.button}>
              Enviar link de recuperação
            </Button>
          </>
        )}
      </Formik>

      <Button onPress={() => router.replace('/')} style={styles.link}>
        Voltar para o login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 32,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
  },
});
