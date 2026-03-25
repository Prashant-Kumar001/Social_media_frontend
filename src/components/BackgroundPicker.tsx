const colors = ["#000", "#fff", "#ff0000", "#00ff00"];

type props = {
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
};

const BackgroundPicker = ({ background, setBackground }:props) => {
  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <button
          key={c}
          style={{ background: c }}
          onClick={() => setBackground(c)}
        />
      ))}
    </div>
  );
};

export default BackgroundPicker;