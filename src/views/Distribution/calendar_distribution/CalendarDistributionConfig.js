export default {
  title: 'Kalendar Distribusi',
  permission: {
    read: 'lubang-tanam-list'
  },
  calendarOptions: {
    colors:  [
      "blue",
      "green",
      "indigo",
      "deep-purple",
      "cyan",
      "orange",
      "grey darken-1",
    ],
    focus: "",
    type: 'day',
    types: [
      {
        code: 'month',
        label: 'Per-Bulan'
      },
      {
        code: 'week',
        label: 'Per-Pekan'
      },
      {
        code: 'day',
        label: 'Per-Hari'
      }
    ]
  }
}