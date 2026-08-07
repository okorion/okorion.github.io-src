import { Component, type ReactNode } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="route-error" role="alert" aria-live="assertive">
          <p>3D LAB · LOAD ERROR</p>
          <h1>3D Lab을 불러오지 못했습니다.</h1>
          <span>
            네트워크가 안정된 뒤 다시 시도하거나 경력 포트폴리오로 돌아갈 수
            있습니다.
          </span>
          <div className="route-error__actions">
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
            >
              다시 시도
            </button>
            <a href="/">경력 포트폴리오로 돌아가기</a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
