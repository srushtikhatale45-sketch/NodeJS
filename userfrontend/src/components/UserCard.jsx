import React from 'react';
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-600 text-sm">ID: {user.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <FiMail className="mr-2" size={16} />
          <span className="text-sm">{user.email}</span>
        </div>
        
        {user.phone && (
          <div className="flex items-center text-gray-600">
            <FiPhone className="mr-2" size={16} />
            <span className="text-sm">{user.phone}</span>
          </div>
        )}
        
        {user.address && (
          <div className="flex items-center text-gray-600">
            <FiMapPin className="mr-2" size={16} />
            <span className="text-sm truncate">{user.address}</span>
          </div>
        )}
      </div>

      {user.age && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Age: {user.age}</span>
        </div>
      )}
    </div>
  );
};

export default UserCard;