import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['normal', 'thick'] },
    children: { control: 'text' },
  },
  args: {
    variant: 'normal',
  },
  // Divider is w-full — constrain width so it renders visibly in the canvas.
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Divider>;

// ─── Interactive playground (Controls panel) ────────────────────────────────
export const Playground: Story = {};

// ─── Individual types ───────────────────────────────────────────────────────
export const Normal: Story = { args: { variant: 'normal' } };
export const Thick: Story = { args: { variant: 'thick' } };
export const Text: Story = { args: { children: '텍스트' } };

// ─── All types ──────────────────────────────────────────────────────────────
export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-muted">Normal</span>
        <Divider variant="normal" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-muted">Thick</span>
        <Divider variant="thick" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-muted">Text</span>
        <Divider>텍스트</Divider>
      </div>
    </div>
  ),
};

// ─── In context — separating stacked content ────────────────────────────────
export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-sm text-foreground">
      <p>Section one</p>
      <Divider />
      <p>Section two</p>
      <Divider>또는</Divider>
      <p>Section three</p>
    </div>
  ),
};
