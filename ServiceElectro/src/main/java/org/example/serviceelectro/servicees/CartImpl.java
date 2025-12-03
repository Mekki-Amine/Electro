package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Cart;
import org.example.serviceelectro.entities.CartItem;
import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.repository.CartItemRepository;
import org.example.serviceelectro.repository.CartRepository;
import org.example.serviceelectro.repository.PublicationRepository;
import org.example.serviceelectro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CartImpl implements ICart {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PublicationRepository publicationRepository;

    @Override
    public Cart getOrCreateCart(Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUser_Id(userId);
        
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        } else {
            Optional<Utilisateur> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("Utilisateur non trouvé");
            }
            
            Cart cart = Cart.builder()
                    .user(userOpt.get())
                    .build();
            return cartRepository.save(cart);
        }
    }

    @Override
    public CartItem addItemToCart(Long userId, Long publicationId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La quantité doit être supérieure à 0");
        }

        Cart cart = getOrCreateCart(userId);
        
        Optional<Publication> publicationOpt = publicationRepository.findById(publicationId);
        if (publicationOpt.isEmpty()) {
            throw new IllegalArgumentException("Publication non trouvée");
        }

        // Vérifier si l'article existe déjà dans le panier
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCart_IdAndPublication_Id(cart.getId(), publicationId);
        
        if (existingItemOpt.isPresent()) {
            // Mettre à jour la quantité
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            // Créer un nouvel article
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .publication(publicationOpt.get())
                    .quantity(quantity)
                    .build();
            return cartItemRepository.save(cartItem);
        }
    }

    @Override
    public void removeItemFromCart(Long userId, Long cartItemId) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isEmpty()) {
            throw new IllegalArgumentException("Article du panier non trouvé");
        }

        CartItem cartItem = cartItemOpt.get();
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à supprimer cet article");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    public void updateItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La quantité doit être supérieure à 0");
        }

        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isEmpty()) {
            throw new IllegalArgumentException("Article du panier non trouvé");
        }

        CartItem cartItem = cartItemOpt.get();
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à modifier cet article");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public Long getCartItemCount(Long userId) {
        return cartItemRepository.countItemsByUserId(userId);
    }
}

