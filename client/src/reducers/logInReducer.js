import { FETCH_STUDENT } from '../actions/types';

const initialState = {
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_STUDENT:
      return {
        ...state,
        item: action.payload
      };

    default:
      return state;
  }
}