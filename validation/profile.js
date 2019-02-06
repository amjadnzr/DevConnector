const validator= require('validator')
const isEmpty = require('./is-empty')


module.exports = function(data){
  
    let errors={}

    data.handle= !isEmpty(data.handle) ? data.handle :''
    data.skills= !isEmpty(data.skills) ? data.skills :'' 
    data.status= !isEmpty(data.status) ? data.status :''
    data.website= !isEmpty(data.website) ? data.website :''
    data.facebook= !isEmpty(data.facebook) ? data.facebook :''
    data.twitter= !isEmpty(data.twitter) ? data.twitter :''
    data.youtube= !isEmpty(data.youtube) ? data.youtube :''
    data.linkedin= !isEmpty(data.linkedin) ? data.linkedin :''
    data.instagram= !isEmpty(data.instagram) ? data.instagram :''

    if(validator.isEmpty(data.handle)){
        errors.handle='Profile Handle is required'
    }
    

    // if(!validator.isLength(data.handle,{min:2,max:40})){
    //     errors.handle='handle should be in between 2 to 40 characters'
    // }

    
    if(validator.isEmpty(data.skills)){
        errors.skills='Profile skills is required'       
    }
    
    if(validator.isEmpty(data.status)){
        errors.status='Profile status is required'
    }

    if(!validator.isEmpty(data.website)){
        if(!validator.isURL(data.website)){
        errors.website='Website doesnt exist'
        }
    }
       
    if(!validator.isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
        errors.youtube='youtube doesnt exist'
        }
    }
    

    if(!validator.isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
        errors.facebook='facebook doesnt exist'
        }
    }

    if(!validator.isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
        errors.linkedin='linkedin doesnt exist'
        }
    }

    if(!validator.isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
        errors.instagram='instagram doesnt exist'
        }
    }

    if(!validator.isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
        errors.twitter='twitter doesnt exist'
        }
    }





return({
    errors,
    isValid: isEmpty(errors)
})
}