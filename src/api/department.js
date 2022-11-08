import requset from '@/utils/request'

/**
 * 查询企业的部门列表（组织架构）
 * @returns Promise
 */
export function getDepartment() {
  return requset({
    url: '/company/department',
    method: 'GET'
  })
}

/**
 * 获取员工简单列表
 * @returns id, username
 */
export function getUserSimple() {
  return requset({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

/**
 * 新增部门
 * @param {*} data code, introduce, manager, name, pid
 * @returns Promise
 */
export function addDepartment(data) {
  return requset({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/**
 * 根据ID查询部门详情
 * @param {*} id 部门id
 * @returns Promise
 */
export function getDepartDetail(id) {
  return requset({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

/**
 * 根据ID修改部门详情
 * @param {*} data 需要编辑的部门信息
 * @returns Promise
 */
export function updateDepartDetail(data) {
  return requset({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据ID删除部门
 * @param {*} id 部门id
 * @returns Promise
 */
export function delDepartment(id) {
  return requset({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
