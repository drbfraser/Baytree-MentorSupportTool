import styled from 'styled-components';

interface INav {
  open: boolean;
}

export const layout = styled.nav`
  height: 100%;
  background-color: #fdfdfdfa;
`

export const navbar = styled.ul<INav>`
  list-style: none;
  display: flex;
  position: absolute;
  width: 90%;
  top: 0;
  justify-content: flex-end;
  margin-top: 2px;
  align-items: center;
  font-size: 17px;
  height: 110px;
  
  a {
    text-decoration: none;
    color: #000;
    &:hover {
      color: #00b300;
    }
  }
`

export const text = styled.li`
  padding: 20px 22px;
}
`

export const logo = styled.img`
  width: auto; 
  height: 92px;
  object-fit: contain;
  @media (max-width: 2000px) {
    margin: 13px 35px 13px;
  }
`
