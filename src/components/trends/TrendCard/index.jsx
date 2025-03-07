import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThumbsUp, MessageSquare, Share2, Bookmark, ChevronDown, ChevronUp, ExternalLink, Link, X, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PlatformIcon } from '../../common/PlatformIcon';
import { HighlightText } from '../../common/HighlightText';
import './styles.css';

export function TrendCard({
  trend,
  searchQuery = '',
  onTagClick,
  isAnimating = false,
  index = 0
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const descriptionRef = useRef(null);
  const modalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Verificar se trend existe e definir valores padrão para propriedades ausentes
  const {
    id = 'unknown',
    title = 'Sem título',
    description = 'Sem descrição',
    platform = 'unknown',
    author = 'Desconhecido',
    views = 0,
    likes = 0,
    comments = 0,
    timeAgo = 'agora',
    tags = [],
    url = '',
    thumbnail = ''
  } = trend || {};

  // Função para extrair URLs da descrição
  const extractUrls = (description = '') => {
    if (!description) return { link: null, video: null, preview: null };
    
    const linkMatch = description.match(/Link:\s*(.*?)(?=Vídeo:|Prévia:|$)/s);
    const videoMatch = description.match(/Vídeo:\s*(.*?)(?=Prévia:|$)/s);
    const previewMatch = description.match(/Prévia:\s*(.*?)(?=$)/s);

    return {
      link: linkMatch ? linkMatch[1].trim() : null,
      video: videoMatch ? videoMatch[1].trim() : null,
      preview: previewMatch ? previewMatch[1].trim() : null
    };
  };

  // Função para extrair o ID do vídeo do YouTube da URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Padrões de URL do YouTube
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Verificar se a URL é do YouTube
  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Verificar se é um vídeo do YouTube
  const isYoutubeVideo = platform === 'youtube' || isYoutubeUrl(url);
  
  // Obter o ID do vídeo do YouTube
  const youtubeVideoId = isYoutubeVideo ? getYoutubeVideoId(url) : null;

  // Função para renderizar a preview
  const renderPreview = (urls, inModal = false) => {
    // Se estiver no modal e for um vídeo do YouTube e estiver reproduzindo
    if (inModal && isYoutubeVideo && isPlaying && youtubeVideoId) {
      return (
        <div className="youtube-container">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
          ></iframe>
        </div>
      );
    }
    
    // Se for um vídeo do YouTube mas não estiver reproduzindo ou não estiver no modal
    if (isYoutubeVideo && youtubeVideoId) {
      return (
        <div className="description-preview">
          <div 
            className="video-container youtube-preview" 
            onClick={(e) => {
              e.stopPropagation();
              if (inModal) {
                setIsPlaying(true);
              } else {
                openModal(e);
              }
            }}
          >
            <img 
              src={thumbnail || `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`}
              alt={title}
              className="preview-image"
            />
            <div className="play-button">
              <Play size={24} fill="white" />
            </div>
          </div>
        </div>
      );
    }
    
    // Se tiver vídeo na descrição
    if (urls.video) {
      // Se for um vídeo do YouTube na descrição
      const videoId = getYoutubeVideoId(urls.video);
      if (videoId && inModal && isPlaying) {
        return (
          <div className="youtube-container">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="youtube-iframe"
            ></iframe>
          </div>
        );
      }
      
      if (videoId) {
        return (
          <div className="description-preview">
            <div 
              className="video-container youtube-preview" 
              onClick={(e) => {
                e.stopPropagation();
                if (inModal) {
                  setIsPlaying(true);
                } else {
                  openModal(e);
                }
              }}
            >
              <img 
                src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                className="preview-image"
              />
              <div className="play-button">
                <Play size={24} fill="white" />
              </div>
            </div>
          </div>
        );
      }
      
      // Para outros tipos de vídeo
      return (
        <div className="description-preview">
          <div className="video-container">
            <video 
              controls
              className="video-frame"
              poster={thumbnail}
              onClick={(e) => e.stopPropagation()}
            >
              <source src={urls.video} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      );
    }
    
    // Se não tiver vídeo, usa sempre a thumbnail
    if (thumbnail) {
      return (
        <div className="description-preview">
          <img 
            src={thumbnail}
            alt="Preview"
            className="preview-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    }

    return null;
  };

  // Função para formatar a descrição com links e prévias
  const formatDescription = (text) => {
    // Primeiro, vamos separar o texto principal do link
    const mainText = text.split('Link:')[0].trim();
    const urls = extractUrls(text);

    return (
      <>
        {mainText && (
          <div className="main-text">
            {mainText}
          </div>
        )}
        {urls.link && (
          <div className="description-link">
            <Link size={14} />
            <a 
              href={urls.link} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {urls.link}
            </a>
          </div>
        )}
      </>
    );
  };

  // Verificar se o texto excede 3 linhas
  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight);
      const height = descriptionRef.current.scrollHeight;
      const lines = height / lineHeight;
      setShowReadMore(lines > 3);
    }
  }, [description]);

  // Função para abrir o modal com o conteúdo completo
  const openModal = (e) => {
    // Não abrir o modal se o clique foi em um botão, tag ou link interno
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    
    setIsExpanded(true);
    document.body.classList.add('modal-open');
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsExpanded(false);
    setIsPlaying(false); // Parar a reprodução do vídeo
    document.body.classList.remove('modal-open');
  };

  // Fechar o modal ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Fechar o modal ao pressionar ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isExpanded]);

  // Função para calcular a posição do modal
  const calculateModalPosition = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    setModalPosition({
      top: scrollTop + (viewportHeight / 2),
      left: scrollLeft + (viewportWidth / 2)
    });
  }, []);

  // Atualizar posição do modal quando abrir e quando rolar a página
  useEffect(() => {
    if (isExpanded) {
      calculateModalPosition();
      window.addEventListener('scroll', calculateModalPosition);
      window.addEventListener('resize', calculateModalPosition);
    }

    return () => {
      window.removeEventListener('scroll', calculateModalPosition);
      window.removeEventListener('resize', calculateModalPosition);
    };
  }, [isExpanded, calculateModalPosition]);

  // Extrair URLs da descrição
  const urls = extractUrls(description);

  // Log para debug
  useEffect(() => {
    if (isExpanded) {
      console.log('Trend expandida:', {
        id,
        title,
        platform,
        url,
        isYoutubeVideo,
        youtubeVideoId,
        isPlaying
      });
    }
  }, [isExpanded, isPlaying]);

  // Cleanup quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (isExpanded) {
        document.body.classList.remove('modal-open');
      }
    };
  }, [isExpanded]);

  return (
    <>
      <div 
        className="trend-card"
        onClick={openModal}
        style={{ 
          animationDelay: `${index * 100}ms`,
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(20px)' : 'translateY(0)'
        }}
      >
        <div className="trend-card-content">
          <div className="trend-card-header">
            <div className="platform-info">
              <PlatformIcon platform={platform} size="sm" />
              <span className="platform-name">{platform}</span>
            </div>
            <div className="header-right">
              <span className="time-ago">{timeAgo}</span>
              {url && <ExternalLink size={16} className="external-link-icon" />}
            </div>
          </div>

          <h3 className="trend-title" title={title}>
            {searchQuery ? (
              <HighlightText text={title} query={searchQuery} />
            ) : (
              title
            )}
          </h3>

          {/* Preview após o título */}
          {renderPreview(urls)}

          <div className="trend-description-container">
            <p 
              ref={descriptionRef}
              className="trend-description"
            >
              {searchQuery ? (
                <HighlightText text={formatDescription(description)} query={searchQuery} />
              ) : (
                formatDescription(description)
              )}
            </p>
          </div>

          <div className="trend-card-footer">
            <div className="trend-meta">
              <span className="trend-author">
                {searchQuery ? (
                  <HighlightText text={author} query={searchQuery} />
                ) : (
                  author
                )}
              </span>
              <span className="meta-separator">•</span>
              <span className="trend-views">{views} visualizações</span>
            </div>

            <div className="trend-actions">
              <button 
                className="action-button"
                onClick={(e) => e.stopPropagation()}
              >
                <ThumbsUp size={18} />
                <span>{typeof likes === 'number' ? likes.toLocaleString('pt-BR') : '0'}</span>
              </button>
              <button 
                className="action-button"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare size={18} />
                <span>{typeof comments === 'number' ? comments.toLocaleString('pt-BR') : '0'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para exibir o conteúdo completo */}
      {isExpanded && (
        <div className="trend-modal-overlay">
          <div 
            className="trend-modal" 
            ref={modalRef}
          >
            <div className="trend-modal-header">
              <div className="platform-info">
                <PlatformIcon platform={platform} size="sm" />
                <span className="platform-name">{platform}</span>
                <span className="time-ago">{timeAgo}</span>
              </div>
              <button 
                className="close-modal-button"
                onClick={closeModal}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="trend-modal-content">
              <h2 className="trend-modal-title">
                {searchQuery ? (
                  <HighlightText text={title} query={searchQuery} />
                ) : (
                  title
                )}
              </h2>
              
              {/* Preview no modal */}
              {renderPreview(urls, true)}
              
              <div className="trend-modal-description">
                {searchQuery ? (
                  <HighlightText text={formatDescription(description)} query={searchQuery} />
                ) : (
                  formatDescription(description)
                )}
              </div>
              
              {/* Link para o post original */}
              {url && !isPlaying && (
                <div className="original-post-link">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-original-button"
                  >
                    <ExternalLink size={16} />
                    Ver post original
                  </a>
                </div>
              )}
              
              {/* Botão para reproduzir o vídeo se não estiver reproduzindo */}
              {isYoutubeVideo && youtubeVideoId && !isPlaying && (
                <div className="play-video-container">
                  <button 
                    className="play-video-button"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Play size={20} />
                    Reproduzir vídeo
                  </button>
                </div>
              )}
              
              <div className="trend-modal-tags">
                {Array.isArray(tags) && tags.map((tag, idx) => (
                  <button
                    key={`modal-${id}-${tag}-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(tag);
                      closeModal();
                    }}
                    className={`trend-tag ${
                      searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase())
                        ? 'highlighted'
                        : ''
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              
              <div className="trend-modal-footer">
                <div className="trend-meta">
                  <span className="trend-author">
                    {searchQuery ? (
                      <HighlightText text={author} query={searchQuery} />
                    ) : (
                      author
                    )}
                  </span>
                  <span className="meta-separator">•</span>
                  <span className="trend-views">{views} visualizações</span>
                </div>
                
                <div className="trend-actions">
                  <button className="action-button">
                    <ThumbsUp size={18} />
                    <span>{typeof likes === 'number' ? likes.toLocaleString('pt-BR') : '0'}</span>
                  </button>
                  <button className="action-button">
                    <MessageSquare size={18} />
                    <span>{typeof comments === 'number' ? comments.toLocaleString('pt-BR') : '0'}</span>
                  </button>
                  <button className="action-button">
                    <Share2 size={18} />
                  </button>
                  <button className="action-button">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 