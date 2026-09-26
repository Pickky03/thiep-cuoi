import WeddingPage from './thiep-cuoi/componets/weddingpage';
import { wedding, gallery, mapsUrl } from './data/wedding';

import EnvelopeCover from './components/EnvelopeCover';

export default function HomePage() {
  return (
    <>
      {/* Trang thiệp cưới thật, nằm phía sau phong bì */}
      <WeddingPage
        wedding={wedding}
        gallery={gallery}
        mapsUrl={mapsUrl}
      />

      {/* Lớp phong bì mở đầu */}
      <EnvelopeCover />
    </>
  );
}