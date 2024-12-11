document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');

    // Function to fetch and parse ICS data
    async function fetchICSData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error fetching ICS file: ${response.status} ${response.statusText}`);
                return [];
            }
            const icsData = await response.text();
            console.log("Fetched ICS Data:", icsData); // Debugging: Log the fetched ICS data
            return parseICS(icsData);
        } catch (error) {
            console.error("Error fetching or parsing ICS file:", error);
            return [];
        }
    }

    // Function to parse ICS data into events
    function parseICS(icsData) {
        const events = [];
        const lines = icsData.split(/\r?\n/);
        let event = null;

        lines.forEach(line => {
            if (line.startsWith('BEGIN:VEVENT')) {
                event = {};
            } else if (line.startsWith('END:VEVENT')) {
                if (event.start && event.end && event.summary) {
                    events.push({
                        title: event.summary,
                        start: event.start,
                        end: event.end,
                        allDay: true,
                    });
                }
                event = null;
            } else if (event) {
                const [key, value] = line.split(/:(.+)/);
                if (key === 'SUMMARY') event.summary = value;
                if (key === 'DTSTART') event.start = parseICSDate(value);
                if (key === 'DTEND') event.end = parseICSDate(value);
            }
        });

        console.log("Parsed Events:", events); // Debugging: Log parsed events
        return events;
    }

    // Helper function to parse ICS dates
    function parseICS(icsData) {
        const events = [];
        const lines = icsData.split(/\r?\n/);
        let event = null;
    
        lines.forEach(line => {
            if (line.startsWith('BEGIN:VEVENT')) {
                event = {};
            } else if (line.startsWith('END:VEVENT')) {
                if (event.start && event.end && event.summary) {
                    events.push({
                        title: event.summary,
                        start: event.start,
                        end: event.end,
                        allDay: true,
                    });
                }
                event = null;
            } else if (event) {
                const [keyValue, value] = line.split(/:(.+)/);
                const key = keyValue.split(';')[0]; // Handle attributes like `;VALUE=DATE`
    
                if (key === 'SUMMARY') event.summary = value;
                if (key === 'DTSTART') event.start = parseICSDate(value);
                if (key === 'DTEND') event.end = parseICSDate(value);
            }
        });
    
        console.log("Parsed Events:", events); // Debugging: Log parsed events
        return events;
    }
    
    function parseICSDate(icsDate) {
        if (!icsDate) return null;
    
        // Handle both full-date (YYYYMMDD) and date-time (YYYYMMDDTHHmmss) formats
        const datePart = icsDate.includes('T') ? icsDate.split('T')[0] : icsDate;
        const year = datePart.substring(0, 4);
        const month = datePart.substring(4, 6);
        const day = datePart.substring(6, 8);
        return `${year}-${month}-${day}`;
    }
    

    // Fetch events from ICS file
    const icsUrl = "https://cal.hibob.com/31618/ics/44b3aa82-d1ac-482d-84d7-8dc7c638206f";
    const events = await fetchICSData(icsUrl);

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: '2024-12-01',
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
        },
        events: events,
        dayMaxEventRows: 10,
 eventDidMount: function (info) {
            // Add a tooltip to each event
            if (window.tippy) {
                tippy(info.el, {
                    content: `${info.event.title}<br>${info.event.start.toISOString().substring(0, 10)} - ${info.event.end.toISOString().substring(0, 10)}`,
                    allowHTML: true,
                    theme: 'light',
                });
            } else {
                console.error("Tippy.js is not loaded.");
            }
        },
    });

    // Render the calendar
    calendar.render();
});
