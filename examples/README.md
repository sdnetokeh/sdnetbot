# Contoh Implementasi WhatsApp Bot dengan Fonnte

Direktori ini berisi contoh implementasi WhatsApp bot menggunakan Fonnte API dan webhook. Contoh ini dapat digunakan sebagai referensi atau titik awal untuk pengembangan bot WhatsApp Anda sendiri.

## Struktur File

- `fonnte-webhook-handler.js` - Implementasi server webhook untuk menerima pesan dari Fonnte
- `fonnte-api-sender.js` - Implementasi fungsi untuk mengirim berbagai jenis pesan dengan Fonnte API
- `package.json` - File konfigurasi npm dengan dependensi yang diperlukan

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- Akun Fonnte dengan perangkat WhatsApp yang terhubung
- Token API Fonnte

## Instalasi

1. Instal dependensi:

```bash
npm install
```

2. Konfigurasi token API:
   - Buka file `fonnte-webhook-handler.js` dan `fonnte-api-sender.js`
   - Ganti `YOUR_FONNTE_TOKEN` dengan token API Fonnte Anda

## Penggunaan

### Menjalankan Server Webhook

Server webhook digunakan untuk menerima pesan dari Fonnte:

```bash
npm start
```

Server akan berjalan di port 3000 (atau port yang ditentukan dalam variabel lingkungan `PORT`).

### Menggunakan API Sender

Untuk menguji fungsi pengiriman pesan:

1. Buka file `fonnte-api-sender.js`
2. Uncomment fungsi `examples()` di bagian bawah file
3. Sesuaikan nomor tujuan dan contoh lainnya sesuai kebutuhan
4. Jalankan dengan perintah:

```bash
npm test
```

## Fitur yang Tersedia

### Webhook Handler (`fonnte-webhook-handler.js`)

- Menerima pesan teks dan media dari Fonnte
- Memproses pesan berdasarkan konten
- Mencari jawaban di database FAQ
- Mengirim respons otomatis
- Menyimpan riwayat percakapan
- Menangani pesan grup

### API Sender (`fonnte-api-sender.js`)

- Mengirim pesan teks sederhana
- Mengirim gambar dari URL
- Mengirim file dari local path
- Mengirim pesan dengan template
- Mengirim pesan ke grup WhatsApp
- Mengirim pesan dengan tombol
- Mengirim pesan dengan list
- Validasi nomor WhatsApp

## Mengintegrasikan dengan n8n

Untuk mengintegrasikan contoh ini dengan n8n:

1. Gunakan node "Execute Command" di n8n untuk menjalankan server webhook
2. Atau gunakan node "HTTP Request" untuk memanggil API Fonnte langsung dari workflow n8n

Lihat dokumentasi lengkap di `../docs/fonnte-integration-guide.md` untuk panduan integrasi dengan n8n.

## Pemecahan Masalah

### Webhook Tidak Menerima Pesan

- Pastikan URL webhook dapat diakses dari internet (gunakan tunneling seperti ngrok jika di localhost)
- Verifikasi bahwa URL webhook sudah dikonfigurasi dengan benar di dashboard Fonnte
- Periksa log server untuk kesalahan

### Pesan Tidak Terkirim

- Periksa apakah token API valid
- Pastikan format nomor tujuan benar (awalan 62 untuk Indonesia)
- Periksa respons API untuk detail kesalahan

## Referensi

- [Dokumentasi Fonnte](https://docs.fonnte.com/)
- [API Fonnte](https://docs.fonnte.com/api/sending-api-messages.html)
- [Webhook Fonnte](https://docs.fonnte.com/webhook/webhook-url.html) 