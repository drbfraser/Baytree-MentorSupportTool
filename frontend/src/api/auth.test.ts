import { expect } from '@jest/globals'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

describe('authentication', () => {
  it('logout', async () => {
    // mock
    mock.onGet('/logout').reply(200)
    // when
    await axios.get('/logout')
    // then
    expect(mock.history.get[0].url).toEqual('/logout')
  })
})
