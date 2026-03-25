type props = {
    mode: "text" | "media";
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    background: string;
    media: File | null;
    setMedia: React.Dispatch<React.SetStateAction<File | null>>;
    previewUrl: string | null;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
}
const StoryPreview = ({
  mode,
  text,
  setText,
  background,
  media,
  setMedia,
  previewUrl,
  setPreviewUrl,
}: props) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div style={{ backgroundColor: mode === "text" ? background : "#000" }}>
      {mode === "text" ? (
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      ) : !previewUrl ? (
        <input type="file" onChange={handleUpload} />
      ) : media?.type.startsWith("image") ? (
        <img src={previewUrl} />
      ) : (
        <video src={previewUrl} controls />
      )}
    </div>
  );
};

export default StoryPreview;
