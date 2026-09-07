'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/me');
      setForm({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
      });
    } catch (err) {
      setError('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const response = await apiClient.put('/me', {
        name: form.name,
        phone: form.phone,
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage('Profil berhasil diperbarui');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <p className="text-sm text-[#134E4A]/60">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDFA]">
      <nav className="bg-white border-b border-[#0F766E]/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#0F766E] text-white flex items-center justify-center">
            <Stethoscope size={16} />
          </div>
          <span className="font-semibold text-[#134E4A]">Klinik Nirmala Cendekia</span>
        </div>
        <a href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#134E4A]/60 hover:text-[#0F766E] transition">
          <ArrowLeft size={15} />
          Dashboard
        </a>
      </nav>

      <main className="p-6 max-w-md mx-auto">
        <h2 className="font-display text-xl font-semibold text-[#134E4A] tracking-tight mb-5">Profil Saya</h2>

        <div className="bg-white border border-[#0F766E]/10 rounded-xl p-6">
          {message && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2.5 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 px-3 py-2.5 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Nama Lengkap</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Email</label>
              <input
                value={form.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-[#134E4A]/40 mt-1">Email tidak dapat diubah</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">No. Telepon</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0F766E] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d5f58] transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}