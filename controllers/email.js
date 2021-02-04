const nodemailer = require('nodemailer')
const config = require('../config/app')
const QRCode = require('qrcode')
const hbs = require('handlebars')
const fs = require('fs')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.appEmail,
    pass: config.appEmailPass
  }
})

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

exports.emailing = async (data) => {
  let product = data.invoice
  let subTotal = data.subTotal
  let qr = await QRCode.toDataURL(data.uniqId)
  readHTMLFile(__dirname + '../../hmtl/invoice.html', function (err, html) {
    const template = hbs.compile(html)
    let render = {
      qrCode: qr,
      product: product,
      subTotal: subTotal
    }
    let htmlToSend = template(render)
    let mailOption = {
      from: config.appEmail,
      to: data.email,
      subject: 'your qr-code order',
      attachDataUrls: true,
      html: htmlToSend
    }
    transporter.sendMail(mailOption, (err, info) => {
      if (err) throw err
      console.log('Email sent: ' + info.response);
    })
  })
}