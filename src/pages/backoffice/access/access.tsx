import { useUser } from "../../../core/store";
import { useEffect, useState } from "react";


const Access = () => {
    
    const user = useUser();
    const [dataUser, setDataUser] = useState<any>(null);
  
  useEffect(() => {
    setDataUser(user);
  }, [user]);





    return (
    <div className="w-full h-full">
        <h1>id</h1>
        <div className="">{user?.id_gimnasio}</div>
    </div>
    )
}

export default Access;
