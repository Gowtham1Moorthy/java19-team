import { useEffect, useState } from 'react';
import { Users, Building2, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      label: 'Total Resources',
      value: stats?.totalResources || 0,
      icon: Building2,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/20 to-red-500/20',
    },
    {
      label: 'Pending',
      value: stats?.pendingBookings || 0,
      icon: Clock,
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-500/20 to-amber-500/20',
    },
    {
      label: 'Approved',
      value: stats?.approvedBookings || 0,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'Rejected',
      value: stats?.rejectedBookings || 0,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-500/20 to-rose-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Welcome to Campus</span>
        </h1>
        <p className="text-dark-400 text-lg">Resource Management System Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className={`glass rounded-2xl p-6 card-hover animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.gradient} text-white rounded-lg p-1`} />
              </div>
              <span className="text-4xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-dark-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/users/new"
              className="block p-4 rounded-xl bg-dark-800/50 hover:bg-primary-500/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary-400 group-hover:text-white" />
                <span className="text-dark-300 group-hover:text-white">Add New User</span>
              </div>
            </a>
            <a
              href="/resources/new"
              className="block p-4 rounded-xl bg-dark-800/50 hover:bg-purple-500/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-purple-400 group-hover:text-white" />
                <span className="text-dark-300 group-hover:text-white">Add New Resource</span>
              </div>
            </a>
            <a
              href="/bookings/new"
              className="block p-4 rounded-xl bg-dark-800/50 hover:bg-orange-500/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-400 group-hover:text-white" />
                <span className="text-dark-300 group-hover:text-white">Create New Booking</span>
              </div>
            </a>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-dark-400">Backend API</span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-dark-400">Database</span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-dark-400">Version</span>
              <span className="text-dark-400">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
