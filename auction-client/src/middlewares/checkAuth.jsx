import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { socketConnect, socketConnected } from "../redux/clientStore";
import { socket } from "../connection/socket";

export const CheckAuth = ({ children }) => {
  const client = JSON.parse(sessionStorage.getItem("client"));
  const nav = useNavigate();
  const dispatch = useDispatch();
  function onAuth(res) {
    if (res) {
      return dispatch(socketConnected(res));
    }

    return nav("/auth");
  }
  useEffect(() => {
    if (!client) {
      return nav("/auth");
    }
    dispatch(socketConnect({ id: client.id }));

    socket.on("userAuth", onAuth);

    return () => {
      socket.off("userAuth", onAuth);
    };
  }, []);
  if (client) {
    return children;
  }
};
