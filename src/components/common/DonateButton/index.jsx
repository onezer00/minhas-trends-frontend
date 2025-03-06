import React, { useState, useEffect } from 'react';
import { Heart, X, Coffee, DollarSign, CreditCard, Copy, Check } from 'lucide-react';
import './styles.css';

// Configurações de doação - Personalize aqui
const DONATION_CONFIG = {
  // Chave PIX (pode ser CPF, CNPJ, e-mail, telefone ou chave aleatória)
  pixKey: '663790da-17ae-4608-a6b4-7e50d5504bOf',
  pixKeyType: 'CHAVE', // Tipo da chave: CPF, CNPJ, E-mail, Telefone ou Chave Aleatória
  
  // Link do PayPal
  paypalUrl: 'https://www.paypal.com/donate/?business=56G4R3K79SVZC&no_recurring=0&item_name=Receber+doa%C3%A7%C3%B5es+TrendPulse&currency_code=BRL',
  
  // Link do PicPay (alternativa brasileira ao Buy Me a Coffee)
  picpayUrl: 'https://picpay.me/seupicpay',
  
  // Link do Mercado Pago
  mercadoPagoUrl: 'https://mpago.la/seulink',
  
  // Habilitar/desabilitar métodos de pagamento
  enablePix: true,
  enablePaypal: true,
  enablePicPay: true, // Mostrar, mas estará desabilitado
  enableMercadoPago: true, // Mostrar, mas estará desabilitado
};

