/**
 * Script untuk menguji apakah webhook n8n dapat diakses
 * Gunakan: node test-webhook.js
 */

const axios = require('axios');

const N8N_URL = 'http://18.215.188.50:5678';
const WEBHOOK_PATH = '/whatsapp/webhook';

// Tes 1: Cek apakah server n8n berjalan
async function testN8nServer() {
  try {
    console.log(`Menguji koneksi ke server n8n: ${N8N_URL}`);
    const response = await axios.get(N8N_URL);
    console.log('✅ Server n8n dapat diakses!');
    console.log(`Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error('❌ Tidak dapat mengakses server n8n:');
    console.error(`Status: ${error.response ? error.response.status : 'Tidak ada respons'}`);
    console.error(`Pesan: ${error.message}`);
    return false;
  }
}

// Tes 2: Cek apakah webhook URL dapat diakses
async function testWebhook() {
  try {
    const webhookUrl = `${N8N_URL}${WEBHOOK_PATH}`;
    console.log(`Menguji webhook URL: ${webhookUrl}`);
    
    // Coba dengan GET request dulu
    try {
      const getResponse = await axios.get(webhookUrl);
      console.log('✅ Webhook dapat diakses dengan GET!');
      console.log(`Status: ${getResponse.status}`);
      console.log(`Respons: ${JSON.stringify(getResponse.data)}`);
    } catch (getError) {
      console.log(`ℹ️ Webhook tidak merespons GET request: ${getError.message}`);
      console.log('Ini normal jika webhook hanya dikonfigurasi untuk POST.');
    }
    
    // Coba dengan POST request
    const postData = {
      test: 'data',
      message: 'Ini adalah pesan uji dari test-webhook.js'
    };
    
    const postResponse = await axios.post(webhookUrl, postData);
    console.log('✅ Webhook dapat diakses dengan POST!');
    console.log(`Status: ${postResponse.status}`);
    console.log(`Respons: ${JSON.stringify(postResponse.data)}`);
    return true;
  } catch (error) {
    console.error('❌ Tidak dapat mengakses webhook:');
    console.error(`Status: ${error.response ? error.response.status : 'Tidak ada respons'}`);
    console.error(`Pesan: ${error.message}`);
    
    if (error.response && error.response.status === 404) {
      console.log('\n🔍 Kemungkinan penyebab error 404:');
      console.log('1. Webhook belum diaktifkan di n8n (klik "Execute Node" pada node Webhook)');
      console.log('2. Path webhook tidak sesuai (pastikan path persis sama dengan yang dikonfigurasi di n8n)');
      console.log('3. n8n tidak berjalan dengan benar');
    }
    
    return false;
  }
}

// Jalankan tes
async function runTests() {
  console.log('🔄 Memulai pengujian webhook n8n...\n');
  
  const serverRunning = await testN8nServer();
  console.log('\n-----------------------------------\n');
  
  if (serverRunning) {
    await testWebhook();
  } else {
    console.log('⚠️ Server n8n tidak dapat diakses, tidak dapat menguji webhook.');
    console.log('Pastikan n8n berjalan dan dapat diakses dari internet.');
  }
  
  console.log('\n-----------------------------------\n');
  console.log('🏁 Pengujian selesai!');
}

runTests().catch(error => {
  console.error('❌ Terjadi error saat menjalankan tes:');
  console.error(error);
}); 