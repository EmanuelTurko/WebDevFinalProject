import {FC} from 'react'
import ItemsList from '../itemList.tsx'
import usePosts from '../../Hooks/usePosts.ts'

const  PostList:FC = () => {
    const {posts,isLoading,error} = usePosts()
  return (
    <>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ItemsList title='list' items={posts.map(post=>post.title)} onItemSelected={() => {}}/>
    </>
  )
}

export default PostList
