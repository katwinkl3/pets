import React, { useState, useCallback, Component} from 'react';
import { withRouter } from 'react-router-dom';
import './Login.css';
import {Form, Input, Button, message} from 'antd';

function login(email, password) {
  return fetch('http://localhost:3001/login', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
        email,
        password
    }),
    credentials: 'include'
  });
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
        const AntWrappedLoginForm = Form.create()(LoginPage)
        return (
          <div>
            <AntWrappedLoginForm {...this.props}/>
          </div>
        );
    }
}

function LoginPage({ history , form, loginSuccess}) {
  const { getFieldDecorator } = form;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [anyErrors, setError] = useState('');

  const emailChanged = useCallback((e) => {
    setEmail(e.target.value);
  }, [])

  const passwordChanged = useCallback(e => {
    setPassword(e.target.value);
  }, []);

  const validateFields = () => {
    let validated = false;
    form.validateFields((err, values) => {
      if (!err) {
        validated = true;
      }
    });
    return validated;
  }

  const submit = useCallback(async (e) => {
    if (validateFields()) {
      try {
        let data = await login(email, password)
        data.json().then(result => {
          if (result.status === "failed"){
            message.error(result.message);
          } else if (result.status === "success") {
            localStorage.setItem("email", email);
            console.log("the log in button has been pressed")
            loginSuccess();
            history.push('/');
          }
        })
      } catch(e) {
        setError("Unexpected error");
      }
    }
  }, [email, password])

  return (
    <div className="login">
      <h2 className = "login-title">Login</h2>

      <Form>
        <div className="signup-div">
        <Form.Item>
        {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input
              placeholder="Email*"
              onChange={emailChanged}/>
          )}
        </Form.Item>
        <Form.Item>
        {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }],
          })(
            <Input
              placeholder="Password*"
              onChange={passwordChanged}/>
          )}
        </Form.Item>
        <Button className= "login-button" type="primary" htmlType="submit" onClick={submit}>
            Log in
        </Button>
        </div>
        </Form>
    </div>
  );
}

export default withRouter(LoginForm);