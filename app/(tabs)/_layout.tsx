import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: () => null, // você pode colocar um ícone se quiser
        }}
      />
      {/* Outras abas, se houver */}
    </Tabs>
  );
}
