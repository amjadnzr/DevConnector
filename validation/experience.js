const validator= require('validator')
const isEmpty = require('./is-empty')


module.exports = function(data){
  
    let errors={}

    data.title = !isEmpty(data.title) ? data.title :''
    data.company= !isEmpty(data.company) ? data.company :'' 
    data.from= !isEmpty(data.from) ? data.from :'' 

    

    if(validator.isEmpty(data.title)){
        errors.title='job title field is required'
    }

    if(validator.isEmpty(data.company)){
        errors.company='company field is required'
    }

    if(validator.isEmpty(data.from)){
        errors.from='from when field is required'
    }

    
return({
    errors,
    isValid: isEmpty(errors)
})
}