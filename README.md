📋 Lista de Tarefas - React + Redux

Uma aplicação web moderna para gerenciamento de tarefas desenvolvida com React e Redux, seguindo as melhores práticas de desenvolvimento.

🚀 Funcionalidades

- ✅ Adicionar tarefas - Interface intuitiva para criar novas tarefas
- ✏️ Editar tarefas - Edição inline com confirmação
- 🔄 Marcar como concluída/pendente - Toggle visual de status
- 🗑️ Excluir tarefas - Remoção com feedback visual
- 🔍 Filtrar tarefas - Visualizar todas, pendentes ou concluídas
- 📊 Estatísticas em tempo real - Contadores de tarefas

🛠️ Tecnologias Utilizadas

- React 18 - Biblioteca JavaScript para interfaces
- Redux - Gerenciamento de estado global
- Tailwind CSS - Framework CSS utilitário
- Lucide React - Biblioteca de ícones
- JavaScript ES6+ - Sintaxe moderna

🏗️ Arquitetura Redux

Actions
- `ADD_TODO` - Adicionar nova tarefa
- `TOGGLE_TODO` - Alternar status da tarefa
- `DELETE_TODO` - Remover tarefa
- `EDIT_TODO` - Editar texto da tarefa
- `SET_FILTER` - Definir filtro de visualização

Estado Global
```javascript
{
  todos: [
    {
      id: number,
      text: string,
      completed: boolean
    }
  ],
  filter: 'ALL' | 'PENDING' | 'COMPLETED'
}
