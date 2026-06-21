import { render, screen } from "@testing-library/react";
import { ApiConfigForm } from "@/features/settings/api-config-form";
import { vi } from "vitest";

it("asks only for a DeepSeek API key", () => {
  render(<ApiConfigForm onTest={vi.fn()} />);
  expect(screen.getByLabelText("DeepSeek API 密钥")).toHaveAttribute("type", "password");
  expect(screen.queryByLabelText("API 地址")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("模型名称")).not.toBeInTheDocument();
});

it("renders the test connection button", () => {
  render(<ApiConfigForm onTest={vi.fn()} />);
  expect(screen.getByRole("button", { name: "测试连接" })).toBeVisible();
});
