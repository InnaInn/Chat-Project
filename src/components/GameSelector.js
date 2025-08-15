import React, { useState, useEffect } from "react";

function GameSelector({ language, translations, onSelectGame }) {
  const options = translations[language].gameOptions;
  const [value, setValue] = useState(options.length > 0 ? options[0].uiName : "");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (options.length > 0) {
      onSelectGame(options[0]);
    }
  }, [language, translations, onSelectGame]);

  const filtered = options.filter(opt =>
    opt.uiName.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelect = (option) => {
    setValue(option.uiName);
    setShowList(false);
    onSelectGame(option);
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
              collection-type={option.collectionType}
              className="dropdownItem"
              onClick={() => handleSelect(option)}
            >
              {option.uiName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GameSelector;