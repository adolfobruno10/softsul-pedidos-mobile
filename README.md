# Sistema de Pedidos Mobile - Softsul Sistemas

## Descrição

Aplicativo móvel desenvolvido em React Native para gerenciamento de pedidos, parte do desafio técnico da Softsul Sistemas. O aplicativo consome a API Laravel para realizar operações CRUD (Create, Read, Update, Delete) de pedidos.

## Funcionalidades

- ✅ Listagem de pedidos com status colorido
- ✅ Criação de novos pedidos
- ✅ Edição de pedidos existentes
- ✅ Exclusão de pedidos com confirmação
- ✅ Interface nativa e responsiva
- ✅ Integração completa com API REST

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile multiplataforma
- **Expo**: Plataforma de desenvolvimento que facilita a criação e teste de apps
- **JavaScript/JSX**: Linguagem de programação
- **React Hooks**: Para gerenciamento de estado (useState, useEffect)
- **Fetch API**: Para comunicação com a API REST

## Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Expo CLI
- API Laravel rodando em `http://localhost:8000`

## Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd softsul-pedidos-mobile

# Instale as dependências
npm install

# Instale as dependências específicas do Expo
npx expo install react-dom react-native-web @expo/metro-runtime

# Execute o aplicativo
npm run web     # Para executar no navegador
npm run android # Para executar no Android (requer Android Studio)
npm run ios     # Para executar no iOS (requer macOS e Xcode)
```

## Configuração da API

O aplicativo está configurado para consumir a API Laravel em `http://localhost:8000/api`. Se você estiver executando a API em outro endereço, altere a constante `API_BASE_URL` no arquivo `App.js`:

```javascript
const API_BASE_URL = 'http://seu-servidor:porta/api';
```

## Estrutura do Código

### Componentes Principais

- **App.js**: Componente principal que contém toda a lógica do aplicativo
- **fetchPedidos()**: Função para buscar pedidos da API
- **savePedido()**: Função para criar/atualizar pedidos
- **deletePedido()**: Função para excluir pedidos
- **renderPedido()**: Componente para renderizar cada item da lista

### Estados do Aplicativo

- **pedidos**: Array com todos os pedidos
- **modalVisible**: Controla a visibilidade do modal de criação/edição
- **editingPedido**: Pedido sendo editado (null para criação)
- **formData**: Dados do formulário

### Estilos

O aplicativo utiliza StyleSheet do React Native para estilização, com:
- Design moderno e limpo
- Cores consistentes com o sistema web
- Status badges coloridos (amarelo para pendente, verde para entregue, vermelho para cancelado)
- Interface responsiva

## API Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar todos os pedidos |
| POST | `/api/pedidos` | Criar novo pedido |
| PUT | `/api/pedidos/{id}` | Atualizar pedido |
| DELETE | `/api/pedidos/{id}` | Excluir pedido |

## Funcionalidades Detalhadas

### Listagem de Pedidos
- Exibe todos os pedidos em cards organizados
- Status colorido para fácil identificação
- Botões de ação (editar/excluir) em cada card
- Mensagem quando não há pedidos

### Criação/Edição de Pedidos
- Modal com formulário completo
- Validação de campos obrigatórios
- Seleção de status com botões visuais
- Campos de data no formato YYYY-MM-DD

### Exclusão de Pedidos
- Confirmação antes da exclusão
- Feedback visual após operações
- Atualização automática da lista

## Tratamento de Erros

- Alerts informativos para o usuário
- Tratamento de erros de rede
- Validação de dados antes do envio
- Mensagens de sucesso/erro apropriadas

## Melhorias Futuras

- [ ] Validação de datas com DatePicker nativo
- [ ] Offline support com AsyncStorage
- [ ] Pull-to-refresh na listagem
- [ ] Busca e filtros
- [ ] Notificações push
- [ ] Testes unitários
- [ ] Animações de transição

## Compatibilidade

- **iOS**: 11.0+
- **Android**: API Level 21+ (Android 5.0+)
- **Web**: Navegadores modernos

## Desenvolvimento

Para desenvolvimento, certifique-se de que:

1. A API Laravel esteja rodando em `http://localhost:8000`
2. O banco de dados esteja configurado e populado
3. As dependências estejam instaladas corretamente

### Comandos Úteis

```bash
# Limpar cache do Expo
npx expo start -c

# Instalar dependências específicas do Expo
npx expo install [package-name]

# Verificar compatibilidade de dependências
npx expo doctor
```

## Autor

Desenvolvido por **Adolfo Bruno Sousa** como parte do desafio técnico da Softsul Sistemas.

## Licença

Este projeto é propriedade de Adolfo Bruno e foi desenvolvido exclusivamente para fins de avaliação técnica.

