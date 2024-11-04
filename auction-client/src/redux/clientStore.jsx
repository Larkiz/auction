import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../connection/socket";

export const clientSlice = createSlice({
  name: "client",
  initialState: {
    data: {
      name: "",
      id: null,
      lots: [],
    },
  },
  reducers: {
    socketConnect: (state, { payload }) => {
      socket.emit("userAuth", payload);
    },
    socketConnected: (state, { payload }) => {
      state.data = payload;
    },
    createLot: (state, { payload }) => {
      // console.log(payload);

      state.data.lots = [payload, ...state.data.lots];
    },
  },
});

export const { socketConnect, socketConnected, createLot } =
  clientSlice.actions;

export const { clientReducer: reducer } = clientSlice;
