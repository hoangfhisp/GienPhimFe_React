import { StyledWrapper } from "./SwithMenu.styles";


export const SwitchMenu = ({ open, onToggle }) => {
    return (
        <StyledWrapper>
            <input
                type="checkbox"
                id="checkbox"
                checked={open}
                onChange={onToggle}
            />

            <label htmlFor="checkbox" className="toggle" aria-label="Toggle menu">
                <div className="bars" id="bar1" />
                <div className="bars" id="bar2" />
                <div className="bars" id="bar3" />
            </label>
        </StyledWrapper>
    );
};