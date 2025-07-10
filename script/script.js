// EmailJS Initialization
(function(){
    emailjs.init("NFeoJI_KXjeM-geRm"); 
})();

// Global elements and variables
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Home Page Elements
const tags = document.querySelectorAll('#home-page .tag');
const allModuleCards = document.querySelectorAll('#home-page .module-card');
const searchInput = document.getElementById('searchInput');
const downloadButtons = document.querySelectorAll('.download-btn'); // Combined for all pages
const modulesGrid = document.getElementById('modulesGrid');
const noResultsMessage = document.getElementById('noResultsMessage');
const notificationModuleCard = document.getElementById('notificationModuleCard');
const latestNotificationBubble = document.getElementById('latestNotificationBubble');
const notificationBubble = document.getElementById('notificationBubble');

// Apps Page Elements
const appSearchInput = document.getElementById('appSearchInput');
const appSearchTags = document.querySelectorAll('#apps-page .tag');
const appsGrid = document.getElementById('appsGrid');
const allAppCards = document.querySelectorAll('#apps-page .module-card');
const noAppResultsMessage = document.getElementById('noAppResultsMessage');

// Upload Page Elements
const uploadForm = document.getElementById("upload-form");
const uploadStatus = document.getElementById("status");
const uploadFormSection = document.getElementById("form-section");
const uploadSuccessSection = document.getElementById("upload-success-section");
const returnToUploadFormButton = document.getElementById("return-to-upload-form");


// --- Navigation Logic ---
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove 'active' class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        // Add 'active' class to the clicked nav item
        this.classList.add('active');

        const pageToShow = this.getAttribute('data-page');

        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        // Show the selected page
        document.getElementById(pageToShow).classList.add('active');

        // Re-filter modules/apps/reset upload form when switching pages to ensure correct display
        if (pageToShow === 'home-page') {
            filterModules();
        } else if (pageToShow === 'apps-page') {
            filterApps();
        } else if (pageToShow === 'upload-page') {
            // Reset upload form to initial state when navigating to it
            uploadFormSection.style.display = "block";
            uploadSuccessSection.style.display = "none";
            uploadForm.reset();
            uploadStatus.textContent = "";
            uploadStatus.style.color = ""; // Reset status color
        }
    });
});

// --- Download Notification & Simulation Logic ---
function showNotification(moduleName) {
    notificationText.textContent = `"${moduleName}" sedang diunduh...`; // Indonesian text
    notification.classList.add('show');

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function simulateAndTriggerDownload(button, moduleName, downloadUrl) {
    const progress = button.querySelector('.progress');
    button.disabled = true; // Disable button during download
    button.style.opacity = 0.8; // Dim button

    let width = 0;
    const interval = setInterval(() => {
        width += 10;
        progress.style.width = `${width}%`;

        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                button.disabled = false; // Re-enable button
                button.style.opacity = 1; // Restore opacity
                progress.style.width = '0%'; // Reset progress bar

                if (downloadUrl) {
                    window.open(downloadUrl, '_blank'); // Open download URL in new tab
                }

            }, 300);
        }
    }, 50);
}

// Attach event listeners to all download buttons
downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        const moduleName = this.getAttribute('data-module');
        const downloadUrl = this.getAttribute('data-download-url');
        showNotification(moduleName); // Show notification
        simulateAndTriggerDownload(this, moduleName, downloadUrl); // Start download simulation
    });
});

// --- Tag Notification Bubbles Logic ---
function hideBubble(bubbleElement) {
    if (bubbleElement) {
        bubbleElement.classList.add('hidden-bubble');
    }
}

function showBubble(bubbleElement) {
    if (bubbleElement) {
        bubbleElement.classList.remove('hidden-bubble');
        // Re-trigger animation by resetting it
        bubbleElement.style.animation = 'none';
        void bubbleElement.offsetWidth; // Trigger reflow
        bubbleElement.style.animation = null;
    }
}

