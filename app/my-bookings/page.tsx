'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, ArrowLeft, Calendar, Clock } from 'lucide-react';
import apiClient from '@/lib/axios';

interface Booking {
  id: number;
  booking_date: string;
  time_slot: string;
  status: string;
  complaint: string;
  doctor: {
    user: { name: string };
    specialization: { name: string };
  };
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Gagal memuat riwayat booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Yakin ingin membatalkan booking ini?')) return;
    setCancellingId(bookingId);
    try {
      await apiClient.patch(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membatalkan booking');
    } finally {
      setCancellingId(null);
    }
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/20',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusLabel: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
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

      <main className="p-6 max-w-2xl mx-auto">
        <h2 className="font-display text-xl font-semibold text-[#134E4A] tracking-tight mb-5">Riwayat Booking Saya</h2>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 px-3 py-2.5 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {loading ? (
          <p className="text-sm text-[#134E4A]/60">Memuat...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-[#0F766E]/10 rounded-xl p-8 text-center">
            <p className="text-sm text-[#134E4A]/60 mb-4">Kamu belum punya booking.</p>
            
              <a href="/doctors"
              className="inline-block bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d5f58] transition"
            >
              Cari Dokter
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-[#0F766E]/10 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-display font-semibold text-[#134E4A] tracking-tight">{booking.doctor.user.name}</h3>
                    <p className="text-sm text-[#FB923C]">{booking.doctor.specialization.name}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColor[booking.status]}`}>
                    {statusLabel[booking.status]}
                  </span>
                </div>

                <p className="text-sm text-[#134E4A]/60 mb-1 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar size={13} />{booking.booking_date}</span>
                  <span className="flex items-center gap-1"><Clock size={13} />{booking.time_slot}</span>
                </p>
                {booking.complaint && (
                  <p className="text-sm text-[#134E4A]/60 mb-3">Keluhan: {booking.complaint}</p>
                )}

                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancellingId === booking.id ? 'Membatalkan...' : 'Batalkan Booking'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}