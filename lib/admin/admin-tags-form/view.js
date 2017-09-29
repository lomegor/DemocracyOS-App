import t from 't-component'
import AddUserInput from '../admin-permissions/add-user-input/add-user-input'
import { domRender } from '../../render/render'
import FormView from '../../form-view/form-view'
import images from '../../tags-images'
import template from './template.jade'
import userTemplate from './user.jade'

export default class TagForm extends FormView {
  constructor (tag) {
    var action = '/api/tag/'
    var title
    if (tag) {
      action += tag.id
      title = 'admin-tags-form.title.edit'
    } else {
      action += 'create'
      title = 'admin-tags-form.title.create'
    }

    var options = {
      form: { title: title, action: action },
      tag: tag || { clauses: [], experts: [] },
      images: images,
      list: []
    }

    super(template, options)

    this.options = options

    this.list = this.el[0].querySelector('.experts [data-list]')
    this.expertsInput = this.el[0].querySelector('#experts')
    this.initUsers()
    this.initAddUserInput()
  }

  initUsers () {
    this.options.tag.experts.forEach((user) => {
      if (!user) return
      this.onSelect(user)
    })
  }

  initAddUserInput () {
    this.addUserInput = new AddUserInput({
      onSelect: this.bound('onSelect'),
      container: this.el[0].querySelector('.experts label')
    })
  }

  /**
   * Build view's `this.el`
   */

  switchOn () {
    this.on('success', this.bound('onSuccess'))
    this.bind('click', 'input[name="image"]', this.bound('onImageClick'))
    this.bind('click', '.revoke', this.bound('onRevoke'))
  }

  renderUser (user) {
    return domRender(userTemplate, { user })
  }

  /**
   * Handle `success` event
   *
   * @api private
   */

  onSuccess (res) {
    this.onSave()
  }

  onSave () {
    this.messages([t('admin-tags-form.message.onsuccess')])
  }

  onImageClick (ev) {
    this.find('input[name="image"]').removeClass('error')
  }

  onSelect (user) {
    if (this.list.querySelector(`[data-user="${user.id}"]`)) {
      return Promise.resolve()
    }

    this.list.appendChild(this.renderUser(user))
    if (!this.expertsInput.value) {
      this.expertsInput.value = user.id
    } else {
      this.expertsInput.value = this.expertsInput.value + ',' + user.id
    }
    return Promise.resolve()
  }

  onRevoke (evt) {
    const btn = evt.target
    const userId = btn.getAttribute('data-revoke')

    this.list.removeChild(btn.parentNode)
    this.expertsInput.value = this.expertsInput.value.replace(new RegExp(userId + ',?'), '')
  }
}
