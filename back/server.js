import {createServer} from 'http'
import reqHandler from './sub-back/req-handler.js'

createServer(reqHandler).listen(3000)