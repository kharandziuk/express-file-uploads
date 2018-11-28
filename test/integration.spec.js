const S = require('supertest')
const { expect } = require('chai')
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const path = require('path')
const uploadDir = path.resolve(__dirname, 'uploads')
const crypto = require("crypto")
const { promisify } = require('util')

function streamToPromise(stream) {
  return new Promise(function(resolve, reject) {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

const getId = () => crypto.randomBytes(16).toString("hex")

app.post('/upload', (req, res) => {
  const [type, extension] = req.header('Content-Type').split('/')
  console.log(req.header('Content-Length'))
  if (type !== 'image') {
    return res.status(400).json({error: `Content-Type header isn't image/*`})
  }
  if (!['jpeg', 'png', 'gif'].includes(extension)) {
    return res.status(400).json({error: 'Content-Type should be [jpeg, png, gif]'})
  }
  const fileName = `${getId()}.${extension}`
  const rs = fs.createWriteStream(path.resolve(uploadDir, fileName))

  streamToPromise(req.pipe(rs)).then(() => {
    res.status(201).json({ status: 'done', id: fileName})
  })
})

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
describe('server', () => {
  it('can upload image inside of request body', async () => {
    const data = await promisify(fs.readFile)('test.jpeg')
    const { body }= await S(app)
      .post('/upload')
      .set('Content-Type', 'image/jpeg')
      .send(data)
    expect(body.status).eql('done')
  })
})
