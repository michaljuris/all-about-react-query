import axios from 'axios'
import { queryCache, useMutation, useQueryClient } from 'react-query'

export default function useSavePost() {
  const queryClient = useQueryClient()

  const { mutate, ...rest } = useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        const oldPostsSnapshot = queryClient.getQueryData('posts')
        const oldPostSnapshot = queryClient.getQueryData(['posts', newPost.id])

        queryClient.setQueryData(['posts', newPost.id], newPost)
        queryClient.setQueryData('posts', (old) => {
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

        return () => {
          queryClient.setQueryData(['posts', newPost.id], oldPostSnapshot)
          queryClient.setQueryData('posts', oldPostsSnapshot)
        }
      },
      onError: (error, newPost, rollback) => {
        if (rollback) rollback()

        queryClient.invalidateQueries(['posts', newPost.id])
        queryClient.invalidateQueries('posts')
      },
      onSuccess: (data, values) => {
        queryClient.invalidateQueries(['posts', data.id])
        queryClient.invalidateQueries('posts')
      },
    }
  )

  return [mutate, rest]
}
