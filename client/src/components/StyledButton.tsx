import { Button } from "@chakra-ui/react";
import React from "react";

interface StyledButtonProps {
  isLoading: boolean;
}

const StyledButton: React.FC<StyledButtonProps> = ({ children, isLoading }) => {
  return (
    <Button
      type="submit"
      colorScheme="teal"
      mt={4}
      isLoading={isLoading}
      bg={"#00bac7"}
      _hover={{ bg: "#00d1e0" }}
    >
      {children}
    </Button>
  );
};

export default StyledButton;
