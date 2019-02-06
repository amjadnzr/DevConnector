const validator= require('validator')
const isEmpty = require('./is-empty')


module.exports = function(data){
  
    let errors={}

    data.email= !isEmpty(data.email) ? data.email :''
    data.password= !isEmpty(data.password) ? data.password :'' 
    

    

    if(validator.isEmpty(data.email)){
        errors.email='Email field is required'
    }

    if(validator.isEmpty(data.password)){
        errors.password='Password field is required'
    }

    
    if(!validator.isEmail(data.email) && !validator.isEmpty(data.email) ){
        errors.email='Email not valid'
    }




   





return({
    errors,
    isValid: isEmpty(errors)
})
}