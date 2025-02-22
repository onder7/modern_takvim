document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'tr',
        firstDay: 1,
        events: function(info, successCallback) {
            const year = info.start.getFullYear();
            let events = [];

            // 1. Resmi tatilleri ekle
            if (officialHolidaysData[year]) {
                officialHolidaysData[year].forEach(holiday => {
                    const [day, month, year] = holiday.date.split('-');
                    events.push({
                        title: holiday.name,
                        start: `${year}-${month}-${day}`,
                        className: `holiday ${holiday.info.includes('Dini') ? 'religious' : 'national'}`,
                        extendedProps: {
                            type: 'holiday',
                            duration: holiday.duration,
                            info: holiday.info
                        }
                    });
                });
            }

            // 2. Yıllık özel günleri ekle
            specialDaysAndWeeks.annual.forEach(event => {
                if (event.date.type === 'dynamic') {
                    // Dinamik tarihli günler (Anneler/Babalar günü)
                    const dynamicDate = calculateDynamicDate(event.date.rule, year);
                    if (dynamicDate) {
                        events.push({
                            title: event.name,
                            start: dynamicDate,
                            className: `special-day ${event.category}`,
                            extendedProps: {
                                type: event.type,
                                info: event.info
                            }
                        });
                    }
                } else if (event.date.start && event.date.end) {
                    // Özel haftalar
                    const [startDay, startMonth] = event.date.start.split('-');
                    const [endDay, endMonth] = event.date.end.split('-');
                    events.push({
                        title: event.name,
                        start: `${year}-${startMonth}-${startDay}`,
                        end: `${year}-${endMonth}-${endDay}`,
                        className: `special-week ${event.category}`,
                        extendedProps: {
                            type: event.type,
                            info: event.info
                        }
                    });
                } else {
                    // Normal özel günler
                    const [day, month] = event.date.split('-');
                    events.push({
                        title: event.name,
                        start: `${year}-${month}-${day}`,
                        className: `special-day ${event.category}`,
                        extendedProps: {
                            type: event.type,
                            info: event.info
                        }
                    });
                }
            });

            // 3. Yıla özel dini günleri ekle
            if (specialDaysAndWeeks[year]) {
                specialDaysAndWeeks[year].forEach(event => {
                    if (event.date.start && event.date.end) {
                        // Muharrem ayı gibi uzun süreli dini dönemler
                        const [startDay, startMonth, startYear] = event.date.start.split('-');
                        const [endDay, endMonth, endYear] = event.date.end.split('-');
                        events.push({
                            title: event.name,
                            start: `${startYear}-${startMonth}-${startDay}`,
                            end: `${endYear}-${endMonth}-${endDay}`,
                            className: `religious-period ${event.category}`,
                            extendedProps: {
                                type: event.type,
                                info: event.info
                            }
                        });
                    } else {
                        // Kandil geceleri ve diğer dini günler
                        const [day, month, year] = event.date.split('-');
                        events.push({
                            title: event.name,
                            start: `${year}-${month}-${day}`,
                            className: `religious-day ${event.category}`,
                            extendedProps: {
                                type: event.type,
                                info: event.info
                            }
                        });
                    }
                });
            }

            successCallback(events);
        },
        eventDidMount: function(info) {
            // Tooltip oluştur
            const tooltip = document.createElement('div');
            tooltip.className = 'event-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-title">${info.event.title}</div>
                ${info.event.extendedProps.duration ? 
                    `<div class="tooltip-duration">${info.event.extendedProps.duration}</div>` : ''}
                <div class="tooltip-info">${info.event.extendedProps.info}</div>
            `;
            info.el.appendChild(tooltip);
        }
    });

    calendar.render();

    // Dinamik tarihleri hesapla
    function calculateDynamicDate(rule, year) {
        const rules = {
            "Mayıs ayının ikinci Pazar günü": () => {
                let date = new Date(year, 4, 1);
                let sundayCount = 0;
                while (sundayCount < 2) {
                    if (date.getDay() === 0) sundayCount++;
                    if (sundayCount < 2) date.setDate(date.getDate() + 1);
                }
                return date.toISOString().split('T')[0];
            },
            "Haziran ayının üçüncü Pazar günü": () => {
                let date = new Date(year, 5, 1);
                let sundayCount = 0;
                while (sundayCount < 3) {
                    if (date.getDay() === 0) sundayCount++;
                    if (sundayCount < 3) date.setDate(date.getDate() + 1);
                }
                return date.toISOString().split('T')[0];
            }
        };
        return rules[rule] ? rules[rule]() : null;
    }

    // Yıl seçiciyi ayarla
    setupYearSelector();

    function setupYearSelector() {
        const yearSelector = document.getElementById('yearSelector');
        const years = [...new Set([
            ...Object.keys(officialHolidaysData),
            ...Object.keys(specialDaysAndWeeks).filter(y => y !== 'annual')
        ])].sort();

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelector.appendChild(option);
        });

        yearSelector.value = new Date().getFullYear().toString();
        
        yearSelector.addEventListener('change', function(e) {
            calendar.gotoDate(`${e.target.value}-01-01`);
            calendar.refetchEvents();
        });
    }
});