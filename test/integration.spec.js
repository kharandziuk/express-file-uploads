const S = require('supertest')
const { expect } = require('chai')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
describe('server', () => {
  it('hello world', async () => {
    const { text }= await S(app).get('/')
    expect(text).eql('Hello World!')
  })
})
