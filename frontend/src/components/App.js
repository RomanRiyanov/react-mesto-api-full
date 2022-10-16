import React, {useEffect, useState} from "react";
import {
    Route,
    Switch,
    useHistory
  } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import AddPlacePopup from "./AddPlacePopup";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from "./EditAvatarPopup";
import PopupWithImage from './PopupWithImage';

import Login from './Login';
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

import * as auth from '../utils/Auth';

import { api } from "../utils/Api";
import {CurrentUserContext} from '../context/CurrentUserContext';

function App() {

    const [currentUser, setCurrentUser] = useState({
        name: "",
        about: "",
        avatar: "",
        _id: "",
        cohort: ""
      });

    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
    const [isImagePopupOpen, setImagePopupOpen] = useState(false);
    const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);

    const [isRegisterSucceed, setRegisterSucceed] = useState(false);

    const [cards, setCards] = useState([]);

    const [selectedCard, setSelectedCard] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);

    const [loggedIn, setLoggedIn] = useState(false);
    const [headerEmail, setHeaderEmail] = useState('');
    const history = useHistory();

    function onEditAvatar() {
        setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    }

    function onEditProfile() {
        setEditProfilePopupOpen(!isEditProfilePopupOpen);
    }

    function onAddPlace() {
        setAddPlacePopupOpen(!isAddPlacePopupOpen);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setImagePopupOpen(true);
    }

    function closeAllPopups() {
        setEditAvatarPopupOpen(false);
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setImagePopupOpen(false);
        setInfoTooltipOpen(false);
    }

    function handleUpdateUser (data) {
        setIsLoaded(true);

        api.setUserInfo(data)
        .then(userData => {
            setCurrentUser(userData);
            closeAllPopups();
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setIsLoaded(false);
        })
    }

    function handleUpdateAvatar (data) {
        setIsLoaded(true);

        api.setUserAvatar(data)
        .then(userData => {
            setCurrentUser(userData);
            closeAllPopups();
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setIsLoaded(false);
        })
    }

    function handleCardLike (card) {
        const isLiked = card.likes.some(elem => elem === currentUser._id);
        setIsLoaded(true);

        api.changeLikeCardStatus(card._id, isLiked)
        .then((newCard) => {
            setCards((oldCards) => {
                return oldCards.map((item) => item._id === card._id ? newCard : item)
            })
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setIsLoaded(false);
        })
    }

    function handleDeleteClick (card) {
        setIsLoaded(true);

        api.deleteCard(card._id)
        .then(() => {
            setCards((oldCards) => {
                return oldCards.filter((item) => item._id !== card._id)
            })
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setIsLoaded(false);
        }) 
    }

    function handleAddPlaceSubmit (data) {
        setIsLoaded(true);

        api.addNewCard(data)
        .then((newCard) => {
            setCards([newCard, ...cards]);
            closeAllPopups();
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setIsLoaded(false);
        })
    }

    function onRegister({ email, password }) {
        return auth.register({ email, password })
        .then((res) => {
            if (!res) {
                throw new Error ('Попробуйте ещё раз');
            };
            history.push('/sign-in');
            setRegisterSucceed(true);
            setInfoTooltipOpen(true);
            return res;
        })
        .catch((err) => {
            setRegisterSucceed(false);
            console.log(`Ошибка при регистрации ${err}`);
            setInfoTooltipOpen(true);
        })
    }

    function onLogin({ email, password }) {
        return auth.authorize({ email, password })
        .then((res) => {
            if (!res) {
                throw new Error ('Неверный email или пароль');
            }
            setLoggedIn(true);
            console.log(loggedIn);
            setRegisterSucceed(true);
            history.push('/');
        })
        .catch((err) => {
            setRegisterSucceed(false);
            console.log(`Ошибка при авторизации ${err}`);
            setInfoTooltipOpen(true);
          });
    }
    
    function loginOut(){
        return auth.logOut()
          .then((res) => {
            if (res) {
                setLoggedIn(false);
                return res;
            }
          })
          .catch(err => {
              console.log(err);
          });
      }

    function tokenCheck () {
        return auth.getContent()
        .then((res) => {
            if (res) {
                setHeaderEmail(res.email);
                setLoggedIn(true);
                history.push('/');
            } return;
        })
        .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {        
            tokenCheck();
    }, [loggedIn]);

    useEffect(() => {
        if (loggedIn) {
            api.getUserInfo()
            .then(userData => {
                setCurrentUser(userData);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [loggedIn]);

    useEffect(() => {
        if (loggedIn) {
            api.getCards()
            .then(cardsData => {
                setCards(cardsData);
            })
            .catch(err => {
                console.log(err);
            })
        } 
    }, [loggedIn]);

    useEffect(() => {
        function handleEscapeClose(event) {
            if (event.key === 'Escape') {
                closeAllPopups()
            }
        }
        document.addEventListener('keydown', handleEscapeClose);

        return () => {
            document.removeEventListener('keydown', handleEscapeClose);
        }
    }, [])

  return (
    
      <div className="body">
        <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
            <Switch>

                <ProtectedRoute 
                    exact path='/'
                    onEditAvatar = {onEditAvatar} 
                    onEditProfile = {onEditProfile}
                    onAddPlace = {onAddPlace}
                    onCloseButton = {closeAllPopups}
                    onCardClick={handleCardClick}
                    onCardDelete={handleDeleteClick}
                    onCardLike={handleCardLike}
                    cards={cards}
                    isLoaded={isLoaded}
                    loggedIn={loggedIn}
                    component={Main}
                    header={Header}
                    footer={Footer}
                    headerEmail={headerEmail}
                    loginOut={loginOut}
                />

                <Route path='/sign-in'>
                    <Header/>
                    <div className="authContainer">
                        <Login onLogin={onLogin} />
                    </div>
                    <Footer />                
                </Route>
                
                <Route path='/sign-up'>
                    <Header/>
                    <div className="authContainer">
                        <Register onRegister={onRegister}/>
                    </div>
                    <Footer />
                </Route>
            </Switch>

            <EditProfilePopup isLoaded={isLoaded} onUpdateUser={handleUpdateUser} onCloseButton = {closeAllPopups} isOpen={isEditProfilePopupOpen} />
            <AddPlacePopup isLoaded={isLoaded} onCardAdd={handleAddPlaceSubmit} onCloseButton = {closeAllPopups} isOpen={isAddPlacePopupOpen} />
            <EditAvatarPopup isLoaded={isLoaded} onUpdateAvatar={handleUpdateAvatar} onCloseButton = {closeAllPopups} isOpen={isEditAvatarPopupOpen} />
            <PopupWithImage isLoaded={isLoaded} onClose={closeAllPopups} card={selectedCard} isOpen={isImagePopupOpen}/>
            <InfoTooltip isOpen = {isInfoTooltipOpen} isSuccess = {isRegisterSucceed} onClose={closeAllPopups} />

        </CurrentUserContext.Provider>
        </div>

    </div>
  );
}

export default App;
