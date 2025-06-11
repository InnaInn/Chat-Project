import React from "react";

function GameSelector({ language, translations }) {
  return (
    <div className="gameList">
      <input
        className="gameInput"
        list="gameList"
        placeholder={translations[language].gamePlaceholder}
      />
      <datalist id="gameList">
        {translations[language].gameOptions.map((title, index) => (
          <option key={index} value={title}></option>
        ))}
      </datalist>
    </div>
  );
}

export default GameSelector;