import React, { useState, useEffect, useRef } from "react";
import GameSelector from "./GameSelector";
import burgerMenuLight from "../img/burgerMenuLight.svg";
import burgerMenuDark from "../img/burgerMenuDark.svg";
import closeImgDark from "../img/closeImgDark.svg";
import closeImgLight from "../img/closeImgLight.svg";

function Header({ language, toggleLanguage, translations, onToggleTheme, isLightTheme,  onSelectGame }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuRef = useRef(null);
  const burgerRef = useRef(null);


  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      burgerRef.current &&
      !burgerRef.current.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="leftSection">
        <div className="toggleSwitch desktopOnly">
          <label>
            <input
              className="checkboxTheme"
              type="checkbox"
              checked={isLightTheme}
              onChange={onToggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
        <GameSelector language={language} translations={translations} onSelectGame={onSelectGame} />
      </div>
      <div
        className={`burgerIcon mobileOnly ${menuOpen ? "menuOpen" : ""}`}
        onClick={toggleMenu}
        ref={burgerRef}
      >
        <img
          className="burgerIcon"
          src={
            menuOpen
              ? isLightTheme ? closeImgLight : closeImgDark
              : isLightTheme ? burgerMenuLight : burgerMenuDark
          }
          alt="menuIcon"
        />
      </div>
      <div className="desktopOnly">
        <button className="languageButton" onClick={toggleLanguage}>
          {translations[language].changeLanguage}
        </button>
      </div>
      {menuOpen && (
        <div className="mobileMenu" ref={menuRef}>
          <button className="languageButton" onClick={toggleLanguage}>
            {translations[language].changeLanguage}
          </button>
          <div className="toggleSwitch">
            <label>
              <input
                className="checkboxTheme"
                type="checkbox"
                checked={isLightTheme}
                onChange={onToggleTheme}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
