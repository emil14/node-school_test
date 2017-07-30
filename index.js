'use strict'

const MyForm = {
  validate (formData) {
    const errorFields = []

    // validate name
    // FIXME user can send just spaces
    if (formData.fio.split(' ').length !== 3) errorFields.push('fio')

    // validate email
    const atPosition = formData.email.indexOf('@')
    const domain = formData.email.substring(atPosition + 1)
    const address = formData.email.substring(0, atPosition)
    const resolvedDomains = [
      'ya.ru', 'yandex.ru', 'yandex.ua',
      'yandex.by', 'yandex.kz', 'yandex.com'
    ]
    const domainIsValid = resolvedDomains.includes(domain)
    const hasAddress = address.length !== 0
    const hasAtSign = atPosition !== -1

    if (!hasAtSign || !hasAddress || !domainIsValid) errorFields.push('email')

    // validate number
    const validStart = formData.phone.substring(0, 2) === '+7'
    const validLength = formData.phone.length === 15
    const validFormat = [
      formData.phone.charAt(2) === '(',
      formData.phone.charAt(6) === ')',
      formData.phone.charAt(10) === '-',
      formData.phone.charAt(13) === '-'
    ]

    let sum = 0
    const charIsNumber = char => !isNaN(char)

    for (const char of formData.phone) {
      if (charIsNumber(char)) sum += Number(char)
    }

    if (sum > 30) errorFields.push('phone')

    return {
      isValid: errorFields.length === 0,
      errorFields
    }
  },

  getData () {
    const formNode = document.forms.form
    const formData = new FormData(formNode)
    const resultObj = {}

    for (var [key, value] of formData.entries()) {
      resultObj[key] = value
    }

    return resultObj
  },

  setData () {},

  submit () {
    const formData = MyForm.getData()
    const validationResult = MyForm.validate(formData)

    console.log(validationResult)
  }
}

const submitButton = document.getElementById('submitButton')

submitButton.onclick = event => {
  event.preventDefault()
  MyForm.submit()
}
