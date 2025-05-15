import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Definindo um tema personalizado simples
// Apenas mudamos as cores principal e secundária
const tema = {
  ...MD3LightTheme,  // Usa o tema claro padrão como base
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007bff',    // Cor azul para elementos principais
    secondary: '#6c757d',  // Cor cinza para elementos secundários
  },
};

// Esta função configura a estrutura básica do aplicativo
export default function Layout() {
  return (
    // PaperProvider: Fornece o tema para todos os componentes do Paper
    <PaperProvider theme={tema}>
      {/* SafeAreaProvider: Garante que o conteúdo fique em áreas seguras da tela */}
      <SafeAreaProvider>
        {/* Stack: Sistema de navegação entre telas */}
        <Stack>
          {/* Configuração da tela principal (index) */}
          <Stack.Screen
            name="index"
            options={{
              title: 'Meus Contatos',  // Título que aparece no topo da tela
              headerTitleStyle: {
                fontWeight: 'bold',    // Deixa o título em negrito
              },
            }}
          />
          
          {/* Configuração da tela de configurações */}
          <Stack.Screen
            name="settings"
            options={{
              title: 'Configurações',  // Título da tela de configurações
              headerTitleStyle: {
                fontWeight: 'bold',    // Título em negrito
              },
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
}