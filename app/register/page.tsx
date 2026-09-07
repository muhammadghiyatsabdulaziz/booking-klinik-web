'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', phone: '', role: 'patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/register', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(', ') : err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#0F766E] text-white mb-4">
            <Stethoscope size={20} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#134E4A] tracking-tight">Buat akun baru</h1>
          <p className="text-sm text-[#134E4A]/60 mt-1">Mulai cari dan booking dokter pilihanmu</p>
        </div>

        <div className="bg-white border border-[#0F766E]/10 rounded-xl p-7 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 px-3 py-2.5 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Nama Lengkap</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">No. Telepon</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Konfirmasi Password</label>
              <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#0F766E] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#0d5f58] transition disabled:opacity-50">
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm text-[#134E4A]/60 mt-5">
            Sudah punya akun?{' '}
            <a href="/login" className="text-[#FB923C] font-medium hover:underline">Masuk di sini</a>
          </p>
        </div>
      </div>
    </div>
  );
}