export function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [heartFilled, setHeartFilled] = useState(false);

  // Fechar o modal quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPixModal && !event.target.closest('.pix-modal-content')) {
        setShowPixModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPixModal]);

  const toggleDonateOptions = () => {
    setIsOpen(!isOpen);
    // Não animar o coração ao abrir o menu
  };

  const closeDonateOptions = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleDonate = (platform, e) => {
    e.stopPropagation();
    
    // Animar o coração
    setHeartFilled(true);
    setTimeout(() => setHeartFilled(false), 1500);
    
    let donateUrl = '';
    
    switch (platform) {
      case 'pix':
        // Mostrar modal do PIX
        setShowPixModal(true);
        return;
      case 'paypal':
        donateUrl = DONATION_CONFIG.paypalUrl;
        break;
      case 'picpay':
        donateUrl = DONATION_CONFIG.picpayUrl;
        break;
      case 'mercadoPago':
        donateUrl = DONATION_CONFIG.mercadoPagoUrl;
        break;
      default:
        return;
    }
    
    if (donateUrl) {
      window.open(donateUrl, '_blank', 'noopener,noreferrer');
    }
    
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    try {
      // Método moderno de copiar para a área de transferência
      navigator.clipboard.writeText(DONATION_CONFIG.pixKey)
        .then(() => {
          setCopied(true);
          
          // Animar o coração
          setHeartFilled(true);
          setTimeout(() => {
            setCopied(false);
            setHeartFilled(false);
          }, 1500);
        })
        .catch(err => {
          console.error('Erro ao copiar para a área de transferência:', err);
          // Método alternativo usando um elemento temporário
          fallbackCopyToClipboard();
        });
    } catch (err) {
      console.error('Erro ao acessar a API de clipboard:', err);
      // Método alternativo usando um elemento temporário
      fallbackCopyToClipboard();
    }
  };

  // Método alternativo para navegadores que não suportam a API Clipboard
  const fallbackCopyToClipboard = () => {
    try {
      // Criar um elemento de texto temporário
      const textArea = document.createElement('textarea');
      textArea.value = DONATION_CONFIG.pixKey;
      
      // Tornar o elemento invisível
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Selecionar e copiar o texto
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      
      // Remover o elemento temporário
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        
        // Animar o coração
        setHeartFilled(true);
        setTimeout(() => {
          setCopied(false);
          setHeartFilled(false);
        }, 1500);
      } else {
        alert('Não foi possível copiar automaticamente. Por favor, copie manualmente: ' + DONATION_CONFIG.pixKey);
      }
    } catch (err) {
      console.error('Erro no método alternativo de cópia:', err);
      alert('Não foi possível copiar automaticamente. Por favor, copie manualmente: ' + DONATION_CONFIG.pixKey);
    }
  };

  return (
    <div className="donate-container">
      <button 
        className={`donate-button ${heartFilled ? 'heart-filled' : ''}`}
        onClick={toggleDonateOptions}
        aria-label="Apoie este projeto"
        title="Apoie este projeto"
      >
        <Heart size={20} className="heart-icon" />
        <span>Apoie-me</span>
      </button>
      
      {isOpen && (
        <div className="donate-options">
          <div className="donate-header">
            <h3>Apoie este projeto</h3>
            <button 
              className="close-button"
              onClick={closeDonateOptions}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
          
          <p className="donate-message">
            Sua contribuição ajuda a manter este projeto e desenvolver novas funcionalidades.
            Escolha uma das opções abaixo:
          </p>
          
          <div className="donate-buttons">
            {DONATION_CONFIG.enablePix && (
              <button 
                className="donate-option pix"
                onClick={(e) => handleDonate('pix', e)}
              >
                <DollarSign size={18} />
                <span>PIX</span>
              </button>
            )}
            
            {DONATION_CONFIG.enablePaypal && (
              <button 
                className="donate-option paypal"
                onClick={(e) => handleDonate('paypal', e)}
              >
                <CreditCard size={18} />
                <span>PayPal</span>
              </button>
            )}
            
            {DONATION_CONFIG.enablePicPay && (
              <button 
                className="donate-option picpay disabled"
                onClick={(e) => e.preventDefault()}
                title="Em breve"
                disabled
              >
                <Coffee size={18} />
                <span>PicPay</span>
                <div className="coming-soon-badge">Em breve</div>
              </button>
            )}
            
            {DONATION_CONFIG.enableMercadoPago && (
              <button 
                className="donate-option mercadoPago disabled"
                onClick={(e) => e.preventDefault()}
                title="Em breve"
                disabled
              >
                <Coffee size={18} />
                <span>Mercado Pago</span>
                <div className="coming-soon-badge">Em breve</div>
              </button>
            )}
          </div>
          
          <div className="donate-footer">
            <p>Obrigado pelo seu apoio! <span className={`thank-heart ${heartFilled ? 'animated' : ''}`}>❤️</span></p>
          </div>
        </div>
      )}
      
      {showPixModal && (
        <div className="pix-modal">
          <div className="pix-modal-content">
            <div className="pix-modal-header">
              <h3>Doação via PIX</h3>
              <button 
                className="close-button"
                onClick={() => setShowPixModal(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="pix-modal-body">
              <p>Utilize a chave PIX abaixo para fazer sua doação:</p>
              
              <div className="pix-key-container">
                <div className="pix-key-type">{DONATION_CONFIG.pixKeyType}:</div>
                <div className="pix-key-value">{DONATION_CONFIG.pixKey}</div>
              </div>
              
              <button 
                className={`pix-copy-button ${copied ? 'copied' : ''}`}
                onClick={copyToClipboard}
                aria-label="Copiar chave PIX"
                title="Copiar chave PIX"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span className="copy-text">Chave PIX copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span className="copy-text">Copiar chave PIX</span>
                  </>
                )}
              </button>
              
              <div className="pix-instructions">
                <p>Como usar:</p>
                <ol>
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Acesse a área de PIX</li>
                  <li>Escolha a opção "Transferir"</li>
                  <li>Cole a chave acima</li>
                  <li>Informe o valor da sua contribuição</li>
                  <li>Confirme a transação</li>
                </ol>
              </div>
            </div>
            
            <div className="pix-modal-footer">
              <button 
                className="pix-close-button"
                onClick={() => setShowPixModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 