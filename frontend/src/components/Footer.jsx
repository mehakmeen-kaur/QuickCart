import React from 'react'
import { footerStyles } from '../assets/dummyStyles'
import { FaApplePay, FaCcAmex, FaCcMastercard, FaCcPaypal, FaCcVisa, FaEnvelope, FaFacebookF, FaInstagram, FaLink, FaMapMarkerAlt, FaPhone, FaTwitter, FaYoutube } from 'react-icons/fa';
import { BsTelephone } from 'react-icons/bs'
import {FiBookmark, FiMail} from 'react-icons/fi'
import {BiMailSend} from 'react-icons/bi'

const Footer = () => {

    const socialLinks = [
        {
            icon: FaFacebookF,
            url: 'https://www.facebook.com/'
        },
        {
            icon: FaTwitter,
            url: 'https://twitter.com/'
        },
        {
            icon: FaInstagram,
            url: 'https://www.instagram.com/'
        },
        {
            icon: FaYoutube,
            url: 'https://www.youtube.com/'
        }
    ];
    return (
        <footer className={footerStyles.footer}>
            <div className={footerStyles.topBorder} />

            <div className={`${footerStyles.floatingShape} -top-24 -right-24 w-80 h-80 opacity-20`}></div>
            <div className={`${footerStyles.floatingShape} -bottom-40 -left-24 w-96 h-96 opacity-15 animation-delay-2000`}></div>
            <div className={`${footerStyles.floatingShape} top-1/4 left-1/3 w-64 h-64 bg-emerald-600 opacity-10 animate-pulse animation-delay-1000`}></div>

            <div className={footerStyles.container}>
                <div className={footerStyles.grid}>
                    {/* BRAND */}
                    <div>
                        <h2 className={footerStyles.brandTitle}>
                            RUSH<span className={footerStyles.brandSpan}>BASKET</span>
                        </h2>
                        <p className={footerStyles.brandText}>
                            Bringing you the freshest organic produce since 2020. Our mission is to deliver farm-fresh
                            goodness straight to your doorsteps.
                        </p>
                        <div className='space-x-3 flex'>
                            {socialLinks.map((social, idx) => (
                                <a href={social.url} key={idx}
                                    target='_blank' aria-label={`Visit our ${social.icon.name.replace('Fa', '')} page`}
                                    className={footerStyles.socialLink}>
                                    <social.icon className={footerStyles.socialIcon}></social.icon>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className={footerStyles.sectionTitle}>
                            <FaLink className={footerStyles.sectionIcon} /> Quick Links
                        </h3>
                        <ul className={footerStyles.linkList}>
                            {["Home", "Items", "Contact"].map((item, idx) => (
                                <li key={idx}>
                                    <a href={item==='Home' ? '/' : `/${item.toLowerCase()}`} 
                                        className={footerStyles.linkItem}>
                                        <span className={footerStyles.linkBullet}>
                                            {item}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT INFO */}
                    <div>
                        <h3 className={footerStyles.sectionTitle}>
                            <BsTelephone className={footerStyles.sectionIcon} /> Contact Us
                        </h3>
                        <ul className="space-y-4 text-sm sm:text-base">
                            <li className="flex items-center gap-3">
                                <FaMapMarkerAlt className={footerStyles.contactIcon} />
                                <p>123 Organic Valley, Green City, GC 54321</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className={footerStyles.contactIcon} />
                                <p>+7894561230</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className={footerStyles.contactIcon} />
                                <p>rushbasket@gmail.com</p>
                            </li>
                        </ul>
                    </div>

                    {/* NEWS LETTER */}
                    <div>
                        <h3 className={footerStyles.sectionTitle}>
                            <FiMail className={footerStyles.sectionIcon}/> NewsLetter
                        </h3>
                        <p className={footerStyles.newsletterText}>
                            Subscribe to our newsletter for fresh updates, exclusive offers,
                            and seasonal recipes!
                        </p>
                        <div className={footerStyles.newsletterForm}>
                            <input type="email" placeholder='Enter Email Address'
                            className={footerStyles.newsletterInput} />
                            <button className={footerStyles.newsletterButton}>
                                <BiMailSend className='mr-2 text-lg'/>
                                <span>Subscribe</span>
                            </button>
                        </div>
                        <p className={footerStyles.privacyText}>
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className={footerStyles.paymentSection}>
                    <h4 className={footerStyles.paymentTitle}>
                        <FiBookmark className={footerStyles.paymentIcon}/> We Accept All Major Payment 
                        Method
                    </h4>
                    <div className={footerStyles.paymentMethods}>
                        {[FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaApplePay].map((Icon,idx)=> (
                            <div key={idx} className={footerStyles.paymentItem}>
                                <Icon className={footerStyles.paymentIcon}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HR */}
                <div className={footerStyles.attribution}>
                    <div className={footerStyles.attributionBadge}>
                        <div className={footerStyles.hexagonContainer}>
                            <div className={footerStyles.hexagon}>
                                <div className={footerStyles.hexagonInner}>
                                    <div className={footerStyles.hexagonInnerShape}></div>
                                </div>
                            </div>
                            <span className={footerStyles.attributionText}>
                                Designed By{' '}
                                <a href="" target='_blank'
                                className={footerStyles.attributionLink}>
                                    RushBasket Services
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{footerStyles.customCSS}</style>

        </footer>
    )
}

export default Footer