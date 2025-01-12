document.addEventListener('DOMContentLoaded', async function () {
    // Create container and get calendar element
    const calendarEl = document.getElementById('calendar');
    const containerDiv = document.createElement('div');
    containerDiv.className = 'calendar-container';
    calendarEl.parentNode.insertBefore(containerDiv, calendarEl);
    containerDiv.appendChild(calendarEl);

    // Team members configuration
    const COLORS = {
        GOLD: '#fc8626',
        SKY_BLUE: '#004f9f',
        DARK_RED: '#66023c'
    };
    
    // Team members configuration
    const TEAM_MEMBERS = {
        // Tier 2 IL
        'Netanel Balas': { group: 'Tier 2 IL', color: COLORS.GOLD }, 
        'Nadav Arnheim': { group: 'Tier 2 IL', color: COLORS.GOLD },
        'Guy Kogan': { group: 'Tier 2 IL', color: COLORS.GOLD }, 
        'Galit Bezinian Ezov': { group: 'Tier 2 IL', color: COLORS.GOLD },
        // Tier 2 Dubai
        'Abizar Fakruddin': { group: 'Tier 2 DUBAI', color: COLORS.SKY_BLUE },
        'Yasin Banu Shafi Mohamed': { group: 'Tier 2 DUBAI', color: COLORS.SKY_BLUE },
        'Peeyush Sharma': { group: 'Tier 2 DUBAI', color: COLORS.SKY_BLUE },
        // Support EU
        'Erla Gudmundsdottir': { group: 'Support Europe', color: COLORS.DARK_RED },
        'Asdis Johannsdottir': { group: 'Support Europe', color: COLORS.DARK_RED },
        'Stefan Orn Thorarinsson': { group: 'Support Europe', color: COLORS.DARK_RED },
        'María Ýr Valsdóttir': { group: 'Support Europe', color: COLORS.DARK_RED }
    };

    // Create and inject CSS styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
    .calendar-container {
        display: flex;
        gap: 20px;
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px 40px;
    }

    .filter-sidebar {
        background: #2D3338;
        color: #fff;
        padding: 20px;
        border-radius: 8px;
        width: 250px;
        height: fit-content;
        flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        position: sticky;
        top: 20px;
        margin-right: 20px;
    }

    #calendar {
        flex-grow: 1;
        min-width: 0;
        max-width: 1000px;
        margin: 0 auto;
    }

    .filter-sidebar h2 {
        margin: 0 0 15px 0;
        font-size: 1.5em;
        color: #fff;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .group-section {
        margin-bottom: 15px;
    }

    .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        margin-bottom: 8px;
    }

    .group-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        cursor: pointer;
        padding: 10px 15px;
    }

    .group-header:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .group-toggle {
        margin-left: 10px;
        display: flex;
        align-items: center;
    }

    .group-checkbox {
        margin: 0;
    }

    .group-header .arrow {
        transition: transform 0.3s;
    }

    .group-header.expanded .arrow {
        transform: rotate(90deg);
    }

    .group-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        padding-left: 15px;
    }

    .group-content.expanded {
        max-height: 500px;
    }

    .member-item {
        padding: 8px 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background-color 0.2s;
        border-radius: 4px;
    }

    .member-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .member-checkbox {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 3px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .member-checkbox:checked {
        background-color: #4CAF50;
        border-color: #4CAF50;
    }

    .member-checkbox:checked::after {
        content: "✓";
        color: white;
        font-size: 12px;
    }

    .member-checkbox:indeterminate {
        background-color: #808080;
        border-color: #808080;
    }

    .member-checkbox:indeterminate::after {
        content: "-";
        color: white;
        font-size: 12px;
    }

    .member-label {
        cursor: pointer;
        flex-grow: 1;
    }

    .color-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .actions-bar {
        padding: 10px 15px;
        display: flex;
        gap: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 10px;
    }

    .action-button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        flex: 1;
    }

    .action-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    /* Modern Calendar Button Styles */
    .fc-button-primary {
        background-color: #2D3338 !important;
        border: none !important;
        padding: 8px 16px !important;
        font-weight: 500 !important;
        text-transform: capitalize !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    }

    .fc-button-primary:hover {
        background-color: #404850 !important;
        transform: translateY(-1px) !important;
    }

    .fc-button-primary:active {
        transform: translateY(0) !important;
    }

    .fc-button-primary:disabled {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
    }

    .fc-today-button {
        font-weight: 600 !important;
        background-color: #4CAF50 !important;
    }

    .fc-today-button:hover {
        background-color: #45a049 !important;
    }

    .fc-button-active {
        background-color: #404850 !important;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    .fc-button-group {
        gap: 4px !important;
    }

    .fc-button-group .fc-button-primary {
        border-radius: 6px !important;
    }

    .fc-header-toolbar {
        gap: 16px !important;
        padding: 8px !important;
    }

    .fc-toolbar-title {
        font-size: 1.25em !important;
        font-weight: 600 !important;
    }
    `;
    document.head.appendChild(styleSheet);

    // Create team member filter sidebar
    function createTeamFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-sidebar';

        let filterHTML = '<h2>Team Filters</h2>';

        // Group members by team
        const groupedMembers = {};
        Object.entries(TEAM_MEMBERS).forEach(([name, details]) => {
            if (!groupedMembers[details.group]) {
                groupedMembers[details.group] = [];
            }
            groupedMembers[details.group].push({name, color: details.color});
        });

        // Create group sections
        Object.entries(groupedMembers).forEach(([group, members]) => {
            filterHTML += `
                <div class="group-section">
                    <div class="group-header">
                        <div class="group-header-content" onclick="toggleGroup('${group}')">
                            <span>${group}</span>
                            <span class="arrow">›</span>
                        </div>
                        <div class="group-toggle">
                            <input type="checkbox" 
                                id="group-toggle-${group.replace(/\s+/g, '-')}" 
                                class="group-checkbox member-checkbox" 
                                checked>
                        </div>
                    </div>
                    <div class="group-content" id="group-${group.replace(/\s+/g, '-')}">
                        ${members.map(({name, color}) => `
                            <div class="member-item">
                                <input type="checkbox" 
                                    id="filter-${name.replace(/\s+/g, '-')}" 
                                    class="member-checkbox" 
                                    data-group="${group}"
                                    checked>
                                <span class="color-indicator" style="background-color: ${color}"></span>
                                <label class="member-label" for="filter-${name.replace(/\s+/g, '-')}">
                                    ${name}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        filterHTML += `
            <div class="actions-bar">
                <button class="action-button" onclick="selectAll()">Select All</button>
                <button class="action-button" onclick="deselectAll()">Deselect All</button>
            </div>
        `;

        filterContainer.innerHTML = filterHTML;
        containerDiv.insertBefore(filterContainer, calendarEl);

        // Add event listeners for group toggles
        document.querySelectorAll('.group-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const group = e.target.id.replace('group-toggle-', '').replace(/-/g, ' ');
                const memberCheckboxes = document.querySelectorAll(`input[data-group="${group}"]`);
                memberCheckboxes.forEach(memberCheckbox => {
                    memberCheckbox.checked = e.target.checked;
                });
                filterEvents();
            });
        });

        // Update member checkbox listeners to handle group toggle states
        document.querySelectorAll('.member-checkbox:not(.group-checkbox)').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const group = e.target.dataset.group;
                const groupCheckbox = document.getElementById(`group-toggle-${group.replace(/\s+/g, '-')}`);
                const groupMembers = document.querySelectorAll(`input[data-group="${group}"]:not(.group-checkbox)`);
                const allChecked = Array.from(groupMembers).every(cb => cb.checked);
                const anyChecked = Array.from(groupMembers).some(cb => cb.checked);
                
                groupCheckbox.checked = allChecked;
                groupCheckbox.indeterminate = anyChecked && !allChecked;
                
                filterEvents();
            });
        });

        // Expand all groups initially
        document.querySelectorAll('.group-content').forEach(content => {
            content.classList.add('expanded');
            content.previousElementSibling.classList.add('expanded');
        });
    }

    // Add global functions for the onclick handlers
    window.toggleGroup = function(group) {
        const groupContent = document.getElementById(`group-${group.replace(/\s+/g, '-')}`);
        const header = groupContent.previousElementSibling;
        groupContent.classList.toggle('expanded');
        header.classList.toggle('expanded');
    };

    window.selectAll = function() {
        document.querySelectorAll('.member-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.indeterminate = false;
        });
        filterEvents();
    };

    window.deselectAll = function() {
        document.querySelectorAll('.member-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.indeterminate = false;
        });
        filterEvents();
    };

    // Fetch and parse ICS data
    async function fetchICSData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching ICS file: ${response.status}`);
            }
            const icsData = await response.text();
            return parseICS(icsData);
        } catch (error) {
            console.error("Error fetching or parsing ICS file:", error);
            return [];
        }
    }

    function parseICS(icsData) {
        const events = [];
        const lines = icsData.split(/\r?\n/);
        let event = null;

        lines.forEach(line => {
            if (line.startsWith('BEGIN:VEVENT')) {
                event = {};
            } else if (line.startsWith('END:VEVENT')) {
                if (event.start && event.end && event.summary) {
                    const teamMember = Object.keys(TEAM_MEMBERS).find(member => 
                        event.summary.toLowerCase().includes(member.toLowerCase())
                    );

                    if (teamMember) {
                        events.push({
                            title: event.summary,
                            start: event.start,
                            end: event.end,
                            allDay: true,
                            backgroundColor: TEAM_MEMBERS[teamMember].color,
                            borderColor: TEAM_MEMBERS[teamMember].color,
                            teamMember: teamMember,
                            group: TEAM_MEMBERS[teamMember].group
                        });
                    }
                }
                event = null;
            } else if (event) {
                const [keyValue, value] = line.split(/:(.+)/);
                const key = keyValue.split(';')[0];

                if (key === 'SUMMARY') event.summary = value;
                if (key === 'DTSTART') event.start = parseICSDate(value);
                if (key === 'DTEND') event.end = parseICSDate(value);
            }
        });

        return events;
    }

    function parseICSDate(icsDate) {
        if (!icsDate) return null;
        const datePart = icsDate.includes('T') ? icsDate.split('T')[0] : icsDate;
        const year = datePart.substring(0, 4);
        const month = datePart.substring(4, 6);
        const day = datePart.substring(6, 8);
        return `${year}-${month}-${day}`;
    }

    function filterEvents() {
        const selectedMembers = Object.keys(TEAM_MEMBERS).filter(member => 
            document.getElementById(`filter-${member.replace(/\s+/g, '-')}`).checked
        );

        calendar.getEvents().forEach(event => {
            const teamMember = Object.keys(TEAM_MEMBERS).find(member => 
                event.title.toLowerCase().includes(member.toLowerCase())
            );
            
            if (teamMember) {
                if (selectedMembers.includes(teamMember)) {
                    event.setProp('display', 'auto');
                } else {
                    event.setProp('display', 'none');
                }
            }
        });
    }

    // Initialize calendar
    const icsUrl = "https://cal.hibob.com/31618/ics/44b3aa82-d1ac-482d-84d7-8dc7c638206f";
    const events = await fetchICSData(icsUrl);

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: new Date(),
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        events: events,
        dayMaxEventRows: 10,
        eventDidMount: function(info) {
            if (window.tippy) {
                tippy(info.el, {
                    content: `
                        <strong>${info.event.extendedProps.teamMember}</strong><br>
                        Group: ${info.event.extendedProps.group}<br>
                        ${info.event.start.toISOString().substring(0, 10)} - 
                        ${info.event.end.toISOString().substring(0, 10)}
                    `,
                    allowHTML: true,
                    theme: 'light'
                });
            }
        }
    });

    // Create filters and render calendar
    createTeamFilters();
    calendar.render();
});
