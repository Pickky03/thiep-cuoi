'use client'
import WeddingPage from './componets/weddingpage';

import {
  gallery,
  mapsUrl,
  wedding,
} from '../data/wedding';

export default function ThiepCuoiPage() {
  return (
    <WeddingPage
      wedding={wedding}
      gallery={gallery}
      mapsUrl={mapsUrl}
    />
  );
}