// --- Home Page Filtering Logic ---
function filterModules() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeTagElement = document.querySelector('#home-page .tag.active');
    const activeCategory = activeTagElement ? activeTagElement.getAttribute('data-category') : 'all';

    let hasVisibleRegularCards = false;

    // Hide all module cards initially
    allModuleCards.forEach(card => {
        card.classList.add('hidden');
    });

    if (activeCategory === 'pemberitahuan') {
        // Only show the notification card if "Pemberitahuan" tag is active
        notificationModuleCard.classList.remove('hidden');
        noResultsMessage.style.display = 'none'; // Hide no results message
    } else {
        // Filter regular module cards
        const regularModuleCards = Array.from(allModuleCards).filter(c =>
            c.id !== 'notificationModuleCard'
        );

        regularModuleCards.forEach(card => {
            const titleElement = card.querySelector('.module-title');
            // Get title text, excluding badge span if present
            const titleText = titleElement ? titleElement.childNodes[0].textContent.toLowerCase().trim() : ''; 
            const moduleCategories = card.getAttribute('data-category') ? card.getAttribute('data-category').split(' ').map(cat => cat.trim()) : [];

            const matchesSearchTerm = titleText.includes(searchTerm);

            // Conditional initial character matching for short search terms
            const matchesInitialCharacters = (searchTerm.length > 0 && searchTerm.length <= 5)
                                             ? titleText.startsWith(searchTerm)
                                             : true; // If search term is longer than 5 chars, don't use startsWith

            let matchesTag = false;

            // Check if card category matches active tag category
            if (activeCategory === 'all') {
                matchesTag = true;
            } else if (activeCategory === 'trending') {
                matchesTag = moduleCategories.includes('trending');
            } else if (activeCategory === 'latest') {
                matchesTag = moduleCategories.includes('latest');
            } else if (activeCategory === 'premium') {
                matchesTag = moduleCategories.includes('premium');
            }
            else if (activeCategory === 'shortlink') {
                matchesTag = moduleCategories.includes('shortlink');
            }
            else {
                matchesTag = moduleCategories.includes(activeCategory);
            }

            if (matchesSearchTerm && matchesInitialCharacters && matchesTag) {
                card.classList.remove('hidden');
                hasVisibleRegularCards = true;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide no results message based on visibility of regular cards
        if (!hasVisibleRegularCards && searchTerm !== '') {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Add event listeners to Home page tags
tags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove 'active' class from all tags and add to clicked tag
        tags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const currentActiveCategory = this.getAttribute('data-category');

        // Handle notification bubbles based on active tag
        if (currentActiveCategory === 'latest') {
            hideBubble(latestNotificationBubble);
        } else {
            showBubble(latestNotificationBubble);
        }

        if (currentActiveCategory === 'pemberitahuan') {
            hideBubble(notificationBubble);
        } else {
            showBubble(notificationBubble);
        }

        // Clear search input if a tag is clicked, unless it's the notification tag
        if (currentActiveCategory !== 'pemberitahuan') {
             searchInput.value = '';
        }

        filterModules(); // Re-filter modules
    });
});

// Add event listener for search input on Home page
searchInput.addEventListener('input', filterModules);

// --- Apps Page Filtering Logic ---
function filterApps() {
    const searchTerm = appSearchInput.value.toLowerCase().trim();
    const activeTagElement = document.querySelector('#apps-page .tag.active');
    const activeCategory = activeTagElement ? activeTagElement.getAttribute('data-category') : 'all';

    let hasVisibleApps = false;

    // Hide all app cards initially
    allAppCards.forEach(card => {
        const titleElement = card.querySelector('.module-title');
        const titleText = titleElement ? titleElement.childNodes[0].textContent.toLowerCase().trim() : '';
        const appCategories = card.getAttribute('data-category') ? card.getAttribute('data-category').split(' ').map(cat => cat.trim()) : [];

        const matchesSearchTerm = titleText.includes(searchTerm);

        const matchesInitialCharacters = (searchTerm.length > 0 && searchTerm.length <= 5)
                                         ? titleText.startsWith(searchTerm)
                                         : true;

        let matchesTag = false;
        if (activeCategory === 'all') {
            matchesTag = true;
        } else {
            matchesTag = appCategories.includes(activeCategory);
        }

        if (matchesSearchTerm && matchesInitialCharacters && matchesTag) {
            card.classList.remove('hidden');
            hasVisibleApps = true;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show/hide no results message for Apps page
    if (!hasVisibleApps && searchTerm !== '') {
        noAppResultsMessage.style.display = 'block';
    } else {
        noAppResultsMessage.style.display = 'none';
    }
}

// Add event listeners to Apps page tags
appSearchTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.preventDefault();
        appSearchTags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        appSearchInput.value = ''; // Clear search input when tag is clicked
        filterApps(); // Re-filter apps
    });
});

// Add event listener for search input on Apps page
appSearchInput.addEventListener('input', filterApps);

