import {createServer} from 'http'
import handleRequest from './handleRequests/handleRequest.js'

createServer(handleRequest).listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})