/**
 * Contoh implementasi untuk mengirim pesan dengan Fonnte API
 * Dapat digunakan sebagai referensi atau untuk pengujian
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Konfigurasi
const FONNTE_TOKEN = 'YOUR_FONNTE_TOKEN'; // Ganti dengan token Fonnte Anda
const API_URL = 'https://api.fonnte.com/send';

/**
 * Fungsi untuk mengirim pesan teks sederhana
 * @param {string} target - Nomor tujuan (format: 628xxxxxxxxxx)
 * @param {string} message - Pesan yang akan dikirim
 * @returns {Promise} - Promise dengan respons API
 */
async function sendTextMessage(target, message) {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: target,
        message: message
      }
    });
    
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim pesan dengan gambar dari URL
 * @param {string} target - Nomor tujuan (format: 628xxxxxxxxxx)
 * @param {string} imageUrl - URL gambar yang akan dikirim
 * @param {string} caption - Caption untuk gambar
 * @returns {Promise} - Promise dengan respons API
 */
async function sendImageFromUrl(target, imageUrl, caption = '') {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: target,
        message: caption,
        url: imageUrl,
        type: 'image'
      }
    });
    
    console.log('Image sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending image:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim pesan dengan file dari local path
 * @param {string} target - Nomor tujuan (format: 628xxxxxxxxxx)
 * @param {string} filePath - Path ke file yang akan dikirim
 * @param {string} caption - Caption untuk file
 * @param {string} fileType - Tipe file (document, image, audio, video)
 * @returns {Promise} - Promise dengan respons API
 */
async function sendFileFromPath(target, filePath, caption = '', fileType = 'document') {
  try {
    // Buat form data untuk upload file
    const form = new FormData();
    form.append('target', target);
    form.append('message', caption);
    form.append('type', fileType);
    form.append('file', fs.createReadStream(filePath));
    
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        ...form.getHeaders()
      },
      data: form
    });
    
    console.log('File sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending file:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim pesan dengan template
 * @param {string} target - Nomor tujuan (format: 628xxxxxxxxxx)
 * @param {string} templateName - Nama template
 * @param {string} languageCode - Kode bahasa (id, en, dll)
 * @param {Array} parameters - Array parameter untuk template
 * @returns {Promise} - Promise dengan respons API
 */
async function sendTemplateMessage(target, templateName, languageCode = 'id', parameters = []) {
  try {
    // Format parameter untuk template
    const components = [
      {
        type: 'body',
        parameters: parameters.map(param => ({
          type: 'text',
          text: param
        }))
      }
    ];
    
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: target,
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: components
        }
      }
    });
    
    console.log('Template message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending template message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim pesan ke grup
 * @param {string} groupId - ID grup WhatsApp
 * @param {string} message - Pesan yang akan dikirim
 * @returns {Promise} - Promise dengan respons API
 */
async function sendGroupMessage(groupId, message) {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: groupId,
        message: message
      }
    });
    
    console.log('Group message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending group message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim pesan dengan tombol
 * @param {string} target - Nomor tujuan (format: 628xxxxxxxxxx)
 * @param {string} message - Pesan yang akan dikirim
 * @param {Array} buttons - Array objek tombol {id, text}
 * @returns {Promise} - Promise dengan respons API
 */
async function sendButtonMessage(target, message, buttons) {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: target,
        message: message,
        buttons: buttons
      }
    });
    
    console.log('Button message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending button message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim pesan dengan list
 * @param {string} target - Nomor tujuan (format: 628xxxxxxxxxx)
 * @param {string} message - Pesan yang akan dikirim
 * @param {string} buttonText - Teks untuk tombol
 * @param {Array} sections - Array objek section {title, rows: [{id, title, description}]}
 * @returns {Promise} - Promise dengan respons API
 */
async function sendListMessage(target, message, buttonText, sections) {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: target,
        message: message,
        buttonText: buttonText,
        sections: sections
      }
    });
    
    console.log('List message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending list message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fungsi untuk validasi nomor WhatsApp
 * @param {string} phoneNumber - Nomor yang akan divalidasi
 * @returns {Promise} - Promise dengan respons API
 */
async function validateNumber(phoneNumber) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.fonnte.com/validate',
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/json'
      },
      data: {
        target: phoneNumber
      }
    });
    
    console.log('Number validation result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error validating number:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Contoh penggunaan
async function examples() {
  try {
    // Contoh nomor tujuan (ganti dengan nomor yang valid)
    const targetNumber = '628xxxxxxxxxx';
    
    // 1. Kirim pesan teks
    await sendTextMessage(targetNumber, 'Halo! Ini adalah pesan teks dari API Fonnte.');
    
    // 2. Kirim gambar dari URL
    await sendImageFromUrl(
      targetNumber, 
      'https://example.com/image.jpg',
      'Ini adalah caption untuk gambar'
    );
    
    // 3. Kirim file dari local path
    await sendFileFromPath(
      targetNumber,
      './document.pdf',
      'Ini adalah dokumen penting',
      'document'
    );
    
    // 4. Kirim pesan template
    await sendTemplateMessage(
      targetNumber,
      'welcome_message',
      'id',
      ['John Doe', 'ABC Company']
    );
    
    // 5. Kirim pesan ke grup
    const groupId = '120363123456789@g.us'; // Ganti dengan ID grup yang valid
    await sendGroupMessage(groupId, 'Halo semua anggota grup!');
    
    // 6. Kirim pesan dengan tombol
    await sendButtonMessage(
      targetNumber,
      'Silakan pilih salah satu opsi berikut:',
      [
        { id: 'btn1', text: 'Opsi 1' },
        { id: 'btn2', text: 'Opsi 2' },
        { id: 'btn3', text: 'Opsi 3' }
      ]
    );
    
    // 7. Kirim pesan dengan list
    await sendListMessage(
      targetNumber,
      'Silakan pilih kategori produk:',
      'Lihat Kategori',
      [
        {
          title: 'Elektronik',
          rows: [
            { id: 'e1', title: 'Smartphone', description: 'Berbagai merek smartphone' },
            { id: 'e2', title: 'Laptop', description: 'Laptop untuk kerja dan gaming' }
          ]
        },
        {
          title: 'Fashion',
          rows: [
            { id: 'f1', title: 'Pria', description: 'Pakaian pria' },
            { id: 'f2', title: 'Wanita', description: 'Pakaian wanita' }
          ]
        }
      ]
    );
    
    // 8. Validasi nomor WhatsApp
    await validateNumber(targetNumber);
    
  } catch (error) {
    console.error('Error in examples:', error);
  }
}

// Uncomment untuk menjalankan contoh
// examples();

// Export fungsi untuk digunakan di file lain
module.exports = {
  sendTextMessage,
  sendImageFromUrl,
  sendFileFromPath,
  sendTemplateMessage,
  sendGroupMessage,
  sendButtonMessage,
  sendListMessage,
  validateNumber
}; 