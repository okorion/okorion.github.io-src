export function WebGLFallback() {
  return (
    <div className="legacy-fallback" role="alert" aria-live="polite">
      <img
        src="/favicon/og-image.png"
        alt=""
        width="1200"
        height="630"
        aria-hidden="true"
      />
      <div className="legacy-fallback__veil" aria-hidden="true" />
      <div className="legacy-fallback__card">
        <p>3D LAB · STATIC FALLBACK</p>
        <h1>이 환경에서는 3D 장면을 표시할 수 없습니다.</h1>
        <span>
          정적 미리보기와 경력 포트폴리오는 그래픽 환경과 관계없이 이용할 수
          있습니다.
        </span>
        <a href="/">경력 포트폴리오로 돌아가기</a>
      </div>
    </div>
  );
}
