# Bot WhatsApp Customer Service dengan n8n

Proyek ini adalah implementasi bot WhatsApp untuk customer service menggunakan n8n sebagai platform otomatisasi workflow dan WhatsApp gateway untuk konektivitas.

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- n8n terinstal
- Akun WhatsApp Business API atau gateway WhatsApp
- Akses ke internet

## Instalasi

1. Clone repositori ini
2. Instal n8n jika belum terinstal:
   ```
   npm install n8n -g
   ```
3. Siapkan kredensial WhatsApp gateway di n8n
4. Import workflow n8n dari file `workflows/customer-service-bot.json`

## Struktur Proyek

- `workflows/` - Berisi file workflow n8n
- `templates/` - Template pesan respons
- `config/` - File konfigurasi
- `docs/` - Dokumentasi tambahan

## Penggunaan

1. Jalankan n8n dengan perintah:
   ```
   n8n start
   ```
2. Akses dashboard n8n di `http://localhost:5678`
3. Aktifkan workflow customer service bot
4. Konfigurasikan webhook WhatsApp gateway untuk mengarah ke endpoint n8n

## Fitur Bot

- Menyapa pelanggan baru
- Menjawab pertanyaan umum
- Menangani permintaan dukungan
- Eskalasi ke agen manusia jika diperlukan
- Menyimpan riwayat percakapan

## Konfigurasi

Konfigurasi bot dapat diubah melalui file `config/bot-config.json` atau langsung melalui antarmuka n8n. 