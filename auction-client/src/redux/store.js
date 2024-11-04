import { configureStore } from "@reduxjs/toolkit";
import { clientSlice } from "./clientStore";

export const store = configureStore({
  reducer: { client: clientSlice.reducer },
});
