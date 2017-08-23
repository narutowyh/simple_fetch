
/**
 * 将window.fetch封装
 * 数据采用json传输
 * get: xxxapi?q={json data}
 * post: body即为 json data
 * 示例：
 * ({
 *    url: '/xxApi',
 *    method: 'GET',
 *    headers: {
 *      "Content-Type": "text/plain",
 *    },
 *    body: {
 *      a: 1,
 *      b: 2
 *    },
 *    otherInits: {
 *      mode: 'cors',
 *      cache: 'default'
 *    }
 * })
 * 发出的请求：/xxApi?q=encodeURI(JSON.stringify(body))
 * 有跨域需求的话让后端加相应的跨域头
 * 返回的数据格式要求：json
 * // 成功:
 * {
 *    ok: true,
 *    data: `返回的数据`
 * }
 * // 失败：
 * {
 *    ok: false,
 *    code: 102, // 错误码
 *    msg: "请先登录" // 与错误码对应的错误信息
 * }
 * @return promise 成功获取到数据时resolve、否则reject
 * todo 错误信息可配置
 */

export default ({ url, method = 'GET', headers = {}, body, otherInits }) => {
  const myInit = {
    method,
    headers: Object.assign({}, new window.Headers(headers), {
      'Content-Type': 'application/json'
    })
  }

  // 如果有其他设置，将其添加到myInit中
  if (otherInits) {
    Object.assign(myInit, otherInits)
  }

  // 将body包装成提交的字段：
  if (body) {
    switch (method.toUpperCase()) {
      case 'GET':
        let query = window.encodeURI(JSON.stringify(body))
        url += `?q=${query}`
        break
      default:
        if (otherInits.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
          const formData = new window.FormData()
          let formStr = ''
          Object.keys(body).forEach((key) => {
            formData.append(key, body[key])
            formStr += `&${key}=${body[key]}`
          })
          Object.assign(myInit, {
            body: formStr
          })
        } else {
          Object.assign(myInit, {
            body: JSON.stringify(body)
          })
        }
    }
  }
  const myRequest = new window.Request(url, myInit)
  return new Promise((resolve, reject) => {
    window.fetch(myRequest)
      .then((res) => {
        if (!res.ok) {
          reject(new Error('获取数据时发生网络错误'))
        } else {
          res.json().then((r) => {
            if (r.ok !==undefined && !r.ok) {
              reject(new Error(r.msg))
            } else {
              resolve(r.data === undefined ? r : r.data)
            }
          }).catch((err) => {
            console.log('返回的数据格式非json', err)
            reject(new Error('返回的数据格式非json'))
          })
        }
      })
      .catch((err) => {
        console.log('获取数据时发生网络错误', err)
        reject(err)
      })
  })
}
