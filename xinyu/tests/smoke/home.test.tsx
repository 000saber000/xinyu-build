import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

it("introduces the courtyard journey", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { name: "今天，想去哪里走走？" }),
  ).toBeVisible();
});
