import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Detail } from "@/components/HomePage/Detail";
import { recipes } from "@/mocks/recipes";
import { AppStateProvider } from "@/state/AppStateProvider";

describe("Detail", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppStateProvider>{children}</AppStateProvider>
  );

  beforeEach(() => {
    vi.stubGlobal("alert", vi.fn());

    // @ts-expect-error jsdom stub
    global.Notification = { permission: "denied" };
  });

  it("renders ingredients and steps, allows saving rating and note", async () => {
    const user = userEvent.setup();
    const sample = recipes[0];
    render(<Detail recipe={sample} />, { wrapper });

    sample.ingredients.forEach((i) => {
      const matches = screen.getAllByText(new RegExp(i.name, "i"));
      expect(matches.length).toBeGreaterThan(0);
    });

    await user.click(screen.getAllByText("★")[4]);
    const input = screen.getByPlaceholderText(/notes/i);
    await user.type(input, "Tasty!");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/saved:/i)).not.toBeNull();
  });

  it("starts a timer for a step and marks as started", async () => {
    const user = userEvent.setup();
    const sample = recipes[0];
    render(<Detail recipe={sample} />, { wrapper });

    const timerBtns = screen.getAllByRole("button", { name: /timer/i });
    await user.click(timerBtns[0]);

    expect(screen.getByRole("button", { name: /\[Started\]/ })).not.toBeNull();
  });
});
