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

/**
 * 新增员工
 * @param {*} data 员工信息
 * @returns Promise
 */
export function addUser(data) {
  return requset({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @param {*} id 员工id
 * @returns Promise
 */
export function delUser(id) {
  return requset({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量导入员工
 * @param {*} data 员工数组 [{}, {}]
 * @returns
 */
export function batchUser(data) {
  return requset({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
