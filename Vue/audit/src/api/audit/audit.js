import request from '@/utils/request'

//上传Toekn
export function uploadData(data) {
    return request({
      url: '/uploadData',
      method: 'post',
      data: data,
    })
}


export function getHistoryToken(data) {
  return request({
    url: '/getHistoryToken',
    method: 'post',
    params:{"data":data},
  })
}


export function regesterService(data) {
  return request({
    url: '/regesterService',
    method: 'post',
    params:{"data":data},
  })
}


export function QueryService(data) {
  return request({
    url: '/QueryService',
    method: 'post',
    params:{"data":data},
  })
}