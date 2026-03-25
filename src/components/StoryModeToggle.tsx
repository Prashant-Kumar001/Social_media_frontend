type props = {
  setMode: React.Dispatch<React.SetStateAction<"text" | "media">>;
};
const StoryModeToggle = ({ setMode }: props) => {
  return (
    <div className="flex">
      <button onClick={() => setMode("text")}>Text</button>
      <button onClick={() => setMode("media")}>Media</button>
    </div>
  );
};

export default StoryModeToggle;
