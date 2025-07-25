import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button, Checkbox, IconButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';


export default function RegisterScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [batismoFotos, setBatismoFotos] = useState<string[]>([]);
  const [perfilUri, setPerfilUri] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [aceiteLGPD, setAceiteLGPD] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePickImage = async (callback: (uri: string) => void) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      callback(result.assets[0].uri);
    }
  };

  const buscarEnderecoPorCep = async (cep: string, setFieldValue: any) => {
    if (cep.length < 8) return;
    try {
      setCepLoading(true);
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
      setFieldValue('rua', data.logradouro || '');
      setFieldValue('bairro', data.bairro || '');
      setFieldValue('cidade', data.localidade || '');
      setFieldValue('estado', data.uf || '');
    } catch (error) {
      Alert.alert('Erro', 'CEP inválido ou não encontrado');
    } finally {
      setCepLoading(false);
    }
  };

  const schema = Yup.object().shape({
    nome: Yup.string().required('Informe o nome'),
    nascimento: Yup.string().required('Informe a data de nascimento'),
    email: Yup.string().email('E-mail inválido').required('Informe o e-mail'),
    senha: Yup.string()
      .required('Crie uma senha')
      .matches(/[A-Z]/, 'Deve conter letra maiúscula')
      .matches(/[a-z]/, 'Deve conter letra minúscula')
      .matches(/[0-9]/, 'Deve conter número')
      .matches(/[!@#$%^&*]/, 'Deve conter caractere especial'),
    confirmarSenha: Yup.string().oneOf([Yup.ref('senha')], 'Senhas diferentes').required('Confirme a senha'),
    telefone: Yup.string().required('Informe o telefone'),
    cpf: Yup.string().matches(/^\d{11}$/, 'CPF inválido').required('Informe o CPF'),
    cep: Yup.string().matches(/^\d{8}$/, 'CEP inválido').required('Informe o CEP'),
    rua: Yup.string().required('Rua obrigatória'),
    numero: Yup.string().required('Número obrigatório'),
    bairro: Yup.string().required('Bairro obrigatório'),
    cidade: Yup.string().required('Cidade obrigatória'),
    estado: Yup.string().required('Estado obrigatório'),
    classificacao: Yup.string().required('Selecione a classificação'),
    codigoIgreja: Yup.string().required('Código da igreja obrigatório'),
    batismo: Yup.string().when('classificacao', {
      is: 'Membro',
      then: (schema) => schema.required('Informe a data de batismo')
    }),
  });

  const handleSubmitForm = async (values: any) => {
  if (!aceiteLGPD) {
    Alert.alert('LGPD', 'Você precisa aceitar os termos para continuar');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.senha);
    const user = userCredential.user;

    await setDoc(doc(db, 'membros', user.uid), {
      nome: values.nome,
      email: values.email,
      telefone: values.telefone,
      cpf: values.cpf,
      nascimento: values.nascimento,
      classificacao: values.classificacao,
      batismo: values.batismo || null,
      codigoIgreja: values.codigoIgreja,
      cep: values.cep,
      rua: values.rua,
      numero: values.numero,
      bairro: values.bairro,
      cidade: values.cidade,
      estado: values.estado,
      criadoEm: new Date(),
    });

    Alert.alert('Cadastro realizado', 'Seu cadastro foi efetuado com sucesso!');
    router.replace('/');
  } catch (error: any) {
    console.error('Erro ao cadastrar:', error);
    Alert.alert('Erro', error.message);
  }
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.title}>Registro</Text>

      <Formik
        initialValues={{
          nome: '', nascimento: '', email: '', senha: '', confirmarSenha: '', telefone: '', cpf: '',
          cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', classificacao: '',
          batismo: '', codigoIgreja: ''
        }}
        validationSchema={schema}
        onSubmit={handleSubmitForm}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
          
            {perfilUri && (
              <Image source={{ uri: perfilUri }} style={styles.preview} />
            )}

            <Button mode="outlined" onPress={() => handlePickImage(uri => setPerfilUri(uri))} style={styles.input}>
              {perfilUri ? 'Trocar Foto de Perfil' : 'Selecionar Foto de Perfil'}
            </Button>

            <TextInput label="Nome completo" mode="outlined" value={values.nome} onChangeText={handleChange('nome')} style={styles.input} />
            {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

            <TextInputMask
              type={'datetime'}
              options={{ format: 'DD/MM/YY' }}
              value={values.nascimento}
              onChangeText={handleChange('nascimento')}
              placeholder="Data de nascimento (DD/MM/AA)"
              style={styles.input}
            />
            {touched.nascimento && errors.nascimento && <Text style={styles.error}>{errors.nascimento}</Text>}

            <TextInput label="E-mail" mode="outlined" keyboardType="email-address" value={values.email} onChangeText={handleChange('email')} style={styles.input} />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.passwordRow}>
              <TextInput label="Senha" mode="outlined" secureTextEntry={!showPassword} value={values.senha} onChangeText={handleChange('senha')} style={styles.passwordInput} />
              <IconButton icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />
            </View>
            {touched.senha && errors.senha && <Text style={styles.error}>{errors.senha}</Text>}

            <View style={styles.passwordRow}>
              <TextInput label="Confirmar senha" mode="outlined" secureTextEntry={!showConfirmPassword} value={values.confirmarSenha} onChangeText={handleChange('confirmarSenha')} style={styles.passwordInput} />
              <IconButton icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />
            </View>
            {touched.confirmarSenha && errors.confirmarSenha && <Text style={styles.error}>{errors.confirmarSenha}</Text>}

            <TextInput label="Telefone" mode="outlined" value={values.telefone} onChangeText={handleChange('telefone')} style={styles.input} keyboardType="numeric"/>
            <TextInput label="CPF (somente números)" mode="outlined" value={values.cpf} onChangeText={handleChange('cpf')} style={styles.input} keyboardType="numeric"/>
            {touched.cpf && errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}

            <TextInput label="CEP" mode="outlined" value={values.cep} onChangeText={(text) => { handleChange('cep')(text); if (text.length === 8) buscarEnderecoPorCep(text, setFieldValue); }} style={styles.input} keyboardType="numeric"/>
            <TextInput label="Rua" mode="outlined" value={values.rua} onChangeText={handleChange('rua')} style={styles.input} />
            <TextInput label="Número" mode="outlined" value={values.numero} onChangeText={handleChange('numero')} style={styles.input} keyboardType="numeric"/>
            <TextInput label="Bairro" mode="outlined" value={values.bairro} onChangeText={handleChange('bairro')} style={styles.input} />
            <TextInput label="Cidade" mode="outlined" value={values.cidade} onChangeText={handleChange('cidade')} style={styles.input} />
            <TextInput label="Estado" mode="outlined" value={values.estado} onChangeText={handleChange('estado')} style={styles.input} />

            <Picker selectedValue={values.classificacao} onValueChange={(itemValue) => setFieldValue('classificacao', itemValue)} style={styles.input}>
              <Picker.Item label="Selecione a classificação" value="" />
              <Picker.Item label="Membro" value="Membro" />
              <Picker.Item label="Congregado" value="Congregado" />
            </Picker>
            {touched.classificacao && errors.classificacao && <Text style={styles.error}>{errors.classificacao}</Text>}

            {values.classificacao === 'Membro' && (
              <>
                <TextInputMask
                  type={'datetime'}
                  options={{ format: 'DD/MM/YY' }}
                  value={values.batismo}
                  onChangeText={handleChange('batismo')}
                  placeholder="Data de batismo (DD/MM/AA)"
                  style={styles.input}
                />
                <Button mode="outlined" onPress={() => handlePickImage(uri => setBatismoFotos([...batismoFotos, uri]))}>
                  Selecionar fotos do batismo
                </Button>
                {batismoFotos.map((uri, i) => (<Image key={i} source={{ uri }} style={styles.preview} />))}
              </>
            )}

            <TextInput label="Código da Igreja" mode="outlined" value={values.codigoIgreja} onChangeText={handleChange('codigoIgreja')} style={styles.input} />
            {touched.codigoIgreja && errors.codigoIgreja && <Text style={styles.error}>{errors.codigoIgreja}</Text>}

            <Button mode="outlined" onPress={() => Alert.alert('Política LGPD', 'Ao continuar, você autoriza o uso de sua imagem, voz, participação em eventos e dados de forma criteriosa para uso na igreja, redes sociais, materiais de divulgação, e fins internos da instituição, respeitando os termos da LGPD.')}>Visualizar Política LGPD</Button>

            <View style={styles.checkboxContainer}>
              <Checkbox status={aceiteLGPD ? 'checked' : 'unchecked'} onPress={() => setAceiteLGPD(!aceiteLGPD)} />
              <Text style={styles.checkboxLabel}>Aceito os termos da LGPD</Text>
            </View>

            <Button mode="contained" onPress={() => handleSubmit()} disabled={!aceiteLGPD}>
              Registrar
            </Button>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { marginTop: 10, fontSize: 28, marginBottom: 24, fontWeight: 'bold', textAlign: 'center' },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 8, fontSize: 12 },
  preview: { width: 140, height: 140, borderRadius: 100, marginBottom: 10, alignSelf: 'center' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 24 },
  checkboxLabel: { marginLeft: 8 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
});
