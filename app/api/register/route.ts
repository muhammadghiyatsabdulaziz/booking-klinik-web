// app/api/register/route.js
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
// Jika Anda melakukan hashing password, import library-nya di sini (misal: bcryptjs)

export async function POST(request) {
  try {
    // 1. Ambil data yang dikirim dari form frontend
    const { username, email, password } = await request.json();

    // 2. Koneksikan ke database Neon menggunakan Env Variable Vercel
    const sql = neon(process.env.DATABASE_URL);

    // 3. Jalankan query database (Contoh: Insert data user baru)
    // Sesuaikan nama kolom dan tabel dengan database klinik Anda
    await sql`
      INSERT INTO users (username, email, password) 
      VALUES (${username}, ${email}, ${password})
    `;

    // 4. Kirim respon sukses ke frontend
    return NextResponse.json({ message: 'Registrasi berhasil!' }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal melakukan registrasi' }, { status: 500 });
  }
}
