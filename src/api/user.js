import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data 手机号+密码
 * @returns Promise
 */
export function userLogin(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户基本资料
 * @returns Promise
 */
export function getUserProfile() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取用户基本信息（头像）
 * @param {*} id 用户id
 * @returns Promise
 */
export function getUserAvatar(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}
