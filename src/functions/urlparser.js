const urlParser = (request) => {
  const url = new URLSearchParams(request.url)
  if(url.has('/?group')) {
    request.group_id = Number(url.get('/?group'))
  }
}

module.exports = urlParser;
