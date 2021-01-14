import router from '@/router'

const buildingStore = {
    state: {
        building: ''
    },
    mutations: {
        logout: function (state) {
            state.building = ''
        },
        buildingSelect: function (state, payload) {
            state.building = payload
        },
        backToMyPage: function (state) {
            state.building = ''
            router.push({ name: 'myPage' })
        }
    }
}

export default buildingStore