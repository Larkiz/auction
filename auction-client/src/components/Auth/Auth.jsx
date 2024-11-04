import { Button, Container, FormControl, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { socketConnect, socketConnected } from "../../redux/clientStore";
import { socket } from "../../connection/socket";
import { useNavigate } from "react-router";

export const Auth = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const nav = useNavigate();

  function connect() {
    dispatch(socketConnect({ name: name }));
  }

  useEffect(() => {
    function authHandle(res) {
      if (res) {
        dispatch(socketConnected(res));

        sessionStorage.setItem("client", JSON.stringify(res));
        nav("/");
      }
    }
    socket.on("userAuth", authHandle);

    return () => {
      socket.off("userAuth", authHandle);
    };
  }, []);

  return (
    <Container maxWidth="xs">
      <FormControl>
        <TextField
          label={"Имя"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button onClick={connect} variant="contained">
          Войти
        </Button>
      </FormControl>
    </Container>
  );
};
