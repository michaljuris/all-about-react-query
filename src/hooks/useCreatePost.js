import axios from 'axios'
import { queryCache, useMutation } from 'react-query'

export default function useCreatePost() {
  return useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        const oldPostsSnapshot = queryCache.getQueryData('posts')

        if (queryCache.getQueryData('posts')) {
          queryCache.setQueryData('posts', (old) => [...old, newPost])
        }

        return () => queryCache.setQueryData('posts', oldPostsSnapshot) // this will be accessible as rollbackValue (3rd argument) in onError fn
      },
      onError: (error, newPost, rollBack) => {
        if (rollBack) rollBack()
      },
      onSettled: () => {
        // po error i success
        queryCache.invalidateQueries('posts')
      },
    }
  )
}
