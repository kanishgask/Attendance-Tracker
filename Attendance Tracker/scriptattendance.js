document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');
    const mainApp = document.getElementById('mainApp');
    const authForms = document.querySelector('.auth-forms');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loading = document.getElementById('loading');

    // Navigation Elements
    const navItems = document.querySelectorAll('.sidebar nav ul li:not(#logoutBtn)');
    const sectionContents = document.querySelectorAll('.section-content');

    // Dashboard Elements
    const todayAttendance = document.getElementById('todayAttendance');
    const weekAttendance = document.getElementById('weekAttendance');
    const monthAttendance = document.getElementById('monthAttendance');
    const recentActivityList = document.getElementById('recentActivityList');

    // Attendance Elements
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    const filterDate = document.getElementById('filterDate');
    const clearFilter = document.getElementById('clearFilter');
    const attendanceTable = document.querySelector('#attendanceTable tbody');

    // Reports Elements
    const reportType = document.getElementById('reportType');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const attendanceChart = document.getElementById('attendanceChart');
    const reportData = document.getElementById('reportData');

    // Settings Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const notificationsForm = document.getElementById('notificationsForm');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentNode.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Mock data for demonstration
    let currentUser = null;
    let isCheckedIn = false;
    let lastCheckInTime = null;
    let attendanceChartInstance = null;

    // Sample attendance data
    let attendanceData = [
        { id: 1, date: '2023-06-01', checkIn: '09:00:00', checkOut: '17:00:00', status: 'Present' },
        { id: 2, date: '2023-06-02', checkIn: '08:45:00', checkOut: '17:15:00', status: 'Present' },
        { id: 3, date: '2023-06-03', checkIn: '09:15:00', checkOut: '16:45:00', status: 'Present' },
        { id: 4, date: '2023-06-04', checkIn: null, checkOut: null, status: 'Absent' },
        { id: 5, date: '2023-06-05', checkIn: '10:00:00', checkOut: '16:30:00', status: 'Late' },
        { id: 6, date: '2023-06-06', checkIn: '09:00:00', checkOut: '17:00:00', status: 'Present' },
        { id: 7, date: '2023-06-07', checkIn: '09:00:00', checkOut: null, status: 'Pending' },
    ];

    let activityData = [
        { id: 1, action: 'Checked in', time: 'Today, 09:00 AM' },
        { id: 2, action: 'Checked out', time: 'Yesterday, 05:30 PM' },
        { id: 3, action: 'Checked in', time: 'Yesterday, 08:45 AM' },
        { id: 4, action: 'Updated profile', time: '2 days ago' },
        { id: 5, action: 'Checked out', time: '2 days ago, 05:15 PM' },
    ];

    // Initialize the app
    initApp();

    function initApp() {
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        if (filterDate) filterDate.value = today;
        if (startDate) startDate.value = today;
        if (endDate) endDate.value = today;

        // Check if user is logged in (for demo purposes)
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
            try {
                currentUser = JSON.parse(demoUser);
                showMainApp();
                updateUserInfo();
                loadDashboardData();
                loadAttendanceData();
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('demoUser');
            }
        }
    }

    // Event Listeners
    if (loginBtn) loginBtn.addEventListener('click', () => {
        authForms.style.display = 'flex';
        loginForm.classList.remove('hidden');
    });

    if (registerBtn) registerBtn.addEventListener('click', () => {
        authForms.style.display = 'flex';
        registerForm.classList.remove('hidden');
    });

    if (closeLogin) closeLogin.addEventListener('click', () => {
        authForms.style.display = 'none';
        loginForm.classList.add('hidden');
    });

    if (closeRegister) closeRegister.addEventListener('click', () => {
        authForms.style.display = 'none';
        registerForm.classList.add('hidden');
    });

    if (showRegister) showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    if (showLogin) showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    if (loginFormElement) loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;

        if (email && password) {
            loading.classList.add('active');

            setTimeout(() => {
                currentUser = {
                    id: 1,
                    name: 'Demo User',
                    email: email,
                    avatar: 'https://via.placeholder.com/80'
                };

                localStorage.setItem('demoUser', JSON.stringify(currentUser));
                loading.classList.remove('active');
                authForms.style.display = 'none';
                loginForm.classList.add('hidden');
                showMainApp();
                updateUserInfo();
                loadDashboardData();
                loadAttendanceData();
            }, 2000);
        } else {
            alert('Please enter email and password');
        }
    });

    if (registerFormElement) registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName')?.value;
        const email = document.getElementById('regEmail')?.value;
        const password = document.getElementById('regPassword')?.value;
        const confirmPassword = document.getElementById('regConfirmPassword')?.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (name && email && password) {
            loading.classList.add('active');

            setTimeout(() => {
                currentUser = {
                    id: 2,
                    name: name,
                    email: email,
                    avatar: 'https://via.placeholder.com/80'
                };

                localStorage.setItem('demoUser', JSON.stringify(currentUser));
                loading.classList.remove('active');
                authForms.style.display = 'none';
                registerForm.classList.add('hidden');
                showMainApp();
                updateUserInfo();
                loadDashboardData();
                loadAttendanceData();

                registerFormElement.reset();
            }, 2000);
        } else {
            alert('Please fill all fields');
        }
    });

    // Navigation
    if (navItems) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');

                const section = item.getAttribute('data-section');
                sectionContents.forEach(content => content.classList.add('hidden'));

                const sectionElement = document.getElementById(`${section}Section`);
                if (sectionElement) sectionElement.classList.remove('hidden');

                if (section === 'reports') {
                    generateReport();
                }
            });
        });
    }

    // Tabs in settings
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
                btn.classList.add('active');

                const tab = btn.getAttribute('data-tab');
                tabContents.forEach(content => content.classList.add('hidden'));

                const tabElement = document.getElementById(`${tab}Tab`);
                if (tabElement) tabElement.classList.remove('hidden');
            });
        });
    }

    // Attendance Actions
    if (checkInBtn) checkInBtn.addEventListener('click', () => {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        const dateString = now.toISOString().split('T')[0];

        const newRecord = {
            id: attendanceData.length + 1,
            date: dateString,
            checkIn: timeString,
            checkOut: null,
            status: 'Pending'
        };

        attendanceData.unshift(newRecord);
        isCheckedIn = true;
        lastCheckInTime = now;

        if (checkInBtn) checkInBtn.disabled = true;
        if (checkOutBtn) checkOutBtn.disabled = false;

        loadAttendanceData();
        loadDashboardData();

        activityData.unshift({
            id: activityData.length + 1,
            action: 'Checked in',
            time: 'Just now'
        });

        updateRecentActivity();
    });

    if (checkOutBtn) checkOutBtn.addEventListener('click', () => {
        if (!isCheckedIn) return;

        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];

        const todayRecord = attendanceData.find(record =>
            record.date === new Date().toISOString().split('T')[0] &&
            record.checkIn &&
            !record.checkOut
        );

        if (todayRecord) {
            todayRecord.checkOut = timeString;

            const checkInTime = new Date(`${todayRecord.date}T${todayRecord.checkIn}`);
            const durationMs = now - checkInTime;
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            const checkInHour = parseInt(todayRecord.checkIn.split(':')[0]);
            todayRecord.status = checkInHour > 9 ? 'Late' : 'Present';

            isCheckedIn = false;
            lastCheckInTime = null;

            if (checkInBtn) checkInBtn.disabled = false;
            if (checkOutBtn) checkOutBtn.disabled = true;

            loadAttendanceData();
            loadDashboardData();

            activityData.unshift({
                id: activityData.length + 1,
                action: 'Checked out',
                time: 'Just now'
            });

            updateRecentActivity();
        }
    });

    // Filter attendance by date
    if (filterDate) filterDate.addEventListener('change', loadAttendanceData);
    if (clearFilter) clearFilter.addEventListener('click', () => {
        if (filterDate) filterDate.value = new Date().toISOString().split('T')[0];
        loadAttendanceData();
    });

    // Generate report
    if (generateReportBtn) generateReportBtn.addEventListener('click', generateReport);

    // Profile form
    if (profileForm) profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profileName')?.value;
        const email = document.getElementById('profileEmail')?.value;
        const avatar = document.getElementById('profileAvatar')?.value;

        if (currentUser) {
            currentUser.name = name;
            currentUser.email = email;
            if (avatar) currentUser.avatar = avatar;

            localStorage.setItem('demoUser', JSON.stringify(currentUser));
            updateUserInfo();

            activityData.unshift({
                id: activityData.length + 1,
                action: 'Updated profile',
                time: 'Just now'
            });

            updateRecentActivity();

            alert('Profile updated successfully');
        }
    });

    // Password form
    if (passwordForm) passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match');
            return;
        }

        alert('Password changed successfully');
        if (passwordForm) passwordForm.reset();
    });

    // Notifications form
    if (notificationsForm) notificationsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Notification settings saved');
    });

    // Logout
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('demoUser');
        currentUser = null;
        if (mainApp) mainApp.classList.add('hidden');
        const userControls = document.querySelector('.user-controls');
        if (userControls) userControls.classList.remove('hidden');
    });

    // Helper Functions
    function showMainApp() {
        if (mainApp) mainApp.classList.remove('hidden');
        const userControls = document.querySelector('.user-controls');
        if (userControls) userControls.classList.add('hidden');
    }

    function updateUserInfo() {
        if (currentUser) {
            if (userName) userName.textContent = currentUser.name;
            if (userEmail) userEmail.textContent = currentUser.email;
            if (userAvatar) userAvatar.src = currentUser.avatar;

            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileAvatar = document.getElementById('profileAvatar');

            if (profileName) profileName.value = currentUser.name;
            if (profileEmail) profileEmail.value = currentUser.email;
            if (profileAvatar) profileAvatar.value = currentUser.avatar || '';
        }
    }

    function loadDashboardData() {
        if (!currentUser) return;

        // Today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = attendanceData.find(record => record.date === today);
        if (todayAttendance) {
            todayAttendance.textContent = todayRecord ?
                (todayRecord.checkIn ? 'Present' : 'Absent') :
                'Absent';
        }

        // This week's attendance
        const weekCount = attendanceData.filter(record => {
            const recordDate = new Date(record.date);
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            return recordDate >= startOfWeek && record.status === 'Present';
        }).length;

        if (weekAttendance) weekAttendance.textContent = weekCount;

        // This month's attendance
        const currentMonth = new Date().getMonth();
        const monthCount = attendanceData.filter(record => {
            const recordMonth = new Date(record.date).getMonth();
            return recordMonth === currentMonth && record.status === 'Present';
        }).length;

        if (monthAttendance) monthAttendance.textContent = monthCount;

        updateRecentActivity();
    }

    function updateRecentActivity() {
        if (!recentActivityList) return;

        recentActivityList.innerHTML = '';
        activityData.slice(0, 5).forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `
                        <span>${activity.action}</span>
                        <span class="activity-time">${activity.time}</span>
                    `;
            recentActivityList.appendChild(li);
        });
    }

    function loadAttendanceData() {
        if (!attendanceTable) return;

        attendanceTable.innerHTML = '';

        const filterValue = filterDate ? filterDate.value : null;
        const filteredData = filterValue ?
            attendanceData.filter(record => record.date === filterValue) :
            attendanceData;

        filteredData.forEach(record => {
            const row = document.createElement('tr');

            // Format date
            const date = new Date(record.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Calculate duration
            let duration = '-';
            if (record.checkIn && record.checkOut) {
                const checkInTime = new Date(`${record.date}T${record.checkIn}`);
                const checkOutTime = new Date(`${record.date}T${record.checkOut}`);
                const diffMs = checkOutTime - checkInTime;
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                duration = `${diffHours}h ${diffMinutes}m`;
            }

            // Determine row class based on status
            let statusClass = '';
            switch (record.status) {
                case 'Present': statusClass = 'present'; break;
                case 'Late': statusClass = 'late'; break;
                case 'Absent': statusClass = 'absent'; break;
                case 'Pending': statusClass = 'pending'; break;
            }

            row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${record.checkIn || '-'}</td>
                        <td>${record.checkOut || '-'}</td>
                        <td>${duration}</td>
                        <td class="${statusClass}">${record.status}</td>
                    `;

            attendanceTable.appendChild(row);
        });
    }

    function generateReport() {
        try {
            if (!attendanceChart || typeof Chart === 'undefined') return;

            // Destroy previous chart instance if exists
            if (attendanceChartInstance) {
                attendanceChartInstance.destroy();
            }

            // Sample report data
            const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const presentData = [1, 1, 1, 0, 1, 0, 0];
            const absentData = [0, 0, 0, 1, 0, 0, 0];
            const lateData = [0, 0, 0, 0, 0, 0, 0];

            const ctx = attendanceChart.getContext('2d');
            attendanceChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Present',
                            data: presentData,
                            backgroundColor: '#00d9ff',
                        },
                        {
                            label: 'Late',
                            data: lateData,
                            backgroundColor: '#ffa502',
                        },
                        {
                            label: 'Absent',
                            data: absentData,
                            backgroundColor: '#ff4757',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            max: 7
                        }
                    }
                }
            });

            if (reportData) {
                reportData.innerHTML = `
                            <h4>Attendance Summary</h4>
                            <p>Total Present: ${presentData.reduce((a, b) => a + b, 0)} days</p>
                            <p>Total Late: ${lateData.reduce((a, b) => a + b, 0)} days</p>
                            <p>Total Absent: ${absentData.reduce((a, b) => a + b, 0)} days</p>
                        `;
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    }
});