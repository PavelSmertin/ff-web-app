<template>
    <div class="filter">
        <label>{{ label }}</label>
        <ul>
            <li @mousemove="mousemove" @mouseleave="mouseleave" v-for="option in options" v-bind:key="option.value" @click="filter(option)" class="filter_item" v-bind:class="isActiveFilter(option)">
                {{ option.name }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                selectedItemData: null
            }
        },

        props: {
            label: String,
            options: {
                type: [Array, Object]
            },
            selectedProp: { 
                type: String, 
                default() { return 'all' }
            },
        },

        computed: {
            selectedItem: {
                get: function () {
                    return this.selectedItemData || { value: this.selectedProp }
                },
                set: function (newValue) {
                    this.selectedItemData = newValue
                }
            }
        },

        methods: {

            filter(option) {
                this.selectedItem = option
                this.$emit('updateOption', this.selectedItem)
            },

            isActiveFilter( option ) {
                return {
                    'active_filter': option.value === this.selectedItem.value
                }
            },

            mousemove() {
                this.$emit('filterHover')
            },
                       
            mouseleave() {
                this.$emit('filterLeave')
            },
        }
    }
</script>
