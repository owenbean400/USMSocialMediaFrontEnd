export const POSTS_RECOMMENDED = 'POSTS_RECOMMENDED';

export const addPost = (post) => ({
    type: POSTS_RECOMMENDED,
    payload: post
});