import React,{ useState, useEffect, useRef } from "react";
import { ChkInfo} from './chkinfo';

export function HomeComponent(){

    const [displayCamera, setDisplayCamera] = useState(false);
    const [checkDeposits, setCheckDeposits] = useState([]);

    function getData(){
        return checkDeposits.map((item) => 
           <tr>
               <td>{item.checkno}</td>
               <td>{item.amount}</td>
           </tr>
        );
    }

    function addItem(){
        // const newItem = { checkno: "34567", amount : 700.00}
        // const newarr = [...checkDeposits, newItem]
        // setCheckDeposits(newarr);
        setDisplayCamera(true);
    }

    function backToHome(){
        setDisplayCamera(false);
    }

    return (
        <div>
            {!displayCamera && 
               <div className="grid-container">
                    <table className="chk-grid">
                       <thead>
                         <tr>
                             <th>Check Number</th>
                             <th>Check Amount</th>
                         </tr>
                       </thead>
                       <tbody>
                         {getData()}
                       </tbody>
                    </table>
               </div>
            }
            {displayCamera && <ChkInfo onBackButton={backToHome}/>}
            
            {!displayCamera && 
              <div className="button-panel">
                <button className="primary-btn" onClick={addItem}>Scan Checks</button>
              </div>
            }
                       
        </div>
    );
}