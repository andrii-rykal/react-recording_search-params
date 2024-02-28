/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Post } from '../types';
import * as postService from '../services/post';

export const PostsContext = React.createContext({
  posts: [] as Post[],
  loading: false,
  errorMessage: '',
  loadPosts: async (userId: number) => {},
  addPost: async (data: Omit<Post, 'id'>) => {},
  deletePost: async (id: number) => {},
  updatePost: async (post: Post) => {},
});

type Props = {
  children: React.ReactNode;
}

export const PostsProvider: React.FC<Props> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadPosts(0);
  }, []);

  const loadPosts = useCallback((userId = 0) => {
    setLoading(true); 

    return postService.getUserPosts(userId)
      .then(setPosts)
      .catch(() => setErrorMessage('Try again later'))
      .finally(() => setLoading(false));
  }, []);

  const addPost = useCallback(({ title, body, userId }: Omit<Post, 'id'>) => {
    setErrorMessage('');

    return postService.createPost({ title, body, userId })
      .then(newPost => {
        setPosts(currentPosts => [...currentPosts, newPost]);
      })
      .catch((error) => {
        setErrorMessage(`Can't create a post`);
        throw error;
      });
  }, []);

  const deletePost = useCallback((postId: number) => {
    let prevPosts: Post[] = [];

    setPosts(currentPosts => {
      prevPosts = currentPosts;

      return currentPosts.filter(post => post.id !== postId);
    });

    return postService.deletePost(postId)
      .then(() => {})
      .catch((error) => {
        setPosts(prevPosts);
        setErrorMessage(`Can't delete a post`);
        throw error;
      });
  }, []);

  const updatePost = useCallback((updatedPost: Post) => {
    setErrorMessage('');

    return postService.updatePost(updatedPost)
      .then(post => {
        setPosts(currentPosts => {
          const newPosts = [...currentPosts];
          const index = newPosts.findIndex(post => post.id === updatedPost.id);
    
          newPosts.splice(index, 1, post);
    
          return newPosts;
        });
      })
      .catch((error) => {
        setErrorMessage(`Can't update a post`);
        throw error;
      });
  }, []);

  const value = useMemo(() => ({
    posts,
    loading,
    errorMessage,
    loadPosts,
    addPost,
    deletePost,
    updatePost
  }), [posts, loading, errorMessage])

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  )
};
