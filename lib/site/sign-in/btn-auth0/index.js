import React, { Component } from 'react'
import t from 't-component'

export default class BtnAuth0 extends Component {
  static defaultProps = {
    action: '/auth/Auth0'
  }

  render () {
    const { action } = this.props

    return (
      <form
        className='btn-auth0-form'
        action={action}
        method='get'
        role='form'>
        <button
          className='btn btn-block btn-auth0'
          type='submit'>
          {t('signin.login-with-auth0')}
        </button>
      </form>
    )
  }
}
