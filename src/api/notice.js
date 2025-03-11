import request from '@/api/request'

const base = '/notice'

/******** BEGIN 自定义方法  *************/

/******** END 自定义方法  **************/

// 查询[rest]  (不带任何自定义参数)
export function query(search,  page=1, limit=10, sort='') {
  return request({
    url: base + '/',
    method: 'get',
    params:{ search,  page, limit, sort }
  })
}

// 获取单个[rest]
export function getOne(id) {
  return request({
    url: base + '/' + id + '/',
    method: 'get',
  })
}

// 获取全部[rest]
export function getAll() {
  return request({
    url: base + '/',
    method: 'get',
  })
}

// 创建[rest]
export function add(data) {
  return request({
    url: base + '/',
    method: 'post',
    data
  })
}

// 删除[rest]
export function remove(id) {
  return request({
    url: base + '/' + id + '/',
    method: 'delete'
  })
}

// 修改[rest]
export function update(data) {
  return request({
    url: base + '/' + data.id + '/',
    method: 'put',
    data
  })
}


