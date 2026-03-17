import { create } from 'zustand';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getUsers();
      set({ users: response.data.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch users', 
        isLoading: false 
      });
      toast.error('Failed to fetch users');
    }
  },

  // Fetch single user
  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getUser(id);
      set({ selectedUser: response.data.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch user', 
        isLoading: false 
      });
      toast.error('Failed to fetch user');
    }
  },

  // Create user
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.createUser(userData);
      const newUser = response.data.data;
      set((state) => ({ 
        users: [newUser, ...state.users], 
        isLoading: false 
      }));
      toast.success('User created successfully');
      return newUser;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create user', 
        isLoading: false 
      });
      toast.error(error.message || 'Failed to create user');
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.updateUser(id, userData);
      const updatedUser = response.data.data;
      set((state) => ({
        users: state.users.map((user) => 
          user.id === id ? updatedUser : user
        ),
        selectedUser: updatedUser,
        isLoading: false
      }));
      toast.success('User updated successfully');
      return updatedUser;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update user', 
        isLoading: false 
      });
      toast.error(error.message || 'Failed to update user');
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userAPI.deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        isLoading: false
      }));
      toast.success('User deleted successfully');
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete user', 
        isLoading: false 
      });
      toast.error(error.message || 'Failed to delete user');
      throw error;
    }
  },

  // Clear selected user
  clearSelectedUser: () => {
    set({ selectedUser: null });
  }
}));

export default useUserStore;