import { Box, Title } from "@mantine/core";
import { colors } from "./colors";
import { Board } from "./components/Board/Board";

function App() {
  return (
    <Box
      style={{ backgroundColor: colors.background, minHeight: "100vh" }}
      p="xl"
    >
      <Title order={2} mb="xl" c="gray.1">
        Tasks
      </Title>
      <Board />
    </Box>
  );
}

export default App;
