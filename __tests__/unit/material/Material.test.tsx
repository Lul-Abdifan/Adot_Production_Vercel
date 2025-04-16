import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Material from "@/components/material/Material";

describe("Material", () => {
  it("renders a heading", () => {
    render(<Material />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
