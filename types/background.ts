export interface BackgroundImage {
  id: string;
  name: string;
  filename: string;
  description?: string;
  opacity?: number;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  size?: 'cover' | 'contain' | 'auto';
}

export const AVAILABLE_BACKGROUNDS: BackgroundImage[] = [
  {
    id: 'blue_swirl',
    name: 'Blue Swirl',
    filename: 'bg_blue_swirl.jpg',
    description: 'Elegant blue swirl pattern',
    opacity: 0.3,
    position: 'center',
    size: 'cover'
  }
  // Future backgrounds can be added here
];

export const DEFAULT_BACKGROUND = AVAILABLE_BACKGROUNDS[0]; 