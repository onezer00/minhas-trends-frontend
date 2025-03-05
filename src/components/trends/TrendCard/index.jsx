import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Share2, Bookmark, ChevronDown, ChevronUp, ExternalLink, Link, Play } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const descriptionRef = useRef(null);
  const videoRef = useRef(null);

  const {
    id,
    title,
    description,
    platform,
    author,
    views,
    likes,
    comments,
    timeAgo,
    tags,
    url,
    thumbnail
  } = trend;

  // Função para determinar se é vídeo do Reddit
  const isRedditVideo = (description) => {
    const videoMatch = description.match(/Vídeo:\s*(.*?)(?=Prévia:|$)/s);
    return videoMatch && videoMatch[1].includes('v.redd.it');
  };

  // Função para extrair URLs da descrição
  const extractUrls = (description) => {
    const linkMatch = description.match(/Link:\s*(.*?)(?=Vídeo:|Prévia:|$)/s);
    const videoMatch = description.match(/Vídeo:\s*(.*?)(?=Prévia:|$)/s);
    const previewMatch = description.match(/Prévia:\s*(.*?)(?=$)/s);

    return {
      link: linkMatch ? linkMatch[1].trim() : null,
      video: videoMatch ? videoMatch[1].trim() : null,
      preview: previewMatch ? previewMatch[1].trim() : null
    };
  };

  // Função para renderizar a preview
  const renderPreview = (urls) => {
    // Se tiver vídeo, prioriza o vídeo
    if (urls.video) {
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

  // Limpar o estado do vídeo quando o card for desmontado
  useEffect(() => {
    return () => {
      setIsVideoPlaying(false);
    };
  }, []);

  // Função para abrir o link em uma nova aba
  const handleCardClick = (e) => {
    // Não abrir o link se o clique foi em um botão, tag ou link interno
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="trend-card"
      onClick={handleCardClick}
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

        <h3 className="trend-title">
          {searchQuery ? (
            <HighlightText text={title} query={searchQuery} />
          ) : (
            title
          )}
        </h3>

        {/* Preview antes da descrição */}
        {renderPreview(extractUrls(description))}

        <div>
          <p 
            ref={descriptionRef}
            className={`trend-description ${isExpanded ? 'expanded' : ''}`}
          >
            {searchQuery ? (
              <HighlightText text={formatDescription(description)} query={searchQuery} />
            ) : (
              formatDescription(description)
            )}
          </p>
          {showReadMore && (
            <button 
              className="read-more-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <>
                  Mostrar menos
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Ler mais
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>

        <div className="trend-card-footer">
          <div className="trend-tags">
            {tags.map((tag, idx) => (
              <button
                key={`${id}-${tag}-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
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
              <span>{likes.toLocaleString('pt-BR')}</span>
            </button>
            <button 
              className="action-button"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare size={18} />
              <span>{comments.toLocaleString('pt-BR')}</span>
            </button>
            <button 
              className="action-button"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 size={18} />
              <span>Compartilhar</span>
            </button>
            <button 
              className="action-button"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark size={18} />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 