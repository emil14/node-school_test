'use strict'

const formNode = document.forms.form
const submitButton = document.getElementById('submitButton')

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
      ].every(cond => cond === true)

      let sum = 0
      const charIsNumber = char => !isNaN(char)

      for (const char of phone) {
        if (charIsNumber(char)) sum += Number(char)
      }

      return validStart && validLength && validFormat && sum > 30
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
    const formData = new FormData(formNode)
    const resultObj = {}

    for (var [key, value] of formData.entries()) {
      resultObj[key] = value
    }

    return resultObj
  },

  setData () {},

  submit() {
    const formData = MyForm.getData()
    const validationResult = MyForm.validate(formData)
    const resultContainer = document.getElementById('resultContainer')

    function makeRequest(url) {
      fetch(url)
        .then(resp => resp.json())
        .then(json => {
          if (json.status === 'success') resultContainer.innerHTML = json.status

          if (json.status === 'error') resultContainer.innerHTML = json.reason

          if (json.status === 'progress') {
            resultContainer.innerHTML = json.reason
            submitButton.disabled = true

            setTimeout(() => {
              // makeRequest()
              submitButton.disabled = false
            }, json.timeout)
          }

          resultContainer.classList.add(json.status)
        })
    }

    for (const field of formNode.elements) {
      const isInvalid = validationResult.errorFields.includes(field.name)
      const hasErrorClass = field.classList.contains('error')

      if (isInvalid && !hasErrorClass) field.classList.add('error')
      else if (!isInvalid && hasErrorClass) field.classList.remove('error')
    }

    if (validationResult.isValid) makeRequest(formNode.action)
  }
}

submitButton.onclick = event => {
  event.preventDefault()
  MyForm.submit()
}
