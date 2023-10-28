<template>
    <v-dialog v-model="showPesertaUmumModal" max-width="1000px" persistent content-class="rounded-lg mx-1" scrollable>
        <v-card class="rounded-xl">
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Form Tambah Peserta Umum
                <v-icon color="white" class="ml-auto" @click="showPesertaUmumModal = false">mdi-close-circle</v-icon>
            </v-card-title>
        </v-card>
        <v-card-text class="pa-0 fontall">
            <v-row v-for="(assignPesertaTambahan, assignPesertaTambahanIndex) in dataToStore.peserta_tambahan"
            :key="`row-pesertaTambahan-assign-${assignPesertaTambahanIndex}`">
            <v-col cols="auto" class="d-flex align-start">
                <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{
                assignPesertaTambahanIndex + 1 }}</v-icon></v-btn>
            </v-col>
            <v-col>
                <v-row>
                <v-col cols="12">
                    <v-text-field dense color="success" hide-details small-chips item-color="success"
                    v-model="assignPesertaTambahan.name" label="Nama" :rules="[(v) => !!v || 'Field is required']"
                    outlined rounded>
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field dense color="success" hide-details small-chips item-color="success"
                    v-model="assignPesertaTambahan.address" label="Alamat"
                    :rules="[(v) => !!v || 'Field is required']" outlined rounded>
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field dense color="success" hide-details small-chips item-color="success"
                    v-model="assignPesertaTambahan.phone" label="No Hp/WA"
                    :rules="[(v) => !!v || 'Field is required']" outlined rounded>
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-select dense color="success" hide-details small-chips item-color="success"
                    :items="listJenisKelamin" v-model="assignPesertaTambahan.gender" label="Jenis Kelamin"
                    :rules="[(v) => !!v || 'Field is required']" outlined rounded>
                    </v-select>
                </v-col>
                </v-row>
            </v-col>
            </v-row>
        </v-card-text>
    </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import axios from "axios";
import moment from 'moment'
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: null,
        },
    },
    data: () => ({
        listJenisKelamin: ['Laki-laki', 'Perempuan'],
        dataToStore:{
            peserta_tambahan: [],
        }
    }),
    computed: {
            showModal: {
                get: function () {
                    return this.show
                },
                set: function() {
                    this.$emit('close', false)
                }
            },
        },
}
</script>