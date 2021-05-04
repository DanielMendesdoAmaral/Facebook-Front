import React, {useState} from 'react';
import styled, {css} from 'styled-components'

//Coloque o elemento que você estiver fazendo, por exemplo, se for um P, coloque style.p
//Sempre coloque o elemento fora do componente.
const Button = styled.button`
    //Estilos condicionais "inline"
    //background: ${props => props.dark ? "#EEEEEE" : "#333333"};
    
    //Estilos condicionais "inblock"
    ${
        props => props.dark ? css`
            background: #EEEEEE;
            color: #333333;
            border-color: #333333;
        `
        :
        css`  
            background: #333333;
            color: #EEEEEE;
            border-color: #EEEEEE;
        `
    }

    border-radius: 10px;
    padding: 5px;
    outline: none;
    cursor: pointer;
`;

const Container = styled.div`
    background: ${props => props.dark ? "#333333" : "#EEEEEE"};
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

function DarkMode() {
    const [dark, setDark] = useState(false);

    return (
        <Container dark={dark}>
            <Button dark={dark} onClick={() => setDark(!dark)}>Modo {dark ? "claro" : "escuro"}</Button>
        </Container>
    )
}

export default DarkMode;