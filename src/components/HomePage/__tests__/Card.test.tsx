import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@/components/HomePage/Card";
import { recipes } from "@/mocks/recipes";

describe("Card", () => {
  const sample = recipes[0];

  it("renders recipe title, description and tags", () => {
    const onClick = vi.fn();
    render(<Card recipe={sample} onClick={onClick} />);

    expect(screen.getByRole("heading", { name: sample.title })).not.toBeNull();
    expect(screen.getByText(sample.description)).not.toBeNull();
    sample.dietaryTags.forEach((tag) => {
      expect(screen.getByText(new RegExp(tag, "i"))).not.toBeNull();
    });
    expect(screen.getByText(new RegExp(sample.difficulty, "i"))).not.toBeNull();
    expect(screen.getByText(new RegExp(sample.cookingTime.replace(/\s/g, "\\s")))).not.toBeNull();
  });

  it("calls onClick when clicking Detail button", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Card recipe={sample} onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: /detail/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});


