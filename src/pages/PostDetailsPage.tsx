/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Post } from '../types';
import { getPost } from '../services/post';
import { Loader } from '../components/Loader';
import { PostForm } from '../components/PostForm';
import { PostsContext } from '../store/PostsContext';
import { useUsers } from '../store/UsersContext';

export const PostDetailsPage = () => {
  // #region posts
  const { updatePost } = useContext(PostsContext);
  const users = useUsers();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // #endregion

  const { postId } = useParams();
  const normalizedPostId = postId ? +postId : 0;
  const navigate = useNavigate();
  const { state } = useLocation();

  function goBack() {
    navigate({ pathname: '..', search: state?.search })
  }

  useEffect(() => {
    setErrorMessage('');
    setLoading(true);

    getPost(normalizedPostId)
      .then(setPost)
      .catch(() => {
        setErrorMessage(`Can't load a post`);
        setTimeout(goBack, 2000);
      })
      .finally(() => setLoading(false));
  }, [normalizedPostId]);

  if (!normalizedPostId || !Number.isInteger(normalizedPostId)) {
    return <Navigate to=".." />;
  }

  return <>
    <h1 className="title">Edit post {normalizedPostId}</h1>

    {loading && <Loader />}

    {errorMessage && (
      <p className="notification is-danger">{errorMessage}</p>
    )}

    {!loading && !errorMessage && post && (
      <PostForm
        users={users}
        fixedUserId={11}
        post={post}
        onReset={goBack}
        onSubmit={postData => updatePost(postData).then(goBack)}
      />
    )}
  </>;
};
