import { Button, Stack } from "@mui/material";
const actionsSx = { width: 150 };
export const UserActions = ({ submitChange }) => {
  return (
    <Stack alignItems={"center"} spacing={2}>
      <Button sx={actionsSx} variant="contained" onClick={submitChange}>
        Подтвердить
      </Button>
      <Button sx={actionsSx} variant="contained" onClick={submitChange}>
        Пропустить
      </Button>
    </Stack>
  );
};
