'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Search, Calendar, User, LogOut } from 'lucide-react';
import apiClient from '@/lib/axios';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const token = localStorage.getItem('token');

      // 1. Cek awal di browser, jika kosong langsung usir
      if (!token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      try {
        // 2. Tembak rute /me untuk memverifikasi token aktif di database online
        const response = await apiClient.get('/me');
        
        // Simpan data user segar terbaru dari database
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setLoading(false);
      } catch (err) {
        // 3. Jika token di DB hangus/401 Unauthorized, hapus data lokal dan usir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Hancurkan token aktif di database Laravel Wasmer
      await apiClient.post('/logout');
    } catch (err) {
      console.error("Gagal menghapus token di server, lanjut bersihkan lokal", err);
    } finally {
      // Apapun status respon backend, pastikan lokal dibersihkan total
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <p className="text-[#134E4A]/60 text-sm animate-pulse">Memuat dashboard klinik...</p>
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#134E4A]/70 hidden sm:inline transition">
            {user.name} ({user.role})
          </span>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-1.5 text-sm text-[#134E4A]/60 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-white border border-[#0F766E]/10 rounded-xl p-7 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-[#134E4A] tracking-tight mb-1">Halo, {user.name} 👋</h2>
          <p className="text-sm text-[#134E4A]/60 mb-6">
            Cari dokter dan booking kunjungan, atau cek riwayat booking kamu.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="/doctors" className="inline-flex items-center gap-2 bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d5f58] transition">
              <Search size={16} />
              Cari Dokter
            </a>
            <a href="/my-bookings" className="inline-flex items-center gap-2 bg-white border border-[#0F766E]/20 text-[#134E4A] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#F0FDFA] transition">
              <Calendar size={16} />
              Riwayat Booking
            </a>
            <a href="/profile" className="inline-flex items-center gap-2 bg-white border border-[#0F766E]/20 text-[#134E4A] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#F0FDFA] transition">
              <User size={16} />
              Profil Saya
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
