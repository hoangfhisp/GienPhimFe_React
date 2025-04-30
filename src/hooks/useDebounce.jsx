import { useState,useEffect } from "react";

function useDebounce(value,delay){
    const [debounceValue,setDebounceValue] = useState(value);

    useEffect(() => {
        const hander = setTimeout(() => setDebounceValue(value),delay)

        return () => clearTimeout(hander);
    },[value]);
    return debounceValue;
}
export default useDebounce