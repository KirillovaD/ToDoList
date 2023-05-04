import {authReducer, authThunks} from "./auth.reducer";

let startState: {
  isLoggedIn: boolean
};

beforeEach(() => {
  startState = {
    isLoggedIn: false
  }
})


test('logout  correct', () => {
  
  const action = authThunks.logout.fulfilled({isLoggedIn: false}, 'requestId' );
  const endState = authReducer(startState, action)
  expect(endState.isLoggedIn).toBe(false);
})

