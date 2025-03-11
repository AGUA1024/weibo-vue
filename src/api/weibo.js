import request from '@/api/request'

const base = '/weibo'

export function getArticle(userId, page, limit, keyword) {
  return request({
    url: base + '/articles',
    method: 'get',
    params:{ 'page': page, 'limit': limit, 'keyword': keyword}
  })
}

export function getWordCut() {
  return request({
    url: base + '/getWordCut',
    method: 'get',
  })
}

export function getWordCut2() {
  return request({
    url: base + '/getWordCut2',
    method: 'get',
  })
}

export function getSunburst() {
  return request({
    url: base + '/getSunburst',
    method: 'get',
  })
}

export function getDaily(topic_name) {
  return request({
    url: base + '/getDaily',
    method: 'get',
    params: {'topic_name': topic_name}
  })
}

export function getHotPlaceData() {
  return request({
    url: base + '/hotPlaceData',
    method: 'get',
  })
}

export function get(data){
  return request({
    url: base + '/get',
    method: 'get',
    params: data
  })
}

export function getHot(userId) {
  return request({
    url: base + '/getHot',
    method: 'get',
    params: {'userId': userId}
  })
}

export function getKeywords(topic_name) {
  return request({
    url: base + '/getKeywords',
    method: 'get',
    params: {'topic_name': topic_name}
  })
}

export function getOpinions(topic_name) {
  return request({
    url: base + '/getOpinions',
    method: 'get',
    params: {'topic_name': topic_name}
  })
}

export function getUserCF(userId) {
  return request({
    url: base + '/getRecomendation2',
    method: 'get',
    params: {'userId': userId}
  })
}

export function getItemCF(userId) {
  return request({
    url: base + '/getRecomendation',
    method: 'get',
    params: {'userId': userId}
  })
}

export function getChartMain() {
  return request({
    url: base + '/getChartMain',
    method: 'get',
  })
}

export function getChart1() {
  return request({
    url: base + '/getBar1',
    method: 'get',
  })
}


export function getBigDataChart() {
  return request({
    url: base + '/getBigDataChart',
    method: 'get',
  })
}

export function getChart2() {
  return request({
    url: base + '/getBar2',
    method: 'get',
  })
}


export function getLeftChart() {
  return request({
    url: base + '/getLeft',
    method: 'get',
  })
}

export function getRightChart() {
  return request({
    url: base + '/getRight',
    method: 'get',
  })
}


// 获取统计数字
export function getPanel() {
  return request({
    url: base + '/getPanel',
    method: 'get',
  })
}

// 按照省份分组统计
export function getCityJob() {
  return request({
    url: base + '/getCityJob',
    method: 'get',
  })
}

// 按照城市分组统计
export function getCityJob2() {
  return request({
    url: base + '/getCityJob2',
    method: 'get',
  })
}

// 按照公司类型分组统计
export function getTypeRank() {
  return request({
    url: base + '/getTypeRank',
    method: 'get',
  })
}
// 按照学历需求类型分组统计
export function getDegreeRank() {
  return request({
    url: base + '/getDegreeRank',
    method: 'get',
  })
}


export function getBasePie(data) {
  return request({
    url: base + '/getBasePie',
    method: 'get',
    data
  })
}


export function getBasePie2(data) {
  return request({
    url: base + '/getBasePie2',
    method: 'get',
    data
  })
}

export function getComments(data) {
  return request({
    url: base + '/getComments',
    method: 'post',
    data
  })
}

// 获取用户收藏的话题
export function getFavTopics(uid) {
  return request({
    url: base + '/getFavTopics',
    method: 'get',
    params: {uid},
  })
}

export function barpie(param) {
  return request({
    url: base + '/barpie',
    method: 'get',
    params: {param},
  })
}

export function bigdata(param) {
  return request({
    url: base + '/bigdata',
    method: 'get',
    params: {param},
  })
}

export function getReport(topic_name) {
  return request({
    url: base + '/getReport',
    method: 'get',
    params: {topic_name},
  })
}
