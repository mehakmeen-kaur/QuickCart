import React from 'react'
import {adminNavbarStyles as styles} from '../assets/adminStyles'
import { FiMenu, FiPackage , FiPlusCircle, FiShoppingBag, FiX } from "react-icons/fi";
import { NavLink } from 'react-router-dom'
import { useState } from 'react';

const AdminNavbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu=()=>setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu=()=> setIsMobileMenuOpen(false);
  return (
    <nav className={styles.nav}>
        <div className={styles.container}>
            <div className={styles.mainFlex}>
                {/* LOGO */}
                <div className={styles.logoContainer}>
                    <div className={styles.logoIconContainer}>
                        <FiPackage className={styles.logoIcon}/>
                    </div>
                    <h1 className={styles.logoText}>
                        <span className={styles.logoAccent}>RushBasket</span> Admin
                    </h1>
                </div>
                {/* DESKTOP LINKS */}
                <div className={styles.desktopNavLinks}>
                    <NavLink to='/admin/add-item' className={styles.navLink}>
                    <FiPlusCircle className="mr-2"/>
                    Add Products
                    </NavLink>

                    <NavLink to='/admin/list-items' className={styles.navLink}>
                    <FiPackage className="mr-2"/>
                    List Items
                    </NavLink>

                    <NavLink to='/admin/orders' className={styles.navLink}>
                    <FiShoppingBag className="mr-2"/>
                    Orders
                    </NavLink>
                </div>

                {/* MOBILE MENU */}
                <div className={styles.mobileMenuButton}>
                    <button onClick={toggleMobileMenu} className={styles.menuButton}>
                        {isMobileMenuOpen ? (<Fix className="h-6 w-6"/>
                        ) :(
                        <FiMenu className="h-6 w-6"/>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* MOBILE LINKS  */}
        <div className={`${styles.mobileMenuContainer} ${
            isMobileMenuOpen ? "block" : "hidden"
        }`}>
            <div className={styles.mobileMenuInner}>
                <NavLink to='/admin/add-item' onClick={closeMobileMenu}
                className={styles.mobileNavLink}>
                    <FiPlusCircle className="mr-3 ml-1" size={20}/>
                    Manage Products
                </NavLink>

                <NavLink to='/admin/list-item' onClick={closeMobileMenu}
                className={styles.mobileNavLink}>
                    <FiPackage className="mr-3 ml-1" size={20}/>
                    List Items
                </NavLink>

                <NavLink to='/admin/orders' onClick={closeMobileMenu}
                className={styles.mobileNavLink}>
                    <FiShoppingBag className="mr-3 ml-1" size={20}/>
                    Orders
                </NavLink>
            </div>
        </div>
    </nav>
  )
}

export default AdminNavbar