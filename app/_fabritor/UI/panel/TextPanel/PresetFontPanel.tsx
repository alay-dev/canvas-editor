// @ts-nocheck

const PRESET_FONT_LIST = [
  {
    label: (
      <div className="font-bold text-3xl" style={{ fontFamily: "Roboto" }}>
        Add title
      </div>
    ),
    key: "title",
    config: {
      fontFamily: "Roboto",
      fontWeight: "bold",
      fontSize: 120,
      text: "Add title",
      top: 100,
    },
  },
  {
    label: (
      <div style={{ fontSize: 24, fontFamily: "Roboto" }}>Add a subtitle</div>
    ),
    key: "sub-title",
    config: {
      fontFamily: "Roboto",
      fontWeight: "bold",
      fontSize: 100,
      text: "Add a subtitle",
      top: 400,
    },
  },
  {
    label: <div style={{ fontSize: 16, fontFamily: "Roboto" }}>Add a text</div>,
    key: "content",
    config: {
      fontFamily: "Roboto",
      fontSize: 80,
      text: "Add a text",
    },
  },
  {
    label: (
      <div
        style={{
          fontSize: 26,
          fontFamily: "Roboto",
          color: "#ffffff",
          WebkitTextStroke: "1px rgb(255, 87, 87)",
        }}
      >
        Text border
      </div>
    ),
    key: "content",
    config: {
      fontFamily: "Roboto",
      fontSize: 100,
      text: "Text border",
      fill: "#ffffff",
      stroke: "#ff5757",
      strokeWidth: 12,
    },
  },
];

export default function PresetFontPanel(props) {
  const { addTextBox } = props;

  const handleClick = (item) => {
    addTextBox?.(item.config);
  };

  return (
    <div className="">
      <div className="flex gap-3 items-center justify-center">
        <div className="flex-1 h-px bg-gray-500" />
        <h3 className="text-center my-5 text-gray-500 text-sm">
          Default text box
        </h3>
        <div className="flex-1 h-px bg-gray-500" />
      </div>

      <ul className="space-y-3">
        {PRESET_FONT_LIST.map((item) => (
          <li
            key={item.key}
            onClick={() => {
              handleClick(item);
            }}
            className=" border border-gray-500 p-2 rounded-lg text-gray-300 cursor-pointer"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
