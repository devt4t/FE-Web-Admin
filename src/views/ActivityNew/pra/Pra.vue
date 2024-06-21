<template>
    <geko-base-crud :config="config">
        <template v-slot:create-form>
            <!-- <rra-pra-form /> -->
        </template>
    </geko-base-crud>
</template>

<script>
import "../rra_pra/rra-pra.scss";
export default {
    name: "pra-module",
    data() {
        return {
            config: {
                title: "PRA",
                model_api: null,
                getter: "GetRraAll_new",
                getterDataKey: "data",
                setter: "AddNewProject",
                update: "UpdateDataProject",
                delete: "deleteProject",
                update_id_setter: "current_id",
                deleteKey: "code",
                allow_create: false,
                pk_field: null,
                permission: {
                    create: "project-create",
                    read: "project-list",
                    update: "project-update",
                    show: "project-show",
                    lookup: "project-lookup",
                    delete: "project-delete",
                },
                statistic: {
                    transform_key: {
                        total_data: {
                            label: "Total Data",
                            icon: "mdi-list-status",
                        },
                        verified: {
                            label: "Terverifikasi",
                            icon: "mdi-check-circle-outline",
                            color: "success",
                        },
                        unverified: {
                            label: "Belum Terverifikasi",
                            icon: "mdi-close-circle-outline",
                            color: "danger",
                        },
                    },
                },
                fields: [
                    {
                        id: "id",
                        methods: {
                            list: false,
                            detail: false,
                            create: false,
                            update: false,
                            filter: false,
                        },
                    },

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
                        id: "form_no",
                        label: "Form no",
                        methods: {
                            list: {
                                class: "min-w-100px",
                                type: "row-slot",
                            },
                            detail: true,
                            create: true,
                            update: true,
                            filter: false,
                        },
                    },

                    {
                        id: "village_id",
                        label: "Desa",
                        methods: {
                            list: {
                                view_data: "desas_name",
                            },
                            detail: true,
                            create: true,
                            update: true,
                            filter: false,
                        },
                    },

                    // {
                    //   id: "date",
                    //   label: "Tanggal",
                    //   methods: {
                    //     list: {
                    //       type: "row-slot",
                    //     },
                    //     detail: true,
                    //     create: true,
                    //     update: true,
                    //     filter: false,
                    //   },
                    // },

                    {
                        id: "pic_id",
                        label: "PIC",
                        methods: {
                            list: {
                                view_data: "user_id",
                            },
                            detail: true,
                            create: true,
                            update: true,
                            filter: false,
                        },
                    },
                    {
                        id: "pic_manager_id",
                        label: "PIC Manager",
                        methods: {
                            list: {
                                view_data: "employees_name",
                                class: "min-w-100px",
                            },
                            detail: true,
                            create: true,
                            update: true,
                            filter: false,
                        },
                    },
                    {
                        id: "status",
                        label: "Status Dokumen",
                        methods: {
                            list: {
                                view_data: "status",
                                class: {
                                    document_saving: "badge bg-warning",
                                    ready_to_submit: "badge bg-info",
                                    submit_review: "badge bg-success",
                                },
                                transform: "status-scooping-visit",
                            },
                            detail: true,
                            create: false,
                            update: false,
                            filter: false,
                        },
                    },
                    {
                        id: "is_verify",
                        label: "Status Verifikasi",
                        methods: {
                            list: {
                                view_data: "is_verify",
                                class: {
                                    0: "badge bg-danger",
                                    1: "badge bg-success",
                                },
                                transform: "status-verification",
                            },
                            detail: true,
                            create: false,
                            update: false,
                            filter: false,
                        },
                    },
                ],
            },
        };
    },

    mounted() {

        console.log('pra', this.$route.query)
        if (this.$route.query.view === 'list') {
            this.$router.push({
                path: '/newRraPra',
                query: {
                    view: 'list',
                    id: ''
                }
            })
            return
        }
    }
};
</script>