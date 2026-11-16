import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import realProjects from '@/data/project.json';
import ProjectsPage from './page';

// Two non-featured projects, so that both render as project cards: one with
// a thumbnail, one without any image
vi.mock('@/data/project.json', async (importOriginal) => {
  const actual = (await importOriginal()) as {
    default: typeof realProjects;
  };
  const [base] = actual.default;
  return {
    default: [
      {
        ...base,
        id: 'with-image',
        name: 'With image',
        featured: false,
        images: { thumbnail: '/thumbnail.png', gallery: [] },
      },
      {
        ...base,
        id: 'without-image',
        name: 'Without image',
        featured: false,
        images: { gallery: [] },
      },
    ],
  };
});

describe('Projects page cards', () => {
  it('shows the thumbnail of a project that has one', () => {
    render(<ProjectsPage />);
    expect(screen.getByAltText('With image')).toHaveAttribute(
      'src',
      '/thumbnail.png',
    );
  });

  it('shows no image for a project without one', () => {
    render(<ProjectsPage />);
    const card = screen
      .getByRole('heading', { name: 'Without image' })
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    expect(card!.querySelector('img')).toBeNull();
  });
});
