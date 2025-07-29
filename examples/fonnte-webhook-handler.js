/**
 * Contoh implementasi webhook handler untuk Fonnte dengan Node.js
 * Dapat digunakan sebagai referensi untuk memahami format data Fonnte
 */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FONNTE_TOKEN = 'AxqAYdM8T22QgKi4ert'; // Token API Fonnte Anda

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Direktori untuk menyimpan file media
const MEDIA_DIR = path.join(__dirname, 'media');
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR);
}

// Load FAQ database
const faqDatabase = require('../config/faq-database.json');
const botConfig = require('../config/bot-config.json');
const responseTemplates = require('../templates/responses.json');

// Fungsi untuk mencari jawaban dari FAQ
function findAnswerInFAQ(message) {
  const lowerMessage = message.toLowerCase();
  
  // Cek apakah ada keyword yang cocok
  for (const faq of faqDatabase.faqs) {
    for (const keyword of faq.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return faq.answer;
      }
    }
    
    // Cek apakah ada pertanyaan yang cocok
    for (const question of faq.questions) {
      if (lowerMessage.includes(question.toLowerCase())) {
        return faq.answer;
      }
    }
  }
  
  // Jika tidak ada yang cocok, kembalikan pesan default
  return responseTemplates.error.not_understood;
}

// Fungsi untuk mengirim pesan melalui API Fonnte
async function sendMessage(target, message) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.fonnte.com/send',
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: target,
        message: message
      }
    });
    
    console.log('Message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Fungsi untuk mengunduh media dari URL
async function downloadMedia(url, filename) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const filePath = path.join(MEDIA_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading media:', error);
    throw error;
  }
}

// Webhook endpoint untuk menerima pesan dari Fonnte
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    console.log('Received webhook data:', req.body);
    
    // Fonnte mengirimkan data dalam format yang berbeda
    // Data pesan ada di req.body.data
    const data = req.body.data || req.body;
    
    if (!data || !data.sender) {
      return res.status(400).send('Invalid webhook data');
    }
    
    // Ekstrak informasi dari webhook
    const {
      sender,
      message,
      pushName,
      isGroup,
      groupName,
      hasMedia,
      type,
      url,
      caption,
      filename
    } = data;
    
    // Log pesan yang diterima
    console.log(`Received message from ${pushName} (${sender}): ${message}`);
    
    // Simpan percakapan ke log
    const conversation = {
      sender,
      message,
      timestamp: new Date().toISOString(),
      isGroup: isGroup === 'true',
      groupName: groupName || ''
    };
    
    const logFile = path.join(__dirname, 'conversation_logs.json');
    let logs = [];
    
    // Baca file log yang ada
    try {
      if (fs.existsSync(logFile)) {
        const logData = fs.readFileSync(logFile, 'utf8');
        logs = JSON.parse(logData);
      }
    } catch (err) {
      console.error('Error reading log file:', err);
    }
    
    // Tambahkan percakapan baru
    logs.push(conversation);
    
    // Tulis kembali ke file
    try {
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error('Error writing log file:', err);
    }
    
    // Tangani media jika ada
    if (hasMedia === 'true' && url) {
      const mediaFilename = filename || `${Date.now()}_${type}`;
      const mediaPath = await downloadMedia(url, mediaFilename);
      console.log(`Media downloaded to ${mediaPath}`);
      
      // Tambahkan logika untuk memproses media di sini
      // Misalnya, jika gambar, Anda bisa menggunakan OCR
      // Jika dokumen, Anda bisa mengekstrak teks, dll.
    }
    
    // Proses pesan dan cari jawaban
    let response;
    
    // Cek apakah ini salam pembuka
    if (message && (
        message.toLowerCase().includes('halo') || 
        message.toLowerCase().includes('hai') || 
        message.toLowerCase().includes('hi') || 
        message.toLowerCase().includes('selamat')
    )) {
      response = responseTemplates.greeting.new_customer
        .replace('{{name}}', pushName || 'pelanggan')
        .replace('{{bot_name}}', botConfig.bot.name);
    } 
    // Cek di database FAQ
    else if (message) {
      response = findAnswerInFAQ(message);
    } 
    // Jika tidak ada pesan teks (mungkin hanya media)
    else {
      response = "Terima kasih telah mengirimkan media. Ada yang bisa saya bantu?";
    }
    
    // Kirim respons
    await sendMessage(sender, response);
    
    // Kirim respons sukses ke webhook
    res.status(200).send('Webhook received successfully');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Mulai server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
}); 