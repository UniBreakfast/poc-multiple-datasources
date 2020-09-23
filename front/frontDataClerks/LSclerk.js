const {stringify, parse} = JSON

const clerk = {
  read(subject) {
    const data = localStorage['MDS_'+subject]
    return data == undefined? null : parse(data)
  }
}


export default function operate(action, subject, data) {
  return Promise.resolve(clerk[action](subject, data))
}