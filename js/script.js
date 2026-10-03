document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. Theme Switcher (LocalStorage persistence) */
    const themeBtn = document.getElementById('theme-switch');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('campusTheme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.className = prefersDark ? 'theme-dark' : 'theme-light';
    }

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('theme-light')) {
            body.classList.replace('theme-light', 'theme-dark');
            localStorage.setItem('campusTheme', 'theme-dark');
        } else {
            body.classList.replace('theme-dark', 'theme-light');
            localStorage.setItem('campusTheme', 'theme-light');
        }
    });

    /* 2. Dynamic Greeting & 3. Current Date/Time */
    const timeDisplay = document.getElementById('current-datetime');
    const greetingEl = document.getElementById('dynamic-greeting');

    function updateTimeAndGreeting() {
        const now = new Date();
        
        // Time format: 14:30 | Oct 12, 2026
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        timeDisplay.textContent = `${timeStr} | ${dateStr}`;

        // Greeting
        const hour = now.getHours();
        let greeting = "Good evening";
        if (hour < 12) greeting = "Good morning";
        else if (hour < 17) greeting = "Good afternoon";
        
        greetingEl.textContent = greeting;
    }

    setInterval(updateTimeAndGreeting, 1000);
    updateTimeAndGreeting();

    /* 4. Search / Filter */
    const searchInput = document.getElementById('global-search');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const searchableItems = document.querySelectorAll('.searchable-item');
        
        searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    /* 5. Expand/Collapse Announcements */
    const toggleAnnouncementsBtn = document.getElementById('toggle-announcements');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('expanded');
        });
    });

    toggleAnnouncementsBtn.addEventListener('click', () => {
        const items = document.querySelectorAll('.accordion-item');
        const isAnyExpanded = Array.from(items).some(item => item.classList.contains('expanded'));
        
        items.forEach(item => {
            if (isAnyExpanded) {
                item.classList.remove('expanded');
                toggleAnnouncementsBtn.textContent = "Expand All";
            } else {
                item.classList.add('expanded');
                toggleAnnouncementsBtn.textContent = "Collapse All";
            }
        });
    });

    /* 6. Notification Counter */
    const notifCard = document.getElementById('notif-card');
    const cardBadge = document.getElementById('card-notif-badge');
    const navBadge = document.getElementById('nav-notif-badge');
    
    notifCard.addEventListener('click', () => {
        // Simulate reading notifications
        let current = parseInt(cardBadge.textContent);
        if (current > 0) {
            current--;
            cardBadge.textContent = current;
            navBadge.textContent = current;
            
            if (current === 0) {
                navBadge.style.display = 'none';
            }
        }
    });

    /* 7. Show/Hide Sections (Removed for Lab 2 Assignments) */


    /* 8. Mobile Sidebar Toggle */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.querySelector('.sidebar');

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    /* 9. Tab Switching Logic */
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const views = document.querySelectorAll('.view-section');
    const quickServiceBtns = document.querySelectorAll('.service-btn');

    function switchTab(tabName) {
        // Remove active class from all nav items
        navItems.forEach(nav => {
            nav.classList.remove('active');
            // If the nav item matches the tab name, make it active
            const navText = nav.textContent.trim().toLowerCase();
            if (navText.includes(tabName)) {
                nav.classList.add('active');
            }
        });

        // Hide all views, show the target one
        views.forEach(view => {
            view.classList.add('hidden');
        });
        const targetView = document.getElementById(`view-${tabName}`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            let tabName = item.textContent.trim().toLowerCase();
            // Handle notifications which has a badge
            if (tabName.includes('notifications')) {
                tabName = 'notifications';
            }
            switchTab(tabName);
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    quickServiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab('services');
        });
    });

    // --- LAB 2: REST API Integration ---

    async function fetchStudentProfile() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            
            const profileContainer = document.getElementById('view-profile');
            if (profileContainer) {
                profileContainer.innerHTML = `
                    <section class="welcome-section fade-in">
                        <div class="welcome-text"><h1 class="page-title">Student Profile</h1><p class="caption">Manage your personal information.</p></div>
                    </section>
                    <div class="card bento-item fade-in" style="margin-top:2rem; padding: 2rem; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div class="avatar profile-ac" style="width: 64px; height: 64px; font-size: 24px;">${data.name.charAt(0)}</div>
                            <div>
                                <h2 style="margin:0">${data.name}</h2>
                                <p class="caption">@${data.username}</p>
                            </div>
                        </div>
                        <hr style="border:1px solid var(--border-color); margin: 1rem 0;">
                        <p style="margin-bottom: 0.5rem;"><strong><i data-lucide="mail" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"></i> Email:</strong> ${data.email}</p>
                        <p><strong><i data-lucide="phone" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"></i> Phone:</strong> ${data.phone}</p>
                    </div>
                `;
                if(window.lucide) lucide.createIcons();
            }
        } catch (error) {
            console.error(error);
            const profileContainer = document.getElementById('view-profile');
            if (profileContainer) profileContainer.innerHTML += `<div class="card bento-item fade-in" style="margin-top:2rem; padding: 2rem; color:red; text-align:center;">Unable to load profile data. Please try again.</div>`;
        }
    }

    async function fetchAnnouncements() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            
            const container = document.getElementById('announcements-container');
            if (container) {
                container.innerHTML = ''; // clear mock data
                data.forEach(post => {
                    const html = `
                        <div class="accordion-item searchable-item">
                            <button class="accordion-header">
                                <span class="announcement-title">${post.title}</span>
                                <i data-lucide="chevron-down" class="chevron"></i>
                            </button>
                            <div class="accordion-content">
                                <p>${post.body}</p>
                            </div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', html);
                });

                // Re-attach accordion events for new elements
                const accordionHeaders = container.querySelectorAll('.accordion-header');
                accordionHeaders.forEach(header => {
                    header.addEventListener('click', () => {
                        const item = header.parentElement;
                        item.classList.toggle('expanded');
                    });
                });
                if(window.lucide) lucide.createIcons();
            }
        } catch (error) {
            console.error(error);
            const container = document.getElementById('announcements-container');
            if (container) container.innerHTML = `<div style="padding:1rem; color:red;">Unable to load announcements. Please try again.</div>`;
        }
    }

    let allAssignments = [];
    async function fetchAssignments() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?userId=1&_limit=5");
            if (!response.ok) throw new Error("API request failed");
            allAssignments = await response.json();
            renderAssignments(allAssignments);
        } catch (error) {
            console.error(error);
            const container = document.getElementById('assignments-container');
            if (container) container.innerHTML = `<div style="padding:1rem; color:red;">Unable to load assignments. Please try again.</div>`;
        }
    }

    function renderAssignments(assignments) {
        const container = document.getElementById('assignments-container');
        if (!container) return;
        container.innerHTML = '';
        if(assignments.length === 0) {
            container.innerHTML = '<div style="padding: 1rem; color: var(--text-secondary);">No assignments found.</div>';
            return;
        }
        assignments.forEach(todo => {
            const statusBadge = todo.completed ? '<span class="status-badge success">Completed</span>' : '<span class="status-badge pending">Pending</span>';
            const html = `
                <div class="event-item searchable-item" style="display:flex; justify-content: space-between; align-items:center; border-bottom:1px solid var(--border-color); padding: 0.75rem 0;">
                    <div class="event-details" style="flex:1;">
                        <h4 class="event-title" style="margin:0; text-transform: capitalize;">${todo.title}</h4>
                    </div>
                    <div style="margin-left: 1rem;">${statusBadge}</div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    // Assignment Filter Event Listeners
    const btnFilterAll = document.getElementById('filter-all');
    const btnFilterCompleted = document.getElementById('filter-completed');
    const btnFilterPending = document.getElementById('filter-pending');

    if(btnFilterAll) btnFilterAll.addEventListener('click', () => renderAssignments(allAssignments));
    if(btnFilterCompleted) btnFilterCompleted.addEventListener('click', () => renderAssignments(allAssignments.filter(a => a.completed)));
    if(btnFilterPending) btnFilterPending.addEventListener('click', () => renderAssignments(allAssignments.filter(a => !a.completed)));

    // Initialize API calls
    fetchStudentProfile();
    fetchAnnouncements();
    fetchAssignments();
});
