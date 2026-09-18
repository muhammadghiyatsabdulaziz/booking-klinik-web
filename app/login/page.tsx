'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
     const response = await apiClient.post('/login/', { email, password });

      
      if (response.data.token) {
        // Simpan token string dan data user ke storage lokal browser
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Alihkan dengan aman ke rute dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal, periksa email dan password kamu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#0F766E] text-white mb-4">
            <Stethoscope size={20} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#134E4A] tracking-tight">Selamat datang kembali</h1>
          <p className="text-sm text-[#134E4A]/60 mt-1">Masuk untuk kelola booking kunjungan kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#0F766E]/10 rounded-xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-xs text-red-600 font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#134E4A] mb-1.5">Alamat Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0F766E] transition text-[#134E4A]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#134E4A] mb-1.5">Kata Sandi</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0F766E] transition text-[#134E4A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F766E] hover:bg-[#0d5f58] text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk Akun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
