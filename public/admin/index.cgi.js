((args) => {
  const fs = require('fs')

  function decode_cookie(raw_cookie) {
    var cookie = {}
    if (!raw_cookie) {
      return cookie
    }

    for (var key_value of raw_cookie.split(';')) {
      var key, value
      [key, value] = key_value.trim().split('=')
      cookie[unescape(key)] = unescape(value)
    }
    return cookie
  }

  function encode_cookie(cookie) {
    var raw_cookie = ''
    if (!cookie) {
      return raw_cookie
    }

    for (var key in cookie) {
      var value = cookie[key]
      if (!value) {
      }
      else {
        if (raw_cookie.length > 0) {
          raw_cookie += ';'
        }
        raw_cookie += `${escape(key)}=${escape(value)}`
      }
    }
    return raw_cookie
  }

  function parse_query(raw_query) {
    var query = {}
    if (!raw_query) {
      return query
    }

    for (var key_value of raw_query.split('&')) {
      var key, value
      [key, value] = key_value.trim().split('=')
      query[unescape(key)] = unescape(value)
    }
    return query
  }

  console.log(args)
  try {
    if (args.method == 'GET') {
      var cookie = decode_cookie(args.headers.cookie)
      var data
      if (cookie['session'] != 'DUMMY_0123456789') {
        data = fs.readFileSync('assets/admin/index_login.html', 'utf8')
      }
      else {
        data = fs.readFileSync('assets/admin/index.html', 'utf8')
      }

      var header = {}
      header['Content-Type'] = 'text/html'
      header['Set-Cookie'] = encode_cookie(cookie)
      return {'status' : 200, 'header': header, 'data': data}
    }
    else if (args.method == 'POST') {
      var params = parse_query(args.body)
      if (params['api'] == 'login') {
        var cookie = {}
        var data
        if (params['password'] != 'password') {
          data = fs.readFileSync('assets/admin/index_login.html', 'utf8')
        }
        else {
          data = fs.readFileSync('assets/admin/index.html', 'utf8')
          cookie = {'session': 'DUMMY_0123456789'}
        }

        var header = {}
        header['Content-Type'] = 'text/html'
        header['Set-Cookie'] = encode_cookie(cookie)
        return {'status' : 200, 'header': header, 'data': data}
      }
      else if (params['api'] == 'logout') {
        var data = fs.readFileSync('assets/admin/index_login.html', 'utf8')
        var cookie = {'session': 'expired'}

        var header = {}
        header['Content-Type'] = 'text/html'
        header['Set-Cookie'] = encode_cookie(cookie)
        return {'status' : 200, 'header': header, 'data': data}
      }
    }
    else {
      return {'status' : 400}
    }
  }
  catch (err) {
    return {'status' : 500}
  }
})
