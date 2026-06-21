import { render, screen } from "@testing-library/react";
import { CompanionPicker } from "@/components/garden/companion-picker";

it("renders five preset companion radio inputs", () => {
  const onChange = () => {};
  render(<CompanionPicker value="fox" onChange={onChange} />);

  const names = ["小茶", "青书", "白露", "月团", "微光"];
  for (const name of names) {
    expect(screen.getByRole("radio", { name: new RegExp(name) })).toBeVisible();
  }
  expect(screen.getAllByTestId("companion-art")).toHaveLength(5);
  for (const artwork of screen.getAllByTestId("companion-art")) {
    expect(artwork.getAttribute("style")).toContain("companion-sprite.webp");
  }
});

it("marks the selected companion as checked", () => {
  render(<CompanionPicker value="owl" onChange={() => {}} />);

  expect(screen.getByRole("radio", { name: /青书/ })).toBeChecked();
  expect(screen.getByRole("radio", { name: /小茶/ })).not.toBeChecked();
});

it("calls onChange when a different companion is selected", async () => {
  let selected = "";
  render(
    <CompanionPicker
      value="fox"
      onChange={(id) => { selected = id; }}
    />,
  );

  const deerRadio = screen.getByRole("radio", { name: /白露/ });
  deerRadio.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(selected).toBe("deer");
});

it("provides a file input for custom avatar", () => {
  render(<CompanionPicker value="fox" onChange={() => {}} />);

  const fileInput = screen.getByLabelText(/自定义头像/);
  expect(fileInput).toHaveAttribute("accept", ".jpg,.jpeg,.png,.webp");
});

it("accepts 'custom' as the selected value", () => {
  render(<CompanionPicker value="custom" onChange={() => {}} />);

  const radios = screen.getAllByRole("radio");
  expect(radios.every((r) => !(r as HTMLInputElement).checked)).toBe(true);
});
