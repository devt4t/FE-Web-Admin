<template>
    <div>
        <v-dialog v-model="isShow" max-width="700" content-class="rounded-xl" scrollable>
            <v-card>
                <v-card-title class="headermodalstyle">
                    FF Alocation
                    <v-divider class="mx-2" color="white"></v-divider>
                    <v-icon color="red" @click="isShow = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-autocomplete
                        color="green"
                        dense
                        rounded
                        outlined
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    ></v-autocomplete>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({

    }),
    computed: {
        isShow: {
            get: function () {
                return this.show
            },
            set: function(val) {
                this.$emit('dialogAct', {name: 'changeFF', status: val});
            }
        }
    }
}
</script>