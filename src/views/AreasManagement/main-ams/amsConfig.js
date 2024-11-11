export default [
    {
      id: "indicator",
      label: " ",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    
    {
      id: "am_no",
      label: "Kode Area Management",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "regions_name",
      label: "Region",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "region",
      label: "Region",
      methods: {
        list: false,
        detail: false,
        create: {
          validation: ["required"],
          col_size: 6,
          view_data: "region_code",
          type: "select",
          getter: "new-utilities/region/list",
          setter: "region_code",
          option: {
            getterKey: "data.result",
            getter: "region_code",
            list_pointer: {
              code: "region_code",
              label: "name",
              display: ["name"],
            },
          },
        },
        update: {
          validation: ["required"],
          col_size: 6,
          view_data: "region_code",
          type: "select",
          getter: "new-utilities/region/list",
          setter: "region_code",
          option: {
            getterKey: "data.result",
            getter: "region_code",
            list_pointer: {
              code: "region_code",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: {
          validation: ["required"],
          col_size: 6,
          type: "select",
          getter: "new-utilities/region/list",
          // setter: "region_code",
          icon: "location",
          main: true,
          option: {
            getterKey: "data.result",
            list_pointer: {
              code: "region_code",
              label: "name",
              display: ["name"],
            },
          },
        }
      },
    },
    {
      id: "managementunits_name",
      label: "Management Unit",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "mu_no",
      label: "Management Units",
      methods: {
        list: false,
        detail: false,
        create: {
          validation: ["required"],
          col_size: 6,
          view_data: "mu_no",
          type: "select",
          getter: "new-utilities/management-units",
          setter: "mu_no",
          option: {
            getterKey: "data",
            getter: "mu_no",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name"],
            },
          },
        },
        update: {
          validation: ["required"],
          col_size: 6,
          view_data: "mu_no",
          type: "select",
          getter: "new-utilities/management-units",
          setter: "mu_no",
          option: {
            getterKey: "data",
            getter: "mu_no",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: {
          validation: ["required"],
          col_size: 6,
          type: "select",
          getter: "new-utilities/management-units",
          setter: "mu_no",
          icon: "location",
          main: true,
          option: {
            getterKey: "data",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name"],
            },
          },
        }
      },
    },
    {
      id: "target_area",
      label: "Target Area",
      methods: {
        filter: {
          type: "select",
          getter: "new-utilities/target-areas",
          setter: "area_code",
          form_param: {
            mu_no: "mu_no",
          },
          param: {
            program_year: "current_program_year",
          },
          main: true,
          option: {
            getterKey: "data",
            list_pointer: {
              code: "area_code",
              label: "name",
              display: ["name"],
            },
          },
        },
      },
    },
  ];
  