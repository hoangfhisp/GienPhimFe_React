export default function SeeMore({children}){
    return(
        <div className="see-more">
        <a style={{color: "white" , textDecoration: "none"}} >{children}</a>
        </div>
    );
}