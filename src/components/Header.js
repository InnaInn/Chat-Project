import React from "react";
import GameSelector from "./GameSelector";

function Header({ language, toggleLanguage, translations }) {
  return (
    <header className="header">
      <div className="leftSection">
        <div className='toggleSwitch'>
          <label>
            <input className="checkboxTheme" type='checkbox' />
            <span className='slider'></span>
          </label>
        </div>
        <GameSelector language={language} translations={translations} />
      </div>
      <div>
        <button className="languageButton" onClick={toggleLanguage}>
          {translations[language].changeLanguage}
        </button>
      </div>
    </header>
  );
}

export default Header;