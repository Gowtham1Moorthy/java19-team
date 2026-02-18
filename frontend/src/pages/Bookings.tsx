import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Check, X } from 'lucide-react';
import { getBookings, updateBookingStatus } from '../services/api';
import { supabase } from '../lib/supabase';
import type { Booking, BookingStatus } from '../types';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Subscribe to Supabase Realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('realtime-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('New booking inserted:', payload);
          const newBooking = payload.new as Booking;
          setBookings((prev) => {
            if (prev.some((b) => b.id === newBooking.id)) return prev;
            return [...prev, newBooking];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('Booking updated:', payload);
          const updatedBooking = payload.new as Booking;
          setBookings((prev) =>
            prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('Booking deleted:', payload);
          const deletedBooking = payload.old as Booking;
          setBookings((prev) => prev.filter((b) => b.id !== deletedBooking.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

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
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bookings</h1>
              <p className="text-dark-400">Manage resource bookings</p>
            </div>
          </div>
          <Link to="/bookings/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Booking
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-4">
          <span className="text-dark-400">Filter by status:</span>
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-dark-400">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{booking.resourceName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : booking.status === 'APPROVED'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-dark-400">User:</span>
                      <p className="text-white">{booking.userName}</p>
                    </div>
                    <div>
                      <span className="text-dark-400">Email:</span>
                      <p className="text-white">{booking.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-dark-400">Date:</span>
                      <p className="text-white">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-dark-400">Time:</span>
                      <p className="text-white">{booking.timeSlot}</p>
                    </div>
                  </div>
                </div>
                
                {booking.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(booking.id!, 'APPROVED')}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id!, 'REJECTED')}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
