document.addEventListener('DOMContentLoaded', function() {
  // 1. Handle Name Parameter
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || 'Tamu Undangan';
  const nameElements = document.querySelectorAll('.guest-name');
  nameElements.forEach(element => {
    element.textContent = guestName;
  });

  // 2. Music Autoplay on Button Click
  window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById("bg-music");

    // Coba autoplay (kadang butuh interaksi user)
    const playAudio = () => {
      audio.play().catch(() => {
        // Gagal autoplay, tunggu interaksi user
        document.body.addEventListener("click", () => {
          audio.play();
        }, { once: true });
      });
    };

    playAudio();
  });


  // 3. Countdown Timer
  const countdownElements = {
    days: document.querySelector('#days'),
    hours: document.querySelector('#hours'),
    minutes: document.querySelector('#minutes'),
    seconds: document.querySelector('#seconds')
  };

  function updateCountdown() {
    const weddingDate = new Date('2025-06-29T11:00:00+08:00');
    const now = new Date();
    const timeDifference = weddingDate - now;

    if (timeDifference <= 0) {
      Object.values(countdownElements).forEach(el => el.textContent = '0');
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    countdownElements.days.textContent = days;
    countdownElements.hours.textContent = hours;
    countdownElements.minutes.textContent = minutes;
    countdownElements.seconds.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. Google Maps Redirect
  const mapsPlaceholder = document.querySelector('.maps-container');
  if (mapsPlaceholder) {
    mapsPlaceholder.addEventListener('click', function() {
      window.open('https://maps.app.goo.gl/ms9Nzc2DzeNPf7KN9?g_st=aw', '_blank');
    });
  }

  // 5. RSVP Form Handler with Firebase
  const wishForm = document.getElementById('wishForm');
  const wishesContainer = document.getElementById('wishesContainer');
  let wishesData = {};

  // Wait for Firebase to be loaded
  setTimeout(() => {
    if (window.firebaseDB) {
      console.log('Firebase detected, loading wishes from Firebase');
      loadWishesFromFirebase();
    } else {
      console.log('Firebase not available, using localStorage');
      // Fallback to localStorage if Firebase not available
      loadWishesFromLocal();
    }
  }, 2000);

  if (wishForm) {
    wishForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const message = document.getElementById('message').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked');
      
      if (name && message && attendance) {
        // Create wish object
        const wish = {
          name: name,
          message: message,
          attendance: attendance.value,
          timestamp: new Date().toLocaleString('id-ID'),
          serverTimestamp: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : Date.now()
        };
        
        // Save to Firebase or localStorage
        if (window.firebaseDB) {
          saveWishToFirebase(wish);
        } else {
          saveWishToLocal(wish);
        }
        
        // Reset form
        wishForm.reset();
        
        // Show success message
        showSuccessMessage();
      }
    });
  }

  function saveWishToFirebase(wish) {
    try {
      const wishesRef = window.firebaseRef(window.firebaseDB, 'wishes');
      window.firebasePush(wishesRef, wish)
        .then(() => {
          console.log('Wish saved to Firebase successfully');
        })
        .catch((error) => {
          console.error('Error saving to Firebase:', error);
          // Fallback to localStorage
          saveWishToLocal(wish);
        });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      // Fallback to localStorage
      saveWishToLocal(wish);
    }
  }

  function saveWishToLocal(wish) {
    let wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    wish.id = Date.now();
    wishes.unshift(wish);
    localStorage.setItem('weddingWishes', JSON.stringify(wishes));
    displayWish(wish);
  }

  function loadWishesFromFirebase() {
    try {
      const wishesRef = window.firebaseRef(window.firebaseDB, 'wishes');
      window.firebaseOnValue(wishesRef, (snapshot) => {
        // Hide loading indicator
        const loadingElement = document.getElementById('loadingWishes');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
        
        // Update connection status
        updateConnectionStatus(true);
        
        const data = snapshot.val();
        wishesData = data || {};
        
        // Clear container except loading and no-wishes elements
        if (wishesContainer) {
          const existingWishes = wishesContainer.querySelectorAll('.wish-item');
          existingWishes.forEach(wish => wish.remove());
        }
        
        // Convert to array and sort by timestamp
        const wishesArray = Object.entries(wishesData).map(([key, value]) => ({
          id: key,
          ...value
        }));
        
        // Sort by serverTimestamp (newest first)
        wishesArray.sort((a, b) => {
          const timeA = a.serverTimestamp || 0;
          const timeB = b.serverTimestamp || 0;
          return timeB - timeA;
        });
        
        // Display wishes
        wishesArray.forEach(wish => displayWish(wish));
        updateWishesCount();
        toggleNoWishesMessage();
      });
    } catch (error) {
      console.error('Error loading from Firebase:', error);
      // Hide loading and show error fallback
      const loadingElement = document.getElementById('loadingWishes');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      updateConnectionStatus(false);
      loadWishesFromLocal();
    }
  }

  function loadWishesFromLocal() {
    // Hide loading indicator
    const loadingElement = document.getElementById('loadingWishes');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    // Update connection status
    updateConnectionStatus(false);
    
    const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    wishes.forEach(wish => displayWish(wish));
    updateWishesCount();
    toggleNoWishesMessage();
  }

  function updateConnectionStatus(isFirebase) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
      if (isFirebase) {
        statusElement.textContent = '🌐 Online';
        statusElement.className = 'connection-status online';
      } else {
        statusElement.textContent = '📱 Lokal';
        statusElement.className = 'connection-status offline';
      }
    }
  }

  function displayWish(wish) {
    const wishElement = document.createElement('div');
    wishElement.className = 'wish-item';
    wishElement.innerHTML = `
      <div class="wish-header">
        <h4 class="wish-name">${escapeHtml(wish.name)}</h4>
        <span class="wish-attendance ${wish.attendance === 'Akan Hadir' ? 'attending' : 'not-attending'}">
          ${wish.attendance}
        </span>
      </div>
      <p class="wish-message">${escapeHtml(wish.message)}</p>
      <small class="wish-timestamp">${wish.timestamp}</small>
    `;
    
    if (wishesContainer) {
      wishesContainer.appendChild(wishElement);
      updateWishesCount();
      toggleNoWishesMessage();
    }
  }

  function updateWishesCount() {
    let wishesCount = 0;
    
    if (window.firebaseDB && wishesData) {
      wishesCount = Object.keys(wishesData).length;
    } else {
      const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
      wishesCount = wishes.length;
    }
    
    const countElement = document.getElementById('wishesCount');
    if (countElement) {
      countElement.textContent = `${wishesCount} Ucapan`;
    }
  }

  function toggleNoWishesMessage() {
    let wishesCount = 0;
    
    if (window.firebaseDB && wishesData) {
      wishesCount = Object.keys(wishesData).length;
    } else {
      const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
      wishesCount = wishes.length;
    }
    
    const noWishesElement = document.getElementById('noWishes');
    if (noWishesElement) {
      noWishesElement.style.display = wishesCount === 0 ? 'block' : 'none';
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = 'Terima kasih! Ucapan doa Anda telah terkirim.';
    
    const form = document.getElementById('wishForm');
    form.appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }

});

// Floating Hearts Animation
function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.innerHTML = '♥';
  heart.className = 'floating-heart';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.animationDuration = Math.random() * 3 + 5 + 's';
  heart.style.opacity = Math.random() * 0.5 + 0.3;
  heart.style.fontSize = Math.random() * 10 + 15 + 'px';
  heart.style.color = `hsl(${Math.random() * 30 + 330}, 70%, 70%)`;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}

// Create floating hearts periodically
setInterval(createFloatingHeart, 3000);

// Add floating heart styles dynamically
const style = document.createElement('style');
style.textContent = `
.floating-heart {
    position: fixed;
    top: 100%;
    pointer-events: none;
    z-index: 999;
    animation: floatUp 8s linear infinite;
}

@keyframes floatUp {
    to {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);     