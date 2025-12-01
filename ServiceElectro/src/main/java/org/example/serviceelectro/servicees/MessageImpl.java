package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Message;
import org.example.serviceelectro.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class MessageImpl implements Imessage {

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @Override
    public Message saveMessage(Message message) {
        try {
            if (message.getSender() == null) {
                throw new IllegalArgumentException("L'expéditeur est requis pour créer un message");
            }
            if (message.getReceiver() == null) {
                throw new IllegalArgumentException("Le destinataire est requis pour créer un message");
            }
            if (message.getContent() == null || message.getContent().trim().isEmpty()) {
                throw new IllegalArgumentException("Le contenu du message est requis");
            }
            
            String contentPreview = message.getContent().length() > 50 
                ? message.getContent().substring(0, 50) + "..." 
                : message.getContent();
            System.out.println("💾 Saving message: " + contentPreview);
            System.out.println("   Sender ID: " + (message.getSender() != null ? message.getSender().getId() : "null"));
            System.out.println("   Receiver ID: " + (message.getReceiver() != null ? message.getReceiver().getId() : "null"));
            
            Message saved = messageRepository.save(message);
            System.out.println("✅ Message saved with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.out.println("❌ Error saving message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }

    @Override
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

    @Override
    public List<Message> findBySenderId(Long senderId) {
        return messageRepository.findBySenderIdOrderByCreatedAtDesc(senderId);
    }

    @Override
    public List<Message> findByReceiverId(Long receiverId) {
        return messageRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
    }

    @Override
    public List<Message> getConversation(Long userId1, Long userId2) {
        try {
            // Récupérer les messages dans les deux sens
            List<Message> messages1 = messageRepository.findBySenderIdAndReceiverIdOrderByCreatedAtAsc(userId1, userId2);
            List<Message> messages2 = messageRepository.findBySenderIdAndReceiverIdOrderByCreatedAtAsc(userId2, userId1);
            
            // Combiner et trier par date
            return Stream.concat(messages1.stream(), messages2.stream())
                    .sorted((m1, m2) -> {
                        if (m1.getCreatedAt() == null && m2.getCreatedAt() == null) return 0;
                        if (m1.getCreatedAt() == null) return 1;
                        if (m2.getCreatedAt() == null) return -1;
                        return m1.getCreatedAt().compareTo(m2.getCreatedAt());
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("❌ Error in getConversation: " + e.getMessage());
            e.printStackTrace();
            return List.of(); // Retourner une liste vide en cas d'erreur
        }
    }

    @Override
    public void markAsRead(Long messageId) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            Message message = messageOpt.get();
            message.setIsRead(true);
            messageRepository.save(message);
        }
    }

    @Override
    public void markAllAsRead(Long receiverId) {
        List<Message> unreadMessages = messageRepository.findByReceiverIdAndIsReadFalse(receiverId);
        for (Message message : unreadMessages) {
            message.setIsRead(true);
        }
        messageRepository.saveAll(unreadMessages);
    }

    @Override
    public long countUnreadMessages(Long receiverId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(receiverId);
    }
}

