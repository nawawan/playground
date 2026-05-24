import { useState } from "react";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

export const UploadModal = ({ open, onClose }: UploadModalProps) => {
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  return (
    <div className="trajectry-upload-modal" onClick={onClose}>
      <div className="trajectry-upload-modal__card" onClick={(event) => event.stopPropagation()}>
        <div className="trajectry-hand trajectry-upload-modal__title">+ new activity</div>
        <div className="trajectry-mono trajectry-upload-modal__subtitle">
          upload a GPX file from your bike computer or watch
        </div>
        <div
          className={`trajectry-upload-modal__drop${dragging ? " is-dragging" : ""}`}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
        >
          <div className="trajectry-upload-modal__pin">📍</div>
          <div className="trajectry-hand trajectry-upload-modal__drop-title">drop your .gpx here</div>
          <div className="trajectry-mono trajectry-upload-modal__or">or</div>
          <button className="trajectry-upload-modal__browse" type="button">
            browse files
          </button>
        </div>
        <div className="trajectry-upload-modal__actions">
          <button className="trajectry-upload-modal__cancel" onClick={onClose} type="button">
            cancel
          </button>
          <button className="trajectry-upload-modal__import" disabled type="button">
            import
          </button>
        </div>
      </div>
    </div>
  );
};
