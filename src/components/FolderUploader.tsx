import { useEffect, useRef } from 'react';

interface FolderUploaderProps {
  onSelect: (files: FileList) => void;
  disabled?: boolean;
  helperText?: string;
}

export const FolderUploader = ({
  onSelect,
  disabled = false,
  helperText,
}: FolderUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement & { webkitdirectory?: boolean }).webkitdirectory = true;
      inputRef.current.setAttribute('webkitdirectory', '');
      inputRef.current.setAttribute('directory', '');
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    const files = event.target.files;
    if (files && files.length) {
      onSelect(files);
      event.target.value = '';
    }
  };

  return (
    <div className="folder-uploader-container">
      <div className="folder-uploader-folder">
        <div className="folder-uploader-front">
          <div className="folder-uploader-tip" />
          <div className="folder-uploader-cover" />
        </div>
        <div className="folder-uploader-back folder-uploader-cover" />
      </div>
      <label className="folder-uploader-label">
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          disabled={disabled}
        />
        {helperText || 'Upload a File'}
      </label>
    </div>
  );
};
