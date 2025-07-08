const tags = document.querySelectorAll('#home-page .tag');
const allModuleCards = document.querySelectorAll('#home-page .module-card');
const searchInput = document.getElementById('searchInput');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const downloadButtons = document.querySelectorAll('.download-btn');
const modulesGrid = document.getElementById('modulesGrid');
const noResultsMessage = document.getElementById('noResultsMessage');
const notificationModuleCard = document.getElementById('notificationModuleCard');

const latestNotificationBubble = document.getElementById('latestNotificationBubble');
const notificationBubble = document.getElementById('notificationBubble');

const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

// New elements for Apps page
const appSearchInput = document.getElementById('appSearchInput');
const appSearchTags = document.querySelectorAll('#apps-page .tag');
const appsGrid = document.getElementById('appsGrid');
const allAppCards = document.querySelectorAll('#apps-page .module-card');
const noAppResultsMessage = document.getElementById('noAppResultsMessage');


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

        // Re-filter modules/apps when switching pages to ensure correct display
        if (pageToShow === 'home-page') {
            filterModules();
        } else if (pageToShow === 'apps-page') {
            filterApps();
        }
    });
});

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
            const titleText = titleElement.childNodes[0].textContent.toLowerCase().trim(); // Get title text, excluding badges
            const moduleCategories = card.getAttribute('data-category').split(' ').map(cat => cat.trim());

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
        const titleText = titleElement.childNodes[0].textContent.toLowerCase().trim();
        const appCategories = card.getAttribute('data-category').split(' ').map(cat => cat.trim());

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

// DOMContentLoaded ensures the DOM is fully loaded before running scripts
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