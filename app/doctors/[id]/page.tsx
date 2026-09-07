'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Stethoscope, ArrowLeft, Clock } from 'lucide-react';
import apiClient from '@/lib/axios';

interface Doctor {
  id: number;
  bio: string;
  experience_years: number;
  consultation_fee: number;
  user: { name: string };
  specialization: { name: string };
}

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setAvailableSlots([]);
    if (!date) return;
    setLoadingSlots(true);
    try {
      const response = await apiClient.get(`/doctors/${doctorId}/available-slots?date=${date}`);
      setAvailableSlots(response.data.available_slots || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

 const handleBooking = async () => {
  setError('');
  setMessage('');
  if (!selectedDate || !selectedSlot) {
    setError('Pilih tanggal dan jam terlebih dahulu');
    return;
  }
  setSubmitting(true);
  try {
    const bookingResponse = await apiClient.post('/bookings', {
      doctor_id: doctorId,
      booking_date: selectedDate,
      time_slot: selectedSlot,
      complaint: complaint,
    });

    const newBookingId = bookingResponse.data.booking.id;

    // Setelah booking dibuat, minta Snap Token untuk pembayaran
    const paymentResponse = await apiClient.post(`/bookings/${newBookingId}/pay`);
    const snapToken = paymentResponse.data.snap_token;

    // @ts-ignore - window.snap dari script Midtrans
    window.snap.pay(snapToken, {
      onSuccess: function () {
        setMessage('Pembayaran berhasil! Booking kamu sudah dikonfirmasi.');
        setSelectedSlot('');
        setComplaint('');
        handleDateChange(selectedDate);
      },
      onPending: function () {
        setMessage('Pembayaran sedang diproses. Silakan cek riwayat booking untuk update status.');
        setSelectedSlot('');
        setComplaint('');
      },
      onError: function () {
        setError('Pembayaran gagal. Silakan coba lagi.');
      },
      onClose: function () {
        setError('Kamu menutup popup pembayaran sebelum selesai. Booking tetap tersimpan dengan status menunggu pembayaran.');
      },
    });
  } catch (err: any) {
    setError(err.response?.data?.message || 'Booking gagal, coba lagi');
  } finally {
    setSubmitting(false);
  }
};

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <p className="text-sm text-[#134E4A]/60">Memuat...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#F0FDFA]">
      <nav className="bg-white border-b border-[#0F766E]/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#0F766E] text-white flex items-center justify-center">
            <Stethoscope size={16} />
          </div>
          <span className="font-semibold text-[#134E4A]">Klinik Nirmala Cendekia</span>
        </div>
        <a href="/doctors" className="flex items-center gap-1.5 text-sm text-[#134E4A]/60 hover:text-[#0F766E] transition">
          <ArrowLeft size={15} />
          Daftar Dokter
        </a>
      </nav>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-white border border-[#0F766E]/10 rounded-xl p-6 mb-5">
          <h2 className="font-display text-xl font-semibold text-[#134E4A] tracking-tight">{doctor.user.name}</h2>
          <p className="text-[#FB923C] font-medium mb-2">{doctor.specialization.name}</p>
          <p className="text-sm text-[#134E4A]/60 mb-4">{doctor.bio}</p>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-[#134E4A]/50">
              <Clock size={13} />
              {doctor.experience_years} tahun pengalaman
            </span>
            <span className="font-semibold text-[#134E4A]">
              Rp {doctor.consultation_fee.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#0F766E]/10 rounded-xl p-6">
          <h3 className="font-display font-semibold text-[#134E4A] tracking-tight mb-4">Booking Kunjungan</h3>

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Pilih Tanggal</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
            />
          </div>

          {selectedDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#134E4A] mb-2">Pilih Jam</label>
              {loadingSlots ? (
                <p className="text-sm text-[#134E4A]/50">Memuat slot...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-[#134E4A]/50">Tidak ada slot kosong di tanggal ini</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                        selectedSlot === slot
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : 'bg-white text-[#134E4A] border-gray-200 hover:border-[#0F766E]/40'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#134E4A] mb-1.5">Keluhan (opsional)</label>
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E]"
              rows={3}
              placeholder="Ceritakan keluhan kamu..."
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={submitting || !selectedSlot}
            className="w-full bg-[#FB923C] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#f5810f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Memproses...' : 'Booking Sekarang'}
          </button>
        </div>
      </main>
    </div>
  );
}