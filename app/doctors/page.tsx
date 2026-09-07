'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Clock, Search, ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/axios';

interface Doctor {
  id: number;
  bio: string;
  experience_years: number;
  consultation_fee: number;
  user: { name: string };
  specialization: { id: number; name: string };
}

interface Specialization {
  id: number;
  name: string;
}

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = async (specId?: string) => {
    setLoading(true);
    try {
      const url = specId ? `/doctors?specialization_id=${specId}` : '/doctors';
      const response = await apiClient.get(url);
      setDoctors(response.data);
      if (!specId) {
        const uniqueSpecs = Array.from(
          new Map(response.data.map((d: Doctor) => [d.specialization.id, d.specialization])).values()
        ) as Specialization[];
        setSpecializations(uniqueSpecs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (specId: string) => {
    setSelectedSpec(specId);
    fetchDoctors(specId || undefined);
  };

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

      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="font-display text-xl font-semibold text-[#134E4A] tracking-tight mb-1">Cari Dokter</h2>
        <p className="text-sm text-[#134E4A]/60 mb-5">Pilih spesialisasi dan temukan dokter yang tepat</p>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#134E4A]/40" />
            <input
              type="text"
              placeholder="Cari nama dokter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-lg pl-9 pr-3.5 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
            />
          </div>
          <select
            value={selectedSpec}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm w-full sm:max-w-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
          >
            <option value="">Semua Spesialisasi</option>
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.id}>{spec.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-[#134E4A]/60">Memuat data dokter...</p>
        ) : doctors.length === 0 ? (
          <p className="text-sm text-[#134E4A]/60">Tidak ada dokter ditemukan.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {doctors
              .filter((doctor) => doctor.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((doctor) => (
              <div key={doctor.id} className="bg-white border border-[#0F766E]/10 rounded-xl p-5 hover:border-[#0F766E]/30 transition">
                <h3 className="font-display font-semibold text-[#134E4A] tracking-tight">{doctor.user.name}</h3>
                <p className="text-sm text-[#FB923C] font-medium mb-2">{doctor.specialization.name}</p>
                <p className="text-sm text-[#134E4A]/60 mb-4 line-clamp-2">{doctor.bio}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="flex items-center gap-1 text-[#134E4A]/50">
                    <Clock size={13} />
                    {doctor.experience_years} tahun pengalaman
                  </span>
                  <span className="font-semibold text-[#134E4A]">
                    Rp {doctor.consultation_fee.toLocaleString('id-ID')}
                  </span>
                </div>
                
                  <a href={`/doctors/${doctor.id}`}
                  className="block text-center bg-[#0F766E] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d5f58] transition"
                >
                  Lihat & Booking
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}