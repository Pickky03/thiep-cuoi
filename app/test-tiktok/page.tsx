// app/test-tiktok/page.tsx

export default function TestTikTokPage() {
    return (
      <main
        style={{
          width: '100vw',
          height: '100svh',
          background: '#000',
        }}
      >
        <iframe
          src="https://www.tiktok.com/player/v1/7687990475814440210?autoplay=1&controls=0&loop=0&muted=1"
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 0,
          }}
          title="TikTok test"
        />
      </main>
    );
  }