import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { getUsers, getResources, createBooking } from '../services/api';
import type { User, Resource } from '../types';

const BookingForm = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    userId: '',
    resourceId: '',
    bookingDate: '',
    timeSlot: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, resourcesData] = await Promise.all([
          getUsers(),
          getResources(),
        ]);
        setUsers(usersData);
        setResources(resourcesData.filter(r => r.status === 'AVAILABLE'));
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createBooking({
        userId: parseInt(formData.userId),
        resourceId: parseInt(formData.resourceId),
        bookingDate: formData.bookingDate,
        timeSlot: formData.timeSlot,
      });
      setSuccess('Booking created successfully!');
      setTimeout(() => {
        navigate('/bookings');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/bookings')}
            className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Create Booking</h1>
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
              <label className="block text-dark-400 mb-2">User</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-dark-400 mb-2">Resource</label>
              <select
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select a resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} - {resource.type} (Capacity: {resource.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-dark-400 mb-2">Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
                className="w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-dark-400 mb-2">Time Slot</label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select a time slot</option>
                <option value="09:00 - 10:00">09:00 - 10:00</option>
                <option value="10:00 - 11:00">10:00 - 11:00</option>
                <option value="11:00 - 12:00">11:00 - 12:00</option>
                <option value="13:00 - 14:00">13:00 - 14:00</option>
                <option value="14:00 - 15:00">14:00 - 15:00</option>
                <option value="15:00 - 16:00">15:00 - 16:00</option>
                <option value="16:00 - 17:00">16:00 - 17:00</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/bookings')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
