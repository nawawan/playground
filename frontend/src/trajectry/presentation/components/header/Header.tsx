type HeaderProps = {
  onUpload: () => void;
};

export const Header = ({ onUpload }: HeaderProps) => (
  <header className="trajectry-header">
    <div className="trajectry-header__brand">
      <div className="trajectry-header__logo">
        trajec<span>·</span>try
      </div>
      <div className="trajectry-header__subtitle hide-narrow">a year on the road</div>
    </div>
    <div className="trajectry-header__spacer" />
    <div className="trajectry-mono trajectry-header__stats hide-narrow">2026 · 12 routes · 487 km</div>
    <button className="trajectry-header__upload" type="button" onClick={onUpload}>
      + Upload GPX
    </button>
    <div className="trajectry-header__avatar">あ</div>
  </header>
);
