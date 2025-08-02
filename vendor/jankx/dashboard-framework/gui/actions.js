export const fetchOptionsRequest = () => ({ type: 'FETCH_OPTIONS_REQUEST' });
export const fetchOptionsSuccess = (data) => ({ type: 'FETCH_OPTIONS_SUCCESS', payload: data });
export const fetchOptionsFailure = (error) => ({ type: 'FETCH_OPTIONS_FAILURE', payload: error });

export const saveOptionsRequest = () => ({ type: 'SAVE_OPTIONS_REQUEST' });
export const saveOptionsSuccess = () => ({ type: 'SAVE_OPTIONS_SUCCESS' });
export const saveOptionsFailure = (error) => ({ type: 'SAVE_OPTIONS_FAILURE', payload: error });