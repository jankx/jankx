import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import {
    fetchOptionsRequest,
    fetchOptionsSuccess,
    fetchOptionsFailure,
    saveOptionsRequest,
    saveOptionsSuccess,
    saveOptionsFailure,
} from './actions';

const fetchOptionsEpic = (action$) =>
    action$.pipe(
        ofType('FETCH_OPTIONS_REQUEST'),
        mergeMap(() =>
            ajax.getJSON('/wp-admin/admin-ajax.php?action=fetch_options').pipe(
                map(response => fetchOptionsSuccess(response.data)),
                catchError(error => of(fetchOptionsFailure(error)))
            )
        )
    );

const saveOptionsEpic = (action$) =>
    action$.pipe(
        ofType('SAVE_OPTIONS_REQUEST'),
        mergeMap(action =>
            ajax.post('/wp-admin/admin-ajax.php?action=save_options', {
                data: action.payload,
            }).pipe(
                map(() => saveOptionsSuccess()),
                catchError(error => of(saveOptionsFailure(error)))
            )
        )
    );

const rootEpic = (action$) => {
    return merge(
        fetchOptionsEpic(action$),
        saveOptionsEpic(action$)
    );
};

export default rootEpic;