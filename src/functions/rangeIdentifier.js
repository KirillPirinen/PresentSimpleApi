const getRange = (price) => {
  if(!price) return false
  price = Number(price.replace(/[^\d]/g, ''))
   
  if(price <= 1000) return 1
  else if (price <= 3000) return 2
  else if (price <= 5000) return 3
  else if (price <= 10000) return 4
  else if (price >= 10000) return 5
  else return false
}

module.exports = getRange
