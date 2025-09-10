import React from "react";
import { FaRegNewspaper } from "react-icons/fa";
import "./style.scss";


export default function Footer() {
  return (
    <footer className="site-footer">
     <div class="container">
      <div class="row align-items-center justify-content-between">
        {/* col-6 */}
        <div className="col-lg-12">  
          <div className="footer-left text-center">
            Copyright © 2025 All Right Reserved
          </div>  
        </div>
        {/* col-6-end */}
        {/* <div className="col-lg-6">
           <div className="footer-right">
                 <a href="/privacy" className="footer-link">Privacy Policy</a>
               <a href="/terms" className="footer-link">Terms of Service</a>
           </div>
          </div> */}
         
      </div>
     </div>
    </footer>
  );
}

