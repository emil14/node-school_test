const http = require('http')
const data = [
  require('./responses/success.json'),
  require('./responses/error.json'),
  require('./responses/progress.json')
]

const server = http.createServer((req, res) => {
  const randomResponse = data[Math.floor(Math.random() * data.length)]

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(randomResponse))
})

server.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`)
})
