export interface WeddingPhoto {
    id: number;
    src: string;
    alt: string;
  }
  
  export interface WeddingData {
    groom: string;
    bride: string;
  
    groomFamily: string[];
    brideFamily: string[];
  
    date: string;
    time: string;
  
    venue: string;
    address: string;
    mapsUrl: string;
  
    heroImage: string;
    portraitImage: string;
  
    gallery: WeddingPhoto[];
  }