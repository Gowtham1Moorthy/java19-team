import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import { getUsers, deleteUser } from '../services/api';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Callback to handle data changes from realtime
  const handleUsersChange = useCallback((newUsers: User[]) => {
    setUsers(newUsers);
  }, []);

  // Fetch initial users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Subscribe to Supabase Realtime changes
  useEffect(() => {
    // Subscribe to INSERT, UPDATE, DELETE events on users table
    const channel = supabase
      .channel('realtime-users')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('New user inserted:', payload);
          const newUser = payload.new as User;
          setUsers((prev) => {
            // Avoid duplicates
            if (prev.some((u) => u.id === newUser.id)) return prev;
            return [...prev, newUser];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('User updated:', payload);
          const updatedUser = payload.new as User;
          setUsers((prev) =>
            prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('User deleted:', payload);
          const deletedUser = payload.old as User;
          setUsers((prev) => prev.filter((user) => user.id !== deletedUser.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Users</h1>
              <p className="text-dark-400">Manage system users</p>
            </div>
          </div>
          <Link
            to="/users/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add User
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass rounded-xl p-4 border-red-500/50 bg-red-500/10">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-dark-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="font-medium">#{user.id}</td>
                    <td className="text-white font-medium">{user.name}</td>
                    <td className="text-dark-400">{user.email}</td>
                    <td className="text-dark-400">{user.phone}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'STAFF'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id!)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
