import { Spinner } from "@chakra-ui/react";
export default function CustomSpinner() {
  return (
    <main className="flex w-full items-center justify-center h-full">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </main>
  );
}