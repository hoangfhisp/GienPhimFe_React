import './AnimeSkeleton.scss';

export default function AnimeSkeleton({ count = 12 }) {
  return (
    <div className="anime-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="anime-item skeleton" key={i}>
          <div className="skeleton-img"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-sub"></div>
        </div>
      ))}
    </div>
  );
}
