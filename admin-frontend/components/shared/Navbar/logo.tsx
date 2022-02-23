import styled from "styled-components";

interface LogoProps {
  width: string;
  height?: string;
  padding?: string;
}

const Logo = styled.img<LogoProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height ?? "5rem"};
  padding: ${(props) => (props.padding ? props.padding : null)};
`;

export default Logo;
