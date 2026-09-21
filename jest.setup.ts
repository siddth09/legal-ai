// jest.setup.ts
// Extends Jest with @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
import "@testing-library/jest-dom";

// jsdom does not implement scrollIntoView — mock it globally
window.HTMLElement.prototype.scrollIntoView = jest.fn();
