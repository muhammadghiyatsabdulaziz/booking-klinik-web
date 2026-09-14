// app/api/register/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, password_confirmation, phone, role } = body;

    if (!name || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: 'Semua kolom wajib diisi' },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { message: 'Konfirmasi password tidak cocok' },
        { status: 400 }
      );
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL belum diatur');
    }

    const sql = neon(databaseUrl);

    // Cek email terdaftar
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Jalankan query insert
    await sql`
      INSERT INTO users (name, email, password, phone, role) 
      VALUES (${name}, ${email}, ${password}, ${phone}, ${role})
    `;

    // Buat data dummy user untuk dikembalikan ke frontend tanpa membaca object dynamic
    const dummyUser = {
      name: name,
      email: email,
      role: role || 'patient'
    };

    const dummyToken = 'dummy-jwt-token-serverless'; 

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil!',
        user: dummyUser,
        token: dummyToken
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error register:', errorMessage);
    
    return NextResponse.json(
      { message: 'Gagal melakukan registrasi server', details: errorMessage },
      { status: 500 }
    );
  }
}
