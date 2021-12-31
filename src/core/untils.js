
/**
 * 本地缓存
 */
export function set (key,val) {
  window.sessionStorage[key] = val
}
export function get (key) {
  return window.sessionStorage[key] || defaultValue
}
export function setObj (key, val) {
  window.sessionStorage[key] = JSON.stringify(val)
}
export function getObj (key) {
  return JSON.parse(window.sessionStorage[key] || '{}')
}
export function romove (key) {
  window.sessionStorage.romove[key]
}
export function clear () {
  window.sessionStorage.clear()
}
// export const session = {
//   set: function (key, val)  {
//     window.sessionStorage[key] = val
//   },
//   get : function(key,defaultValue)  {
//     return window.sessionStorage[key] || defaultValue
//   },
//   setObj: function (key , val)  {
//     window.sessionStorage[key] = JSON.stringify(val)
//   },
//   getObj :function (key)  {
//     return JSON.parse(window.sessionStorage[key] || '{}')
//   }
// }
