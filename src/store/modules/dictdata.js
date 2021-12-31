import ApiService from '@/api/api-service'

const state = {
}

const mutations = {

}

const actions = {
  requestDict ({ commit }, transParams ) {
    const params = {
      groupsCode: transParams,
      type: 'DROPDOWNBOX',
      queryFlag: "children"
    }
    return new Promise((resolve) => {
      ApiService.post('/beta/betaService/COS.IQ.02.0150', params, (res) => {
        //  console.log(res)
         let rows = [];
         if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
           rows = res.returnData.rows
           window.sessionStorage.setItem(transParams, JSON.stringify(rows))
         }
         resolve(rows)
       })
     })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
