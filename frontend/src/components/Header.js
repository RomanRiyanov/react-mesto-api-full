import React from 'react';
import {
    Route,
    Switch,
    Link,
  } from 'react-router-dom';
import logoPath from '../images/logo.svg';

function Header({headerEmail, loginOut}) {

  function signOut(){
    return loginOut();
  }

  return (
    <section className="header">
        <img className="header__logo" src={logoPath} alt="Логотип Mesto" />
        <Switch>
          <Route exact path='/'>
            <div className='header__link_container'>
              <p className='header__link_email'>{headerEmail}</p>
              <Link onClick={signOut} className='header__link' to='/sign-in'>Выйти с этой планеты</Link>
            </div>
          </Route>
          <Route exact path='/sign-up'>
            <Link className='header__link' to='/sign-in'>Войти</Link>
          </Route>
          <Route exact path='/sign-in'>
            <Link className='header__link' to='/sign-up'>Зарегистироваться</Link>
          </Route>
        </Switch>
    </section>
  );
}

export default Header;
