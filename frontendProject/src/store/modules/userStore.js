import router from '@/router'

const userStore = {
    state: {
        token: '',
        refresh_token: '',
        authority: '',
        employeeId : '',
    },
    mutations: {
        login: function (state, payload) {
            state.token = payload.access_token
            state.refresh_token = payload.refresh_token
            state.authority = payload.authority
        },
        saveEmployeeId: function (state, payload) {
            state.employeeId = payload
        },
        setToken: function (state, payload) {
            state.token = payload.access_token
        },
        logout: function (state) {
            if (state.token != '') {
                state.token = ''
                state.refresh_token = ''
                state.authority = ''
                state.employeeId = ''
            }
        },
        loginCheck: function (state) {
            if (!state.token) {
                router.push({
                    name: 'login'
                }).catch(error => {
                    console.log(error)
                })
            }
        },
    }
}

export default userStore