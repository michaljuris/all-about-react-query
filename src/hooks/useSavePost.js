import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useSavePost() {
  return useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onSuccess: (data, values) => {
        queryCache.setQueryData(['posts', data.id], data)
        queryCache.setQueryData('posts', (old) => {
          return old.map((d) => {
            if (d.id === data.id) {
              return data
            }
            return d
          })
        })
      },
    }
  )
}
