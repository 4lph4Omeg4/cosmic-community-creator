// FIX: Removed circular import of 'StarSystem' from itself. The interface is defined below.
// FIX: Define and export ChatMessage interface directly to resolve the export error.
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export type ActiveChamber = 'none' | 'vision-weaver' | 'celestial-forge' | 'stellar-animator';

export interface StarSystem {
  id: string;
  label: string;
  theme: 'pleiaden' | 'arcturus' | 'sirius' | 'lyra' | 'andromeda' | 'orion' | 'zeta-reticuli' | 'polaris';
  lore: string;
  details: string;
  image: string;
  images?: string[]; // Multiple generated images
  video?: string; // Generated video URL
}