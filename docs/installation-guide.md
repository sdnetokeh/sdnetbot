# Panduan Instalasi dan Penggunaan Bot WhatsApp Customer Service

Dokumen ini memberikan panduan langkah demi langkah untuk menginstal dan menggunakan bot WhatsApp customer service dengan n8n dan WhatsApp gateway.

## Prasyarat

Sebelum memulai, pastikan Anda telah memiliki:

1. Node.js versi 14 atau lebih baru
2. npm (Node Package Manager)
3. Akun WhatsApp Business API atau gateway WhatsApp
4. Server yang dapat diakses dari internet (untuk webhook)

## Instalasi n8n

### Instalasi Lokal

1. Buka terminal atau command prompt
2. Instal n8n secara global menggunakan npm:

```bash
npm install n8n -g
```

3. Jalankan n8n:

```bash
n8n start
```

4. Akses dashboard n8n di `http://localhost:5678`

### Instalasi dengan Docker

Jika Anda lebih suka menggunakan Docker:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

## Menyiapkan WhatsApp Gateway

### Opsi 1: Twilio WhatsApp Sandbox

1. Buat akun di [Twilio](https://www.twilio.com/)
2. Navigasi ke Console > Messaging > Try it > WhatsApp
3. Ikuti petunjuk untuk mengaktifkan WhatsApp Sandbox
4. Catat SID Akun dan Token Autentikasi Anda

### Opsi 2: WhatsApp Business API

1. Daftar untuk WhatsApp Business API melalui penyedia solusi bisnis (BSP)
2. Ikuti proses verifikasi bisnis
3. Dapatkan kredensial API dari BSP Anda

### Opsi 3: Gateway Lokal (Fonnte, WAblas, dll)

1. Daftar akun di gateway lokal pilihan Anda
2. Ikuti panduan untuk mendapatkan API key
3. Pastikan gateway mendukung webhook untuk menerima pesan

## Konfigurasi Bot

1. Clone repositori ini ke server Anda:

```bash
git clone https://github.com/username/whatsapp-bot.git
cd whatsapp-bot
```

2. Edit file konfigurasi di `config/bot-config.json`:
   - Ubah nomor telepon WhatsApp
   - Sesuaikan URL webhook
   - Atur endpoint API WhatsApp gateway

3. Sesuaikan template respons di `templates/responses.json` sesuai kebutuhan bisnis Anda

4. Perbarui database FAQ di `config/faq-database.json` dengan pertanyaan dan jawaban yang relevan untuk bisnis Anda

## Mengimpor Workflow n8n

1. Buka dashboard n8n di `http://localhost:5678` (atau URL server Anda)
2. Klik pada tab "Workflows" di sidebar
3. Klik tombol "Import from File"
4. Pilih file `workflows/customer-service-bot.json` dari repositori ini
5. Klik "Import"

## Konfigurasi Kredensial di n8n

1. Di dashboard n8n, klik pada "Credentials" di sidebar
2. Klik "Add Credential"
3. Pilih jenis kredensial sesuai gateway WhatsApp Anda:
   - Untuk Twilio: Pilih "Twilio API"
   - Untuk gateway lain: Pilih "HTTP Header Auth"
4. Masukkan kredensial yang diperlukan
5. Simpan kredensial

## Mengaktifkan Webhook

1. Buka workflow yang telah diimpor
2. Klik pada node "Webhook: Receive Message"
3. Klik "Execute Node" untuk mengaktifkan webhook
4. Salin URL webhook yang dihasilkan

## Konfigurasi Webhook di WhatsApp Gateway

### Untuk Twilio:

1. Kembali ke Twilio Console
2. Navigasi ke Phone Numbers > Manage > Active Numbers
3. Pilih nomor WhatsApp Anda
4. Di bagian "Messaging", atur Webhook URL ke URL n8n yang disalin sebelumnya
5. Metode: POST
6. Simpan perubahan

### Untuk Gateway Lain:

Ikuti dokumentasi gateway Anda untuk mengatur webhook dengan URL yang disalin dari n8n.

## Mengaktifkan Workflow

1. Kembali ke dashboard n8n
2. Buka workflow customer service bot
3. Klik tombol "Active" di pojok kanan atas untuk mengaktifkan workflow
4. Workflow sekarang aktif dan siap menerima pesan

## Pengujian Bot

1. Kirim pesan WhatsApp ke nomor yang terdaftar di gateway Anda
2. Bot akan merespons sesuai dengan konfigurasi yang telah dibuat
3. Periksa log eksekusi di n8n untuk memastikan semua berfungsi dengan baik

## Pemecahan Masalah

### Webhook Tidak Menerima Pesan

- Pastikan URL webhook dapat diakses dari internet
- Periksa apakah gateway WhatsApp dikonfigurasi dengan benar
- Periksa log n8n untuk kesalahan

### Format Pesan Tidak Dikenali

- Periksa node "Extract Message Data" untuk memastikan format pesan dari gateway Anda ditangani dengan benar
- Tambahkan kondisi untuk format gateway Anda jika belum ada

### Respons Tidak Sesuai

- Periksa file `templates/responses.json` dan `config/faq-database.json`
- Pastikan kata kunci dan pertanyaan yang digunakan cocok dengan yang diharapkan

## Kustomisasi Lanjutan

### Menambahkan NLP (Natural Language Processing)

Untuk pemahaman pesan yang lebih baik, Anda dapat mengintegrasikan layanan NLP seperti:

1. Dialogflow
2. Wit.ai
3. IBM Watson

Tambahkan node HTTP Request di n8n untuk mengirim pesan ke layanan NLP dan memproses hasilnya.

### Integrasi Database

Untuk menyimpan percakapan dan data pelanggan, tambahkan node database di n8n:

1. PostgreSQL
2. MongoDB
3. MySQL

### Menambahkan Fitur Multimedia

Untuk mengirim gambar, dokumen, atau tombol:

1. Modifikasi node "Send WhatsApp Response"
2. Sesuaikan parameter body sesuai dengan dokumentasi gateway Anda

## Pemeliharaan

- Perbarui database FAQ secara berkala
- Pantau log percakapan untuk mengidentifikasi pertanyaan yang sering diajukan tetapi belum ada jawabannya
- Perbarui template respons sesuai kebutuhan

## Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan:

1. Buka issue di repositori GitHub
2. Hubungi tim dukungan kami di support@example.com 