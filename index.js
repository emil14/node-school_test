'use strict'

const MyForm = {
  validate () {
    return {
      isValid: false,
      errorFields: ['', '']
    }
  },

  getData () {
    return {}
  },

  setData () {},

  submit () {}
}

const globalObject = window || global

globalObject.myForm = MyForm
