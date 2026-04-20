import request from './request'

export const noteApi = {
  list() {
    return request.get('/v1/demo/notes')
  },
  create(data: { title: string; content: string }) {
    return request.post('/v1/demo/notes', data)
  },
  listAll() {
    return request.get('/v1/demo/notes/all')
  },
}
