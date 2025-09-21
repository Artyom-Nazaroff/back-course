const http = require('http')

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/students': res.write('Students!')
            break
        case '/courses': res.write('Courses!')
            break
        default: res.write('404')
    }
    res.end()
})

server.listen(3003)