import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function YoutubeSearch() {
  const versiculo = '"Lâmpada para os meus pés é tua palavra, e luz para os meus caminhos." - Salmos 119:105';
  const termo = encodeURIComponent(`pregação sobre ${versiculo}`);
  const url = `https://www.youtube.com/results?search_query=${termo}`;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} style={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
