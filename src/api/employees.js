import requset from '@/utils/request'

/**
 * 获取员工列表
 * @param {*} params page, size
 * @returns Promise
 */
export function getUser(params) {
  return requset({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
