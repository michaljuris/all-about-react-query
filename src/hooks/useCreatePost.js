import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useCreatePost() {
  return useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onSuccess: () => {
        queryCache.invalidateQueries(['posts'])
      },
    }
  )
}
