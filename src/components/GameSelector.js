import React, { useState } from "react";

function GameSelector({ language, translations }) {
  const [value, setValue] = useState("");
  const [showList, setShowList] = useState(false);

  const options = translations[language].gameOptions;
  
  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

const handleSelect = (option) => {
    setValue(option);
    setShowList(false);
  };

  return (
    <div className="gameList">
      <input
        className="gameInput"
        type="text"
        placeholder={translations[language].gamePlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)}
      />
      {showList && filtered.length > 0 && (
        <ul className="dropdownList">
          {filtered.map((option, i) => (
            <li
              key={i}
              className="dropdownItem"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GameSelector;