import fs from 'fs'
import {ServerResponse} from 'http'

const fsp = fs.promises,  {stat} = fsp
const {stringify} = JSON

ServerResponse.prototype.json = function (obj) {
  this.setHeader('Content-Type', typeDict['json'])
  this.end(stringify(obj))
}

const utf = '; charset=utf-8',
      typeDict = {
        htm: 'text/html'+utf,
        html: 'text/html'+utf,
        json: 'application/json'+utf,
        css: 'text/css'+utf,
        txt: 'text/plain'+utf,
        ico: 'image/x-icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml'+utf,
        mp3: 'audio/mpeg',
        mp4: 'video/mp4',
        js: 'application/javascript'+utf,
      }


export default async function reqHandler(req, resp) {
  let {method} = req,  url = decodeURI(req.url)

  if (method=='GET') {

    try {
        let path = process.cwd()+(url.startsWith('/center/')? '' : '/front')+url
        if ((await stat(path).catch(_=> stat(path+='.html'))).isDirectory() &&
          (await stat(path+='/index.html')).isDirectory())  throw 0
        const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'

        fs.createReadStream(path).pipe(resp)
        if (typeDict[ext])
          resp.setHeader('Content-Type', typeDict[ext])

    } catch (err) {
      console.log(err);

      resp.statusCode = 404
      resp.json('sorry, '+url+' is not available')
    }
  }

  else resp.end(stringify({url, method}))
}