import React from "react";

function PopupWithForm 
  ({
    isOpen, 
    isInputValid, 
    onCloseButton, 
    onSubmit, 
    name, 
    title, 
    buttonText,
    windowType,
    titleType,
    children
  }) {

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && isOpen) {
        onCloseButton();
    }
  }

  return (
    <div className={`popup ${isOpen && 'popup_viewable'}`} id={`popup_${name}`} onMouseDown={handleOverlayClick}>
        <div className={`popup__window ${windowType}`}>
            <button onClick={onCloseButton} aria-label="Закрыть" className="close-button" id={`close-button_${name}`}></button>
            <h2 className={`popup__title ${titleType}`}>{title}</h2>
            <form onSubmit={onSubmit} className="popup__form" id={`popup__form_${name}`}>
                {children}
                <button aria-label={buttonText} className={`submit-button ${isInputValid || 'inactive-button'}`} type="submit" disabled={!isInputValid}>
                        {buttonText}
                </button>
            </form>
        </div>
    </div>
  )
}

export default PopupWithForm;
