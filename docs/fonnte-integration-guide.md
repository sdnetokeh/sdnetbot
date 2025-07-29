# Panduan Integrasi Bot WhatsApp dengan Fonnte Gateway

Dokumen ini memberikan panduan langkah demi langkah untuk mengintegrasikan bot WhatsApp customer service yang menggunakan n8n dengan gateway Fonnte.

## Tentang Fonnte

[Fonnte](https://docs.fonnte.com/) adalah layanan WhatsApp gateway yang dikembangkan di Indonesia, menawarkan solusi untuk mengirim dan menerima pesan WhatsApp secara otomatis melalui API.

## Prasyarat

1. Akun Fonnte (daftar di [Fonnte](https://fonnte.com))
2. n8n yang sudah terinstal (lihat `installation-guide.md`)
3. Server yang dapat diakses dari internet untuk webhook

## Langkah 1: Mendaftar dan Login ke Fonnte

1. Kunjungi [Fonnte](https://fonnte.com) dan daftar akun baru
2. Setelah mendaftar, login ke dashboard Fonnte
3. Hubungkan perangkat WhatsApp Anda dengan memindai kode QR yang muncul

## Langkah 2: Mendapatkan Token API Fonnte

1. Di dashboard Fonnte, klik menu "Device"
2. Pilih perangkat WhatsApp yang ingin digunakan
3. Klik tab "API"
4. Salin "Token" yang ditampilkan (ini adalah API key Anda)

## Langkah 3: Konfigurasi Webhook di Fonnte

1. Di dashboard Fonnte, klik menu "Device"
2. Pilih perangkat WhatsApp Anda
3. Klik tab "Webhook"
4. Pada field "Webhook URL", masukkan URL webhook n8n Anda (akan didapatkan dari n8n pada langkah selanjutnya)
5. Klik "Save" untuk menyimpan pengaturan

## Langkah 4: Menyiapkan Webhook di n8n

1. Buka dashboard n8n (biasanya di `http://localhost:5678`)
2. Buka workflow "WhatsApp Customer Service Bot" yang sudah diimpor
3. Klik pada node "Webhook: Receive Message"
4. Pastikan pengaturan sebagai berikut:
   - Method: POST
   - Path: whatsapp/webhook
   - Response Mode: Last Node
5. Klik "Execute Node" untuk mengaktifkan webhook
6. Salin URL webhook yang dihasilkan (contoh: `https://your-n8n-instance.com/webhook/whatsapp-webhook`)
7. Gunakan URL ini untuk dikonfigurasi di Fonnte pada Langkah 3

## Langkah 5: Menyesuaikan Format Data Fonnte di n8n

Fonnte memiliki format data webhook yang berbeda dengan gateway lain. Kita perlu menyesuaikan node "Extract Message Data" di workflow n8n:

1. Buka workflow n8n
2. Klik pada node "Extract Message Data"
3. Tambahkan atau pastikan kode berikut ada untuk menangani format Fonnte:

```javascript
// Ekstrak data pesan dari WhatsApp Gateway
let incomingData;

// Format Fonnte
if ($input.body.data && $input.body.data.sender) {
  incomingData = {
    message: $input.body.data.message || '',
    sender: $input.body.data.sender,
    timestamp: new Date().toISOString(),
    gateway: 'fonnte',
    // Fonnte-specific fields
    pushName: $input.body.data.pushName,
    isGroup: $input.body.data.isGroup === 'true',
    groupName: $input.body.data.groupName || '',
    groupId: $input.body.data.groupId || '',
    // Handle attachments if any
    hasMedia: $input.body.data.hasMedia === 'true',
    mediaType: $input.body.data.type || '',
    mediaUrl: $input.body.data.url || ''
  };
} else {
  // Format lainnya (tetap pertahankan yang sudah ada)
  // ...
}

// Simpan data pesan ke variabel untuk digunakan di node berikutnya
return {
  json: incomingData
};
```

## Langkah 6: Konfigurasi Pengiriman Pesan dengan Fonnte API

1. Buka workflow n8n
2. Klik pada node "Send WhatsApp Response"
3. Ubah konfigurasi untuk menggunakan Fonnte API:
   - URL: `https://api.fonnte.com/send`
   - Method: POST
   - Headers: 
     - Authorization: Token Fonnte Anda
     - Content-Type: application/json
   - Body:
     ```json
     {
       "target": "{{$node[\"Save Conversation\"].json.sender}}",
       "message": "{{$node[\"Save Conversation\"].json.response}}"
     }
     ```

## Langkah 7: Perbarui Konfigurasi Bot

1. Buka file `config/bot-config.json`
2. Perbarui bagian "whatsapp" dengan detail Fonnte:
   ```json
   "whatsapp": {
     "phoneNumber": "628xxxxxxxxxx", // Nomor WhatsApp Anda di Fonnte
     "webhookUrl": "https://your-n8n-instance.com/webhook/whatsapp",
     "apiEndpoint": "https://api.fonnte.com/send",
     "provider": "fonnte"
   }
   ```

## Fitur Khusus Fonnte

### Mengirim Pesan dengan Template

Fonnte mendukung pengiriman pesan dengan template. Untuk menggunakannya:

```javascript
// Di node function sebelum mengirim pesan
const message = {
  target: sender,
  message: response,
  template: {
    name: "template_name",
    language: {
      code: "id" // Kode bahasa (id untuk Indonesia)
    },
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "Parameter 1"
          }
        ]
      }
    ]
  }
};

return { json: message };
```

### Menangani Lampiran Media

Fonnte dapat menangani pesan dengan media (gambar, dokumen, dll). Tambahkan kode berikut di node "Process Message":

```javascript
// Cek apakah pesan berisi media
if (incomingData.hasMedia) {
  switch (incomingData.mediaType) {
    case 'image':
      // Proses gambar
      break;
    case 'document':
      // Proses dokumen
      break;
    case 'audio':
      // Proses audio
      break;
    // dan seterusnya
  }
}
```

### Mengirim Media dengan Fonnte

Untuk mengirim media (gambar, dokumen, dll) dengan Fonnte:

```javascript
// Contoh mengirim gambar
const mediaMessage = {
  target: sender,
  message: caption, // Caption untuk media
  url: "https://example.com/image.jpg", // URL gambar
  type: "image" // Tipe media (image, document, audio, video)
};

// Atau mengirim file dari local path
const fileMessage = {
  target: sender,
  message: caption,
  file: "/path/to/file.pdf",
  type: "document"
};
```

## Menangani Webhook dari Fonnte

Fonnte mengirimkan data webhook dengan format berikut:

```json
{
  "device": "6281234567890",
  "sender": "6287654321098",
  "message": "Halo, saya butuh bantuan",
  "pushName": "Customer Name",
  "isGroup": "false",
  "groupName": "",
  "groupId": "",
  "timestamp": "1234567890",
  "hasMedia": "false",
  "type": "",
  "url": "",
  "caption": "",
  "filename": "",
  "latitude": "",
  "longitude": ""
}
```

Pastikan node "Extract Message Data" dapat menangani format ini dengan benar.

## Pemecahan Masalah

### Webhook Tidak Menerima Pesan

- Pastikan URL webhook di Fonnte sudah benar dan dapat diakses dari internet
- Periksa apakah token API Fonnte sudah benar
- Periksa log di dashboard Fonnte untuk melihat status pengiriman webhook

### Pesan Tidak Terkirim

- Periksa apakah token API Fonnte valid dan tidak kadaluarsa
- Pastikan nomor tujuan dalam format yang benar (awalan 62 untuk Indonesia)
- Periksa log di dashboard Fonnte untuk melihat status pengiriman pesan

### Format Pesan Tidak Sesuai

- Periksa format data yang dikirim oleh Fonnte di log n8n
- Sesuaikan node "Extract Message Data" untuk menangani format yang diterima

## Referensi

- [Dokumentasi Fonnte](https://docs.fonnte.com/)
- [API Fonnte](https://docs.fonnte.com/api/sending-api-messages.html)
- [Webhook Fonnte](https://docs.fonnte.com/webhook/webhook-url.html) 