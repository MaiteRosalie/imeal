import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/Modal";

describe("Modal", () => {
  it("renders children and closes on overlay/close click", async () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).not.toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "✕" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    render(
      <Modal onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    const overlay = document.querySelector(
      '[class*="bg-black/50"]'
    ) as HTMLElement;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
