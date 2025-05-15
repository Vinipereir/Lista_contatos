import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Avatar, IconButton, Text } from 'react-native-paper';

const ContactItem = ({ contact, onEdit, onDelete, editButtonColor = "#007bff" }) => {
  // Função para determinar a cor do avatar com base na categoria do contato
  const obterCorAvatar = (categoria) => {
    switch (categoria) {
      case 'trabalho':
        return '#007bff'; // Azul para contatos de trabalho
      case 'pessoal':
        return '#28a745'; // Verde para contatos pessoais
      case 'família':
        return '#dc3545'; // Vermelho para contatos da família
      
    }
  };

  // Função para obter o ícone com base na categoria
  const obterIconeCategoria = (categoria) => {
    switch (categoria) {
      case 'trabalho':
        return 'briefcase';
      case 'pessoal':
        return 'account';
      case 'família':
        return 'home-heart';
      default:
        return 'account';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Text
          size={50}
          label={contact.name[0].toUpperCase()}
          style={{ backgroundColor: obterCorAvatar(contact.category) }}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.phone}>{contact.phone}</Text>
          <View style={styles.detailsRow}>
            <IconButton
              icon={obterIconeCategoria(contact.category)}
              size={16}
              iconColor={obterCorAvatar(contact.category)}
              style={styles.smallIcon}
            />
            <Text style={{ color: obterCorAvatar(contact.category) }}>
              {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            iconColor={editButtonColor} // Aqui usamos a cor passada por props
            size={20}
            onPress={() => onEdit(contact)}
          />
          <IconButton
            icon="delete"
            iconColor="#dc3545"
            size={20}
            onPress={() => onDelete(contact)}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    elevation: 2,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    margin: 0,
    marginRight: -4,
  },
  actions: {
    flexDirection: 'row',
  },
});

export default ContactItem;