import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { getResourceById, createResource, updateResource } from '../services/api';
import type { Resource, ResourceType, ResourceStatus } from '../types';

const ResourceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'CLASSROOM' as ResourceType,
    capacity: 30,
    status: 'AVAILABLE' as ResourceStatus,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchResource = async () => {
        try {
          const resource = await getResourceById(parseInt(id));
          setFormData({
            name: resource.name,
            type: resource.type,
            capacity: resource.capacity,
            status: resource.status,
          });
        } catch (err) {
          setError('Failed to fetch resource');
        }
      };
      fetchResource();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditMode && id) {
        await updateResource(parseInt(id), formData);
        setSuccess('Resource updated successfully!');
      } else {
        await createResource(formData);
        setSuccess('Resource created successfully!');
      }
      setTimeout(() => {
        navigate('/resources');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save resource');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/resources')}
            className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? 'Edit Resource' : 'Create Resource'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/50 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-dark-400 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="Enter resource name"
              />
            </div>
            <div>
              <label className="block text-dark-400 mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full"
              >
                <option value="LAB">Lab</option>
                <option value="CLASSROOM">Classroom</option>
                <option value="EVENT_HALL">Event Hall</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-400 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full"
                placeholder="Enter capacity"
              />
            </div>
            <div>
              <label className="block text-dark-400 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full"
              >
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/resources')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
