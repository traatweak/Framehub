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

        navItems.forEach(nav => nav.classList.remove('active'));

        this.classList.add('active');

        const pageToShow = this.getAttribute('data-page');

        pages.forEach(page => page.classList.remove('active'));

        document.getElementById(pageToShow).classList.add('active');

        // Re-filter modules/apps when switching pages
        if (pageToShow === 'home-page') {
            filterModules();
        } else if (pageToShow === 'apps-page') {
            filterApps();
        }
    });
});

function showNotification(moduleName) {
    notificationText.textContent = `"${moduleName}" is being downloaded...`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function simulateAndTriggerDownload(button, moduleName, downloadUrl) {
    const progress = button.querySelector('.progress');
    button.disabled = true;
    button.style.opacity = 0.8;

    let width = 0;
    const interval = setInterval(() => {
        width += 10;
        progress.style.width = `${width}%`;

        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                button.disabled = false;
                button.style.opacity = 1;
                progress.style.width = '0%';

                if (downloadUrl) {
                    window.open(downloadUrl, '_blank');
                }

            }, 300);
        }
    }, 50);
}

downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        const moduleName = this.getAttribute('data-module');
        const downloadUrl = this.getAttribute('data-download-url');
        simulateAndTriggerDownload(this, moduleName, downloadUrl);
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
        bubbleElement.style.animation = 'none';
        void bubbleElement.offsetWidth;
        bubbleElement.style.animation = null;
    }
}

function filterModules() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeTagElement = document.querySelector('#home-page .tag.active');
    const activeCategory = activeTagElement ? activeTagElement.getAttribute('data-category') : 'all';

    let hasVisibleRegularCards = false;

    allModuleCards.forEach(card => {
        card.classList.add('hidden');
    });

    if (activeCategory === 'pemberitahuan') {
        notificationModuleCard.classList.remove('hidden');
        noResultsMessage.style.display = 'none';
    } else {
        const regularModuleCards = Array.from(allModuleCards).filter(c =>
            c.id !== 'notificationModuleCard'
        );

        regularModuleCards.forEach(card => {
            const titleElement = card.querySelector('.module-title');
            const titleText = titleElement.childNodes[0].textContent.toLowerCase().trim();
            const moduleCategories = card.getAttribute('data-category').split(' ').map(cat => cat.trim());

            const matchesSearchTerm = titleText.includes(searchTerm);

            const matchesInitialCharacters = (searchTerm.length > 0 && searchTerm.length <= 5)
                                             ? titleText.startsWith(searchTerm)
                                             : true;

            let matchesTag = false;

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

        if (!hasVisibleRegularCards && searchTerm !== '') {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

tags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.preventDefault();

        tags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const currentActiveCategory = this.getAttribute('data-category');

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

        if (currentActiveCategory !== 'pemberitahuan') {
             searchInput.value = '';
        }

        filterModules();
    });
});

searchInput.addEventListener('input', filterModules);

// --- Apps Page Filtering Logic ---
function filterApps() {
    const searchTerm = appSearchInput.value.toLowerCase().trim();
    const activeTagElement = document.querySelector('#apps-page .tag.active');
    const activeCategory = activeTagElement ? activeTagElement.getAttribute('data-category') : 'all';

    let hasVisibleApps = false;

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

    if (!hasVisibleApps && searchTerm !== '') {
        noAppResultsMessage.style.display = 'block';
    } else {
        noAppResultsMessage.style.display = 'none';
    }
}

appSearchTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.preventDefault();
        appSearchTags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        appSearchInput.value = '';
        filterApps();
    });
});

appSearchInput.addEventListener('input', filterApps);

document.addEventListener('DOMContentLoaded', () => {
    const currentActiveTagHome = document.querySelector('#home-page .tag.active');
    if (!currentActiveTagHome) {
        document.querySelector('#home-page .tag[data-category="all"]').classList.add('active');
    }
    filterModules();
    showBubble(latestNotificationBubble);
    showBubble(notificationBubble);

    const currentActiveTagApps = document.querySelector('#apps-page .tag.active');
    if (!currentActiveTagApps) {
        document.querySelector('#apps-page .tag[data-category="all"]').classList.add('active');
    }
    filterApps();

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const moduleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    allModuleCards.forEach(card => {
        if (!card.classList.contains('notification-card')) {
            moduleObserver.observe(card);
        }
    });

    allAppCards.forEach(card => {
        moduleObserver.observe(card);
    });

    const originalFilterModules = filterModules;
    filterModules = () => {
        originalFilterModules();
        allModuleCards.forEach(card => {
            if (!card.classList.contains('notification-card')) {
                card.classList.remove('show');
                if (!card.classList.contains('hidden')) {
                    const rect = card.getBoundingClientRect();
                    const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
                    if (isVisible) {
                        card.classList.add('show');
                    } else {
                        moduleObserver.unobserve(card);
                        moduleObserver.observe(card);
                    }
                } else if (card.classList.contains('hidden')) {
                    moduleObserver.unobserve(card);
                }
            }
        });
    };

    const originalFilterApps = filterApps;
    filterApps = () => {
        originalFilterApps();
        allAppCards.forEach(card => {
            card.classList.remove('show');
            if (!card.classList.contains('hidden')) {
                const rect = card.getBoundingClientRect();
                const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
                if (isVisible) {
                    card.classList.add('show');
                } else {
                    moduleObserver.unobserve(card);
                    moduleObserver.observe(card);
                }
            } else if (card.classList.contains('hidden')) {
                moduleObserver.unobserve(card);
            }
        });
    };
});