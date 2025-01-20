import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// Configure testing-library
configure({
  asyncUtilTimeout: 5000,
  testIdAttribute: "data-testid",
});

// Silence les warnings de l'API React concernant act()
global.IS_REACT_ACT_ENVIRONMENT = true;
