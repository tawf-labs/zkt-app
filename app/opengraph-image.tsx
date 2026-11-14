import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const alt = 'zkt.app - Transparent & Traceable Zakat Donations';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Load brand logo (kept exactly as before)
  let logoBase64 = '';
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  } catch {
    // Fallback if file read fails
  }

  // Load hero background pattern from public/zkt-hero-background.png
  let heroBgBase64 = '';
  try {
    const bgPath = path.join(process.cwd(), 'public', 'zkt-hero-background.png');
    if (fs.existsSync(bgPath)) {
      const bgBuffer = fs.readFileSync(bgPath);
      heroBgBase64 = `data:image/png;base64,${bgBuffer.toString('base64')}`;
    }
  } catch {
    // Fallback if background read fails
  }

  // Load Geist font files from node_modules/geist
  let fontRegular: ArrayBuffer | null = null;
  let fontBold: ArrayBuffer | null = null;
  try {
    const regularPath = path.join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf'
    );
    const boldPath = path.join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf'
    );
    if (fs.existsSync(regularPath)) {
      fontRegular = fs.readFileSync(regularPath).buffer as ArrayBuffer;
    }
    if (fs.existsSync(boldPath)) {
      fontBold = fs.readFileSync(boldPath).buffer as ArrayBuffer;
    }
  } catch {
    // Fallback if font read fails
  }

  const fonts: any[] = [];
  if (fontRegular) {
    fonts.push({
      name: 'Geist',
      data: fontRegular,
      weight: 400,
      style: 'normal',
    });
  }
  if (fontBold) {
    fonts.push({
      name: 'Geist',
      data: fontBold,
      weight: 700,
      style: 'normal',
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #ffffff 0%, #f3fbf6 45%, #e4f3ea 100%)',
          padding: '60px 70px',
          fontFamily: 'Geist, sans-serif',
          color: '#161616',
          position: 'relative',
        }}
      >
        {/* Hero Background Pattern Overlay */}
        {heroBgBase64 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroBgBase64}
            alt="background"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.35,
            }}
          />
        )}

        {/* Top Bar: Brand Logo + Verified Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {logoBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoBase64}
                alt="zkt.app logo"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  backgroundColor: '#008b52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                Z
              </div>
            )}
            <span
              style={{
                fontSize: '34px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#161616',
              }}
            >
              zkt.app
            </span>
          </div>

          {/* Hero-matched Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 139, 82, 0.08)',
              border: '1px solid rgba(0, 139, 82, 0.25)',
              borderRadius: '9999px',
              padding: '8px 20px',
              color: '#008b52',
              fontSize: '16px',
              fontWeight: 700,
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#008b52',
              }}
            />
            <span>Blockchain Traced • Zero-Knowledge</span>
          </div>
        </div>

        {/* Middle Content: Heading, Subtitle & Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxWidth: '920px',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: '54px',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#161616',
            }}
          >
            Transparent Blockchain-Based Donation Platform
          </h1>
          <p
            style={{
              fontSize: '23px',
              lineHeight: 1.45,
              color: '#636363',
              margin: 0,
            }}
          >
            Private, verifiable Zakat & charitable giving powered by zero-knowledge proofs.
            Every donation is recorded and trackable in real-time.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                padding: '0 28px',
                borderRadius: '10px',
                backgroundColor: '#008b52',
                color: '#ffffff',
                fontSize: '17px',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0, 139, 82, 0.25)',
              }}
            >
              Start Donating
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                padding: '0 28px',
                borderRadius: '10px',
                border: '2px solid #008b52',
                color: '#008b52',
                fontSize: '17px',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              Explore Campaigns
            </div>
          </div>
        </div>

        {/* Bottom: Hero Stats Row */}
        <div
          style={{
            display: 'flex',
            borderTop: '1px solid #e2e6e3',
            paddingTop: '20px',
            gap: '60px',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#008b52' }}>
              100%
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#636363',
                letterSpacing: '0.08em',
              }}
            >
              TRACEABLE ON-CHAIN
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#008b52' }}>
              ZK Proofs
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#636363',
                letterSpacing: '0.08em',
              }}
            >
              DONOR PRIVACY
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#008b52' }}>
              Verified
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#636363',
                letterSpacing: '0.08em',
              }}
            >
              CHARITY PARTNERS
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
