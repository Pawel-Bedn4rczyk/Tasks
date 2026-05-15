import { Box } from "@mantine/core";
import { colors } from "./colors";
import { Board } from "./components/Board/Board";

function App() {
  return (
    <Box
      style={{ backgroundColor: colors.background, minHeight: "100vh" }}
      p="xl"
    >
      <Board />
    </Box>
  );
}

export default App;
