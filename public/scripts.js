document.addEventListener('DOMContentLoaded', function() {
    const joinButton = document.getElementById('joinButton');
    const channelIdInput = document.getElementById('channelId');
    const loadingModal = document.getElementById('loadingModal');
    const userName = document.getElementById('userName');

    const modalMessage = document.getElementById('modalMessage');
    const closeButton = document.querySelector('.close');
    const themeToggle = document.getElementById('themeToggle');
    let isLightTheme = false;

    joinButton.addEventListener('click', function() {
        const channelId = channelIdInput.value.trim();
        
        if (channelId === '') {
            alert('Mohon masukkan Channel ID');
            return;
        }
        
        // Show loading modal
        loadingModal.style.display = 'flex';
        modalMessage.textContent = 'Tolong tunggu, perintah sedang dilakukan...';
        
        // Send request to server
        fetch('/join-channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channelId: channelId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.userInfo && data.userInfo.length > 0) {
                const user = data.userInfo[0]; // Assuming we take the first user's info
                userName.textContent = user.displayName;
                userName.style.display = 'block';
            }

            modalMessage.textContent = data.message;
        })
        .catch(error => {
            modalMessage.textContent = 'Terjadi kesalahan: ' + error.message;
        });
    });
    
    closeButton.addEventListener('click', function() {
        loadingModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === loadingModal) {
            loadingModal.style.display = 'none';
        }
    });

    // Toggle theme
    themeToggle.addEventListener('click', function() {
        isLightTheme = !isLightTheme;
        document.body.classList.toggle('light', isLightTheme);
        themeToggle.innerHTML = isLightTheme ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});

const eyes = document.querySelectorAll('.eyes');
const pupils = document.querySelectorAll('.pupils');
const curve = document.querySelector('.curve');

document.addEventListener('mousemove', (e) => {
  eyes.forEach((eye, index) => {
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2; 
    const eyeCenterY = rect.top + rect.height / 2; 
    const deltaX = e.clientX - eyeCenterX;
    const deltaY = e.clientY - eyeCenterY; 
    const angle = Math.atan2(deltaY, deltaX);
    const maxMove = 25;
    const moveX = Math.cos(angle) * maxMove;
    const moveY = Math.sin(angle) * maxMove;

    pupils[index].style.transform = `translate(${moveX}px, ${moveY}px)`;  
  });
});

const passwordInput = document.getElementById("password");
let isPasswordVisible = false;

eyes.forEach(eye => {
  eye.addEventListener("click", function() {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? "text" : "password";

    // Animate pupils when toggling
    document.querySelectorAll(".pupils").forEach(pupil => {
      pupil.style.transform = isPasswordVisible ? "scale(1.5)" : "scale(1)";
    });
  });
});
