import request from '@/utils/request'

/**
 * 获取所有角色列表
 * @param {*} params page, pagesize
 * @returns Promise
 */
export function getAllroles(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

/**
 * 根据ID查询企业（获取公司信息）
 * @param {*} cid 企业ID
 * @returns Promise
 */
export function getCompany(cid) {
  return request({
    url: `/company/${cid}`,
    method: 'GET'
  })
}

/**
 * 添加角色
 * @param {*} data name, description
 * @returns Promise
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据ID获取角色详情
 * @param {*} id 角色id
 * @returns 比getAllroles中的数据多一个permIds：权限点数据
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

/**
 * 根据ID更新角色
 * @param {*} data 角色详情
 * @returns Promise
 */
export function updateRoleDetail(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据ID删除角色
 * @param {*} id 角色id
 * @returns Promise
 */
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
