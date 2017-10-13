/**
 * query-master
 * a boolean query parser
 */

const handleQuotes = query => 
  (query.match(/[aA-zZ-]+|"[^"]+"/g) || [])
    .map((s, i, a) => {
      if(a[i] === '-'){
        let newTerm = `-${a[i+1].replace(/"/g,'')}`
        delete a[i+1]
        return newTerm
      }
      return s.replace(/"/g,'')
    })

const handleOr = query => {
  let output = {
    any:[],
    remainder:null
  }
  while(query.filter(v => v === 'OR').length !== 0){
    let start = query.indexOf('OR')-1,
        loc = parseInt(start), temp = [],
        hungry = true
    while(hungry){
      let cur = query[loc]
      temp.push(cur)
      loc += 2
      hungry = query[loc-1] === 'OR'
    }
    query.splice(start, temp.length*2-1)
    output.any.push(Array.from(new Set(temp)))
  }
  output.remainder = query
  return output
}

const handleNot = query => ({
  remainder:query.filter(v => !/^-/.test(v)),
  not:Array.from(new Set(query.filter(v => /^-/.test(v)).map(v => v.substring(1,v.length))))
})

 /**
  * @param {String} query
  * @returns {Object} parsedQuery {
  *   must: [], any: [], not: []
  * }
  */
module.exports = query => {
  if(typeof query !== "string"){
    throw new TypeError("input query must be string")
  }

  query = String(query)
  let any, must, not
  query = handleQuotes(query)
  query = handleOr(query)
  query = Object.assign(query, handleNot(query.remainder))
  query['must'] = Array.from(new Set(query.remainder))
  delete query.remainder
  return query
}

//console.log(module.exports(process.argv[2]))