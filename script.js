document.addEventListener('DOMContentLoaded', function() {
    const REGULAR_LAST_DAY = new Date('June 13, 2025 14:20:00');
    const SENIOR_LAST_DAY = new Date('June 8, 2025 14:20:00');
    const EXAMS_START_DAY = new Date('June 10, 2025 08:00:00');
    const SCHOOL_YEAR_START = new Date('September 3, 2024 08:00:00');
    const SCHOOL_START_TIME = 8;
    const SCHOOL_END_TIME = 14 + (20/60);

    const seniorToggle = document.getElementById('seniorToggle');
    const lastDayTitle = document.getElementById('lastDayTitle');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const schoolDaysElement = document.getElementById('schoolDays');
    const schoolHoursElement = document.getElementById('schoolHours');
    const schoolMinutesElement = document.getElementById('schoolMinutes');
    const schoolSecondsElement = document.getElementById('schoolSeconds');
    const schoolDaysTotalElement = document.getElementById('schoolDaysTotal');
    const weekendsElement = document.getElementById('weekends');
    const examDaysElement = document.getElementById('examDays');
    const examHoursElement = document.getElementById('examHours');
    const examMinutesElement = document.getElementById('examMinutes');
    const examSecondsElement = document.getElementById('examSeconds');
    const yearProgressElement = document.getElementById('yearProgress');
    const progressPercentElement = document.getElementById('progressPercent');

    let targetDate = REGULAR_LAST_DAY;
    updateLastDayTitle();

    seniorToggle.addEventListener('change', function() {
        targetDate = this.checked ? SENIOR_LAST_DAY : REGULAR_LAST_DAY;
        updateLastDayTitle();
    });

    function updateLastDayTitle() {
        const isSenior = seniorToggle.checked;
        lastDayTitle.textContent = isSenior 
            ? "Senior Last Day: June 8th, 2025" 
            : "Last Day of School: June 13th, 2025";
    }

    function updateCountdowns() {
        updateLastDayCountdown();
        updateSchoolHoursCountdown();
        updateSchoolDaysTotal();
        updateWeekendsCountdown();
        updateExamsCountdown();
        updateYearProgress();
    }

    function updateLastDayCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            daysElement.textContent = "0";
            hoursElement.textContent = "0";
            minutesElement.textContent = "0";
            secondsElement.textContent = "0";
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysElement.textContent = days;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
    }

    function updateSchoolHoursCountdown() {
        const now = new Date();
        const targetDay = seniorToggle.checked ? SENIOR_LAST_DAY : REGULAR_LAST_DAY;
        
        if (now >= targetDay) {
            schoolDaysElement.textContent = "0";
            schoolHoursElement.textContent = "0";
            schoolMinutesElement.textContent = "0";
            schoolSecondsElement.textContent = "0";
            return;
        }
        
        let schoolDaysRemaining = 0;
        let totalSchoolSecondsRemaining = 0;
        
        const currentDate = new Date(now);
        const endDate = new Date(targetDay);
        
        currentDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                schoolDaysRemaining++;
                
                if (currentDate.getTime() === new Date(now).setHours(0, 0, 0, 0)) {
                    const currentHour = now.getHours() + (now.getMinutes() / 60);
                    
                    if (currentHour >= SCHOOL_START_TIME && currentHour < SCHOOL_END_TIME) {
                        const remainingHoursToday = SCHOOL_END_TIME - currentHour;
                        totalSchoolSecondsRemaining += (remainingHoursToday * 3600);
                        if (now.getSeconds() > 0) {
                            totalSchoolSecondsRemaining -= now.getSeconds();
                        }
                    } 
                    else if (currentHour < SCHOOL_START_TIME) {
                        const schoolHoursToday = SCHOOL_END_TIME - SCHOOL_START_TIME;
                        totalSchoolSecondsRemaining += schoolHoursToday * 3600;
                    }
                } else {
                    const schoolHoursPerDay = SCHOOL_END_TIME - SCHOOL_START_TIME;
                    totalSchoolSecondsRemaining += schoolHoursPerDay * 3600;
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        const totalSeconds = Math.floor(totalSchoolSecondsRemaining);
        const schoolHoursPerDay = (SCHOOL_END_TIME - SCHOOL_START_TIME) * 3600;
        const days = Math.floor(totalSeconds / schoolHoursPerDay);
        const hours = Math.floor((totalSeconds % schoolHoursPerDay) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        schoolDaysElement.textContent = days;
        schoolHoursElement.textContent = hours;
        schoolMinutesElement.textContent = minutes;
        schoolSecondsElement.textContent = seconds;
    }

    function updateSchoolDaysTotal() {
        const now = new Date();
        const targetDay = seniorToggle.checked ? SENIOR_LAST_DAY : REGULAR_LAST_DAY;
        
        if (now >= targetDay) {
            schoolDaysTotalElement.textContent = "0";
            return;
        }
        
        const holidays = [
            new Date('January 1, 2025'),
            new Date('January 20, 2025'),
            new Date('February 17, 2025'),
            new Date('April 18, 2025'),
            new Date('May 26, 2025'),
        ];
        
        let schoolDaysCount = 0;
        
        const currentDate = new Date(now);
        const endDate = new Date(targetDay);
        
        currentDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        const currentHour = now.getHours() + (now.getMinutes() / 60);
        if (currentHour >= SCHOOL_END_TIME) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                const isHoliday = holidays.some(holiday => 
                    holiday.getDate() === currentDate.getDate() && 
                    holiday.getMonth() === currentDate.getMonth() && 
                    holiday.getFullYear() === currentDate.getFullYear()
                );
                
                if (!isHoliday) {
                    schoolDaysCount++;
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        schoolDaysTotalElement.textContent = schoolDaysCount;
    }

    function updateWeekendsCountdown() {
        const now = new Date();
        const targetDay = seniorToggle.checked ? SENIOR_LAST_DAY : REGULAR_LAST_DAY;
        
        if (now >= targetDay) {
            weekendsElement.textContent = "0";
            return;
        }
        
        let weekendsRemaining = 0;
        
        const currentDate = new Date(now);
        const endDate = new Date(targetDay);
        
        const dayOfWeek = currentDate.getDay();
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const daysUntilSaturday = 6 - dayOfWeek;
            currentDate.setDate(currentDate.getDate() + daysUntilSaturday);
        } 
        else if (dayOfWeek === 0) {
            currentDate.setDate(currentDate.getDate() + 6);
        }
        
        currentDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        while (currentDate < endDate) {
            weekendsRemaining++;
            currentDate.setDate(currentDate.getDate() + 7);
        }
        
        weekendsElement.textContent = weekendsRemaining;
    }

    function updateExamsCountdown() {
        const now = new Date();
        const difference = EXAMS_START_DAY - now;
        
        if (difference <= 0) {
            examDaysElement.textContent = "0";
            examHoursElement.textContent = "0";
            examMinutesElement.textContent = "0";
            examSecondsElement.textContent = "0";
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        examDaysElement.textContent = days;
        examHoursElement.textContent = hours;
        examMinutesElement.textContent = minutes;
        examSecondsElement.textContent = seconds;
    }
    
    function updateYearProgress() {
        const now = new Date();
        const targetDay = seniorToggle.checked ? SENIOR_LAST_DAY : REGULAR_LAST_DAY;
        
        const totalDuration = targetDay - SCHOOL_YEAR_START;
        const elapsed = now - SCHOOL_YEAR_START;
        
        let percentage = (elapsed / totalDuration) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        
        const roundedPercentage = Math.round(percentage * 10) / 10;
        
        yearProgressElement.style.width = percentage + '%';
        progressPercentElement.textContent = roundedPercentage;
    }

    updateCountdowns();
    setInterval(updateCountdowns, 1000);
});
