import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileSearch } from "./ProfileSearch";

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("ProfileSearch", () => {
  it("рендерить поле пошуку і кнопку", () => {
    renderWithProviders(<ProfileSearch />);

    expect(
      screen.getByPlaceholderText(/введи github username/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Шукати")).toBeInTheDocument();
  });
});