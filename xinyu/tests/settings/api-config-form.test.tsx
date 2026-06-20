import { render, screen } from "@testing-library/react";
import { ApiConfigForm } from "@/features/settings/api-config-form";
import { vi } from "vitest";

it("never exposes the key as plain text", () => {
  render(<ApiConfigForm onTest={vi.fn()} />);
  expect(screen.getByLabelText("API 密钥")).toHaveAttribute("type", "password");
  expect(screen.getByLabelText("仅本次会话使用")).toBeChecked();
});

it("renders all required fields", () => {
  render(<ApiConfigForm onTest={vi.fn()} />);
  expect(screen.getByLabelText("API 地址")).toBeVisible();
  expect(screen.getByLabelText("API 密钥")).toBeVisible();
  expect(screen.getByLabelText("模型名称")).toBeVisible();
  expect(screen.getByRole("button", { name: "测试连接" })).toBeVisible();
});
