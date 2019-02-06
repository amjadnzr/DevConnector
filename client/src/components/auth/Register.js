import React, { Component } from 'react'
import axios from 'axios'
import classnames from 'classnames'
 class Register extends Component {
     constructor(){
         super();
         this.state={
             name:"",
             email:"",
             password:"",
             password2:"",
             error:{}
             }
             this.onChange=this.onChange.bind(this)
             this.onSubmit=this.onSubmit.bind(this)
     }
     onChange(e){
        this.setState({[e.target.name]:e.target.value})
     }

     onSubmit(e){
       e.preventDefault()

      const newUser={
           name:this.state.name,
           email:this.state.email,
           password:this.state.password,
           password2:this.state.password2
       }
         axios.post('user/register',newUser).then(
             result=>{
                 console.log(result.data)
             }).catch(err=>{this.setState({error:err})})
          }
  render() {
     const {error}=this.state
    return (
        <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                 <div className="form-group">
                  <input type="text" className={classnames('form-control form-control-lg',{'is-invalid':error.name})}  placeholder="Name" name="name" value={this.state.name} onChange={this.onChange} />
                  {error.name && (<div className='invalid-feedback'>{error.name}</div>)}
                </div> 
                <div className="form-group">
                  <input type="email" className={classnames('form-control form-control-lg',{'is-invalid':error.email})} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                  {error.email && (<div className='invalid-feedback'>{error.email}</div>)}
                </div>
                <div className="form-group">
                  <input type="password" className={classnames('form-control form-control-lg',{'is-invalid':error.password})} placeholder="Password" name="password" autoComplete="off" value={this.state.password} onChange={this.onChange} />
                  {error.password && (<div className='invalid-feedback'>{error.password}</div>)}
                </div>
                <div className="form-group">
                  <input type="password" className={classnames('form-control form-control-lg',{'is-invalid':error.password2})} placeholder="Confirm Password" name="password2" autoComplete="off" value={this.state.password2} onChange={this.onChange} />
                  {error.password2 && (<div className='invalid-feedback'>{error.password2}</div>)}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    
    )
  }
}

export default Register;
