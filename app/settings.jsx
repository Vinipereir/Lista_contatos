import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Appbar, List, Divider, Switch, Dialog, Portal, Button, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function Settings({ navigation }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  // Estados para configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderBy, setOrderBy] = useState('name'); // name, category
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [sortDialogVisible, setSortDialogVisible] = useState(false);

  // Carrega configurações ao iniciar
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  // Salva configurações quando mudam
  useEffect(() => {
    salvarConfiguracoes();
  }, [notificationsEnabled, orderBy]); // Removemos darkMode pois ele é gerenciado pelo ThemeContext

  const carregarConfiguracoes = async () => {
    try {
      const configuracoes = await AsyncStorage.getItem('settings');
      if (configuracoes) {
        const { notificationsEnabled, orderBy } = JSON.parse(configuracoes);
        setNotificationsEnabled(notificationsEnabled ?? true);
        setOrderBy(orderBy ?? 'name');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const salvarConfiguracoes = async () => {
    try {
      const configuracoes = {
        notificationsEnabled,
        orderBy,
      };
      await AsyncStorage.setItem('settings', JSON.stringify(configuracoes));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const limparTodosOsDados = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert(
        'Dados limpos',
        'Todos os contatos e configurações foram apagados.',
        [{ text: 'OK', onPress: () => navigation?.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      Alert.alert('Erro', 'Não foi possível limpar os dados.');
    }
  };

  const confirmarLimpezaDados = () => {
    setConfirmDialogVisible(true);
  };

  const abrirDialogOrdenacao = () => {
    setSortDialogVisible(true);
  };

  const voltarParaInicio = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      console.error('Navegação não disponível');
    }
  };
  
  // Obtém as cores com base no tema
  const theme = darkMode ? DarkTheme : LightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Appbar.Header style={[styles.appbar, { backgroundColor: theme.primary }]}>
        <Appbar.BackAction onPress={voltarParaInicio} color="#FFF" />
        <Appbar.Content title="Configurações" color="#FFF" />
      </Appbar.Header>

      <ScrollView>
        <List.Section>
          <List.Subheader style={[styles.sectionHeader, { color: theme.accent }]}>Aparência</List.Subheader>
          <List.Item
            title="Modo escuro"
            titleStyle={{ color: theme.text }}
            description="Alterar entre tema claro e escuro"
            descriptionStyle={{ color: theme.secondaryText }}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.accent} />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                color={theme.accent}
              />
            )}
            style={[styles.listItem, { backgroundColor: theme.card }]}
          />
          <Divider style={{ backgroundColor: theme.divider }} />

          <List.Subheader style={[styles.sectionHeader, { color: theme.accent }]}>Notificações</List.Subheader>
          <List.Item
            title="Notificações"
            titleStyle={{ color: theme.text }}
            description="Receber alertas sobre atualizações"
            descriptionStyle={{ color: theme.secondaryText }}
            left={props => <List.Icon {...props} icon="bell-outline" color={theme.accent} />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.accent}
              />
            )}
            style={[styles.listItem, { backgroundColor: theme.card }]}
          />
          <Divider style={{ backgroundColor: theme.divider }} />

          <List.Subheader style={[styles.sectionHeader, { color: theme.accent }]}>Organização</List.Subheader>
          <TouchableOpacity onPress={abrirDialogOrdenacao}>
            <List.Item
              title="Ordenar contatos por"
              titleStyle={{ color: theme.text }}
              description={orderBy === 'name' ? 'Nome' : 'Categoria'}
              descriptionStyle={{ color: theme.secondaryText }}
              left={props => <List.Icon {...props} icon="sort-alphabetical-ascending" color={theme.accent} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={theme.secondaryText} />}
              style={[styles.listItem, { backgroundColor: theme.card }]}
            />
          </TouchableOpacity>
          <Divider style={{ backgroundColor: theme.divider }} />

          <List.Subheader style={[styles.sectionHeader, { color: theme.accent }]}>Gerenciamento de dados</List.Subheader>
          <TouchableOpacity onPress={confirmarLimpezaDados}>
            <List.Item
              title="Limpar todos os dados"
              titleStyle={{ color: theme.danger }}
              description="Apagar todos os contatos e configurações"
              descriptionStyle={{ color: theme.secondaryText }}
              left={props => <List.Icon {...props} icon="delete" color={theme.danger} />}
              style={[styles.listItem, { backgroundColor: theme.card }]}
            />
          </TouchableOpacity>
        </List.Section>

        <View style={styles.aboutSection}>
          <Text style={[styles.versionText, { color: theme.secondaryText }]}>MyContacts v1.0.0</Text>
          <Text style={[styles.copyrightText, { color: theme.secondaryText }]}>© 2025 - Todos os direitos reservados</Text>
        </View>
      </ScrollView>

      <Portal>
        <Dialog 
          visible={confirmDialogVisible} 
          onDismiss={() => setConfirmDialogVisible(false)}
          style={{ backgroundColor: theme.card }}
        >
          <Dialog.Title style={[styles.dialogTitle, { color: theme.danger }]}>Confirmar ação</Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.dialogText, { color: theme.text }]}>
              Você tem certeza que deseja limpar todos os contatos e configurações? Esta ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialogVisible(false)} textColor={theme.accent}>Cancelar</Button>
            <Button onPress={limparTodosOsDados} textColor={theme.danger}>
              Limpar tudo
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog 
          visible={sortDialogVisible} 
          onDismiss={() => setSortDialogVisible(false)}
          style={{ backgroundColor: theme.card }}
        >
          <Dialog.Title style={{ color: theme.text }}>Ordenar contatos por</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => {
              setOrderBy(value);
              setSortDialogVisible(false);
            }} value={orderBy}>
              <View style={styles.radioOption}>
                <RadioButton value="name" color={theme.accent} />
                <Text style={[styles.radioText, { color: theme.text }]}>Nome</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="category" color={theme.accent} />
                <Text style={[styles.radioText, { color: theme.text }]}>Categoria</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSortDialogVisible(false)} textColor={theme.accent}>Cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

// Definição de cores para os temas
const LightTheme = {
  primary: '#007bff',
  accent: '#007bff',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#212529',
  secondaryText: '#6c757d',
  divider: '#e9ecef',
  danger: '#dc3545',
};

const DarkTheme = {
  primary: '#0056b3',
  accent: '#4dabf7',
  background: '#121212',
  card: '#1e1e1e',
  text: '#f8f9fa',
  secondaryText: '#adb5bd',
  divider: '#343a40',
  danger: '#ff6b6b',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    elevation: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  listItem: {
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
  },
  aboutSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 14,
    marginTop: 8,
  },
  dialogTitle: {
    fontWeight: 'bold',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 10,
  },
});