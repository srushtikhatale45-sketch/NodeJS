import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import useUserStore from '../store/userStore';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';

const HomePage = () => {
  const { users, isLoading, fetchUsers, deleteUser } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus size={20} />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </main>

      {/* Modal */}
      {showForm && (
        <UserForm
          user={selectedUser}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default HomePage;