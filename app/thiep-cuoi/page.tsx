
import WeddingPage from '../thiep-cuoi/componets/weddingpage';

import {
  wedding,
  gallery,
  mapsUrl,
} from '../data/wedding';

import EnvelopeCover from '../components/EnvelopeCover';

export default function HomePage() {
  return (
    <>
      {/* Trang cưới thật nằm phía sau */}
      <WeddingPage
        wedding={wedding}
        gallery={gallery}
        mapsUrl={mapsUrl}
      />

      {/* Hiệu ứng mở đầu 17 giây */}
      <EnvelopeCover />
    </>
  );
}
