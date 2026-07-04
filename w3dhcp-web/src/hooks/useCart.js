import { useState, useEffect, useCallback } from 'react'

const CART_STORAGE_KEY = 'w3panel_cart'
const EXPIRY_TIME_MS = 60 * 60 * 1000 // 1 hour

export const useCart = () => {
  const [cartItems, setCartItems] = useState([])

  // Initialize cart from localStorage and listen to changes
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          const { items, timestamp } = JSON.parse(stored)
          if (Date.now() - timestamp < EXPIRY_TIME_MS) {
            setCartItems(items)
          } else {
            localStorage.removeItem(CART_STORAGE_KEY)
            setCartItems([])
          }
        } else {
          setCartItems([])
        }
      } catch (e) {
        console.error('Failed to parse cart from local storage', e)
      }
    }
    
    loadCart()
    
    window.addEventListener('cart_updated', loadCart)
    return () => window.removeEventListener('cart_updated', loadCart)
  }, [])

  // Sync state to localStorage whenever it changes
  const saveCart = (items) => {
    setCartItems(items)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      items,
      timestamp: Date.now()
    }))
  }

  const addDomain = useCallback((domain) => {
    setCartItems(prev => {
      if (prev.find(item => item.id === domain.id)) return prev
      const newItems = [...prev, domain]
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: newItems, timestamp: Date.now() }))
      window.dispatchEvent(new Event('cart_updated'))
      return newItems
    })
  }, [])

  const deleteDomain = useCallback((domainId) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== domainId)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: newItems, timestamp: Date.now() }))
      window.dispatchEvent(new Event('cart_updated'))
      return newItems
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
    window.dispatchEvent(new Event('cart_updated'))
  }, [])

  return {
    cartDomains: cartItems,
    addDomain,
    deleteDomain,
    clearCart
  }
}
