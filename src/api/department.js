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
