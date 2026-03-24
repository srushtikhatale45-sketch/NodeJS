import { create } from 'zustand';
import { todoService } from '../services/api';
import toast from 'react-hot-toast';

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,
  filters: {
    completed: null,
    priority: '',
    search: '',
  },
  
  fetchTodos: async () => {
    set({ loading: true });
    try {
      const { filters } = get();
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== null && v !== '')
      );
      const response = await todoService.getAllTodos(cleanFilters);
      set({ todos: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch todos');
      console.error('Fetch error:', error);
    }
  },
  
  addTodo: async (todoData) => {
    set({ loading: true });
    try {
      const response = await todoService.createTodo(todoData);
      set((state) => ({
        todos: [response.data, ...state.todos],
        loading: false,
      }));
      toast.success('Todo added successfully');
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message || 'Failed to add todo');
      throw error;
    }
  },
  
  updateTodo: async (id, todoData) => {
    set({ loading: true });
    try {
      const response = await todoService.updateTodo(id, todoData);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? response.data : todo
        ),
        loading: false,
      }));
      toast.success('Todo updated successfully');
    } catch (error) {
      set({ loading: false });
      toast.error(error.message || 'Failed to update todo');
      throw error;
    }
  },
  
  deleteTodo: async (id) => {
    set({ loading: true });
    try {
      await todoService.deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        loading: false,
      }));
      toast.success('Todo deleted successfully');
    } catch (error) {
      set({ loading: false });
      toast.error(error.message || 'Failed to delete todo');
      throw error;
    }
  },
  
  toggleTodo: async (id) => {
    try {
      const response = await todoService.toggleTodo(id);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? response.data : todo
        ),
      }));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || 'Failed to toggle todo');
      throw error;
    }
  },
  
  setFilter: (filterType, value) => {
    set((state) => ({
      filters: { ...state.filters, [filterType]: value },
    }));
    get().fetchTodos();
  },
  
  clearFilters: () => {
    set({
      filters: {
        completed: null,
        priority: '',
        search: '',
      },
    });
    get().fetchTodos();
  },
}));

export default useTodoStore;