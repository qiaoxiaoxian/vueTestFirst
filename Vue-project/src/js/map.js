import BMap from 'BMap'

export function MP (ak) {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      resolve(BMap)
    }
    // console.log(document.head)
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=init&s=1'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
