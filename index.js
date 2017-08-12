'use strict'

const MyForm = {
  validate (formData) {
    function validateName (name) {
      return name.split(' ').length === 3 && /\S/.test(name)
    }

    function validateEmail (email) {
      const resolvedDomains = [
        'ya.ru', 'yandex.ru', 'yandex.ua',
        'yandex.by', 'yandex.kz', 'yandex.com'
      ]
      const atPosition = email.indexOf('@')
      const domain = email.substring(atPosition + 1)
      const address = email.substring(0, atPosition)
      const isResolvedDomain = resolvedDomains.includes(domain)
      const hasAddress = address.length !== 0
      const hasAtSign = atPosition !== -1
      const isValidEmail = hasAddress && hasAtSign

      return isValidEmail && isResolvedDomain
    }

    function validatePhone (phone) {
      const validStart = phone.substring(0, 2) === '+7'
      const validLength = phone.length === 16
      const validFormat = [
        phone.charAt(2) === '(',
        phone.charAt(6) === ')',
        phone.charAt(10) === '-',
        phone.charAt(13) === '-'
      ]

      let sum = 0
      const charIsNumber = char => !isNaN(char)

      for (const char of phone) {
        if (charIsNumber(char)) sum += Number(char)
      }

      return validStart && validLength && validFormat.every(cond => cond === true) && sum > 30
    }

    const errorFields = []

    if (!validateName(formData.fio)) errorFields.push('fio')
    if (!validateEmail(formData.email)) errorFields.push('email')
    if (!validatePhone(formData.phone)) errorFields.push('phone')

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
