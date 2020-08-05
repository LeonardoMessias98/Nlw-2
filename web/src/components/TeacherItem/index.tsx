import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

const TeacherItem =() => {
  return(
    <article className="teacher-item">
      <header>
        <img src="https://avatars2.githubusercontent.com/u/55189046?s=400&u=77cfe998bde0305d0f9e7252cefcb20a43a7e3d8&v=4" alt="Profile Pic"/>
        <div>
          <strong>Leonardo Messias</strong>
          <span>React Js</span>
        </div>
      </header>

      <p>
        Entusiasta das melhores tecnologias para desenvolvimento web
        <br /><br />
        Apaixonado por programação ainda mais quando o assunto se trata de React Js
      </p>

      <footer>
        <p>
          Preço/hora
          <strong>R$ 80 Reais</strong>
        </p>   
        <button type="button">
          <img src={whatsappIcon} alt="Entrar em contato"/>
          Entrar em contato
        </button>         
      </footer>
    </article>
  )
}

export default TeacherItem;