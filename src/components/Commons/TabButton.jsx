export default function TabButton({children,onSelect}){
    return(
            <button className="btn btn-outline-light" type="submit" onClick={onSelect}>{children}</button>
    );
}