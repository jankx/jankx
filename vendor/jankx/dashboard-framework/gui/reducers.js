const initialState = {
    formData: {},
    loading: false,
    error: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_OPTIONS_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_OPTIONS_SUCCESS':
            return { ...state, loading: false, formData: action.payload };
        case 'FETCH_OPTIONS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'SAVE_OPTIONS_REQUEST':
            return { ...state, loading: true };
        case 'SAVE_OPTIONS_SUCCESS':
            return { ...state, loading: false };
        case 'SAVE_OPTIONS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default reducer;