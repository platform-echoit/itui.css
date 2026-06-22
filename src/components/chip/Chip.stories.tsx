import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, type ChipSize, type ChipVariant } from './Chip';
import { Avatar } from '../avatar';

/** Inline check icon — Chip auto-sizes direct SVG children to 16px. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
    size: { control: 'inline-radio', options: ['lg', 'md', 'sm'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    leading: { control: false },
    onClick: { control: false },
    onClose: { control: false },
  },
  args: {
    variant: 'outline',
    size: 'md',
    selected: false,
    disabled: false,
    children: '텍스트',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: ChipSize[] = ['lg', 'md', 'sm'];
const VARIANTS: ChipVariant[] = ['outline', 'filled'];

// ─── Interactive playground (Controls panel) ────────────────────────────────
export const Playground: Story = {};

// ─── Variants × states matrix (mirrors the Figma sheet) ─────────────────────
export const Overview: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {VARIANTS.map((variant) => (
        <section key={variant} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold capitalize text-foreground">
            {variant}
          </h3>
          <div className="flex flex-col gap-3">
            {(['default', 'selected', 'disabled'] as const).map((state) => (
              <div key={state} className="flex items-center gap-4">
                <span className="w-20 text-xs capitalize text-neutral-muted">
                  {state}
                </span>
                {SIZES.map((size) => (
                  <Chip
                    key={size}
                    variant={variant}
                    size={size}
                    selected={state === 'selected'}
                    disabled={state === 'disabled'}
                  >
                    텍스트
                  </Chip>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
      <p className="text-xs text-neutral-muted">
        Hover any chip to see the hover state.
      </p>
    </div>
  ),
};

// ─── Content types (leading slot + close button) ────────────────────────────
export const ContentTypes: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip>Label</Chip>
      <Chip onClose={() => {}}>LabelClose</Chip>
      <Chip leading={<CheckIcon />}>CheckLabel</Chip>
      <Chip leading={<CheckIcon />} onClose={() => {}}>
        CheckLabelClose
      </Chip>
      <Chip leading={<Avatar size="sm">A</Avatar>}>AvatarLabel</Chip>
      <Chip leading={<Avatar size="sm">A</Avatar>} onClose={() => {}}>
        AvatarLabelClose
      </Chip>
    </div>
  ),
};

// ─── Individual states ──────────────────────────────────────────────────────
export const Outline: Story = { args: { variant: 'outline' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };

export const WithCloseButton: Story = {
  args: { onClose: () => {}, children: '텍스트' },
};

export const WithLeadingIcon: Story = {
  args: { leading: <CheckIcon />, children: '텍스트' },
};

export const WithAvatar: Story = {
  args: { leading: <Avatar size="sm">A</Avatar>, children: '텍스트' },
};

// ─── Interactive filter chips (toggle + removable) ──────────────────────────
export const Selectable: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => {
    const [tags, setTags] = useState([
      { id: 'design', label: 'Design', on: true },
      { id: 'dev', label: 'Development', on: false },
      { id: 'qa', label: 'QA', on: false },
    ]);

    const toggle = (id: string) =>
      setTags((prev) =>
        prev.map((t) => (t.id === id ? { ...t, on: !t.on } : t)),
      );
    const remove = (id: string) =>
      setTags((prev) => prev.filter((t) => t.id !== id));

    return (
      <div className="flex flex-wrap items-center gap-3">
        {tags.map((t) => (
          <Chip
            key={t.id}
            variant="filled"
            selected={t.on}
            leading={t.on ? <CheckIcon /> : undefined}
            onClick={() => toggle(t.id)}
            onClose={() => remove(t.id)}
          >
            {t.label}
          </Chip>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-neutral-muted">All removed.</span>
        )}
      </div>
    );
  },
};
