class HabitTracker {
    constructor() {
        this.currentDate = new Date();
        this.currentYear = this.currentDate.getFullYear(); // Текущий год для мини-календарей
        this.data = this.loadData();
        this.chart = null;
        this.motivations = [
            "Каждый день кода делает тебя лучше! 💻",
            "Сегодняшний код - завтрашний успех! 🚀",
            "Ошибки - это ступеньки к мастерству! 🔧",
            "Учись сегодня, создавай завтра! 🌟",
            "Каждая функция приближает к цели! ⚡",
            "Код - это суперсилка программиста! 🦸",
            "Отлаживай проблемы, а не мечты! 🐛",
            "Компилируй мечты в реальность! 💫",
            "Сегодня идея, завтра - приложение! 📱",
            "Программирование - это магия XXI века! 🧙",
            "Каждая строчка кода - инвестиция в себя! 💰",
            "Учись, пробуй, ошибайся, становись сильнее! 💪",
            "Код сегодня - возможности завтра! 🎯",
            "Терпение и код победят всё! 🏆",
            "Разработчик создаёт будущее! 🔮"
        ];
        this.init();
    }

    init() {
        this.renderCalendar();
        this.setupEventListeners();
        this.updateStats();
        this.renderChart();
        this.renderYearCalendars();
        this.showRandomMotivation();
        setInterval(() => this.showRandomMotivation(), 10000);
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const monthYear = document.getElementById('current-month');
        
        calendar.innerHTML = '';
        
        monthYear.textContent = this.currentDate.toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric'
        });
        
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-header';
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        });
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendar.appendChild(emptyDay);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerHTML = `<span class="day-number">${day}</span>`;
            
            const dateKey = this.getDateKey(day);
            const cellDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            cellDate.setHours(0, 0, 0, 0);
            
            if (cellDate.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            } else if (cellDate < today) {
                dayElement.classList.add('past');
            } else {
                dayElement.classList.add('future');
            }
            
            if (this.data[dateKey]) {
                dayElement.classList.add('checked');
            }
            
            if (cellDate >= today) {
                dayElement.addEventListener('click', () => this.toggleDay(day));
            }
            
            calendar.appendChild(dayElement);
        }
    }

    renderYearCalendars() {
        const yearCalendars = document.getElementById('year-calendars');
        const currentYearElement = document.getElementById('current-year');
        
        yearCalendars.innerHTML = '';
        currentYearElement.textContent = `${this.currentYear} год`;
        
        for (let month = 0; month < 12; month++) {
            const monthElement = document.createElement('div');
            monthElement.className = 'year-month';
            
            // Заголовок месяца
            const monthHeader = document.createElement('div');
            monthHeader.className = 'year-month-header';
            const monthDate = new Date(this.currentYear, month, 1);
            monthHeader.textContent = monthDate.toLocaleDateString('ru-RU', {
                month: 'long'
            });
            monthElement.appendChild(monthHeader);
            
            // Мини-календарь
            const monthCalendar = document.createElement('div');
            monthCalendar.className = 'year-month-calendar';
            
            // Заголовки дней недели
            const daysOfWeek = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];
            daysOfWeek.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'year-day-header';
                dayHeader.textContent = day;
                monthCalendar.appendChild(dayHeader);
            });
            
            // Дни месяца
            const firstDay = new Date(this.currentYear, month, 1);
            const lastDay = new Date(this.currentYear, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
            
            // Пустые ячейки для начала месяца
            for (let i = 0; i < startingDayOfWeek; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'year-day empty';
                monthCalendar.appendChild(emptyDay);
            }
            
            // Дни месяца
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'year-day';
                dayElement.textContent = day;
                
                const dateKey = `${this.currentYear}-${month + 1}-${day}`;
                if (this.data[dateKey]) {
                    dayElement.classList.add('checked');
                }
                
                monthCalendar.appendChild(dayElement);
            }
            
            monthElement.appendChild(monthCalendar);
            yearCalendars.appendChild(monthElement);
        }
    }

    showRandomMotivation() {
        const motivationElement = document.getElementById('motivation-text');
        const randomIndex = Math.floor(Math.random() * this.motivations.length);
        motivationElement.textContent = this.motivations[randomIndex];
        
        motivationElement.style.opacity = '0';
        setTimeout(() => {
            motivationElement.style.transition = 'opacity 0.5s ease';
            motivationElement.style.opacity = '1';
        }, 100);
    }

    renderChart() {
        const ctx = document.getElementById('progress-chart').getContext('2d');
        
        const chartData = this.getMonthData();
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Дни учебы',
                    data: chartData.values,
                    backgroundColor: chartData.colors,
                    borderColor: '#764ba2',
                    borderWidth: 1,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return value === 1 ? '✓' : '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y === 1 ? 'Занимался учебой' : 'Не занимался';
                            }
                        }
                    }
                }
            }
        });

        document.getElementById('chart-title').textContent = 
            `Прогресс за ${this.currentDate.toLocaleDateString('ru-RU', { month: 'long' })}`;
    }

    getMonthData() {
        const labels = [];
        const values = [];
        const colors = [];
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = this.getDateKey(day);
            const cellDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            
            labels.push(day);
            values.push(this.data[dateKey] ? 1 : 0);
            
            if (this.data[dateKey]) {
                colors.push('#4CAF50');
            } else if (cellDate < today) {
                colors.push('#ff6b6b');
            } else {
                colors.push('#667eea');
            }
        }
        
        return { labels, values, colors };
    }

    toggleDay(day) {
        const dateKey = this.getDateKey(day);
        const cellDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (cellDate < today) {
            return;
        }
        
        if (this.data[dateKey]) {
            delete this.data[dateKey];
        } else {
            this.data[dateKey] = true;
        }
        
        this.saveData();
        this.renderCalendar();
        this.updateStats();
        this.renderChart();
        this.renderYearCalendars();
    }

    getDateKey(day) {
        return `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}`;
    }

    updateStats() {
        const currentMonthData = Object.keys(this.data).filter(key => {
            const [year, month] = key.split('-').map(Number);
            return year === this.currentDate.getFullYear() && month === this.currentDate.getMonth() + 1;
        });
        
        const daysDone = currentMonthData.length;
        document.getElementById('days-done').textContent = daysDone;
    }

    setupEventListeners() {
        // Переключение месяцев основного календаря
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updateStats();
            this.renderChart();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updateStats();
            this.renderChart();
        });

        // Переключение годов для мини-календарей
        document.getElementById('prev-year').addEventListener('click', () => {
            this.currentYear--;
            this.renderYearCalendars();
        });
        
        document.getElementById('next-year').addEventListener('click', () => {
            this.currentYear++;
            this.renderYearCalendars();
        });
        
        document.getElementById('reset-month').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите сбросить все отметки за этот месяц?')) {
                this.resetCurrentMonth();
            }
        });
        
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });
    }

    resetCurrentMonth() {
        Object.keys(this.data).forEach(key => {
            const [year, month] = key.split('-').map(Number);
            if (year === this.currentDate.getFullYear() && month === this.currentDate.getMonth() + 1) {
                delete this.data[key];
            }
        });
        this.saveData();
        this.renderCalendar();
        this.updateStats();
        this.renderChart();
        this.renderYearCalendars();
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `habit-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    loadData() {
        const saved = localStorage.getItem('habitTrackerData');
        return saved ? JSON.parse(saved) : {};
    }

    saveData() {
        localStorage.setItem('habitTrackerData', JSON.stringify(this.data));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});