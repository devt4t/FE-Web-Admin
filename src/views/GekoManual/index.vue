<template>
    <v-container class="mt-5 pl-3 pl-lg-6" fluid>
        <v-card data-aos="fade-down" class="rounded-xl">
            <v-card-title>
                <v-icon class="mr-1" color="blue">mdi-book-open-variant</v-icon>GEKO Manual
                <v-divider class="mx-2"></v-divider>
                <v-switch
                    color="orange"
                    v-model="isEdit"
                    inset
                    :label="`Edit Mode`"
                ></v-switch>
            </v-card-title>
            <v-card-text>
                <v-expansion-panels :focusable="!isEdit" class="rounded-xl">
                    <v-expansion-panel
                        v-for="(item,i) in manuals"
                        :key="i"
                        class="rounded-xl"
                    >
                        <v-expansion-panel-header>
                            <v-text-field 
                                v-if="isEdit"
                                dense
                                hide-details
                                outlined
                                rounded
                                label="Title"
                                v-model="item.title"
                            ></v-text-field>
                            <span v-else>
                                {{ item.title }}
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-textarea 
                                clearable
                                clear-icon="mdi-close-circle"
                                dense
                                hide-details
                                outlined
                                rounded
                                label="Description" v-if="isEdit" v-model="item.description"></v-textarea>
                            <span v-else>{{ item.description }}</span>
                            <VueEditor v-if="isEdit" class="mt-2" v-model="item.content" />
                            <span v-else v-html="item.content"></span>
                            <v-btn v-if="isEdit" rounded outlined color="blue" class="pl-1 mt-2" @click="() => addNew(item)"><v-icon>mdi-plus-circle</v-icon> Add</v-btn>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-btn v-if="isEdit" rounded outlined color="blue" class="pl-1 mt-2" @click="() => addNew()"><v-icon>mdi-plus-circle</v-icon> Add</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        manuals: [],
        isLogin() {
            return this.$store.state.User ? true : false
        },
        user: '',
        isEdit: false
    }),
    mounted() {
        this.user = this.$store.state.User
    },
    methods: {
        addNew(item = null) {
            const user = this.user
            if (user) {
                const newData = {
                    title: '',
                    description: '',
                    content: '',
                    created_by: user.email,
                    updated_by: user.email,
                    users: '',
                    child: []
                }
                if (item) item.child.push(newData)
                else this.manuals.push(newData)
            }
        }
    },
}
</script>