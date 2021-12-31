import ApiService from '@/api/api-service'
import store from '@/store'

//get select dict
/*
 * @transParams 对应参数表中的需要查询的字段名称 例如dic_mainAttachedFlag
 */
export function getSelectDict (transParams ,obj) {
    return new Promise((resolve) => {
        let dictData = window.sessionStorage.getItem(transParams)
        if (dictData) { // 是否缓存
            resolve(JSON.parse(dictData))
        } else {
            let rows = []
            if(transParams.indexOf('dic_') == -1){ // 请求后台
                let params = {}
                if (obj) {
                    params = Object.assign({}, obj)
                } 
                ApiService.post(transParams, params, (res) => {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        rows = res.returnData.rows
                        window.sessionStorage.setItem(transParams, JSON.stringify(rows))
                      resolve(rows)
                    }
                })   
            } else { // 请求参数表
                const params = {
                    groupsCode: transParams,
                    type: 'DROPDOWNBOX',
                    queryFlag: "children"
                }
                ApiService.post('/beta/betaService/COS.IQ.02.0150', params, (res) => {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        rows = res.returnData.rows
                        window.sessionStorage.setItem(transParams, JSON.stringify(rows))    
                        resolve(rows)
                      }
                })
            }
        }
    })
}

//get table list 获取表格数据
/*
*@url 请求地址
*@params 所传参数
* params : object {
  * isTrans: true,//是否需要翻译数据字典
  * transParams : ['dic_costCategory'],//查找数据字典所需参数
  * transDict : ['feeType'],//需要翻译key
  *  }
 */
export function getTableList (url, params , success , error) {
    let sessionDatas, rows
    return new Promise(( resolve ) => {
        ApiService.post( url, params, (res) => {
            // 是都需要翻译
            if(params.isTrans) { // 需要翻译
                if(res.returnData && res.returnData.rows) {
                    rows = res.returnData.rows //获取数据
                } else {
                    rows = []
                }
                params.transParams.forEach( (transItem , p) => {
                    sessionDatas = JSON.parse(window.sessionStorage.getItem(transItem))
                    if (sessionDatas) { // 有缓存
                        rows.forEach( (rowItem) => {
                            sessionDatas.forEach( (dictItem) => {
                                if(rowItem[params.transDict[p]]  == dictItem['codes']) {
                                    let transDictName = params.transDict[p] + 'Desc'
                                    rowItem[transDictName] = dictItem['detailDesc']
                                }
                            })
                        })
                    } else { // 无缓存 请求参数表
                        store.dispatch('dictdata/requestDict', transItem ).then( (resrr) => { // 缓存数据字典
                            sessionDatas = resrr
                            rows.forEach( (rowItem) => {
                                sessionDatas.forEach( (dictItem) => {
                                    if(rowItem[params.transDict[p]]  == dictItem['codes']) {
                                        let transDictName = params.transDict[p] + 'Desc'
                                        rowItem[transDictName] = dictItem['detailDesc']
                                    }
                                })
                            })
                        })     
                    }
                })
                setTimeout(() => {
                    if (res.returnData) {
                        res.returnData.rows = rows
                    } else {
                        res.returnData = {}
                        res.returnData.rows = rows
                    }
                    
                    resolve(success(res || res))
                }, 800)
            } else { // 不需要翻译
                if(success) {
                    resolve(success(res || res))
                } else {
                    resolve(res)
                }
            }
        }, (err) => {
            if(error) {
                resolve(error(err || err))
            } else {
                resolve(err)
            }
        })
    })
}
