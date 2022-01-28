const checkInput = (input, propArr, forced=false) => {
  const props = {}
  propArr.forEach(prop=> {
    if(input.hasOwnProperty(prop)) {
       if(typeof input[prop] !== 'string') props[prop] = input[prop]
       else {
        const test = input[prop].trim()
        if(test.length) props[prop] = test
       }
    }
  })
    switch (forced) {
      case false:
        if(Object.keys(props).length) return props
      case true:
        if(Object.keys(props).length === propArr.length) return props
      default: 
      return false
    } 
}

const validateBeforeInsert = (arr, form_id) => {
  return arr.reduce((a, e) => {
    if(e.payload.length) {
      e.payload.forEach(input => {
          const props = checkInput(input,['title', 'description']);
          if(props) {
            a.push({form_id, pricerange_id:e.id, ...props})
          }
      })
      return a
    } else {
      return a
    }
  },[])
}
module.exports = {
  validateBeforeInsert,
  checkInput
};
