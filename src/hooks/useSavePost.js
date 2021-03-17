import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useSavePost() {
  return useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        queryCache.setQueryData(['posts', newPost.id], newPost)

        queryCache.setQueryData('posts', (old) => {
          if (!old) {
            return old
          }
          return old.map((d) => {
            if (d.id === newPost.id) {
              return newPost
            }
            return d
          })
        })
      },
      onSuccess: (data, values) => {
        queryCache.invalidateQueries(['posts', data.id])
        queryCache.invalidateQueries('posts')
      },
    }
  )
}
