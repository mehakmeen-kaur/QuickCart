import React, { useEffect, useState } from 'react'
import { itemsHomeStyles } from '../assets/dummyStyles'
import BannerHome from './BannerHome'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FaChevronRight, FaMinus, FaPlus, FaShoppingCart, FaThList } from 'react-icons/fa'
import {categories} from '../assets/dummyData'
import axios from 'axios'

const ItemsHome = () => {

    const [products,setProducts]=useState([]);
    const [activeCategory,setActiveCategory]=useState(()=>{
        return localStorage.getItem('activeCategory') || 'All'
    })
    useEffect(()=>{
        localStorage.setItem('activeCategory',activeCategory)
    },[activeCategory])


    //FETCH PRODUCTS
    useEffect(()=>{
        axios.get('http://localhost:4000/api/items')
        .then(res=>{
            const normalized=res.data.map(p=>({
                ...p,
                id:p._id,
            }));
            setProducts(normalized);
        })
        .catch(console.error)
    },[]);

    const navigate=useNavigate()
    const {cart,addToCart,updateQuantity,removeFromCart}=useCart()

    const [searchTerm,setSearchTerm]=useState('')

    //SEARCH FEATURES 
    const productMatchesSearch=(product,term)=>{
        if(!term) return true
        const cleanTerm=term.trim().toLowerCase()
        const searchWords=cleanTerm.split(/\s+/)

        return searchWords.every(word=>
            product.name.toLowerCase().includes(word)
        )
    }

    //SEARCH ACROSS ALL PRODUCTS
    const searchedProducts=searchTerm
    ? products.filter(product =>
        productMatchesSearch(product,searchTerm)
    ) : (activeCategory==="All"
        ? products : products.filter((product)=>product.category===activeCategory)
    )

    const getQuantity=(productId)=> {
        const item=cart.find((ci)=> ci.productId===productId)
        return item ? item.quantity : 0
    }

    const getLineItemId=(productId)=>{
        const item=cart.find((ci)=>ci.productId===productId);
        return item?item.id:null;
    };

    const handleIncrease=(product)=>{
        const lineId=getLineItemId(product._id);
        if(lineId){
            updateQuantity(lineId,getQuantity(product._id)+1);
        }
        else{
            addToCart(product._id,1)
        }
    }

    // const handleDecrease=(product)=>addToCart(product,1)
    const handleDecrease=(product)=>{
        const qty=getQuantity(product._id)
        const lineId=getLineItemId(product._id);
        if(qty > 1 && lineId) updateQuantity(lineId,qty-1)
            else if(lineId) removeFromCart(lineId)
    }

    //REDIRECT TO ITEMS
    const redirectToItemsPage=()=>{
        navigate('/items',{state: {category:activeCategory}})
    }
    const handleSearch=(term)=>{
        setSearchTerm(term)
    }

    //CREATE SIDEBAR CATEGORY
    const sidebarCategories=[
        {
            name:"All Items",
            icon: <FaThList className='text-lg' />,
            value:"All"
        },
        ...categories
    ]
  return (
    <div className={itemsHomeStyles.page}>
        <BannerHome onSearch={handleSearch}/>
        <div className='flex flex-col lg:flex-row flex-1'>
            <aside className={itemsHomeStyles.sidebar}>
                <div className={itemsHomeStyles.sidebarHeader}>
                    <h1
                    style={{
                        fontFamily:" 'PlayFair Dispaly', serif",
                        textShadow:"2px 2px 4px rgba(0,0,0,0.2)"
                    }} 
                    className={itemsHomeStyles.sidebarTitle}>
                        FreshCart
                    </h1>
                    <div className={itemsHomeStyles.sidebarDivider}></div>
                </div>
                <div className={itemsHomeStyles.categoryList}>
                    <ul className='space-y-3'>
                        {sidebarCategories.map((category)=>(
                            <li key={category.name}>
                                <button onClick={()=>{
                                    setActiveCategory(category.value || category.name)
                                    setSearchTerm('')
                                }}
                                className={`${itemsHomeStyles.categoryItem}
                                ${(activeCategory===(category.value || category.name)) && !searchTerm
                                    ? itemsHomeStyles.activeCategory
                                    : itemsHomeStyles.inactiveCategory
                                }`}>
                                    <div className={itemsHomeStyles.categoryIcon}>
                                        {category.icon}
                                    </div>
                                    <span className={itemsHomeStyles.categoryName}>{category.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            
            {/* MAIN CONTENT */}
            <main className={itemsHomeStyles.mainContent}>
                {/* MOBILE CATEGORY SCROLL */}
                <div className={itemsHomeStyles.mobileCategories}>
                    <div className=' flex space-x-4'>
                        {sidebarCategories.map((cat)=>(
                            <button key={cat.name} onClick={()=>{
                                setActiveCategory(cat.value || cat.name)
                                setSearchTerm('')
                            }}
                            className={`${itemsHomeStyles.mobileCategoryItem}
                            ${activeCategory===(cat.value || cat.name) && !searchTerm
                                ? itemsHomeStyles.activeMobileCategory
                                : itemsHomeStyles.inactiveMobileCategory}`}>{cat.name}</button>
                        ))}
                    </div>
                </div>

                {/* SEARCH RESULT */}
                {searchTerm && (
                    <div className={itemsHomeStyles.searchTerm}>
                       <div className='flex items-center justify-center'>
                        <span className='text-emerald-700 font-medium'>
                            Search results for: <span className='font-bold'>"{searchTerm}"</span>
                        </span>
                        <button onClick={()=>setSearchTerm('')} className='m;-4 text-emerald-500 hover:text-shadow-emerald-700 p-1
                        rounded-full transition-colors'>
                            <span className='text-sm bg-emerald-100 px-2 py-1 rounded-full'>
                                Clear
                            </span>
                        </button>
                        </div> 
                    </div>
                )}

                {/* SECTION TILE */}
                <div className='text-center mb-6'>
                    <h2 className={itemsHomeStyles.sectionTitle}
                    style={{
                        fontFamily:"'Playfair Display', serif"
                    }}>
                        {searchTerm? "Search Results"
                        : (activeCategory=="All" ? 'Featured Products' : `Best ${activeCategory}`)}
                    </h2>
                    <div className={itemsHomeStyles.sectionDivider} />
                </div>

                {/* PRODUCT GRID */}
                <div className={itemsHomeStyles.productsGrid}>
                    {searchedProducts.length > 0 ? (
                        searchedProducts.map((product)=> {
                            const qty=getQuantity(product.id)
                            return (
                                <div key={product.id}
                                className={itemsHomeStyles.productCard}>
                                    <div className={itemsHomeStyles.imageContainer}>
                                        <img src={`http://localhost:4000${product.imageUrl}`} alt={product.name} className={itemsHomeStyles.productImage}
                                        onError={(e)=>{
                                            e.target.onerror=null;
                                            e.target.parentNode.innerHTML=`
                                            <div class='flex items-center justify-center w-full h-full bg-gray-200>
                                            <span class'text-gray-500 text-sm>No Image</span>
                                            </div>`
                                        }} />
                                    </div>

                                    <div className={itemsHomeStyles.productContent}>
                                        <h3 className={itemsHomeStyles.productTitle}>{product.name}</h3>
                                        <div className={itemsHomeStyles.priceContainer}>
                                            <div>
                                                <p className={itemsHomeStyles.currentPrice}>
                                                ₹{product.price.toFixed(2)}
                                                </p>
                                                <span className={itemsHomeStyles.oldPrice}>
                                                ₹{(product.price*1.2).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* ADD CONTROLS */}
                                            {qty===0 ? (
                                                <button onClick={()=> handleIncrease(product)}
                                                className={itemsHomeStyles.addButton}>
                                                    <FaShoppingCart className='mr-2' />
                                                    Add
                                                </button>
                                            ): (
                                                <div className={itemsHomeStyles.quantityControls}>
                                                    <button onClick={()=> handleDecrease(product)}
                                                    className={itemsHomeStyles.quantityButton}>
                                                        <FaMinus/>
                                                        </button>
                                                        <span className='font-bold'>{qty}</span>
                                                        <button onClick={()=> handleIncrease(product)}
                                                        className={itemsHomeStyles.quantityButton}>
                                                            <FaPlus/>
                                                        </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ):(
                        <div className={itemsHomeStyles.noProducts}>
                            <div className={itemsHomeStyles.noProductsText}>
                                No Product Found
                            </div>

                            <button onClick={()=> setSearchTerm('')}
                            className={itemsHomeStyles.clearSearchButton}>
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
                
                {/* VIEW ALL BUTTON */}
                {!searchTerm && (
                    <div className='text-center'>
                        <button onClick={redirectToItemsPage}
                        className={itemsHomeStyles.viewAllButton}>
                            View All {activeCategory==="All" ? 'Products' : activeCategory}
                            <FaChevronRight className='ml-3'/>
                        </button>
                    </div>
                )}
            </main>
        </div>
    </div>
  )
}

export default ItemsHome