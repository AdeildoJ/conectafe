import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          headerShown: false, // 👈 remove o título e a faixa branca
        }}
      />
      <Tabs.Screen
        name="oracao"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="idcristao"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="certificados"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="contribuicao"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
