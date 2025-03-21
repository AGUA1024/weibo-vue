export default {
  setUid (state, value) {
    state.uid = value
  },
  setUserInfo (state, value) {
    const data = value
    console.log('设置locaStorage,username=' + data.username + ',uid=' + data.id + ',avatar=' + data.avatar)
    localStorage.setItem('username', data.username)
    localStorage.setItem('uid', data.id)
    localStorage.setItem('avatar', data.avatar)
    localStorage.setItem('phone', data.phone)
    localStorage.setItem('roles', data.roles)
    localStorage.setItem('realname', data.realname)
    state.uid = data.id
    state.username = data.username
    state.avatar = data.avatar
    state.phone = data.phone
    state.roles = data.roles
    state.realname = data.realname
  },
  setAvatar (state, value) {
    localStorage.setItem('avatar', value)
    state.avatar = value
  },
}

