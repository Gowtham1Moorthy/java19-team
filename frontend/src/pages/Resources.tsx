import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { getResources, deleteResource } from '../services/api';
import { supabase } from '../lib/supabase';
import type { Resource } from '../types';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
      } catch (err) {
        setError('Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Subscribe to Supabase Realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('realtime-resources')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'resources',
        },
        (payload) => {
          console.log('New resource inserted:', payload);
          const newResource = payload.new as Resource;
          setResources((prev) => {
            if (prev.some((r) => r.id === newResource.id)) return prev;
            return [...prev, newResource];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resources',
        },
        (payload) => {
          console.log('Resource updated:', payload);
          const updatedResource = payload.new as Resource;
          setResources((prev) =>
            prev.map((r) => (r.id === updatedResource.id ? updatedResource : r))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'resources',
        },
        (payload) => {
          console.log('Resource deleted:', payload);
          const deletedResource = payload.old as Resource;
          setResources((prev) => prev.filter((r) => r.id !== deletedResource.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        setResources(resources.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete resource');
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
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Resources</h1>
              <p className="text-dark-400">Manage campus resources</p>
            </div>
          </div>
          <Link to="/resources/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Resource
          </Link>
        </div>
      </div>

      {error && (
        <div className="glass rounded-xl p-4 border-red-500/50 bg-red-500/10">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length === 0 ? (
          <div className="col-span-full glass rounded-2xl p-8 text-center">
            <p className="text-dark-400">No resources found</p>
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{resource.name}</h3>
                  <span className="text-dark-400 text-sm">{resource.type}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  resource.status === 'AVAILABLE'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {resource.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Capacity</span>
                  <span className="text-white">{resource.capacity} people</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/resources/${resource.id}/edit`}
                  className="flex-1 p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(resource.id!)}
                  className="flex-1 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;
