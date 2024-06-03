

export const navbarData = [
    {
        routeLink: '',
        icon: 'bi bi-house-door',//attenr
        label: 'Home'
    },
    {
        routeLink: 'attendenceReport',
        icon: 'fal fa-regular fa-address-book',//attenr
        label: 'Attendence Report'
    },
    {
        routeLink: `/addAttendence/0/edit`,
        icon: 'fal fa-solid fa-clipboard-user',//at
        label: 'Add Attendence'
    },
    {
        routeLink: 'allUsers',
        icon: 'fal fa-solid fa-user-plus', //us
        label: 'User'
    },

    {
        routeLink: 'holidays',
        icon: 'fal fa-solid fa-calendar-minus',//h
        label: 'Official Holidays'
    },
    {
        routeLink: 'employees',
        icon: 'fal fa-solid fa-user-tie', //e
        label: 'Employees'
    },
    {
        routeLink: 'salaryReport',
        icon: 'fal fa-solid fa-file-invoice-dollar', //salary
        label: 'Salary Report'
    },
    {
        routeLink: 'public-setting',
        icon: 'fal fa-cog',
        label: 'Settings'
    },
];
