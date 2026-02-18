import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Calendar, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/resources', icon: Building2, label: 'Resources' },
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Campus</h1>
              <p className="text-xs text-dark-400">Resource Management</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-dark-300 hover:bg-dark-700/50 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          {user && (
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-dark-400 truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
          <div className="glass rounded-xl p-4">
            <p className="text-xs text-dark-400 text-center">
              Campus Resource Management v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
