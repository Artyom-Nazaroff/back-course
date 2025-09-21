const http = require('http')

let requestCount = 0

const server = http.createServer((req, res) => {
    requestCount++
    switch (req.url) {
        case '/students': res.write('Students!')
            break
        case '/courses': res.write('Courses!')
            break
        default: res.write('404')
    }
    res.write(' Hey Yo! ' + requestCount)
    res.end()
})

server.listen(3003)