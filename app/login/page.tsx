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
      const response = await apiClient.post('/login', { email, password });
      alert('BERHASIL: ' + JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      alert('GAGAL: ' + JSON.stringify(err.response?.data) + ' | Status: ' + err.response?.status);
      setError(err.response?.data?.message || 'Login gagal, coba lagi');
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

        <div
