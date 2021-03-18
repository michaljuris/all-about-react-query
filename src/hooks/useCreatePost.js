import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

export default function useCreatePost() {
  const queryClient = useQueryClient()

  const { mutate, ...rest } = useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        const oldPostsSnapshot = queryClient.getQueryData('posts')

        if (queryClient.getQueryData('posts')) {
          queryClient.setQueryData('posts', (old) => [...old, newPost])
        }

        return () => queryClient.setQueryData('posts', oldPostsSnapshot) // this will be accessible as rollbackValue (3rd argument) in onError fn
      },
      onError: (error, newPost, rollBack) => {
        if (rollBack) rollBack()
      },
      onSettled: () => {
        // po error i success
        queryClient.invalidateQueries('posts')
      },
    }
  )

  return [mutate, rest]
}
