import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User as UserIcon, Mail, Shield, Save } from 'lucide-react';
import toast from "react-hot-toast";
import { apiClient } from "../api/axiosConfig";

export function ProfilePage() {
  const { user, updateUser } = useAuth();  // ← Add updateUser
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');  // ← Initialize with user data
  const [email, setEmail] = useState(user?.email || '');  // ← Initialize with user data

  const handleSave = async () => {
    setLoading(true);

    try {
      // Debug: log what we're sending
      console.log('Sending update:', { name, email });

      const response = await apiClient.put('/users/profile', {
        name,
        email
      });

      // Update user in localStorage and context
      const updatedUser = response.data;
      updateUser(updatedUser);  // ← Use updateUser from context instead of reload

      toast.success('Profile updated successfully!');

    } catch (error: any) {
        console.error('Update error:', error.response?.data);
        const message = error.response?.data?.message || 'Failed to update profile';
        toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
              <p className="text-slate-600">Manage your account information</p>
            </div>
          </div>
          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Role
              </label>
              <input
                type="text"
                value={user?.role || 'USER'}
                disabled
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">
                Role cannot be changed
              </p>
            </div>
            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {/* Account Info */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">User ID:</span>
                <span className="font-mono text-slate-900">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Role:</span>
                <span className="font-semibold text-blue-600">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}