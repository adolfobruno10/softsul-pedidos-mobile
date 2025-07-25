import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

const API_BASE_URL = 'http://localhost:8000/api';

export default function App() {
  const [pedidos, setPedidos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [formData, setFormData] = useState({
    nome_cliente: '',
    data_pedido: '',
    data_entrega: '',
    status: 'pendente'
  });

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`);
      const data = await response.json();
      if (data.success) {
        setPedidos(data.data);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pedidos');
    }
  };

  const savePedido = async () => {
    try {
      const url = editingPedido 
        ? `${API_BASE_URL}/pedidos/${editingPedido.id}`
        : `${API_BASE_URL}/pedidos`;
      
      const method = editingPedido ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Sucesso', data.message);
        setModalVisible(false);
        resetForm();
        fetchPedidos();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao salvar pedido');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o pedido');
    }
  };

  const deletePedido = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                },
              });

              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Sucesso', data.message);
                fetchPedidos();
              } else {
                Alert.alert('Erro', data.message || 'Erro ao excluir pedido');
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o pedido');
            }
          },
        },
      ]
    );
  };

  const openModal = (pedido = null) => {
    if (pedido) {
      setEditingPedido(pedido);
      setFormData({
        nome_cliente: pedido.nome_cliente,
        data_pedido: pedido.data_pedido.split('T')[0],
        data_entrega: pedido.data_entrega.split('T')[0],
        status: pedido.status
      });
    } else {
      setEditingPedido(null);
      resetForm();
    }
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      nome_cliente: '',
      data_pedido: '',
      data_entrega: '',
      status: 'pendente'
    });
    setEditingPedido(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#FFC107';
      case 'entregue': return '#28A745';
      case 'cancelado': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderPedido = ({ item }) => (
    <View style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>#{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.clienteName}>{item.nome_cliente}</Text>
      
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>Pedido: {formatDate(item.data_pedido)}</Text>
        <Text style={styles.dateLabel}>Entrega: {formatDate(item.data_entrega)}</Text>
      </View>
      
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openModal(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deletePedido(item.id)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007BFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Pedidos</Text>
        <Text style={styles.headerSubtitle}>Softsul Sistemas</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.listTitle}>Lista de Pedidos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal()}
          >
            <Text style={styles.addButtonText}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPedido}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
              <Text style={styles.emptySubtext}>Toque em "Novo" para adicionar um pedido</Text>
            </View>
          }
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingPedido ? 'Editar Pedido' : 'Novo Pedido'}
              </Text>

              <Text style={styles.inputLabel}>Nome do Cliente</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do cliente"
                value={formData.nome_cliente}
                onChangeText={(text) => setFormData({ ...formData, nome_cliente: text })}
              />

              <Text style={styles.inputLabel}>Data do Pedido</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.data_pedido}
                onChangeText={(text) => setFormData({ ...formData, data_pedido: text })}
              />

              <Text style={styles.inputLabel}>Data de Entrega</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.data_entrega}
                onChangeText={(text) => setFormData({ ...formData, data_entrega: text })}
              />

              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusContainer}>
                {['pendente', 'entregue', 'cancelado'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      formData.status === status && styles.statusOptionSelected
                    ]}
                    onPress={() => setFormData({ ...formData, status })}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      formData.status === status && styles.statusOptionTextSelected
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={savePedido}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#007BFF',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  pedidoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clienteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusOptionSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#666',
  },
  statusOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  saveButton: {
    backgroundColor: '#007BFF',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

