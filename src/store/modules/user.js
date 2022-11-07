import { userLogin, getUserProfile, getUserAvatar } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN(state, token) {
    state.token = token
    setToken(token)
  },
  REMOVE_TOKEN(state) {
    state.token = ''
    removeToken()
  },
  SET_USER(state, value) {
    state.userInfo = value
  },
  REMOVE_USER(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 用户登录
  async loginActions({ commit }, data) {
    try {
      const res = await userLogin(data)
      commit('SET_TOKEN', res.data)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 获取用户信息
  async getUserInfoActions({ commit }) {
    try {
      const res = await getUserProfile()
      const res2 = await getUserAvatar(res.data.userId)
      commit('SET_USER', { ...res.data, ...res2.data })
      // console.log(res)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 退出登录
  logoutActions({ commit }) {
    commit('REMOVE_TOKEN')
    commit('REMOVE_USER')
    // console.log('已退出')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

