import { FETCH_STUDENT } from './types';


export  const registerStudent = inputData => dispatch => {
  fetch('http://localhost/addStudent', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(inputData)
  })
    .then(res => res.json())
    .then(data =>
      dispatch({
        type: FETCH_STUDENT,
        payload: data
      })

    );
    
};

export  const registerTeacher = inputData => dispatch => {
    fetch('http://localhost:3000/addTeacher', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(inputData)
    })
      .then(res => res.json())
      .then(data =>
        dispatch({
          type: FETCH_STUDENT,
          payload: data
        })
  
      );
      
  };