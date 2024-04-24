import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memberData: [], // 초기 상태는 빈 배열로 설정
};

const loginResponseReducer = createSlice({
  name: 'loginResponse',
  initialState,
  reducers: {
    success: (state, action) => {
      state.memberData = action.payload;
    }, 
    close: (state) => {
        state.memberData = [];
    }
  }
});

export const { success, close } = loginResponseReducer.actions;
export default loginResponseReducer.reducer;
