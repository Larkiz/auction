import { Stack, Typography } from "@mui/material";

export const AuctionTitle = ({ name, time }) => {
  const min = Math.floor(time / 60);

  const sec = ("0" + Math.floor(time - min * 60)).slice(-2);
  return (
    <Stack width={"100%"} direction={"row"}>
      <Typography flexGrow={1} sx={{ padding: "14px 26px" }} variant="h4">
        Ход торгов на {name}
      </Typography>
      <Typography sx={{ padding: "14px 26px" }} variant="h4">
        {time !== 0 ? (
          <>
            {" "}
            {min}:{sec}
          </>
        ) : (
          "Аукцион окончен"
        )}
      </Typography>
    </Stack>
  );
};
