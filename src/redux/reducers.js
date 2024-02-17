import { POSTS_RECOMMENDED } from "./actions";

const initialState = {
    posts: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case POSTS_RECOMMENDED:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            };
        default:
            return state;
    }
};

export default reducer;