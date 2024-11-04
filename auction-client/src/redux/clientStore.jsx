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
    modals: { lot: false },
  },
  reducers: {
    socketConnect: (state, { payload }) => {
      socket.emit("userAuth", payload);
    },
    socketConnected: (state, { payload }) => {
      state.data = payload;
    },
    createLot: (state, { payload }) => {
      state.data.lots = [payload, ...state.data.lots];
    },
    lotModalOpen: (state, { payload }) => {
      state.modals.lot = true;
      socket.emit("room-check", { id: payload });
    },
    lotModalClose: (state, { payload }) => {
      state.modals.lot = false;
      socket.emit("room-leave", { id: payload });
    },
  },
});

export const {
  socketConnect,
  socketConnected,
  createLot,
  lotModalOpen,
  lotModalClose,
} = clientSlice.actions;

export const { clientReducer: reducer } = clientSlice;
