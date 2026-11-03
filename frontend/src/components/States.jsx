import { AlertIcon, CloseIcon } from "./Icons";

export function Skeleton({ className = "" }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-line skeleton-line-sm" />
      <Skeleton className="skeleton-line skeleton-line-lg" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="skeleton-line" />
      ))}
      <Skeleton className="skeleton-line skeleton-line-sm" />
    </div>
  );
}

export function SkeletonGrid({ count = 3, rows = 3 }) {
  return (
    <div className="grid grid-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} rows={rows} />
      ))}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="notice notice-error" role="alert">
      <AlertIcon size={22} />
      <div className="notice-body">
        <strong>Content could not be loaded</strong>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <button type="button" className="btn btn-small" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function WarningBanner({ message, onDismiss }) {
  return (
    <div className="notice notice-warning" role="status">
      <AlertIcon size={20} />
      <div className="notice-body">
        <p>{message}</p>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="icon-btn"
          onClick={onDismiss}
          aria-label="Dismiss warning"
        >
          <CloseIcon size={18} />
        </button>
      ) : null}
    </div>
  );
}

export function EmptyNote({ children }) {
  return <p className="empty-note">{children}</p>;
}
