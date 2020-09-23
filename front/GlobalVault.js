const assureArr = value => Array.isArray(value)? value : [value]


export default class GlobalVault {
  constructor (varNames, saveFn, loadFn) {
    this.ways = {
      toSave: saveFn || GlobalVault.defaultWays.toSave,
      toLoad: loadFn || GlobalVault.defaultWays.toLoad
    }
    this.varSet = assureArr(varNames)
  }

  save() {
    const save = this.ways.toSave

    return Promise.all(this.varSet.flatMap(name => {
      if (typeof name == 'string') return save(name, readVar(name))

      return Object.keys(name).map(key =>
        save(key, Object.fromEntries(name[key].map(name =>
          [name, readVar(name)] )), name[key]))
    }))
  }

  load() {
    const load = this.ways.toLoad

    return Promise.all(this.varSet.flatMap(name => {
      if (typeof name == 'string')
        return load(name).then(data => reassignVar(name, data))

      return Object.keys(name).map(key =>
        load(key).then(data => Object.entries(data)
          .forEach(([name, value]) => reassignVar(name, value)) ))
    }))

  }

  static defaultWays = {
    async toSave(name, value, varNames) {
      localStorage[name] = JSON.stringify(value)
      console.log(name,
        `saved ${varNames? varNames.join(', ')+' ' : ''}to localStorage`)
    },

    async toLoad(name) {
      return JSON.parse(localStorage[name])
    }
  }
}


function reassignVar(name, value) {
  try {
    const varProto = window[name].__proto__,  valProto = value.__proto__
    if (varProto == valProto && valProto == Array.prototype) {
      window[name].splice(0, window[name].length, ...value)
    } else if (varProto == valProto && valProto == Object.prototype) {
      for (const key in window[name]) delete window[name][key]
      Object.assign(window[name], value)
    } else  window[name] = value
    console.log(name+' loaded')
  }
  catch { console.log(`unable to load ${name} variable`) }

}

function readVar(name) {
  if (window[name] === null || [Boolean, Number, String, Array, Object]
    .map(constr => constr.prototype).includes(window[name].__proto__)) {
    return window[name]
  } else throw new Error('non-standard data value in variable '+name)
}