// --- Upload Page Logic ---
uploadForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Simple client-side validation
    const makerName = document.getElementById("maker-name").value.trim();
    const moduleCategory = document.getElementById("module-category").value;
    const moduleVersion = document.getElementById("module-version").value.trim();
    const downloadLink = document.getElementById("download-link").value.trim();
    const gmailAccount = document.getElementById("gmail-account").value.trim();

    if (!makerName || !moduleCategory || !moduleVersion || !downloadLink || !gmailAccount) {
        uploadStatus.textContent = "⚠️ Semua bidang harus diisi!";
        uploadStatus.style.color = "#ffcc00"; // Warning color
        return;
    }

    if (!downloadLink.startsWith("http://") && !downloadLink.startsWith("https://")) {
        uploadStatus.textContent = "❌ Tautan unduh harus dimulai dengan http:// atau https://";
        uploadStatus.style.color = "#ff4444";
        return;
    }

    if (!gmailAccount.endsWith("@gmail.com")) {
        uploadStatus.textContent = "❌ Alamat email harus merupakan akun Gmail yang valid.";
        uploadStatus.style.color = "#ff4444";
        return;
    }

    uploadStatus.textContent = "Mengirim data modul/aplikasi...";
    uploadStatus.style.color = "#bdbdbd"; // Reset color in case of previous error

    const messageContent = `Kategori: ${moduleCategory}\nVersi: ${moduleVersion}\nLink Download: ${downloadLink}`;

    const templateParams = {
        from_name: makerName, 
        from_email: gmailAccount, 
        pesan: messageContent,
    };

    emailjs.send("service_f1xq7sf", "template_p5f4co8", templateParams)
        .then(() => {
            uploadStatus.textContent = ""; // Clear sending status
            uploadForm.reset(); // Reset the form fields
            uploadFormSection.style.display = "none"; // Hide the form
            uploadSuccessSection.style.display = "block"; // Show the success message
        }, (err) => {
            uploadStatus.textContent = "❌ Gagal mengirim modul/aplikasi. Coba lagi.";
            uploadStatus.style.color = "#ff4444"; // Red color for error
            console.error("EmailJS Error:", err);
        });
});

// Event listener for the "Kirim Module/Aplikasi Lain" button on upload page
returnToUploadFormButton.addEventListener("click", function() {
    uploadSuccessSection.style.display = "none"; // Hide the success message
    uploadFormSection.style.display = "block"; // Show the form again
    uploadStatus.textContent = ""; // Clear any previous status message
    uploadStatus.style.color = ""; // Reset status color
});


// --- DOMContentLoaded for initial setup and Intersection Observer ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize active tag for Home page if none is active
    const currentActiveTagHome = document.querySelector('#home-page .tag.active');
    if (!currentActiveTagHome) {
        document.querySelector('#home-page .tag[data-category="all"]').classList.add('active');
    }
    filterModules(); // Initial filter for Home page
    showBubble(latestNotificationBubble); // Show bubbles on load
    showBubble(notificationBubble);

    // Initialize active tag for Apps page if none is active
    const currentActiveTagApps = document.querySelector('#apps-page .tag.active');
    if (!currentActiveTagApps) {
        document.querySelector('#apps-page .tag[data-category="all"]').classList.add('active');
    }
    filterApps(); // Initial filter for Apps page

    // Intersection Observer for fade-in animation on module/app cards
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const moduleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Observe all module cards on Home page (except notification card)
    allModuleCards.forEach(card => {
        if (!card.classList.contains('notification-card')) {
            moduleObserver.observe(card);
        }
    });

    // Observe all app cards on Apps page
    allAppCards.forEach(card => {
        moduleObserver.observe(card);
    });

    // Override filter functions to re-observe cards after filtering
    const originalFilterModules = filterModules;
    filterModules = () => {
        originalFilterModules();
        allModuleCards.forEach(card => {
            if (!card.classList.contains('notification-card')) {
                card.classList.remove('show'); // Remove 'show' class
                if (!card.classList.contains('hidden')) {
                    // If card is visible, re-check intersection and add 'show'
                    const rect = card.getBoundingClientRect();
                    const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
                    if (isVisible) {
                        card.classList.add('show');
                    } else {
                        // Re-observe if not immediately visible
                        moduleObserver.unobserve(card);
                        moduleObserver.observe(card);
                    }
                } else if (card.classList.contains('hidden')) {
                    // If hidden, stop observing
                    moduleObserver.unobserve(card);
                }
            }
        });
    };

    const originalFilterApps = filterApps;
    filterApps = () => {
        originalFilterApps();
        allAppCards.forEach(card => {
            card.classList.remove('show'); // Remove 'show' class
            if (!card.classList.contains('hidden')) {
                // If card is visible, re-check intersection and add 'show'
                const rect = card.getBoundingClientRect();
                const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
                if (isVisible) {
                    card.classList.add('show');
                } else {
                    // Re-observe if not immediately visible
                    moduleObserver.unobserve(card);
                    moduleObserver.observe(card);
                }
            } else if (card.classList.contains('hidden')) {
                // If hidden, stop observing
                moduleObserver.unobserve(card);
            }
        });
    };
});
