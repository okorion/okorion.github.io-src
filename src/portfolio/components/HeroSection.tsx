import { ExternalLink } from "./ExternalLink";

function HeroActions() {
  return (
    <nav className="hero__actions" aria-label="포트폴리오 바로가기">
      <a className="button button--primary" href="#professional-evidence">
        경력 사례 보기 <span aria-hidden="true">↓</span>
      </a>
      <a className="button button--secondary" href="#public-builds">
        공개 프로젝트
      </a>
      <ExternalLink className="text-link" href="https://github.com/okorion">
        GitHub
      </ExternalLink>
    </nav>
  );
}

function HeroCopy() {
  return (
    <div className="hero__copy">
      <p className="hero__eyebrow">
        <span aria-hidden="true">●</span>
        HYOUNKYU OH · PRODUCT / APPLICATION ENGINEER
      </p>
      <h1 id="hero-title">
        Editor·Builder의 편집 흐름을
        <span> 저장과 실행까지 연결합니다.</span>
      </h1>
      <p className="hero__summary">
        React·TypeScript·Three.js 기반의 2D·3D Editor·Builder와 지도 제품을
        개발해 왔습니다. 편집 상태와 command·event, 저장 모델, Runtime 실행의
        의미를 맞추고 모바일·현장·운영 환경에서 실제 동작을 검증합니다.
      </p>
      <p className="hero__experiment">
        공개 프로젝트에서는 local-first AI, 3D·데이터 시각화 도구를 실험합니다.
      </p>
      <HeroActions />
    </div>
  );
}

function HeroVisual() {
  return (
    <a
      className="hero-visual"
      href="/?view=3d"
      aria-label="기존 인터랙티브 3D Lab 열기"
    >
      <img
        src="/favicon/og-image.png"
        alt="나무와 인물 형상의 점 구름으로 구성한 3D 장면"
        width="1200"
        height="630"
        fetchPriority="high"
      />
      <span className="hero-visual__veil" aria-hidden="true" />
      <span className="hero-visual__topline">
        <span>Original 3D experience</span>
        <span aria-hidden="true">↗</span>
      </span>
      <span className="hero-visual__caption">
        <strong>3D Lab</strong>
        <span>기존 인터랙티브 장면은 별도 경험으로 보존했습니다.</span>
      </span>
    </a>
  );
}

function SignalStrip() {
  return (
    <dl className="signal-strip" aria-label="핵심 프로필">
      <div>
        <dt>Experience</dt>
        <dd>2023–현재</dd>
      </div>
      <div>
        <dt>Core</dt>
        <dd>React · TypeScript</dd>
      </div>
      <div>
        <dt>Systems</dt>
        <dd>Editor · Builder · Runtime</dd>
      </div>
      <div>
        <dt>Validation</dt>
        <dd>모바일 · 현장 · 운영</dd>
      </div>
    </dl>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__glow" aria-hidden="true" />
        <HeroCopy />
        <HeroVisual />
      </section>
      <SignalStrip />
    </>
  );
}
