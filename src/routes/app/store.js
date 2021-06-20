import { writable } from 'svelte/store'
import { get } from '../../commons/api'

function create_user_store () {
  const default_data = {
    username: '',
    first_name: '',
    mobile: null,
    email: null,
    role: null
  }
  const store = writable(default_data)
  // run validation only on browser.
  if (process.browser) {
    get({ url: '/auth/me'})
      .then(data => {
        store.set({
          username: data.username,
          first_name: data.first_name,
          mobile: data.mobile,
          email: data.email,
          role: data.role
        })
      })
      .catch(err => {
        // REDIRECT TO LOGIN. MAYBE
        console.log('ERROR WHEN VALIDATING USER')
        console.log(err)
      })
  }
  return store
}

function create_delete_confirm () {
  const default_data = {
    entity: 'pelanggan',
    id: 0,
    value: false,
    on_yes: null
  }
  const { subscribe, update } = writable(default_data)
  return {
    subscribe,
    show: ({ entity, id, on_yes: _yes }) => {
      const _on_yes = () => {
        _yes()
        update(data => {
          return {
            ...data,
            value: false
          }
        })
      }
      update(data => {
        return {
          ...data,
          value: true,
          entity,
          id,
          on_yes: _on_yes
        }
      })
    },
    hide: () => {
      update(data => {
        return {
          ...data,
          value: false
        }
      })
    }
  }
}

export const del_confirm = create_delete_confirm()
export const user = create_user_store()