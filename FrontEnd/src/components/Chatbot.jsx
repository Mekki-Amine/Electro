import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel de Fixer. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos services, nos publications et notre catalogue.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [publications, setPublications] = useState([]);
  const [catalogPublications, setCatalogPublications] = useState([]);
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      loadPublications();
    }
  }, [isOpen]);

  const loadPublications = async () => {
    try {
      setIsLoadingPublications(true);
      // Charger les publications du catalogue
      const catalogResponse = await axios.get('/api/pub');
      setCatalogPublications(catalogResponse.data || []);
      
      // Charger les publications de la page publications
      const publicationsResponse = await axios.get('/api/pub/publications-page');
      setPublications(publicationsResponse.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des publications:', error);
      // Ne pas bloquer le chatbot si les publications ne peuvent pas être chargées
    } finally {
      setIsLoadingPublications(false);
    }
  };

  const botResponses = {
    bonjour: "Bonjour ! Comment puis-je vous aider avec votre appareil électroménager ?",
    salut: "Salut ! Que puis-je faire pour vous aujourd'hui ?",
    prix: "Nos prix varient selon le type de réparation. Pour un devis précis, pouvez-vous me donner plus de détails sur votre appareil ?",
    devis: "Pour obtenir un devis gratuit, vous pouvez remplir le formulaire sur notre page d'accueil ou me donner quelques informations sur votre problème.",
    réparation: "Nous réparons tous types d'appareils électroménagers : lave-linge, lave-vaisselle, réfrigérateur, four, micro-ondes, etc. Quel appareil vous pose problème ?",
    contact: "Vous pouvez nous contacter par email à contact@fixer.fr ou par téléphone au +33 1 23 45 67 89. Nous sommes disponibles du lundi au vendredi de 9h à 18h.",
    horaires: "Nous sommes ouverts du lundi au vendredi de 9h à 18h. Le samedi de 9h à 13h.",
    garantie: "Toutes nos réparations sont garanties. La durée de garantie dépend du type d'intervention.",
    merci: "De rien ! N'hésitez pas si vous avez d'autres questions.",
    au_revoir: "Au revoir ! N'hésitez pas à revenir si vous avez besoin d'aide.",
  };

  const searchPublications = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    const allPublications = [...catalogPublications, ...publications];
    
    // Rechercher dans le titre, description et type
    const results = allPublications.filter(pub => {
      const titleMatch = pub.title && pub.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = pub.description && pub.description.toLowerCase().includes(lowerQuery);
      const typeMatch = pub.type && pub.type.toLowerCase().includes(lowerQuery);
      return titleMatch || descriptionMatch || typeMatch;
    });

    return results;
  };

  const formatPublicationMessage = (publications) => {
    if (publications.length === 0) {
      return "Je n'ai trouvé aucune publication correspondant à votre recherche. Essayez avec d'autres mots-clés ou consultez notre catalogue directement.";
    }

    let message = `J'ai trouvé ${publications.length} publication(s) :\n\n`;
    
    publications.slice(0, 5).forEach((pub, index) => {
      message += `${index + 1}. **${pub.title}**\n`;
      message += `   Type: ${pub.type || 'Non spécifié'}\n`;
      if (pub.price && pub.price > 0) {
        message += `   Prix: ${pub.price}€\n`;
      }
      if (pub.description) {
        const shortDesc = pub.description.length > 100 
          ? pub.description.substring(0, 100) + '...' 
          : pub.description;
        message += `   Description: ${shortDesc}\n`;
      }
      message += `\n`;
    });

    if (publications.length > 5) {
      message += `\nEt ${publications.length - 5} autre(s) publication(s). Consultez notre catalogue pour voir toutes les publications disponibles.`;
    }

    message += `\n\nVous pouvez visiter notre catalogue pour plus de détails et contacter les réparateurs.`;

    return message;
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Détecter les demandes de recherche dans les publications
    const searchKeywords = ['publication', 'catalogue', 'recherche', 'trouve', 'cherche', 'disponible', 'service', 'réparation', 'réparateur'];
    const isSearchRequest = searchKeywords.some(keyword => lowerMessage.includes(keyword)) 
      || lowerMessage.includes('qu\'est-ce') 
      || lowerMessage.includes('qu\'est ce')
      || lowerMessage.includes('quelles')
      || lowerMessage.includes('quels');

    if (isSearchRequest && (catalogPublications.length > 0 || publications.length > 0)) {
      const searchResults = searchPublications(userMessage);
      if (searchResults.length > 0) {
        return formatPublicationMessage(searchResults);
      }
    }

    // Recherche de mots-clés spécifiques
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Si la recherche ne donne rien mais que c'est une demande de recherche
    if (isSearchRequest) {
      return "Je peux vous aider à rechercher dans nos publications. Pouvez-vous être plus précis ? Par exemple : 'recherche réparation lave-linge' ou 'publications disponibles'.";
    }

    // Réponses par défaut
    if (lowerMessage.includes('problème') || lowerMessage.includes('panne')) {
      return "Je comprends que vous avez un problème. Pouvez-vous me donner plus de détails sur votre appareil et le symptôme que vous observez ? Je peux aussi rechercher dans nos publications pour trouver un réparateur spécialisé.";
    }

    if (lowerMessage.includes('urgence') || lowerMessage.includes('urgent')) {
      return "Pour les urgences, contactez-nous directement au +33 1 23 45 67 89. Nous ferons de notre mieux pour intervenir rapidement.";
    }

    return "Je comprends votre question. Je peux vous aider à rechercher dans nos publications ou vous pouvez nous contacter directement par email à contact@fixer.fr ou par téléphone au +33 1 23 45 67 89.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simuler un délai avant la réponse du bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col pointer-events-auto border-2 border-yellow-400">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Service Clientèle</h3>
              <p className="text-xs text-gray-700">En ligne</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-700 transition-colors"
            aria-label="Fermer le chatbot"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {isLoadingPublications && messages.length === 1 && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
                <p className="text-sm">Chargement du catalogue...</p>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Envoyer
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Réponses automatiques • Pour une assistance personnalisée, contactez-nous directement
          </p>
        </form>
      </div>
    </div>
  );
};

