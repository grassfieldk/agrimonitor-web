import type { Meta, StoryObj } from "@storybook/react";
import { ToggleButton } from "@/components/ui/ToggleButton";
import type { Size } from "@/types/ui";

const meta: Meta<typeof ToggleButton> = {
  title: "UI/ToggleButton",
  component: ToggleButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"] as Size[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const On: Story = {
  args: {
    isOn: true,
    onToggle: () => {},
    children: "有効",
  },
};

export const Off: Story = {
  args: {
    isOn: false,
    onToggle: () => {},
    children: "無効",
  },
};

export const Small: Story = {
  args: {
    isOn: true,
    onToggle: () => {},
    children: "小サイズ",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    isOn: true,
    onToggle: () => {},
    children: "中サイズ",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    isOn: true,
    onToggle: () => {},
    children: "大サイズ",
    size: "lg",
  },
};
