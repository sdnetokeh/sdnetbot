# Integrasi WhatsApp Gateway dengan n8n

Dokumen ini menjelaskan cara mengintegrasikan WhatsApp Business API atau gateway WhatsApp dengan n8n untuk membuat bot customer service otomatis.

## Opsi WhatsApp Gateway

Ada beberapa opsi WhatsApp gateway yang dapat digunakan:

1. **WhatsApp Business API (WABA)** - Solusi resmi dari WhatsApp
2. **Twilio** - Penyedia layanan komunikasi cloud
3. **360dialog** - Partner resmi WhatsApp Business
4. **MessageBird** - Platform komunikasi omnichannel
5. **Gupshup** - Platform messaging untuk bisnis
6. **WA Gateway lokal** - Solusi lokal seperti Fonnte, WAblas, dll.

Dalam dokumentasi ini, kita akan menggunakan Twilio sebagai contoh, tetapi langkah-langkah serupa berlaku untuk gateway lainnya.

## Prasyarat

- Akun n8n yang sudah terinstal dan berjalan
- Akun Twilio dengan WhatsApp Sandbox atau WhatsApp Business API
- Nomor WhatsApp yang sudah disetujui untuk penggunaan bisnis (jika menggunakan WABA)

## Langkah-langkah Integrasi

### 1. Menyiapkan Twilio WhatsApp Sandbox

1. Buat akun di [Twilio](https://www.twilio.com/)
2. Navigasi ke Console > Messaging > Try it > WhatsApp
3. Ikuti petunjuk untuk mengaktifkan WhatsApp Sandbox
4. Catat SID Akun dan Token Autentikasi Anda

### 2. Konfigurasi Kredensial di n8n

1. Buka dashboard n8n (biasanya di `http://localhost:5678`)
2. Klik pada "Credentials" di sidebar
3. Klik "Add Credential"
4. Pilih "Twilio API"
5. Masukkan SID Akun dan Token Autentikasi dari Twilio
6. Simpan kredensial

### 3. Membuat Webhook untuk Menerima Pesan

1. Di n8n, buat workflow baru
2. Tambahkan node "Webhook"
3. Konfigurasi webhook:
   - Method: POST
   - Path: /whatsapp/webhook
   - Authenticate: None (atau sesuai kebutuhan keamanan)
   - Response Mode: Last Node
4. Klik "Execute Node" untuk mengaktifkan webhook
5. Salin URL webhook yang dihasilkan

### 4. Konfigurasi Webhook di Twilio

1. Kembali ke Twilio Console
2. Navigasi ke Phone Numbers > Manage > Active Numbers
3. Pilih nomor WhatsApp Anda
4. Di bagian "Messaging", atur Webhook URL ke URL n8n yang disalin sebelumnya
5. Metode: POST
6. Simpan perubahan

### 5. Membuat Workflow Pemrosesan Pesan

Di n8n, lanjutkan workflow yang sudah dibuat:

1. Tambahkan node "Function" setelah Webhook untuk memproses pesan masuk:

```javascript
// Ekstrak data pesan dari Twilio
const body = $input.body;
const incomingMessage = body.Body;
const sender = body.From.replace('whatsapp:', '');

// Kembalikan data yang diproses
return {
  json: {
    message: incomingMessage,
    sender: sender,
    timestamp: new Date().toISOString()
  }
}
```

2. Tambahkan node "Switch" untuk menentukan jenis respons berdasarkan pesan:

```
Kondisi 1: {{$node["Function"].json["message"].toLowerCase().includes("halo")}}
Kondisi 2: {{$node["Function"].json["message"].toLowerCase().includes("produk")}}
Kondisi 3: {{$node["Function"].json["message"].toLowerCase().includes("harga")}}
Kondisi Default: true
```

3. Untuk setiap kondisi, tambahkan node "Set" untuk menyiapkan respons yang sesuai

4. Tambahkan node "Twilio" untuk mengirim respons:
   - Pilih kredensial Twilio yang sudah dibuat
   - Operation: Send Message
   - From: `whatsapp:+14155238886` (nomor Twilio Anda)
   - To: `{{$node["Function"].json["sender"]}}`
   - Message: `{{$node["Set"].json["response"]}}`

5. Aktifkan workflow

## Menggunakan WhatsApp Business API (WABA)

Jika Anda menggunakan WABA resmi, langkah-langkahnya sedikit berbeda:

1. Daftar dan dapatkan persetujuan untuk WhatsApp Business API
2. Pilih penyedia solusi bisnis (BSP) seperti 360dialog, MessageBird, dll.
3. Ikuti panduan BSP untuk menyiapkan API
4. Gunakan node "HTTP Request" di n8n untuk berkomunikasi dengan API WhatsApp

## Menangani Template Pesan

WhatsApp Business memerlukan template pesan yang disetujui untuk pesan proaktif:

1. Buat template pesan di dashboard WhatsApp Business
2. Tunggu persetujuan
3. Gunakan template yang disetujui dalam node Twilio atau HTTP Request:

```
Contoh format template: "Halo {{1}}, terima kasih telah menghubungi kami. Ada yang bisa kami bantu?"
```

## Pengujian

1. Kirim pesan WhatsApp ke nomor Twilio Anda
2. Verifikasi bahwa webhook n8n menerima pesan
3. Periksa apakah respons yang dikirim sesuai dengan yang diharapkan

## Pemecahan Masalah

- **Webhook tidak menerima pesan**: Periksa URL webhook dan pastikan n8n dapat diakses dari internet
- **Tidak ada respons**: Periksa log eksekusi n8n untuk kesalahan
- **Rate limiting**: Perhatikan batasan API dari penyedia WhatsApp gateway

## Langkah Selanjutnya

- Integrasikan dengan database untuk menyimpan percakapan
- Tambahkan analitik untuk melacak performa bot
- Implementasikan NLP (Natural Language Processing) untuk pemahaman pesan yang lebih baik
- Buat mekanisme eskalasi ke agen manusia 