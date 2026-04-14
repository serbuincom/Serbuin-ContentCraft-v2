# Serbuin ContentCraft v.1

Aplikasi untuk mengubah ringkasan atau transkrip menjadi konten tulisan pendek yang menarik untuk media sosial dan blog.

## Cara Deploy ke Vercel

1. **Push ke GitHub/GitLab/Bitbucket**: Pastikan kode Anda sudah ada di repositori Git.
2. **Import ke Vercel**: Masuk ke dashboard Vercel dan pilih "New Project", lalu import repositori Anda.
3. **Konfigurasi Environment Variables**:
   - Di bagian **Environment Variables**, tambahkan:
     - `GEMINI_API_KEY`: Masukkan API Key Gemini Anda (bisa didapatkan di [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. **Deploy**: Klik "Deploy". Vercel akan secara otomatis mendeteksi Vite dan menjalankan build.

## Pengembangan Lokal

```bash
npm install
npm run dev
```

Pastikan Anda memiliki file `.env` dengan `GEMINI_API_KEY`.
