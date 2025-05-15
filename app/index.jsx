import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FAB, Dialog, Portal, Button, TextInput, RadioButton, Text, Searchbar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactItem from '../components/ContactItem';
import Settings from './settings';

export default function Index({ navigation }) {
  // Estados
  const [contacts, setContacts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('pessoal');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Carrega contatos ao iniciar
  useEffect(() => {
    carregarContatos();
  }, []);

  // Salva contatos quando mudam
  useEffect(() => {
    salvarContatos();
  }, [contacts]);

  const carregarContatos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('contacts');
      if (jsonValue != null) {
        setContacts(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const salvarContatos = async () => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Erro ao salvar contatos:', error);
    }
  };

  const mostrarModal = () => setVisible(true);
  
  const fecharModal = () => {
    setVisible(false);
    limparFormulario();
  };

  const limparFormulario = () => {
    setName('');
    setPhone('');
    setCategory('pessoal');
    setEditingContact(null);
  };

  const mostrarModalEdicao = (contato) => {
    setEditingContact(contato);
    setName(contato.name);
    setPhone(contato.phone);
    setCategory(contato.category);
    setVisible(true);
  };

  const mostrarDialogExclusao = (contato) => {
    setContactToDelete(contato);
    setDeleteDialogVisible(true);
  };

  const fecharDialogExclusao = () => {
    setDeleteDialogVisible(false);
    setContactToDelete(null);
  };

  const adicionarOuAtualizarContato = () => {
    if (!name.trim() || !phone.trim()) return;

    if (editingContact) {
      setContacts(
        contacts.map((c) =>
          c.id === editingContact.id
            ? { ...c, name, phone, category }
            : c
        )
      );
    } else {
      const novoContato = {
        id: Date.now().toString(),
        name,
        phone,
        category,
      };
      setContacts([...contacts, novoContato]);
    }

    fecharModal();
  };

  const excluirContato = () => {
    if (contactToDelete) {
      setContacts(contacts.filter((c) => c.id !== contactToDelete.id));
      fecharDialogExclusao();
    }
  };

  // Filtragem de contatos
  const contatosFiltrados = searchQuery
    ? contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
      )
    : contacts;

  // Função para navegar para configurações
  const navegarParaConfiguracoes = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Settings');
    } else {
      setShowSettings(true);
    }
  };

  if (showSettings) {
    return (
      <Settings navigation={{ goBack: () => setShowSettings(false) }} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar contato..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#000"
        />
        <TouchableOpacity 
          style={styles.configButton}
          onPress={navegarParaConfiguracoes}
        >
          <IconButton
            icon="cog"
            color="#007bff"
            size={24}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contatosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactItem
            contact={item}
            onEdit={mostrarModalEdicao}
            onDelete={mostrarDialogExclusao}
            editButtonColor="#000"
          />
        )}
        contentContainerStyle={{
          paddingVertical: 8,
          paddingBottom: contatosFiltrados.length > 0 ? 80 : 0,
          flex: contatosFiltrados.length === 0 ? 1 : undefined
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum contato adicionado</Text>
          </View>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={mostrarModal}
        label="Adicionar"
        color="#ffffff"
      />

      <Portal>
        <Dialog visible={visible} onDismiss={fecharModal} style={styles.dialog}>
          <Dialog.Content>
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="phone" />}
            />
            
            <Text style={styles.categoryLabel}>Categoria:</Text>
            <RadioButton.Group onValueChange={setCategory} value={category}>
              <View style={styles.categoriesContainer}>
                <View style={[styles.radioOption, category === 'trabalho' && styles.selectedCategory]}>
                  <RadioButton value="trabalho" color="#007bff" />
                  <Text>Trabalho</Text>
                </View>
                <View style={[styles.radioOption, category === 'pessoal' && styles.selectedCategory]}>
                  <RadioButton value="pessoal" color="#28a745" />
                  <Text>Pessoal</Text>
                </View>
                <View style={[styles.radioOption, category === 'família' && styles.selectedCategory]}>
                  <RadioButton value="família" color="#dc3545" />
                  <Text>Família</Text>
                </View>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={fecharModal}>Cancelar</Button>
            <Button 
              onPress={adicionarOuAtualizarContato} 
              mode="contained">
              Salvar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={fecharDialogExclusao}>
          <Dialog.Title style={styles.deleteTitle}>Confirmar exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>
              Deseja realmente excluir o contato{' '}
              <Text style={{fontWeight: 'bold'}}>{contactToDelete ? contactToDelete.name : ''}</Text>?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={fecharDialogExclusao}>Cancelar</Button>
            <Button onPress={excluirContato} textColor="red">
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

// Estilos simplificados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  searchBar: {
    flex: 1,
    borderRadius: 20,
    elevation: 2,
    backgroundColor: 'white',
  },
  configButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute', 
    margin: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#007bff',
    elevation: 6,
    borderRadius: 28,
    paddingHorizontal: 8,
  },
  dialog: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  categoryLabel: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedCategory: {
    backgroundColor: '#e6f2ff',
    borderWidth: 1,
    borderColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Aumentado para centralizar melhor na tela
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  deleteTitle: {
    color: '#dc3545',
  },
});