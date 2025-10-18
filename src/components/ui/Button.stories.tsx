import type { Meta, StoryObj } from "@storybook/react";
import type { Size, Variant } from "../../types/ui";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "accent"] as Variant[],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"] as Size[],
    },
    icon: {
      control: { type: "select" },
      options: ["next", "prev", "close"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "プライマリ",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "セカンダリ",
    variant: "secondary",
  },
};

export const Accent: Story = {
  args: {
    children: "アクセント",
    variant: "accent",
  },
};

export const Ghost: Story = {
  args: {
    children: "ゴースト",
    variant: "ghost",
  },
};

export const Text: Story = {
  args: {
    children: "テキスト",
    variant: "text",
  },
};

export const Small: Story = {
  args: {
    children: "小サイズ",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "大サイズ",
    size: "lg",
  },
};

export const Next: Story = {
  args: {
    children: "次へ",
    icon: "next",
  },
};

export const Prev: Story = {
  args: {
    children: "前へ",
    icon: "prev",
  },
};

export const Close: Story = {
  args: {
    children: "閉じる",
    icon: "close",
  },
};

export const Disabled: Story = {
  args: {
    children: "無効",
    disabled: true,
  },
};
