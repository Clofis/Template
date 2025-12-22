document.addEventListener('DOMContentLoaded', () => {
  const topImage = document.querySelector('.animate-top');
  const bottomImage = document.querySelector('.animate-bottom');
  const centerContent = document.querySelector('.animate-center');

  // set kondisi awal
  if (topImage) topImage.classList.add('enter-top');
  if (bottomImage) bottomImage.classList.add('enter-bottom');
  if (centerContent) centerContent.classList.add('enter-center');

  // 1️⃣ bunga bawah
  setTimeout(() => {
    if (bottomImage) bottomImage.classList.add('enter-active');
  }, 200);

  // 2️⃣ bunga atas
  setTimeout(() => {
    if (topImage) topImage.classList.add('enter-active');
  }, 600);

  // 3️⃣ logo & teks
  setTimeout(() => {
    if (centerContent) centerContent.classList.add('enter-active');
  }, 1000);

  // Intersection Observer untuk animasi scroll yang berulang
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const elements = entry.target.querySelectorAll('.animate-on-scroll');
      
      if (entry.isIntersecting) {
        // Animate in
        elements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('enter-active');
          }, index * 150);
        });
      } else {
        // Animate out (reset for re-animation)
        elements.forEach(el => {
          el.classList.remove('enter-active');
        });
      }
    });
  }, observerOptions);

  // Observe semua section
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // ================= COUNTDOWN TIMER ================= 
  function startCountdown() {
    // Tanggal target: 29 Juni 2025, 10:00 WITA
    const targetDate = new Date('2025-06-29T10:00:00+08:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(timer);
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      document.getElementById('days').textContent = days;
      document.getElementById('hours').textContent = hours;
      document.getElementById('minutes').textContent = minutes;
      document.getElementById('seconds').textContent = seconds;
    }, 1000);
  }
  
  // Start countdown timer
  startCountdown();

  // ================= LOAD UCAPAN REAL-TIME ================= 
  function loadUcapanRealTime() {
    const ucapanContainer = document.getElementById('ucapanContainer');
    const ucapanLoading = document.getElementById('ucapanLoading');
    const noUcapan = document.getElementById('noUcapan');
    
    if (!ucapanContainer) return;

    try {
      // Listen to RSVP data changes in real-time
      const rsvpRef = window.ref(window.database, 'rsvp');
      const rsvpQuery = window.query(rsvpRef, window.orderByChild('timestamp'), window.limitToLast(20));
      
      window.onValue(rsvpQuery, (snapshot) => {
        ucapanLoading.classList.add('hidden');
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const ucapanArray = [];
          
          // Convert to array and filter only entries with ucapan
          Object.keys(data).forEach(key => {
            const item = data[key];
            if (item.ucapan && item.ucapan.trim() !== '') {
              ucapanArray.push({
                id: key,
                ...item
              });
            }
          });
          
          if (ucapanArray.length > 0) {
            // Sort by timestamp (newest first)
            ucapanArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            
            // Display ucapan
            ucapanContainer.innerHTML = ucapanArray.map(item => `
              <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-[#8a4f2a] text-lg">${escapeHtml(item.nama)}</h4>
                  <span class="text-xs text-[#b07a4a] flex items-center">
                    ${item.kehadiran === 'hadir' ? '✅' : item.kehadiran === 'tidak-hadir' ? '❌' : '🤔'} 
                    ${item.kehadiran}
                  </span>
                </div>
                <p class="text-[#8a4f2a] text-sm leading-relaxed">${escapeHtml(item.ucapan)}</p>
                <div class="text-xs text-[#b07a4a] mt-2">
                  ${formatTimestamp(item.timestamp)}
                </div>
              </div>
            `).join('');
            
            noUcapan.classList.add('hidden');
          } else {
            ucapanContainer.innerHTML = '';
            noUcapan.classList.remove('hidden');
          }
        } else {
          ucapanContainer.innerHTML = '';
          noUcapan.classList.remove('hidden');
        }
      }, (error) => {
        console.error('Error loading ucapan:', error);
        ucapanLoading.innerHTML = '<p class="text-red-500 text-sm">Gagal memuat ucapan</p>';
      });
      
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      ucapanLoading.innerHTML = '<p class="text-red-500 text-sm">Gagal memuat ucapan</p>';
    }
  }

  // Helper functions
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) return 'Baru saja';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Load ucapan when page loads
  setTimeout(() => {
    loadUcapanRealTime();
  }, 1000);

  // ================= RSVP FORM WITH FIREBASE REALTIME DATABASE ================= 
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const nama = document.getElementById('nama').value;
      const kehadiran = document.getElementById('kehadiran').value;
      const ucapan = document.getElementById('ucapan').value;
      const submitButton = rsvpForm.querySelector('button[type="submit"]');
      
      if (!nama || !kehadiran) {
        alert('Mohon lengkapi nama dan konfirmasi kehadiran.');
        return;
      }

      // Disable button and show loading
      submitButton.disabled = true;
      submitButton.textContent = 'Mengirim...';
      
      try {
        // Check if Firebase is properly initialized
        if (!window.database || !window.ref || !window.push) {
          throw new Error('Firebase not properly initialized');
        }

        console.log('Attempting to save RSVP data...');
        
        // Save to Firebase Realtime Database
        const rsvpRef = window.ref(window.database, 'rsvp');
        const newRsvpRef = await window.push(rsvpRef, {
          nama: nama,
          kehadiran: kehadiran,
          ucapan: ucapan || '',
          timestamp: Date.now() // Using Date.now() instead of serverTimestamp for now
        });
        
        console.log('RSVP saved successfully with key:', newRsvpRef.key);
        alert(`Terima kasih ${nama}! RSVP Anda telah tersimpan.`);
        rsvpForm.reset();
      } catch (error) {
        console.error('Detailed error saving RSVP:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // More specific error messages
        if (error.code === 'PERMISSION_DENIED') {
          alert('Maaf, tidak memiliki izin untuk menyimpan data. Silakan hubungi admin.');
        } else if (error.code === 'NETWORK_ERROR') {
          alert('Maaf, terjadi masalah koneksi. Silakan cek internet Anda.');
        } else {
          alert(`Maaf, terjadi kesalahan: ${error.message}`);
        }
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim';
      }
    });
  }
});

// ================= TOGGLE REKENING FUNCTION ================= 
function toggleRekeningList() {
  const rekeningList = document.getElementById('rekeningList');
  const toggleButton = document.getElementById('toggleRekening');
  
  if (rekeningList.classList.contains('hidden')) {
    // Show rekening list
    rekeningList.classList.remove('hidden');
    rekeningList.classList.add('enter-active');
    toggleButton.textContent = 'Sembunyikan';
  } else {
    // Hide rekening list
    rekeningList.classList.add('hidden');
    rekeningList.classList.remove('enter-active');
    toggleButton.textContent = 'Lihat Rekening';
  }
}

// ================= COPY TO CLIPBOARD FUNCTION ================= 
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(function() {
    // Change button text temporarily
    const originalText = button.textContent;
    button.textContent = 'Tersalin!';
    button.classList.add('bg-green-600');
    button.classList.remove('bg-[#8a4f2a]');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-600');
      button.classList.add('bg-[#8a4f2a]');
    }, 2000);
  }).catch(function(err) {
    console.error('Could not copy text: ', err);
    alert('Gagal menyalin nomor rekening');
  });
}


